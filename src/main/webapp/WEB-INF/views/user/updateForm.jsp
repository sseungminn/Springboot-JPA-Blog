<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ include file="../layout/header.jsp"%>
<script type="text/javascript" src="/js/btn_activate.js"></script>
<script>

//복붙방지
function onKeyDown() {
	var pressedKey = String.fromCharCode(event.keyCode).toLowerCase();
	if (event.ctrlKey && (pressedKey == "c" || pressedKey == "v")) {
		event.returnValue = false;
	}
}

</script>
<div class="container">
	<form>
		<input type="hidden" id="id" value="${principal.user.id }">
		<div class="form-group">
			<label for="username">ID</label> 
			<input type="text" value="${principal.user.username}"class="form-control" placeholder="Enter username" id="username" readonly>
		</div>
		
	<c:if test="${empty principal.user.oauth }"> <!-- 카카오, 구글 가입자 아님 -->
		<div class="form-group">
			<label for="password">Password</label> 
			<input type="password" class="form-control" placeholder="Enter password" id="password" onkeydown="onKeyDown()" oncontextmenu="return false;" required>
		</div>
	</c:if>
		<div class="form-group">
			<label for="email">Email</label> 
			<input type="email" value="${principal.user.email }" class="form-control" placeholder="Enter email" id="email" ${principal.user.oauth != null ? 'readonly' : '' }>
		</div>
		<div class="form-group">
			<label for="originNickname">Nickname</label> 
			<input type="text" value="${principal.user.originNickname }" class="form-control" placeholder="Enter nickname" id="originNickname" ${principal.user.oauth != null ? 'readonly' : '' }>
		</div>
		
	</form>
	
	<c:if test="${empty principal.user.oauth }">
		<button id="btn-update" class="btn btn-primary" disabled>Update</button>
	</c:if>
	<a href="/" class="btn btn-primary" >Home</a>
		
</div>

<script src="/js/user.js"></script>

<%@ include file="../layout/footer.jsp"%>

