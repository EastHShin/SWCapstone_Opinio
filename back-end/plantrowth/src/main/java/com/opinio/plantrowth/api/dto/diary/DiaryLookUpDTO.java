package com.opinio.plantrowth.api.dto.diary;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class DiaryLookUpDTO {
    private String title;
    private String content;
    private LocalDate date;
    private String filename;
}
