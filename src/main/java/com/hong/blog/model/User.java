package com.hong.blog.model;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.CreationTimestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// @DynamicInsert // insert시에 null인 필드를 제외시켜준다.(DB상의 default 값으로 넣어줌)
@Data  // getter, setter
@NoArgsConstructor  // 빈생성자
@AllArgsConstructor  //모든 생성자
@Builder
//ORM -> Java(다른언어) Object -> 테이블로 맵핑해주는 기술
@Entity // User 클래스가 MySQL에 테이블 생성이 됨
public class User {

	@Id // Primary Key
	@GeneratedValue(strategy = GenerationType.IDENTITY) // 프로젝트에 연결된 DB의 넘버링 전략을 따라감
	private int id; // 오라클: 시퀀스, mysql: auto-increment
	
	@Column(nullable = false, length = 100, unique = true)
	private String username; // 아이디
	
	@Column(nullable = false, length = 100) // 비밀번호 암호화 length=100
	private String password; // 비밀번호
	
	@Column(nullable = false, length = 50)
	private String email;		   // 이메일
	
	@Column(nullable = false, length=30)
	private String nickname; // 닉네임
	
	// @ColumnDefault("user")
	// DB는 RoleType이 없음
	@Enumerated(EnumType.STRING)
	private RoleType role; //   // USER, ADMIN
	
	private String oauth; // null, kakao, google
	
	@CreationTimestamp // 시간 자동 입력
	private Timestamp createDate; // 유저 가입 시간
	
}
