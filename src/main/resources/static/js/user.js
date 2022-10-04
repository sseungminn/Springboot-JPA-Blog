let index = {
	init: function(){
		$("#btn-save").on("click", ()=>{ // function(){} 사용하지 않고, ()=> 사용한 이유  : this를 바인딩하기 위해
			this.save();
		});
		$("#btn-update").on("click", ()=>{ 
			this.update();
		});
	},
	
	save: function(){
		let nickname = "";
		let tmp = "";
			if($("#originNickname").val().length % 3 ==0){
				for(i=0; i<$("#originNickname").val().length/3; i++){ tmp += "*";}
				nickname = $("#originNickname").val().substring(0, $("#originNickname").val().length/3) + tmp + $("#originNickname").val().substring($("#originNickname").val().length/3*2);
			}
			else if($("#originNickname").val().length % 3 ==1){
				if($("#originNickname").val().length == 1){
					nickname = $("#originNickname").val();
				}else{
					for(i=0; i<=Math.ceil($("#originNickname").val().length/3); i++) {tmp += "*";}
					nickname = $("#originNickname").val().substring(0, Math.floor($("#originNickname").val().length/3)) + tmp + $("#originNickname").val().substring(Math.floor($("#originNickname").val().length/3*2)+1);
				}		
			} 
			else if($("#originNickname").val().length % 3 ==2){
				for(i=0; i<Math.ceil($("#originNickname").val().length/3)+1; i++) {tmp += "*";}
				if($("#originNickname").val().length==2){
					nickname = $("#originNickname").val().substring(0,1) + "*";
				}else{
					nickname = $("#originNickname").val().substring(0, Math.floor($("#originNickname").val().length/3)) + tmp + $("#originNickname").val().substring(Math.floor($("#originNickname").val().length/3*2)+1);
				}			
			}
			
		let data = {
			username: $("#username").val(),
			password: $("#password").val(),
			email: $("#email").val(),
			originNickname: $("#originNickname").val(),
			nickname : nickname
		};
		
//		console.log(data);
		// 회원가입시 ajax를 사용하는 이유 2가지
		// 1. 웹, 앱에 상관없이 요청에 대한 응답을 html이 아닌 data(json)를 받기 위해 
		// 2. 비동기통신을 하기 위해
		
		// ajax 호출시 default가 비동기호출임
		// ajax 통신을 이용해서 3개의 데이터를 json으로 변경하여 insert 요청
		// ajax가 통신을 성공하고 서버가 json을 리턴해주면 자동으로 자바오브젝트로 변환해준다  
		$.ajax({
			type: "POST",
			url: "/auth/joinProc",
			data: JSON.stringify(data), // http body 데이터
			contentType: "application/json; charset=utf-8", // body데이터(요청데이터)가 어떤 타입인지(MIME) 
			dataType: "json" // 응답결과를 어떤 타입데이터로 받을 건지 -> 이제는 default가 자바오브젝트로 변환해줌
		}).done(function(response){ // 요청이 정상이면 done 수행
			if(response.status == 200){
				alert("회원가입이 완료되었습니다.");
//				console.log(response);
				location.href = "/auth/loginForm";
			} else{
				alert("회원가입을 실패했습니다.");
				location.reload();
			}
		}).fail(function(error){ // 요청이 실패하면 fail 수행
			alert(JSON.stringify(error));
		})
	},
	
	update: function(){
		let nickname = "";
		let tmp = "";
			if($("#originNickname").val().length % 3 ==0){
				for(i=0; i<$("#originNickname").val().length/3; i++){ tmp += "*";}
				nickname = $("#originNickname").val().substring(0, $("#originNickname").val().length/3) + tmp + $("#originNickname").val().substring($("#originNickname").val().length/3*2);
			}
			else if($("#originNickname").val().length % 3 ==1){
				for(i=0; i<=Math.ceil($("#originNickname").val().length/3); i++) {tmp += "*";}
				nickname = $("#originNickname").val().substring(0, Math.floor($("#originNickname").val().length/3)) + tmp + $("#originNickname").val().substring(Math.floor($("#originNickname").val().length/3*2)+1);		
			} 
			else if($("#originNickname").val().length % 3 ==2){
				for(i=0; i<Math.ceil($("#originNickname").val().length/3)+1; i++) {tmp += "*";}
				if($("#originNickname").val().length==2){
					nickname = $("#originNickname").val().substring(0,1) + "*";
				}else{
					nickname = $("#originNickname").val().substring(0, Math.floor($("#originNickname").val().length/3)) + tmp + $("#originNickname").val().substring(Math.floor($("#originNickname").val().length/3*2)+1);
				}			
			}
			
		let data = {
			id: $("#id").val(),
			username: $("#username").val(),
			password: $("#password").val(),
			email: $("#email").val(),
			originNickname: $("#originNickname").val(),
			nickname: nickname
		};
		$.ajax({
			type: "PUT",
			url: "/user",
			data: JSON.stringify(data), 
			contentType: "application/json; charset=utf-8", 
			dataType: "json" 
		}).done(function(){
			alert("수정이 완료되었습니다.");
			location.href = "/";
		}).fail(function(error){ 
			alert(JSON.stringify(error));
		})
	}
}

index.init();