package com.example.demo.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.user.entity.UserCartEntity;

public interface UserCartRepository extends JpaRepository<UserCartEntity, Integer> {
    List<UserCartEntity> findByCartEntity_Id(Integer cartId);

    Optional<UserCartEntity> findByCartEntity_Id(int cartId);
}
