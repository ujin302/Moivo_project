package com.example.demo.ncp.dto;

import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.ToString;

@Component
@Getter
@ToString
public class NCPObjectStorageDTO { // 스토리지 DTO - 24.11.26 - uj
    private final String BUCKETNAME = "moivo";
    private final String PRODUCTDIRECTORY = "products";
    protected final String URL = "https://" + BUCKETNAME + ".kr.object.ncloudstorage.com/" + PRODUCTDIRECTORY + "/";
}
