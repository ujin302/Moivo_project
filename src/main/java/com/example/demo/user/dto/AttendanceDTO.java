package com.example.demo.user.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceDTO { // 출석
    private Integer id;
    private LocalDate lastDate; // 마지막 출석 날짜
    private int allDay = 0; // 연속 출석 일 수, 기본값은 0
    private Integer userId; // 사용자 고유 키
}
