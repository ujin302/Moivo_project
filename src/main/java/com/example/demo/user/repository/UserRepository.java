package com.example.demo.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.user.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    Optional<UserEntity> findByUserId(String userId); // 사용자 계정 Userid

    Optional<UserEntity> findByRefreshToken(String refreshToken); // 토큰 갱신 관련 _241127_sc

}
