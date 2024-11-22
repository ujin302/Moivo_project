package com.example.demo.store.dto;

import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Data
public class ProductPaging {

    private int currentPage;//현재페이지 이건 프론트에서 주는 값
    private int pageBlock;//[이전][1][2][3][다음] 한페이지당 나올것
    private int pageSize;//1페이지당 3개씩 한페이지 보여줄 상품개수
    private int totalA;//총 개수
    private int startNum;
    private int endNum;
    private boolean pre = false;
    private boolean next = false;

    public void makePaging() {

        int totalP = (totalA + pageSize - 1) / pageSize;//총 페이지 수

        startNum = (currentPage - 1) / pageBlock * pageBlock + 1;

        endNum = startNum + pageBlock - 1;

        if (endNum > totalP) endNum = totalP;

        if (startNum != 1){
            pre = true;
        }

        if (endNum < totalP){
            next = true;
        }
    }

//    public void makePagingHTML() {
//        pagingHTML = new StringBuffer();
//
//        int totalP = (totalA + pageSize - 1) / pageSize;//총 페이지 수
//
//        int startPage = (currentPage - 1) / pageBlock * pageBlock + 1;
//
//        int endPage = startPage + pageBlock - 1;
//
//        if (endPage > totalP) endPage = totalP;
//
//        if (startPage != 1)
//            pagingHTML.append("<span id='paging' onclick='Paging(" + (startPage - 1) + ")'>이전</span>");
//
//        for (int i = startPage; i <= endPage; i++) {
//            if (i == currentPage)
//                pagingHTML.append("<span id='currentPaging' onclick='Paging(" + i + ")'>" + i + "</span>");
//            else
//                pagingHTML.append("<span id='paging' onclick='Paging(" + i + ")'>" + i + "</span>");
//        }
//
//        if (endPage < totalP)
//            pagingHTML.append("<span id='paging' onclick='Paging(" + (endPage + 1) + ")'>다음</span>");
//    }
}


