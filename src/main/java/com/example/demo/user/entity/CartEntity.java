package com.example.demo.user.entity;

import java.util.List;

import com.example.demo.store.entity.ProductEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "cart")
public class CartEntity { // 장바구니

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 장바구니 1개 : 사용자 1명
    @OneToOne
    @JoinColumn(name = "userid")
    private UserEntity userEntity;

    // 장바구니 1개 : 상품 n개
    @OneToMany(mappedBy = "cartEntity", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<UserCartEntity> userCartList;

}
