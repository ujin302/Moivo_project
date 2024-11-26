package com.example.demo.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.store.entity.ProductEntity;
import com.example.demo.user.entity.UserWishEntity;
import com.example.demo.user.entity.WishEntity;

@Repository
public interface UserWishRepository extends JpaRepository<UserWishEntity, Integer> {
    Optional<UserWishEntity> findByWishEntityAndProductEntity(WishEntity wishEntity, ProductEntity productEntity);
   
    
    //@Query("select up from UserWishEntity up where up.wishEntity.id = :w and up.productEntity.id = :p")
    //UserWishEntity findByWishEntityAndProductEntityL(@Param("w") int w, @Param("p") int p);

}
