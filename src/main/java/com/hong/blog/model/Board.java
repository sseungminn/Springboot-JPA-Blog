package com.hong.blog.model;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data  // getter, setter
@NoArgsConstructor  // 빈생성자
@AllArgsConstructor  // 모든 생성자
@Builder
// ORM -> Java(다른언어) Object -> 테이블로 맵핑해주는 기술
@Entity
public class Board {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)  // auto_increment
	private int id;
	
	@Column(nullable = false, length = 100)
	private String title;
	
	@Lob   // 대용량 데이터
	private String content; // 섬머노트 library <html>태그가 섞여서 디자인 됨.. 용량 커짐
	
	private int count; //조회수
	
	@ManyToOne(fetch = FetchType.EAGER) // Many = Board,  One = User
	@JoinColumn(name="userId") // 테이블 생성될 때 userId라는 필드명으로 들어감
	private User user; // DB는 오브젝트를 저장할 수 없음.    FK, 자바는 오브젝트를 저장할 수 있음
	
	// mappedBy 연관관계의 주인이 아님 (난 FK가 아니에요) DB에 컬럼 만들지 마세요.
	@OneToMany(mappedBy = "board", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE) // 무조건 댓글 가져와야함 EAGER, cascade REMOVE 게시글 지울때 속한 댓글도 지움
	@JsonIgnoreProperties({"board"}) //board <-> reply 무한참조방지
	@OrderBy("id desc")
	private List<Reply> replys;
	
	@CreationTimestamp // 시간 자동 입력
	private Timestamp createDate;
}
