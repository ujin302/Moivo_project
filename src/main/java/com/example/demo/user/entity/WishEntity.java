package com.example.demo.user.entity;

import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "wish")
public class WishEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id; // 찜 고유 키

    @ManyToOne
    @JoinColumn(name = "userid", nullable = false)
    private UserEntity userEntity; // 고객 고유 키

    // 찜 상품 리스트
    @OneToMany(mappedBy = "wishEntity", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<UserWishEntity> userWishList;
}