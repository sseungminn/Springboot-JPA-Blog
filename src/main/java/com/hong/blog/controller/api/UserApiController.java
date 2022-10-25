package com.hong.blog.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hong.blog.dto.ResponseDto;
import com.hong.blog.model.RoleType;
import com.hong.blog.model.User;
import com.hong.blog.service.UserService;

@RestController // 데이터만 return 해주는 컨트롤러
public class UserApiController {

	@Autowired
	private UserService userService;

	@Autowired
	private AuthenticationManager authenticationManager;
	
	@PostMapping("/auth/joinProc") // join process
	public ResponseDto<Integer> save(@RequestBody User user) {
		System.out.println("UserApiController : save 호출됨");
		user.setRole(RoleType.USER);
		userService.회원가입(user);
		return new ResponseDto<Integer>(HttpStatus.OK.value(), 1);
	}

	@PutMapping("/user")
	public ResponseDto<Integer> update(@RequestBody User user) { // key=value, x-www-form-urlencoded
		userService.회원수정(user);
		// 여기서는 트랜잭션이 종료되기 때문에 DB에 값은 변경이 됐음
		// 하지만 세션값은 변경되지 않은 상태이기 때문에 직접 세션값 변경해줄 것임

		// 세션등록
		Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
		SecurityContextHolder.getContext().setAuthentication(authentication);
		
		return new ResponseDto<Integer>(HttpStatus.OK.value(), 1);
	}
	
	@PostMapping("/auth/usernameCheck")
	public boolean idCheck(@RequestParam("username") String id) {
		User user = userService.회원찾기(id);
		if(user == null) { // 존재하는 회원이 없음 -> 가입 가능
			return true;
		}else {
			return false;	
		}
	}
	
	@PostMapping("/auth/emailCheck")
	public boolean emailCheck(@RequestParam("email") String email) {
		User user = userService.이메일로회원찾기(email);
		if(user == null) { // 존재하는 회원이 없음 -> 가입 가능
			return true;
		}else {
			return false;	
		}
	}
	
	@PostMapping("/auth/nicknameCheck")
	public boolean nicknameCheck(@RequestParam("originNickname") String originNickname) {
		List<User> user = userService.닉네임으로회원찾기(originNickname);
		if(user.size() == 0) { // 존재하는 회원이 없음 -> 가입 가능
			return true;
		}else {
			return false;	
		}
	}
}
