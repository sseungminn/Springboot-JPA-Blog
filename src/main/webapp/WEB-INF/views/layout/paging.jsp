<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!-- 페이징처리 시작-->
<ul class="pagination justify-content-center">
	<!-- 이전 버튼 -->
	<li class="page-item ${boards.first  ? 'disabled' : ''}"><a class="page-link" href="?page=${boards.number-1 }&search=${param.search}">&lt;</a></li>

	<!-- 가운데 숫자 -->
	<c:forEach var="i" begin="${firstlistpage}" end="${lastlistpage}">
		<li class="page-item ${boards.number eq i-1 ? 'disabled' : ''}"><a class="page-link" href="?page=${i-1}&search=${param.search}">${i }</a></li>
	</c:forEach>

	<!-- 다음 버튼 -->
	<li class="page-item ${boards.last  ? 'disabled' : ''}"><a class="page-link" href="?page=${boards.number+1 }&search=${param.search}">&gt;</a></li>
</ul>
<!-- 페이징처리 끝-->
