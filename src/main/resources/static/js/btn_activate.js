$(function() {
	// user update form
	$("#password, #originNickname").on('propertychange change keyup paste input', function() {
		if ($("#originNickname").val() == '' || $("#password").val() == '') {
			$("#btn-login").attr("disabled", true);
			$("#btn-update").attr("disabled", true);
		} else {
			if($("#nicknameError").css("color")=="rgb(0, 128, 0)" || $("#nicknameError").val()=="" || $("#nicknameError").val()== null){ // 초록색이면
				$("#btn-login").attr("disabled", false);
				$("#btn-update").attr("disabled", false);
			} else {
				$("#btn-login").attr("disabled", true);
				$("#btn-update").attr("disabled", true);
			}
		}
	}),

	// user join form
	$("#username, #password, #email, #originNickname").on('propertychange change keyup paste input', function() {
		
		if ($("#username").val() == '' || $("#password").val() == '' || $("#email").val() == '' || $("#originNickname").val() == '') {
			$("#btn-save").attr("disabled", true);
		} else {
			if($("#idError").css("color")=="rgb(0, 128, 0)" && 
				$("#emailError1").css("color")=="rgb(0, 128, 0)" && 
				$("#emailError2").css("color")=="rgb(0, 128, 0)" &&
				$("#nicknameError").css("color")=="rgb(0, 128, 0)") { // 초록색이면
				$("#btn-save").attr("disabled", false);
			} else {
				$("#btn-save").attr("disabled", true);
			}
		}
	}),
	
	// 회원가입 ID 중복체크
	$(".idCheck").on('propertychange change keyup paste input', function() {
		let idValue = $("#username").val();
		let fontColor;
		let comment;
		$.ajax({
			url: "/auth/usernameCheck",
			type: "POST",
			data: {username: idValue},
			dataType: 'json',
			success: function(result){
				if(result==0){
					fontColor = "red";
					comment = "이미 존재하는 아이디입니다.";
					$("#btn-save").attr("disabled", true);
				} else {
					fontColor = "green";
					comment = "사용 가능한 아이디입니다.";
				}
				$("#idError").css("font-size", 7);
				$("#idError").css("color", fontColor);
				$("#idError").html(comment);
			},
			error: function(){
				alert("서버요청실패");
			}
		})
		
	}),
	
	// 회원가입 이메일 중복체크
	$(".emailCheck").on('propertychange change keyup paste input', function() {
		let emailValue = $("#email").val();
		let fontColor;
		let comment;
		$.ajax({
			url: "/auth/emailCheck",
			type: "POST",
			data: {email: emailValue},
			dataType: 'json',
			success: function(result){
				if(result==0){
					fontColor = "red";
					comment = "이미 존재하는 이메일입니다.";
					$("#btn-save").attr("disabled", true);
				} else {
					fontColor = "green";
					comment = "사용 가능한 이메일입니다.";
				}
				$("#emailError2").css("font-size", 7);
				$("#emailError2").css("color", fontColor);
				$("#emailError2").html(comment);
			},
			error: function(){
				alert("서버요청실패");
			}
		})
		
	}),
	
	// 회원가입 닉네임 중복체크
	$(".nicknameCheck").on('propertychange change keyup paste input', function() {
		let nicknameValue = $("#originNickname").val();
		let fontColor;
		let comment;
		$.ajax({
			url: "/auth/nicknameCheck",
			type: "POST",
			data: {originNickname: nicknameValue},
			dataType: 'json',
			success: function(result){
				if(result==0){
					fontColor = "red";
					comment = "이미 존재하는 닉네임입니다.";
					$("#btn-save").attr("disabled", true);
					$("#btn-update").attr("disabled", true);
				} else {
					fontColor = "green";
					comment = "사용 가능한 닉네임입니다.";
				}
				$("#nicknameError").css("font-size", 7);
				$("#nicknameError").css("color", fontColor);
				$("#nicknameError").html(comment);
			},
			error: function(){
				alert("서버요청실패");
			}
		})
		
	}),
	
	//board save form
	$("#email").on("propertychange change keyup paste input", function() {
		let reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
		let fontColor;
		let comment;
		if(!reg_email.test($("#email").val())){
			fontColor = "red";
			comment = '이메일 형식이 잘못되었습니다.';
			$("#emailError2").attr("hidden", true);
			$("#btn-save").attr("disabled", true);
		} else {
			fontColor = "green"; 
			comment = '올바른 이메일 형식입니다.';
			$("#emailError2").attr("hidden", false);
		}
		$("#emailError1").css("font-size", 7);
		$("#emailError1").css("color", fontColor);
		$("#emailError1").html(comment);
	}),
	
	//board save form
	$("#title").on("propertychange change keyup paste input", function() {
		if ($("#title").val() == '') {
			$("#btn-save").attr("disabled", true);
		} else {
			$("#btn-save").attr("disabled", false);
		}
	});
})