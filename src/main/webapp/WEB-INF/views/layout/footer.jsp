<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<br/>
<c:if test="${principal != null}">
	<iframe id="chatBox" name="chatBox" style="display:none; position: absolute; left:67%; top: 10%;" class="chatBox" src='/chat/${principal.user.originNickname}' frameborder='no' scrolling='no' marginwidth='0' marginheight='0' width='391' height='670'></iframe>
	<div class='toggleBG' style="position: absolute; left:90%; bottom:23%;">
		<input type="image" src="/image/vchat/chat.jpg" class="chatBtn" onClick="activeChat();">
	</div>
</c:if>
<br/>
<div class="jumbotron text-center mt-auto" style="margin-bottom: 0;">
	<h6>Created By Hong</h6>
	<h6>📞 010-1111-2222</h6>
	<h6>🏁 Seongnam-si, Gyeonggi-do, Republic of Korea</h6>
</div>

</body>
</html>