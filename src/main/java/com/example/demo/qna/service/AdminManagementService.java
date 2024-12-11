package com.example.demo.qna.service;

public interface AdminManagementService {

    public void addQuestion(String title, String content, Integer categoryId, Integer userId, Boolean isSecret);
}
