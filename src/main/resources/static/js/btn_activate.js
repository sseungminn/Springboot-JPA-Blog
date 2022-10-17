$(function() {
	// user update form
	$("#password").on('propertychange change keyup paste input', function() {
		if ($("#username").val() == '' || $("#password").val() == '') {
			$("#btn-login").attr("disabled", true);
			$("#btn-update").attr("disabled", true);
		} else {
			$("#btn-login").attr("disabled", false);
			$("#btn-update").attr("disabled", false);
		}
	}),

	// user join form
	$("#username, #password, #email, #originNickname").on('propertychange change keyup paste input', function() {
		
		if ($("#username").val() == '' || $("#password").val() == '' || $("#email").val() == '' || $("#originNickname").val() == '') {
			$("#btn-save").attr("disabled", true);
		} else {
			$("#btn-save").attr("disabled", false);
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
				} else{
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
				} else{
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
		} else{
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