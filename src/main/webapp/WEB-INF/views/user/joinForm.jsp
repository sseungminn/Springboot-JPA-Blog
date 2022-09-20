<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ include file="../layout/header.jsp"%>

<div class="container">
	<form>
		<div class="form-group">
			<label for="username">ID</label> <input type="text" class="form-control" placeholder="Enter ID" id="username">
		</div>

		<div class="form-group">
			<label for="password">Password</label> <input type="password" class="form-control" placeholder="Enter password" id="password">
		</div>

		<div class="form-group">
			<label for="email">Email</label> <input type="email" class="form-control" placeholder="Enter email" id="email">
		</div>

		<div class="form-group">
			<label for="nickname">Nickname</label> <input type="text" class="form-control" placeholder="Enter nickname" id="nickname">
		</div>
	</form>

	<button id="btn-save" class="btn btn-primary">Join</button>
	<a href="https://kauth.kakao.com/oauth/authorize?client_id=e5056e73c622d1ca7da441fa86d21d2b&redirect_uri=http://localhost:8000/auth/kakao/callback&response_type=code"><img height="40px"
		src="/image/kakao_login_button.png" /></a>

</div>

<script src="/js/user.js"></script>

<%@ include file="../layout/footer.jsp"%>

