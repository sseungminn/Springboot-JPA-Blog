package com.hong.blog.config.jwt;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hong.blog.config.auth.PrincipalDetail;
import com.hong.blog.model.User;

import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter{
	@SuppressWarnings("unused")
	private final AuthenticationManager authenticationManager;
	
	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws org.springframework.security.core.AuthenticationException {
		System.out.println("JwtAuthenticationFilter : 로그인 시도중");
		try {
//			BufferedReader br = request.getReader();
//			String input = null;
//			while((input = br.readLine()) != null) {
//				System.out.println(input);
//			}
			ObjectMapper om = new ObjectMapper();
			User user = om.readValue(request.getInputStream(), User.class);
			System.out.println(user);
			
			UsernamePasswordAuthenticationToken authenticationToken = 
					new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword());
			
			// PrincipalDetailService의 loadUserByUsername()함수 실행된 후 정상이면 authentication이 리턴됨
			// DB에 있는 username과 password가 일치한다.
			Authentication authentication = authenticationManager.authenticate(authenticationToken);
			
			PrincipalDetail principalDetail = (PrincipalDetail)authentication.getPrincipal();
			System.out.println("로그인 완료됨 : " + principalDetail.getUser().getUsername()); // 정상 로그인 되었다는 뜻
			// authentication 객체가 session 영역에 저장해야하고 그 방법이 return 해주면 됨
			// 리턴의 이유는 권한 관리를 security가 대신 해주기 때문에 편하려고 하는 것임.
			// 굳이 JWT 토큰을 사용하면서 세션을 만들 이유가 없음. 근데 단지 권한 처리때문에 session에 넣어줌
			return authentication;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	// attemptAuthentication 실행 후 인증이 정상적으로 되엇으면 successfulAuthentication 함수 실행됨
	// JWT 토큰을 만들어서 request 요청한 사용자에게 JWT 토큰을 response 해주면 됨
	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication authResult) throws IOException, ServletException {
		System.out.println("successfulAuthentication 실행됨 : 인증 완료");
		super.successfulAuthentication(request, response, chain, authResult);
	}
}
