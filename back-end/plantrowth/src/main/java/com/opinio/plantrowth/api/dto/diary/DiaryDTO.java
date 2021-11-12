package com.opinio.plantrowth.api.dto.diary;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DiaryDTO {
    private String title;
    private String content;
    private LocalDate date;
    private String filename;
    private Long diary_id;
}
