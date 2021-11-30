package com.opinio.plantrowth.api.dto.diary;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DiaryLookUpDTO {
    private String title;
    private String content;
    private LocalDate date;
    private String file_name;
}
