var zz ;
! function(factory) {
    if (typeof require === 'function' && typeof module !== 'undefined') {
        // CommonJS loader
        var SockJS = require('sockjs-client');
        if (!SockJS) {
            throw new Error('vertx-eventbus.js requires sockjs-client, see http://sockjs.org');
        }
        factory(SockJS);
    } else if (typeof define === 'function' && define.amd) {
        // AMD loader
        define('vertx-eventbus', ['sockjs'], factory);
    } else {
        // plain old include
        if (typeof this.SockJS === 'undefined') {
            throw new Error('vertx-eventbus.js requires sockjs-client, see http://sockjs.org');
        }

        VChatCloud = factory(this.SockJS);
    }
}(function(SockJS) {

    function makeUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(a, b) {
            return b = Math.random() * 16, (a == 'y' ? b & 3 | 8 : b | 0).toString(16);
        });
    }

    function mergeHeaders(defaultHeaders, headers) {
        if (defaultHeaders) {
            if (!headers) {
                return defaultHeaders;
            }

            for (var headerName in defaultHeaders) {
                if (defaultHeaders.hasOwnProperty(headerName)) {
                    // user can overwrite the default headers
                    if (typeof headers[headerName] === 'undefined') {
                        headers[headerName] = defaultHeaders[headerName];
                    }
                }
            }
        }

        // headers are required to be a object
        return headers || {};
    }

    var ebus_options = {}

    /**
     * VChatCloud
     *
     * @param url
     * @param options
     * @constructor
     */
    var VChatCloud = function(param, options) {
        var self = this;

        this.param = $.extend({
            url: 'https://vchatcloud.com:9001/eventbus',
        }, param);
        if (window.hasOwnProperty('VCHATCLOUD_SERVER'))
            this.param.url = window.VCHATCLOUD_SERVER;

        ebus_options = options || {};

        // attributes
        this.pingInterval = ebus_options.vertxbus_ping_interval || 3000;
        this.pingTimerID = null;
        this.channels = {};

        this.reconnectEnabled = false;
        this.reconnectAttempts = 0;
        this.reconnectTimerID = null;
        // adapted from backo
        this.maxReconnectAttempts = ebus_options.vertxbus_reconnect_attempts_max || Infinity;
        this.reconnectDelayMin = ebus_options.vertxbus_reconnect_delay_min || 1000;
        this.reconnectDelayMax = ebus_options.vertxbus_reconnect_delay_max || 5000;
        this.reconnectExponent = ebus_options.vertxbus_reconnect_exponent || 2;
        this.randomizationFactor = ebus_options.vertxbus_randomization_factor || 0.5;

        this.defaultHeaders = null;

        // default event handlers
        this.onerror = function(err) {
            try {
                console.error(err);
            } catch (e) {
                // dev tools are disabled so we cannot use console on IE
            }
        };
    };

    function setupSockJSConnection(options) {
        self = this

        var getReconnectDelay = function() {
            var ms = self.reconnectDelayMin * Math.pow(self.reconnectExponent, self.reconnectAttempts);
            if (self.randomizationFactor) {
                var rand = Math.random();
                var deviation = Math.floor(rand * self.randomizationFactor * ms);
                ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
            }
            return Math.min(ms, self.reconnectDelayMax) | 0;
        };

        self.sockJSConn = new SockJS(self.param.url, null, options);
        self.state = VChatCloud.CONNECTING;

        // handlers and reply handlers are tied to the state of the socket
        // they are added onopen or when sending, so reset when reconnecting
        self.handlers = {};
        self.channels = {};
        self.replyHandlers = {};

        self.sockJSConn.onopen = function() {
            self.enablePing(true);
            self.state = VChatCloud.OPEN;
            self.onopen && self.onopen();
            if (self.reconnectTimerID) {
                self.reconnectAttempts = 0;
                // fire separate event for reconnects
                // consistent behavior with adding handlers onopen
                self.onreconnect && self.onreconnect();
            }
        };

        self.sockJSConn.onclose = function(e) {
            self.state = VChatCloud.CLOSED;
            if (self.pingTimerID)
                clearInterval(self.pingTimerID);
            if (self.reconnectEnabled && self.reconnectAttempts < self.maxReconnectAttempts) {
                self.sockJSConn = null;
                // set id so users can cancel
                self.reconnectTimerID = setTimeout(setupSockJSConnection.bind(self), getReconnectDelay());
                ++self.reconnectAttempts;
            }
            self.onclose && self.onclose(e);
        };

        self.sockJSConn.onmessage = function(e) {
            var json = JSON.parse(e.data),
                r, m, p;
            // console.log('<<<', $.extend({},json));

            // define a reply function on the message itself
            if (json.replyAddress) {
                Object.defineProperty(json, 'reply', {
                    value: function(message, headers, callback) {
                        self.send(json.replyAddress, message, headers, callback);
                    }
                });
            }

            if (self.handlers[json.address]) {
                // iterate all registered handlers
                var handlers = self.handlers[json.address];
                for (var i = 0; i < handlers.length; i++) {
                    if (json.type === 'err') {
                        handlers[i]({
                            code: json.failureCode,
                            type: json.failureType,
                            message: json.message
                        });
                    } else {
                        handlers[i](null, json);
                    }
                }
            } else if (self.replyHandlers[json.address]) {
                // Might be a reply message
                var handler = self.replyHandlers[json.address];
                delete self.replyHandlers[json.address];
                if (json.type === 'err') {
                    handler({
                        code: json.failureCode,
                        type: json.failureType,
                        message: json.message
                    });
                } else {
                    handler(null, json);
                }
            } else {
                if (json.type === 'err') {
                    self.onerror(json);
                } else if (json.address && (e = json.address.match(/s2c\.([^\/]*)(?:\/([^\/]*))?(?:\/([^\/]*))?/)) && (r = self.channels[e[2]]) && (m = 'on' + e[1].replace(/[.]?(.{1})([^.]*)/g, function(m0, m1, m2) {
                        return m1.toUpperCase() + m2;
                    })) && (e = r[m])) {
                    if (json.body.returncode) {
                        console.error('change[' + json.address + ']');
                        json.body = json.body.data;
                    }
                    if ((p = (r.__proto__ || Object.getPrototypeOf(r))[m])) {
                        var c = p !== r[m] ? r[m] : function() {};
                        c.call(r, p.call(r, json.body));
                    } else {
                        e.call(r, json.body)
                    }
                } else {
                    try {
                        console.warn('No handler found for message: ', json);
                    } catch (e) {
                        // dev tools are disabled so we cannot use console on IE
                    }
                }
            }
        }
    };

    function is_f(obj) {
        return typeof(obj) === 'function';
    }

    /**
     * Send a message
     *
     * @param {String} address
     * @param {Object} message
     * @param {Object} [headers]
     * @param {Function} [callback]
     */
    VChatCloud.prototype.send = function(address, message, headers, callback) {
        // are we ready?
        if (this.state != VChatCloud.OPEN) {
            throw new Error('INVALID_STATE_ERR');
        }

        if (typeof headers === 'function') {
            callback = headers;
            headers = {};
        }

        var envelope = {
            type: 'send',
            address: address,
            headers: mergeHeaders(this.defaultHeaders, headers),
            body: message
        };

        if (callback) {
            var replyAddress = makeUUID();
            envelope.replyAddress = replyAddress;
            this.replyHandlers[replyAddress] = callback;
        }

        this.sockJSConn.send(JSON.stringify(envelope));
    };

    /**
     * Publish a message
     *
     * @param {String} address
     * @param {Object} message
     * @param {Object} [headers]
     */
    VChatCloud.prototype.publish = function(address, message, headers) {
        // are we ready?
        if (this.state != VChatCloud.OPEN) {
            throw new Error('INVALID_STATE_ERR');
        }

        this.sockJSConn.send(JSON.stringify({
            type: 'publish',
            address: address,
            headers: mergeHeaders(this.defaultHeaders, headers),
            body: message
        }));
    };

    /**
     * Register a new handler
     *
     * @param {String} address
     * @param {Object} [headers]
     * @param {Function} callback
     */
    VChatCloud.prototype.registerHandler = function(address, headers, callback) {
        // are we ready?
        if (this.state != VChatCloud.OPEN) {
            throw new Error('INVALID_STATE_ERR');
        }

        if (typeof headers === 'function') {
            callback = headers;
            headers = {};
        }

        // ensure it is an array
        if (!this.handlers[address]) {
            this.handlers[address] = [];
            // First handler for this address so we should register the connection
            this.sockJSConn.send(JSON.stringify({
                type: 'register',
                address: address,
                headers: mergeHeaders(this.defaultHeaders, headers)
            }));
        }

        this.handlers[address].push(callback);
    };

    /**
     * Unregister a handler
     *
     * @param {String} address
     * @param {Object} [headers]
     * @param {Function} callback
     */
    VChatCloud.prototype.unregisterHandler = function(address, headers, callback) {
        // are we ready?
        if (this.state != VChatCloud.OPEN)
            throw new Error('INVALID_STATE_ERR');
        var handlers = this.handlers[address];
        if (handlers) {
            if (typeof headers === 'function') {
                callback = headers;
                headers = {};
            }
            var idx = handlers.indexOf(callback);
            if (idx != -1) {
                handlers.splice(idx, 1);
                if (handlers.length === 0) {
                    // No more local handlers so we should unregister the connection
                    this.sockJSConn.send(JSON.stringify({
                        type: 'unregister',
                        address: address,
                        headers: mergeHeaders(this.defaultHeaders, headers)
                    }));
                    delete this.handlers[address];
                }
            }
        }
    };

    /**
     * Closes the connection to the VChatCloud Bridge,
     * preventing any reconnect attempts
     */
    VChatCloud.prototype.disconnect = function(callback) {
        var self = this;
        switch (this.state) {
            case VChatCloud.CLOSING:
                self.onclose = callback;
                break;
            case VChatCloud.CLOSED:
                callback && callback.call(self, {
                    code: 10108,
                    message: 'CHANNLE_ALREADY_DISCONNECTED'
                }, null);
                break;
            default:
                this.state = VChatCloud.CLOSING;
                this.enableReconnect(false);
                this.sockJSConn.close();
                self.onclose = callback;
        }
    };

    VChatCloud.CONNECTING = 0;
    VChatCloud.OPEN = 1;
    VChatCloud.CLOSING = 2;
    VChatCloud.CLOSED = 3;

    VChatCloud.prototype.enablePing = function(enable) {
        var self = this;

        if (enable) {
            var sendPing = function() {
                self.sockJSConn.send(JSON.stringify({
                    type: 'ping'
                }));
            };
            if (self.pingInterval > 0) {
                // Send the first ping then send a ping every pingInterval milliseconds
                sendPing();
                self.pingTimerID = setInterval(sendPing, self.pingInterval);
            }
        } else {
            if (self.pingTimerID) {
                clearInterval(self.pingTimerID);
                self.pingTimerID = null;
            }
        }
    };

    VChatCloud.prototype.enableReconnect = function(enable) {
        var self = this;
        self.reconnectEnabled = enable;
        if (!enable && self.reconnectTimerID) {
            clearTimeout(self.reconnectTimerID);
            self.reconnectTimerID = null;
            self.reconnectAttempts = 0;
        }
    };

    VChatCloud.prototype.connect = function(callback) {
        var self = this;
        if (this.state != VChatCloud.OPEN) {
            setupSockJSConnection.call(this, ebus_options);
            self.onopen = callback;
        } else {
            callback.call(self);
        }
    };

    VChatCloud.prototype.joinChannel = VChatCloud.prototype.connectChannel = function(params, callback) {
        var self = this,
            room = new Channel();
        if (arguments[2]) {
            room = arguments[2];
        } else {
            self.channels[params.roomId] = $.extend(room.__proto__, params = $.extend({
                roomId: null,
                clientKey: null,
                nickName: null,
                grade: 'user'
            }, params));
            room.send = function(addr, data, back) {
                self.send.call(self, addr, data, back ? function(err, msg, body) {
                    back.apply(this, [err, msg ? msg.body : null]);
                    /*
                    if (err) {
                    	back.apply(this, [{
                    		returncode: err.failureCode,
                    		returnmessage: err.message,
                    	}, null]);
                    } else {
                    	body = msg.body;
                    	if (body.returncode == "1") {
                    		back.apply(this, [null, body.data]);
                    	} else {
                    		back.apply(this, [{
                    			returncode: body.returncode,
                    			returnmessage: body.returnmessage,
                    		}, null]);
                    	}
                    }
                    */
                } : null);
            }
        }

        if (this.state != VChatCloud.OPEN) {
            setupSockJSConnection.call(this, ebus_options);
            self.onopen = function() {
                this.joinChannel(params, callback, room);
            }
        } else {
            self.channels[params.roomId] = room;
            this.send('c2s.join', params, function(error, msg, body) {
                if (error) {
                    callback.apply(this, [error, null]);
                    self.enableReconnect(false);
                } else {
                    callback.apply(this, [null, msg.body.history]);
                    self.enableReconnect(true);
                    self.reconnectAttempts = 0;
                }
            });
        }
        return room;
    }

    var Channel = function() {
        this.resultCode = 0;
        this.alluserinfo = [];
    };

    $.extend(Channel.prototype, {
        // events
        onNotifyMessage: function(d) {
            return d;
        },
        onNotifyWhisper: function(d) {
            return d;
        },
        onNotifyNotice: function(d) {
            return d;
        },
        onNotifyCustom: function(d) {
            return d;
        },
        onNotifyJoinUser: function(d) {
            return d.clientKey && (this.alluserinfo[d.clientKey] = d), d;
        },
        onNotifyLeaveUser: function(d) {
            delete d.clientKey && this.alluserinfo[d.clientKey];
            return d;
        },
        onPersonalKickUser: function(d) {
            return d;
        },
        onPersonalUnkickUser: function(d) {
            return d;
        },
        onPersonalMuteUser: function(d) {
            return d;
        },
        onPersonalUnmuteUser: function(d) {
            return d;
        },
        onPersonalDuplicateUser: function(d) {
            return d;
        },
        onNotifyKickUser: function(d) {
            delete d.clientKey && this.alluserinfo[d.clientKey];
            return d;
        },
        onNotifyUnkickUser: function(d) {
            return d;
        },
        onNotifyMuteUser: function(d) {
            return d;
        },
        onNotifyUnmuteUser: function(d) {
            return d;
        },
        // method
        sendMessage: function(params, callback) {
            var data = $.extend({
                nickName: this.nickName,
                roomId: this.roomId,
                clientKey: this.clientKey,
                message: '',
                mimeType: 'text'
            }, params);
            (data.message) && this.send('c2s.send.message', data, callback);
        },
        sendWhisper: function(params, callback) {
            var data = $.extend({
                nickName: this.nickName,
                roomId: this.roomId,
                clientKey: this.clientKey,
                message: '',
                receivedClientKey: null,
                mimeType: "text"
            }, params);
            (data.receivedClientKey) && (data.message) && this.send('c2s.whisper.message', data, callback);
        },
        sendCustom: function(params, callback) {
            var data = $.extend({
                nickName: this.nickName,
                roomId: this.roomId,
                clientKey: this.clientKey,
                message: '',
                mimeType: 'text'
            }, params);
            (data.message) && this.send('c2s.sendcustom', data, callback);
        }
    });

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = VChatCloud;
        } else {
            exports.VChatCloud = VChatCloud;
        }
    } else {
        return VChatCloud;
    }
});