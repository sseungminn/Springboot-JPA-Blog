package com.hong.blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.hong.blog.model.Reply;

public interface ReplyRepository extends JpaRepository<Reply, Integer>{

	// interface 안에서는 public 생략가능
	// 영속화 필요 없음
	@Modifying
	@Query(value="INSERT INTO REPLY(userId, boardId, content, createDate) VALUES(?1, ?2, ?3, now())", nativeQuery = true)
	int mSave(int userId, int boardId, String content); // 업데이트된 행의 개수를 리턴해줌
}
