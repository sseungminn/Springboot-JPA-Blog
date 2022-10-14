<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../layout/header.jsp"%>
<script type="text/javascript" src="/js/btn_activate.js"></script>
<script>
// 복붙방지
function onKeyDown() {
	var pressedKey = String.fromCharCode(event.keyCode).toLowerCase();
	if (event.ctrlKey && (pressedKey == "c" || pressedKey == "v")) {
		event.returnValue = false;
	}
}
</script>
<c:if test="${not empty principal }">
	<script>
		location.href = "<c:url value='/'/>";
	</script>
</c:if>
<div class="container">
<!-- 	<form action="/auth/loginProc" method="POST"> -->
	<form action="/login" method="POST">
		<div class="form-group">
			<label for="username">ID</label> <input type="text" name="username" class="form-control" placeholder="Enter username" id="username" autofocus autocomplete="off">
		</div>

		<div class="form-group">
			<label for="password">Password</label> <input type="password" name="password" class="form-control" placeholder="Enter password" id="password" onkeydown="onKeyDown()" oncontextmenu="return false;">
		</div>
		
		<div class="text-center">
		
			<!-- 일반 로그인 -->
			<button id="btn-login" class="btn btn-outline-dark" style="width: 162px" disabled><b>Login</b></button><br />
			<h1></h1> <!-- 여백용 h1태그 -->
			
			<!-- 카카오 로그인(카카오정보로 블로그 회원가입)-->
			<a href="https://kauth.kakao.com/oauth/authorize?client_id=e5056e73c622d1ca7da441fa86d21d2b&redirect_uri=http://localhost:8000/auth/kakao/callback&response_type=code"> 
				<img height="40px" src="/image/kakao_login_medium_narrow.png" />
			</a> <br />
			 <h1></h1>
			 
			<!-- 구글 로그인(구글정보로 블로그 회원가입) -->
			<a href="/oauth2/authorization/google"> 
				<img height="40px" src="/image/btn_google_signin_light_normal_web.png" />
			</a><br />
			 <h1></h1>
			 
			<!-- 페북 로그인(페북정보로 블로그 회원가입) -->
			<a href="/oauth2/authorization/facebook">
				<img height="37px"  width="164px" src="/image/facebook_btn.png" />
			</a><br />
			<h1></h1>
			
			<!--  네이버 로그인(네이버정보로 블로그 회원가입) -->
			<a href="/oauth2/authorization/naver">
				<img height="38px"  width="164px" src="/image/naver_btn.png" />
			</a><br/>
			<h1></h1>
			
		</div>
	</form>

</div>

<script src="/js/user.js"></script>
<%@ include file="../layout/footer.jsp"%>

