$(function(){
	$("#password").on('input', function(){
		if($("#username").val() == '' || $("#password").val() == ''){
			$("#btn-login").attr("disabled", true);
			$("#btn-update").attr("disabled",true);
		}else{
			$("#btn-login").attr("disabled", false);
			$("#btn-update").attr("disabled",false);
		}
	})
})