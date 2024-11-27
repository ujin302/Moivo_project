package com.example.demo.ncp.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class NCPObjectStorageService {
    private final AmazonS3 amazonS3;

    public NCPObjectStorageService(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

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
                    metadata).withCannedAcl(CannedAccessControlList.PublicRead);

            amazonS3.putObject(putObjectRequest);

            // 로그 추가: 업로드 완료
            // String fileUrl = "https://" + bucketName + ".kr.object.ncloudstorage.com/" +
            // directoryPath + fileName;
            // System.out.println("File uploaded successfully: " + fileUrl);

            return fileName;

        } catch (IOException e) {
            System.err.println("File upload failed: " + e.getMessage());
            throw new RuntimeException("Failed to upload file to NCP Object Storage", e);
        }
    }

    // NCP 파일 삭제 - 24.11.25 - uj
    public void deleteFile(String bucketName, String directoryPath, String imageFileName) {
        // S3에서 파일을 삭제
        amazonS3.deleteObject(bucketName, directoryPath + imageFileName); // 버킷과 파일 경로를 사용하여 삭제
    }

}