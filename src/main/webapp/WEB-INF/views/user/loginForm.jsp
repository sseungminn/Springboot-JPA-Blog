<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../layout/header.jsp"%>
<c:if test="${not empty principal }">
	<script>
			location.href="<c:url value='/'/>";
	</script>
</c:if>
<div class="container">
	<form action="/auth/loginProc" method="post">
		<div class="form-group">
			<label for="username">ID</label> 
			<input type="text"  name="username" class="form-control" placeholder="Enter username" id="username">
		</div>
		
		<div class="form-group">
			<label for="password">Password</label> 
			<input type="password" name="password" class="form-control" placeholder="Enter password" id="password">
		</div>
		
		<button id="btn-login" class="btn btn-primary">Login</button>
		<a href="https://kauth.kakao.com/oauth/authorize?client_id=e5056e73c622d1ca7da441fa86d21d2b&redirect_uri=http://localhost:8000/auth/kakao/callback&response_type=code" ><img height="40px" src="/image/kakao_login_button.png"/></a>
		
	</form>

</div>

<script src="/js/user.js"></script>
<%@ include file="../layout/footer.jsp"%>

