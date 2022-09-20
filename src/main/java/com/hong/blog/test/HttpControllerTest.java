package com.hong.blog.test;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

//사용자의 요청 -> HTML 파일로 응답받을 땐
// @Controller

//사용자의 요청 -> 응답(Data)
@RestController
public class HttpControllerTest {

	private static final String TAG = "HttpControllerTest : ";
	
	@GetMapping("/http/lombok")
	public String lombokTest() {
		Member m = Member.builder().username("ssar").password("1234").email("123@email.com").build();
		System.out.println(TAG + "getter : " + m.getUsername());
		m.setUsername("testName");
		System.out.println(TAG + "setter : " + m.getUsername());
		return "lombokTest";
	}
	
	//인터넷 브라우저 요청은 무조건 get요청밖에 할 수 없음
	// http://localhost:8080/http/get (select)
	@GetMapping("/http/get")
	public String getTest(Member m) {
		return "get 요청 : " + m.getId() + ", " + m.getUsername() + ", " + m.getPassword() + ", " + m.getEmail();
	}
	
	
	// http://localhost:8080/http/post (insert)
	@PostMapping("/http/post") 
	public String postTest(@RequestBody Member m) {
		return "post 요청 : " + m.getId() + ", " + m.getUsername() + ", " + m.getPassword() + ", " + m.getEmail();
	}
	
	// http://localhost:8080/http/put (upsert)
	@PutMapping("/http/put")
	public String putTest(@RequestBody Member m) {
		return "put 요청 : " + m.getId() + ", " + m.getUsername() + ", " + m.getPassword() + ", " + m.getEmail();
	}
	
	// http://localhost:8080/http/delete  (delete)
	@DeleteMapping("http/delete")
	public String deleteTest() {
		return "delete 요청";
	}
}
