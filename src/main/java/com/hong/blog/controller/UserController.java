package com.hong.blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hong.blog.config.auth.PrincipalDetail;
import com.hong.blog.model.KakaoProfile;
import com.hong.blog.model.OAuthToken;
import com.hong.blog.model.User;
import com.hong.blog.service.UserService;

// 인증이 안 된 사용자들이 출입할 수 있는 경로를 /auth/** 허용 
// 그냥 주소가 / 이면 index.jsp 허용
// static 이하에 있는 /js/**, /css/**, /image/** 등등 허용
@Controller
public class UserController {

	private String grant_type = "authorization_code";
	private String client_id = "e5056e73c622d1ca7da441fa86d21d2b";
	private String redirect_uri = "http://ec2-3-34-7-153.ap-northeast-2.compute.amazonaws.com:8000/auth/kakao/callback";
	
	@Value("${hong.key}")
	private String hongKey;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private UserService userService;
	
	@GetMapping("/auth/joinForm")
	public String joinForm() {
		return "user/joinForm";
	}

	@GetMapping("/auth/loginForm")
	public String loginForm() {
		return "user/loginForm";
	}

	@GetMapping("/auth/kakao/callback")
	public String kakaoCallback(String code) { // @ResponseBody -> Data를 리턴해주는 컨트롤러 함수

		// POST방식으로 key=value 데이터를 요청(카카오쪽으로)
		// Retrofit2, OkHttp, RestTemplate 등
		RestTemplate rt = new RestTemplate();

		// HttpHeader 오브젝트 생성
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
		// HttpBody 오브젝트 생성
		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type", grant_type);
		params.add("client_id", client_id);
		params.add("redirect_uri", redirect_uri);
		params.add("code", code);

		// HttpHeader와 HttpBody를 하나의 오브젝트에 담기
		HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(params, headers);

		// Http 요청하기 - POST 방식으로 - 그리고 response 변수의 응답 받음
		ResponseEntity<String> response = rt.exchange("https://kauth.kakao.com/oauth/token", HttpMethod.POST,
				kakaoTokenRequest, String.class);

		// Gson, Json Simple, ObjectMapper
		ObjectMapper objectMapper = new ObjectMapper();
		OAuthToken oauthToken = null;
		try {
			oauthToken = objectMapper.readValue(response.getBody(), OAuthToken.class);
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}

//		System.out.println("카카오 액세스 토큰 : " + oauthToken.getAccess_token());

		// 11111111111111111111111111111111111111
		RestTemplate rt2 = new RestTemplate();
		HttpHeaders headers2 = new HttpHeaders();
		headers2.add("Authorization", "Bearer " + oauthToken.getAccess_token());
		headers2.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
		HttpEntity<MultiValueMap<String, String>> kakaoProfileRequest2 = new HttpEntity<>(headers2);
		ResponseEntity<String> response2 = rt2.exchange("https://kapi.kakao.com/v2/user/me", HttpMethod.POST,
				kakaoProfileRequest2, String.class);
		ObjectMapper objectMapper2 = new ObjectMapper();
		KakaoProfile kakaoProfile = null;
		try {
			kakaoProfile = objectMapper2.readValue(response2.getBody(), KakaoProfile.class);
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
//		System.out.println("카카오 아이디 : "+ kakaoProfile.getId());
//		System.out.println("카카오 이메일 : "+ kakaoProfile.getKakao_account().getEmail());
//		System.out.println("카카오 닉네임1 : " + kakaoProfile.getKakao_account().getProfile().getNickname());
//		System.out.println("카카오 닉네임2 : " + kakaoProfile.getProperties().nickname);
//		System.out.println("카카오 닉네임3 : " + kakaoProfile.getKakao_account().getProfile().nickname);
//		System.out.println("DB에 넣을 유저네임 : " + kakaoProfile.getKakao_account().getEmail() + "_" + kakaoProfile.getId());
//		System.out.println("DB에 넣을 이메일 : " + kakaoProfile.getKakao_account().getEmail());
//		System.out.println("DB에 넣을 패스워드 : " + hongKey);
		// 2222222222222222222222222222222
		String originNickname = kakaoProfile.getKakao_account().getProfile().getNickname();
		String tmp = "";
		String nickname = "";
		if(originNickname.length() % 3 == 0) {
			for(int i=0; i<originNickname.length()/3; i++) {tmp += "*";}
			nickname = originNickname.substring(0, originNickname.length()/3) + tmp + originNickname.substring(originNickname.length()/3*2);
		}
		if(originNickname.length() % 3 == 1) {
			if(originNickname.length() == 1) {
				nickname = originNickname;
			}else {
				for(int i=0; i<Math.ceil((double)originNickname.length()/3); i++) {tmp += "*";}
				nickname = originNickname.substring(0, (int)Math.floor(originNickname.length()/3)) + tmp + originNickname.substring((int)Math.floor(originNickname.length()/3*2)+1);
			}
		}
		if(originNickname.length() % 3 ==2) {
			if(originNickname.length() == 2) {
				nickname = originNickname.substring(0,1) + "*";
			}else {
				for(int i=0; i<Math.ceil(originNickname.length()/3); i++) {tmp += "*";}
				nickname = originNickname.substring(0, (int)Math.floor(originNickname.length()/3)) + tmp + originNickname.substring((int)Math.floor(originNickname.length()/3*2)+1);
			}
		}
		User kakaoUser = User.builder()
							  .username(kakaoProfile.getKakao_account().getEmail() + "_"+ kakaoProfile.getId())
							  .password(hongKey)
							  .email(kakaoProfile.getKakao_account().getEmail())
							  .oauth("kakao")
							  .originNickname(originNickname)
							  .nickname(nickname)
							  .build();
		// 이미 가입한 사람인지 체크
		User originUser = userService.회원찾기(kakaoUser.getUsername());
//		System.out.println(kakaoUser);
		if(originUser == null) {
			System.out.print("신규회원입니다. 자동으로 가입 후 로그인됩니다.(카카오)");
			userService.회원가입(kakaoUser);
		}
		// 로그인처리
		System.out.println("카카오 로그인 요청");
		Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(kakaoUser.getUsername(), hongKey));
		SecurityContextHolder.getContext().setAuthentication(authentication);
		
		return "redirect:/";
	}

	@GetMapping("/user/updateForm")
	public String updateForm(@AuthenticationPrincipal PrincipalDetail principal) {
		return "user/updateForm";
	}

}
