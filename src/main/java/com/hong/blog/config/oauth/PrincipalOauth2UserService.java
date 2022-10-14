package com.hong.blog.config.oauth;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.hong.blog.config.auth.PrincipalDetail;
import com.hong.blog.config.oauth.provider.FacebookUserInfo;
import com.hong.blog.config.oauth.provider.GoogleUserInfo;
import com.hong.blog.config.oauth.provider.NaverUserInfo;
import com.hong.blog.config.oauth.provider.OAuth2UserInfo;
import com.hong.blog.model.RoleType;
import com.hong.blog.model.User;
import com.hong.blog.repository.UserRepository;

@Service
public class PrincipalOauth2UserService extends DefaultOAuth2UserService{
	
	@Value("${hong.key}")
	private String hongKey;
	
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	@Autowired
	private UserRepository userRepository;
	
	// 구글로부터 받은 userRequest 데이터에 대한 후처리되는 함수
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
//		System.out.println("userRequest : " + userRequest.getClientRegistration()); // registrationId로 어떤 OAuth로 로그인했는지 알 수 있음
//		System.out.println("getAccessToken() : " + userRequest.getAccessToken());
		
		OAuth2User oauth2User = super.loadUser(userRequest);
		// userRequest정보
		// 구글 로그인 버튼 클릭 -> 구글로그인창 -> 로그인 완료 -> code리턴(인증완료) -> AccessToken요청
		// userRequest 정보로 -> loadUser함수 호출-> 구글한테 회원프로필 받음
//		System.out.println("loadUser(userRequest).getAttributes() : " + oauth2User.getAttributes());
		
		OAuth2UserInfo oAuth2UserInfo = null;
		if(userRequest.getClientRegistration().getRegistrationId().equals("google")) {
			System.out.println("구글 로그인 요청");
			oAuth2UserInfo = new GoogleUserInfo(oauth2User.getAttributes());
		}else if(userRequest.getClientRegistration().getRegistrationId().equals("facebook")) {
			System.out.println("페북 로그인 요청");
			oAuth2UserInfo = new FacebookUserInfo(oauth2User.getAttributes());
		}else if(userRequest.getClientRegistration().getRegistrationId().equals("naver")) {
			System.out.println("네이버 로그인 요청");
			oAuth2UserInfo = new NaverUserInfo((Map)oauth2User.getAttributes().get("response"));
		}
		else {
			System.out.println("우리는 구글과 페이스북과 네이버만 지원합니다.");
		}
		String provider = oAuth2UserInfo.getProvider(); // google, facebook
		String providerId = oAuth2UserInfo.getProviderId();
		String email = oAuth2UserInfo.getEmail();
		String username = email +"_"+ providerId; //afesr@gmail.com_123213231
		String originNickname = oAuth2UserInfo.getNickName();
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
				for(int i=0; i<Math.ceil((double)originNickname.length()/3); i++) {tmp += "*";}
				nickname = originNickname.substring(0, (int)Math.floor(originNickname.length()/3)) + tmp + originNickname.substring((int)Math.floor(originNickname.length()/3*2)+1);
			}
		}
		String password = bCryptPasswordEncoder.encode(hongKey);
		RoleType role = RoleType.USER;
		User userEntity = userRepository.findByUsername(username);
		if(userEntity == null) {
			userEntity = User.builder()
					.username(username)
					.password(password)
					.originNickname(originNickname)
					.nickname(nickname)
					.email(email)
					.role(role)
					.oauth(provider)
					.build();
			userRepository.save(userEntity);
		}else {
			
		}
		if(userRequest.getClientRegistration().getRegistrationId().equals("naver")) {
			return new PrincipalDetail(userEntity, (Map)oauth2User.getAttributes().get("response"));
		}else {
			return new PrincipalDetail(userEntity, oauth2User.getAttributes());
		}
	}
}

