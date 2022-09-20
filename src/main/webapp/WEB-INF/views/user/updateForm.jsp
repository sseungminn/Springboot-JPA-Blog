<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ include file="../layout/header.jsp"%>
<div class="container">
	<form>
<%-- 	<c:if test="${principal.user }"> --%>
	
<%-- 	</c:if> --%>
		<input type="hidden" id="id" value="${principal.user.id }">
		<div class="form-group">
			<label for="username">Name</label> 
			<input type="text" value="${principal.user.username}"class="form-control" placeholder="Enter username" id="username" readonly>
		</div>
		
	<c:if test="${empty principal.user.oauth }"> <!-- 카카오, 구글 가입자 아님 -->
		<div class="form-group">
			<label for="password">Password</label> 
			<input type="password" class="form-control" placeholder="Enter password" id="password">
		</div>
	</c:if>
		<div class="form-group">
			<label for="email">Email</label> 
			<input type="email" value="${principal.user.email }" class="form-control" placeholder="Enter email" id="email" ${principal.user.oauth != null ? 'readonly' : '' }>
		</div>
		<div class="form-group">
			<label for="nickname">Nickname</label> 
			<input type="text" value="${principal.user.nickname }" class="form-control" placeholder="Enter nickname" id="nickname" ${principal.user.oauth != null ? 'readonly' : '' }>
		</div>
	</form>
	
	<button  id="btn-update" class="btn btn-primary">Update</button>
	
</div>

<script src="/js/user.js"></script>

<%@ include file="../layout/footer.jsp"%>

