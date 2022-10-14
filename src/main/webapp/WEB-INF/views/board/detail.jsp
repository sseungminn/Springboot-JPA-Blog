<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="../layout/header.jsp"%>
<script>
let page = new URLSearchParams(location.search).get('page');
let search = new URLSearchParams(location.search).get('search');
function list(){
	location.href='/?page='+page+'&search='+search;
}
function updateBtn(){
	location.href="/board/${board.id}/updateForm?page="+page+'&search='+search;
}
function replyDelete(boardId, replyId){
	check = confirm("삭제하시겠습니까?");
	if(check == true){
		index.replyDelete(boardId, replyId);
	}
}
</script>
<div class="container">

	<button class="btn btn-secondary" onclick="list()">목록</button>
	<c:if test="${board.user.id eq  principal.user.id}">
		<a onclick="updateBtn()" class="btn btn-warning">수정</a>
		<button id="btn-delete" class="btn btn-danger">삭제</button>
	</c:if>

	<br /> <br />

	<div>
		글 번호 : <span id="id"><i>${board.id } </i></span> <br /> 작성자 : <span><i>${board.user.nickname } </i></span>
	</div>

	<br />

	<div>
		<!-- 			<label for="title">Title</label>  -->
		<h3>${board.title }</h3>
	</div>
	<hr />

	<div>
		<!-- 			<label for="content">Content</label> -->
		<div>${board.content }</div>
	</div>
	<hr />

	<!-- 댓글 -->
	<div class="card">
		<form>
			<input type="hidden" id="userId" value="${principal.user.id }"> <input type="hidden" id="boardId" value="${board.id }">
			<div class="card-body">
				<textarea id="reply-content" class="form-control" rows="1"></textarea>
			</div>
			<div class="card-footer">
				<button type="button" id="btn-reply-save" class="btn btn-primary">등록</button>
			</div>
		</form>
	</div>

	<br />

	<div class="card">
		<div class="card-header">댓글리스트</div>

		<ul id="reply-box" class="list-group">
			<c:forEach var="reply" items="${board.replys }">
				<li id="reply-${reply.id}" class="list-group-item d-flex justify-content-between">
					<div>${reply.content }</div>
					<div class="d-flex">
						<div class="font-italic">${reply.user.nickname }&nbsp;</div>
						<c:if test="${principal.user.username ==reply.user.username }">
							<button onClick="replyDelete(${board.id}, ${reply.id})" class="badge">삭제</button>
						</c:if>
					</div>
				</li>
			</c:forEach>
		</ul>

	</div>

</div>

<script src="/js/board.js"></script>
<%@ include file="../layout/footer.jsp"%>
