package com.Placify.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDto {

    private int totalQuizzes;
    private int attempted;
    private int pending;
    private String averageScore;
}
