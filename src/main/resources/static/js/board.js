let index = {
	init: function(){
		$("#btn-save").on("click", ()=>{ 
			this.save();
		});
		$("#btn-delete").on("click", ()=>{
			check = confirm("삭제하시겠습니까?");
			if(check==true){ 
			this.deleteById();
			}
		});
		$("#btn-update").on("click", ()=>{ 
			this.update();
		});
		$("#btn-reply-save").on("click", ()=>{ 
			this.replySave();
		});
	},
	
	save: function(){
		let data = {
			title: $("#title").val(),
			content: $("#content").val()
		};
		
		$.ajax({
			type: "POST",
			url: "/api/board",
			data: JSON.stringify(data), 
			contentType: "application/json; charset=utf-8", 
			dataType: "json"
		}).done(function(){ 
			alert("글쓰기가 완료되었습니다.");
			location.href = "/";
		}).fail(function(error){
			alert(JSON.stringify(error));
		});
	},
	
	deleteById: function(){
		let id = $("#id").text();
		let page = new URLSearchParams(location.search).get('page');
		let search = new URLSearchParams(location.search).get('search');
		$.ajax({
			type: "DELETE",
			url: `/api/board/${id}`,
			dataType: "json"
		}).done(function(){ 
			alert("삭제가 완료되었습니다.");
			location.href = `/?page=${page}&search=${search}`;
		}).fail(function(error){
			alert(JSON.stringify(error));
		});
	},
	
	update: function(){
		let id = $("#id").val();
		let page = new URLSearchParams(location.search).get('page');
		let search = new URLSearchParams(location.search).get('search');
		let data = {
			title: $("#title").val(),
			content: $("#content").val()
		};
		
		$.ajax({
			type: "PUT",
			url: `/api/board/${id}`,
			data: JSON.stringify(data), 
			contentType: "application/json; charset=utf-8", 
			dataType: "json"
		}).done(function(){ 
			alert("글수정이 완료되었습니다.");
			location.href = `/board/${id}?page=${page}&search=${search}`;
		}).fail(function(error){
			alert(JSON.stringify(error));
		});
	},
	
	replySave: function(){
		let data = {
			userId: $("#userId").val(),
			boardId: $("#boardId").val(),
			content: $("#reply-content").val()
		};
		let page = new URLSearchParams(location.search).get('page');
		let search = new URLSearchParams(location.search).get('search');
		$.ajax({
			type: "POST",
			url: `/api/board/${data.boardId}/reply`,
			data: JSON.stringify(data), 
			contentType: "application/json; charset=utf-8", 
			dataType: "json"
		}).done(function(){ 
			alert("댓글쓰기가 완료되었습니다.");
			location.href = `/board/${data.boardId}?page=${page}&search=${search}`;
		}).fail(function(error){
			alert(JSON.stringify(error));
		});
	},
	
	replyDelete: function(boardId, replyId){
		let page = new URLSearchParams(location.search).get('page');
		let search = new URLSearchParams(location.search).get('search');
		$.ajax({
			type: "DELETE",
			url: `/api/board/${boardId}/reply/${replyId}`,
			dataType: "json"
		}).done(function(){ 
			alert("댓글삭제 성공");
			location.href = `/board/${boardId}?page=${page}&search=${search}`;
		}).fail(function(error){
			alert(JSON.stringify(error));
		});
	}
	
	
	
}

index.init();