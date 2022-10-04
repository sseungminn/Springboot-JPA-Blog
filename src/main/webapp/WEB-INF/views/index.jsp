<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ include file="layout/header.jsp"%>
<div class="container" id="wrapper">

	<c:forEach var="board" items="${boards.content }">
	
		<c:url value="/board/${board.id }" var="detail">
			<c:param name="page" value="${boards.number }"/>
		</c:url>
		<div class="card m-2">
			<div class="card-body">
				<h4 class="card-title">${board.title}</h4>
				<a href="${detail }" class="btn btn-primary">상세보기</a>
			</div>
		</div>
	</c:forEach>
<%@ include file="layout/paging.jsp"%>
</div>

<%@ include file="layout/footer.jsp"%>

