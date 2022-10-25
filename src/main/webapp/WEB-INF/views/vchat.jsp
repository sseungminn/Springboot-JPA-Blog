<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="설치 없이 가입 즉시 바로 이용할 수 있는 무료 채팅 서비스를 제공 해 드리겠습니다." />
        <meta name="author" content="" />
        <meta property="og:type" content="website" /> 
        <meta property="og:title" content="바로 이용하는 무료 채팅 솔루션" />
        <meta property="og:description" content="설치 없이 가입 즉시 바로 이용할 수 있는 무료 채팅 서비스를 제공 해 드리겠습니다." />
        <meta property="og:image" content="https://www.vchatcloud.com/img/common/og_img.png" />
		<meta property="og:url" content="https://www.vchatcloud.com" />
        <title>PC형</title>
        <link rel="canonical" href="https://vchatcloud.com/index.html">
        <link rel="icon" type="image/x-icon" href="/image/vchat/favicon.ico" />  
        <link href="/css/reset.css" rel="stylesheet" />
        <link href="/css/chatStyle.css" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.gstatic.com">
		<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap" rel="stylesheet">
        <script src="https://kit.fontawesome.com/c13f14f04a.js" crossorigin="anonymous"></script>
        <script src="https://code.jquery.com/jquery-3.3.1.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/sockjs-client@1.5.0/dist/sockjs.min.js"></script>
        
        <script src="/js/vchat/vchatcloud.js"></script>
        <script src="/js/vchat/login.js"></script>
        <script src="/js/vchat/count.js"></script>
        <script src="/js/vchat/errMsg.js"></script>
        <script src="/js/vchat/draw.js"></script>
        
<!--         <script src="/js/vchat/chatList.js"></script> -->
        <script src="/js/vchat/emoji.js"></script>
<!--         <script src="/js/vchat/whisper.js"></script> -->
<!--         <script src="/js/vchat/sample.js"></script> -->
    </head>
    <body>
    	<div id="wrap">
            <section>
                <div class="pc">
                    <article class="header">
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </article>

                    <article class="contents">

