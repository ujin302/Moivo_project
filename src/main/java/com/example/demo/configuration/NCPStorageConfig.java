package com.example.demo.configuration;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:external-config.properties") // yml에서 불러오는게 아니라 처음 실행할 때 프로퍼티스를 읽어오는거임
public class NCPStorageConfig {

    @Value("${NCP_STORAGE_ACCESS_KEY}")
    private String accessKey;

    @Value("${NCP_STORAGE_SECRET_KEY}")
    private String secretKey;

    @Value("${NCP_STORAGE_REGION}")
    private String region;

    @Value("${NCP_STORAGE_ENDPOINT}")
    private String endpoint;

    @Bean
    public AmazonS3 amazonS3() {

        return AmazonS3ClientBuilder
                .standard()
                .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(endpoint, region))
                .withCredentials(new AWSStaticCredentialsProvider(new BasicAWSCredentials(accessKey, secretKey)))
                .build();

    }
}
