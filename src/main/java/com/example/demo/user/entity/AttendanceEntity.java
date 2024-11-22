package com.example.demo.user.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "attendance")
public class AttendanceEntity { // 출석

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "lastdate")
    private LocalDate lastDate; // 마지막 출석 날짜

    @Column(name = "allday", nullable = false)
    private int allDay = 0; // 연속 출석 일 수, 기본값은 0

    // 출석 1개 : 사용자 1개
    @OneToOne
    @JoinColumn(name = "userid")
    private UserEntity user; // 사용자 고유 키
}
