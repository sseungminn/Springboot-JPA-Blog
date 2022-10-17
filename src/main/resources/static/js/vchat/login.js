const vChatCloud = new VChatCloud();
const dhd = new VChatCloud();
let channel, userNick, userKey, channelKey, youtubeId;

var getParameters = function (paramName) {
    // 리턴값을 위한 변수 선언
    var returnValue;

    // 현재 URL 가져오기
    var url = location.href;

    // get 파라미터 값을 가져올 수 있는 ? 를 기점으로 slice 한 후 split 으로 나눔
    var parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');

    // 나누어진 값의 비교를 통해 paramName 으로 요청된 데이터의 값만 return
    for (var i = 0; i < parameters.length; i++) {
        var varName = parameters[i].split('=')[0];
        if (varName.toUpperCase() == paramName.toUpperCase()) {
            returnValue = parameters[i].split('=')[1];
            return decodeURIComponent(returnValue);
        }
    }
};

//channelKey = getParameters('channelKey');
//channelKey = 'WrXvmQcRTF-M4GbrdfGSm-20220418102355'; //첫번째 PlusPro방 -> <script>alert(1);</script> 해결 못 함
channelKey = 'PswmBLHCLT-GAZr1pV2Qt-20220419134910'; //두번째 PlusPro방
$(function() {
    // 파라미터로 "youtubeId" 값이 빈값이 아닐경우 영상 교체
    // 비디오 영역을 보여주며, 빈값일때는 채팅 채팅화면 영역만 보여준다.(채팅영역은 css를 수정하게끔 해준다.)
    if (getParameters('youtubeId') != undefined ) {
        youtubeId = getParameters('youtubeId');
        $("#ytube_link").attr("src","https://www.youtube.com/embed/"+youtubeId+"?autoplay=1&controls=0&mute=1&modestbranding=1&rel=0&playlist="+youtubeId+"&loop=1");
    }else {
        $('div .pc').css('width','380px');
        $('div .pc').css('height','710px');
        $('.pc .chat_field').css('height','570px');
        $('div .video').remove();

        let html = "";
        
        html += '<ul class="like">';
        html += '<li><span id="likeCounter" style="margin-right: 7px;"></span></li>';
        html += '<li><i id="sendLike" class="fab fa-gratipay"></i></li>';
        html += '</ul>';
        $("div .btn").append(html);
    }
    
    let p = $('div.login').show(),
        c = $('div.chat_field1').hide();
        likeInif();

        $('button.popupbtn', p).click(function() {
            let r = {nick: $('input#name', p).val() };
            if (r.nick) {
                $('div.chat_input div.name').text(r.nick);
                joinRoom(channelKey, 'xxxxxxxx'.replace(/[xy]/g, function(a, b) { return (b = Math.random() * 16, (a == 'y' ? b & 3 | 8 : b | 0).toString(16)) }), r.nick, function(err, history) {
                    if (err) {
                        openError(err.code, function() {
                            p.show();
                            c.hide();
                            vChatCloud.disconnect();
                        });
                    } else {
                        // 채팅영역에 글쓰기가 활성화될시 활성화
                        let noticeMsgCnt = 0;
                        if (typeof write == 'function') history && history.forEach(function(m) {                             
                            if (m.messageType == "notice") {
                                if(noticeMsgCnt == 0){
                                    noticeMsgCnt++;
                                    write(m, 'notice', true);
                                }
                            } else {
                                write(m,'' ,true);
                            }
                        });
                        p.hide();
                        c.show();

                        // 이벤트 바인딩 시작
                        chatInit();
                        personalInit();
                        msgInit();
                        likeInif();
                    }
                });
            }
        });
    $('div.chat_name a.closebtn').click(function() {
        p.show();
        c.hide();
        vChatCloud.disconnect();
        $("#likeCounter").text("0");
    })
})

function joinRoom(roomId, clientKey, nickName, callback) {
    // vchatcloud 객체
    channel = vChatCloud.joinChannel({
        roomId: roomId,
        clientKey: clientKey,
        nickName: nickName
    }, function(error, history) {
        $('div.entery, div.chatout, div.notice, div.whisper, div.content').remove();
        if (error) {
            if (callback) return callback(error, null);
            return error;
        }
        if (callback) callback(null, history);
        // 채팅영역에 글쓰기가 활성화될시 활성화
        if (typeof write == 'function') write("실시간 채팅에 오신 것을 환영합니다. 개인정보를 보호하고 커뮤니티 가이드를 준수하는 것을 잊지 마세요!", 'notice');
    })
}

function openError(code, callback) {
    let p = $('div.errorpopup').hide();
    if(errMsg[code] == undefined){
        $('p:nth-child(2)', p).text(code);
    } else {
        $('p:nth-child(2)', p).text(errMsg[code].kor);
    }
    $('a', p).off().click(function() { p.hide(); if (typeof callback == 'function') { callback() } });
    p.show();
}
