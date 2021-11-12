package com.opinio.plantrowth.api.dto.diary;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DiaryDTO {
    private String title;
    private String filename;
    private String content;
}
