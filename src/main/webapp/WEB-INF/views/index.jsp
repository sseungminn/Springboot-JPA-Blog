<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ include file="layout/header.jsp"%>

<div class="container">

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

	<!-- 페이징처리 시작-->
	<ul class="pagination justify-content-center">
		<!-- 이전 버튼 -->
		<li class="page-item ${boards.first  ? 'disabled' : ''}"><a class="page-link" href="?page=${boards.number-1 }">Previous</a></li>
		
		<!-- 가운데 숫자 -->
		<c:forEach var="i" begin="${firstlistpage}" end="${lastlistpage}">
			<li class="page-item ${boards.number eq i-1 ? 'disabled' : ''}"><a class="page-link" href="?page=${i-1}">${i }</a></li>
		</c:forEach>
		
		<!-- 다음 버튼 -->
		<li class="page-item ${boards.last  ? 'disabled' : ''}"><a class="page-link" href="?page=${boards.number+1 }">Next</a></li>
	</ul>
	<!-- 페이징처리 끝-->
</div>

<%@ include file="layout/footer.jsp"%>