<!--                         비디오 영역  -->
<!--                         <div class="video"> -->
<!--                             <iframe id="ytube_link" width="100%" height="100%" src="https://www.youtube.com/embed/Cu2j6jUopbw?autoplay=1&controls=0&mute=1&modestbranding=1&rel=0&playlist=Cu2j6jUopbw&loop=1" frameborder="0"></iframe> -->
<!--                             <ul class="like"> -->
<!--                                 <li><span id="likeCounter"></span></li> -->
<!--                                 <li><i id="sendLike" class="fab fa-gratipay"></i></li>     -->
<!--                             </ul>     -->
<!--                         </div> -->
<!--                         비디오 영역 끝 -->

                        <!-- 채팅 영역 -->
                        <div class="chat">
                            <!-- 에러 표시 팝업 -->
                            <div class="errorpopup">
                                <p><i class="fas fa-exclamation-circle"></i></p>
                                <p>시스템이 원활하지 않아 오류가 발생하였습니다. 잠시 후, 다시 참여해 주시기 바랍니다.</p>
                                <a class="popupbtn" href="#!">닫기</a>
                            </div>
                            <!-- 에러 표시 팝업 끝 -->

                            <!-- 커스텀 팝업 -->
                            <div class="custompopup">
                                <p>팝업</p>
                                <a class="popupbtn" href="#!">확인</a><a class="popupbtn" href="#!">취소</a>
                            </div>
                            <!-- 커스텀 팝업 끝 -->
                            
                            <!-- 로그인 -->
                            <div class="login">
                                <p class="login-title">채팅방 설정</p>
                                <div class="name">
                                    <label for="name">대화명</label>
                                    <input class="name" type="text" id="name" value='${me}' readonly placeholder="로그인 할 대화명을 입력 해주세요.">
                                </div>
                                <button class="popupbtn">확인</button>
                            </div>
                            <!-- 로그인 끝 -->
                            <!-- 도움말 시작 -->
                            <div class="use_help">
                                <div class="help_contents">
                                    <ul>
                                        <li class="help_title">· 메시지 보내기</li>
                                        <li>1. 전송하실 메시지를 입력하고 <span class="btn_send">전송</span>을 클릭하세요.</li>
                                        <li><img src="/image/vchat/help/001.png" alt="메시지 입력"></li>
                                    </ul>
                                    <ul>
                                        <li class="help_title">· 이모티콘 보내기</li>
                                        <li>1. 아이콘 <i class="fas fa-laugh"></i> 을 클릭하시면 나타나는 목록에서 원하시는 이모티콘을 선택하세요.</li>
                                        <li><img src="/image/vchat/help/002.png" alt="이모티콘 등록"></li>
                                    </ul>
                                    <ul>
                                        <li class="help_title">· 귓속말 보내기</li>
                                        <li>1. 귓속말을 받으실 사용자 대화명을 클릭하세요.</li>
                                        <li>2. 나타난 팝업창에서 <i class="fas fa-comment-alt"></i> 귓속말 입력창에 보내실 메시지를 입력하고 <span>보내기</span>버튼을 클릭하세요.</li>
                                        <li><img src="/image/vchat/help/003.png" alt="귓속말 입력"></li>
                                    </ul>
                                    <ul>
                                        <li class="help_title">· 신고하기</li>
                                        <li>1. 신고할 사용자 대화명을 클릭하세요.</li>
                                        <li>2. 나타난 팝업창에서 <i class="fas fa-not-equal"></i> 신고하기을 클릭하세요.</li>
                                        <li><img src="/image/vchat/help/004.png" alt="신고하기"></li>
                                    </ul>
                                </div>
                                <div class="btn_help_close">
                                    도움말 닫기
                                </div>    
                            </div>
                            <!-- 도움말 끝 -->

                            <div class="chat_field1">
                            <!-- 채팅 시작 -->
                            <div class="chat_field" id="chat">
                                <div class="chat_name">
                                    <ul>
                                        <li>Hong's Blog</li>
                                        <li><a href="#!" class="help">도움말</a></li>
                                        <li><a href="#!" class="closebtn"><i class="fas fa-sign-out-alt closebtn"></i></a></li>
                                    </ul>
                                </div>

                                <!-- 대화 내용 시작 -->                   
                                <div class="chat_contents">
                                    <div id="content1">                                   
                                        <!-- 채팅 노출 영역 시작-->
                                        <c:out value=""></c:out>
                                        <!-- 채팅 노출 영역 끝-->

                                        <!-- 대화명 클릭 시 노출 팝업 시작 -->
                                        <div class="popupLayer">
                                            <div class="popup">
                                                <ul class="popup_content">
                                                    <li class="ico_whisper"><a href="#!"><i class="fas fa-comment-alt"></i>귓속말 보내기</a>
                                                        <div id="whisper" >
                                                            <form><input type="text" name="message"><button>보내기</button></form>
                                                        </div>
                                                    </li>
                                                    <li><a href="#!"><i class="fas fa-not-equal"></i>신고하기</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <!-- 대화명 클릭 시 노출 팝업 끝 -->
                                    </div>
                                </div>
                                <!-- 대화 내용 끝 -->

                                <!-- 메시지 작성 시작 -->
                                <div class="chat_input">
                                    <div>
                                        <div class="name">홍길동</div>
                                        <div class="textbox" id="content" maxlength="200" contenteditable="true" placeholder="메세지 입력하기"></div>
                                        <!-- 이모티콘 영역 -->
                                        <div class="emoji_contents">
                                        </div>
                                        <!-- 이모티콘 영역 끝-->
                                    </div>
                                </div>
                                <!-- 메시지 작성 끝 -->

                                <!-- 이모지 및 전송 버튼 시작 -->
                                <div class="chat_input_btn">
                                    <ul class="emoji">
                                        <li>
                                            <a href="#!" class="ico_emoji show">
                                                <i class="fas fa-laugh"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#!" class="ico_keyboard">
                                                <i class="fas fa-keyboard"></i>
                                            </a>
                                        </li>
                                    </ul>
                                    <ul class="send">
                                        <li><span class="counter"  id="counter">0</span></li>
                                        <li class="btn_send"><a href="#!">전송</a></li>
                                    </ul>
                                </div>
                                <!-- 이모지 및 전송 버튼 끝 -->
                            </div>

                            <!-- 채팅창 숨기기&보이기 버튼 -->
                            <div class="btn">
                                <div class="btn_hide show">채팅 숨기기</div>
                                <div class="btn_show">채팅 보이기</div>
                            </div>
                        </div>
                            <!-- 채팅창 숨기기&보이기 버튼 끝-->
                            <!-- 채팅 끝 -->

                        </div>
                        <!-- 채팅 영역 끝 -->
                    </article>
                </div>
                <!-- 샘플 화면 끝 -->
            </section>
    	</div>
    </body>
</html>
