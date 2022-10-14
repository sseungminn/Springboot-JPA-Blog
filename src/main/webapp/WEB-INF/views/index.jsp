<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ include file="layout/header.jsp"%>

<div class="container search-bar input-group mb-3">
	<form class="form-inline">
	  <input type="search" name="search"  value="${param.search}" class="form-control rounded-pill" placeholder="Enter title to search" autofocus>&nbsp;
	  <div class="input-group-append">
	    <button class="btn btn-outline-secondary rounded-pill">Search</button>
	  </div>
	</form>
</div>
<div class="container" id="wrapper">

	<c:forEach var="board" items="${boards.content }">
		<c:url value="/board/${board.id }" var="detail">
			<c:param name="page" value="${boards.number }"/>
			<c:param name="search" value="${param.search}"/>
		</c:url>
		<div class="card m-2 bg-light">
			<div class="card-body">
				<h4 class="card-title">${board.title}</h4>
				<a href="${detail }" class="btn btn-outline-primary">상세보기</a>
			</div>
		</div>
	</c:forEach>
<%@ include file="layout/paging.jsp"%>
</div>

<%@ include file="layout/footer.jsp"%>

