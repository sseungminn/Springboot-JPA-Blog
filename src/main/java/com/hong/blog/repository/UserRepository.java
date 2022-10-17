package com.hong.blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hong.blog.model.User;

// DAO
// 자동으로 bean 등록이 됨
// @Repository 생략가능
public interface UserRepository extends JpaRepository<User, Integer>{
	
	// SELECT * FROM user WHERE username = ?
//	Optional<User> findByUsername(String username);
	
	User findByUsername(String username);
	User findByEmail(String email);
}


//JPA Naming 쿼리
	// SELECT * FROM user WHERE username = ? AND password = ?
	//User findByUsernameAndPassword(String username, String password);

//	@Query(value = "SELECT * FROM user WHERE username = ?1 AND password = ?2", nativeQuery = true)
//	User login(String username, String password);