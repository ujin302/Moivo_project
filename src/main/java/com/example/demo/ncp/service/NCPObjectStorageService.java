package com.example.demo.ncp.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

@Service
public class NCPObjectStorageService {
    private final AmazonS3 amazonS3;

    public NCPObjectStorageService(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    // Local 기준
//    public String uploadFile(String bucketName, String directoryPath, File file) {
//        String fileName = UUID.randomUUID().toString();
//        try (FileInputStream fileInputStream = new FileInputStream(file)) {
//            ObjectMetadata objectMetadata = new ObjectMetadata();
//
//            Path path = Paths.get(file.getAbsolutePath());
//            objectMetadata.setContentType(Files.probeContentType(path));
//            objectMetadata.setContentLength(file.length());
//
//            PutObjectRequest putObjectRequest = new PutObjectRequest(
//                    bucketName,
//                    directoryPath + fileName,
//                    fileInputStream,
//                    objectMetadata).withCannedAcl(CannedAccessControlList.PublicRead);
//
//            amazonS3.putObject(putObjectRequest);
//            return fileName;
//
//        } catch (IOException e) {
//            throw new RuntimeException("File upload failed", e);
//        }
//
//    }
    
    public String uploadFile(String bucketName, String directoryPath, MultipartFile multipartFile) {
        String fileName = UUID.randomUUID().toString(); // 고유한 파일 이름 생성

        try {
            // 로그 추가: 파일 업로드 시작
            System.out.println("Uploading file: " + multipartFile.getOriginalFilename());

            // 메타데이터 설정
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(multipartFile.getContentType());
            metadata.setContentLength(multipartFile.getSize());

            // S3에 파일 업로드
            PutObjectRequest putObjectRequest = new PutObjectRequest(
                    bucketName,
                    directoryPath + fileName,
                    multipartFile.getInputStream(),
                    metadata
            ).withCannedAcl(CannedAccessControlList.PublicRead);

            amazonS3.putObject(putObjectRequest);

            // 로그 추가: 업로드 완료
            String fileUrl = "https://" + bucketName + ".kr.object.ncloudstorage.com/" + directoryPath + fileName;
            System.out.println("File uploaded successfully: " + fileUrl);

            return fileUrl;

        } catch (IOException e) {
            System.err.println("File upload failed: " + e.getMessage());
            throw new RuntimeException("Failed to upload file to NCP Object Storage", e);
        }
    }

    
}


