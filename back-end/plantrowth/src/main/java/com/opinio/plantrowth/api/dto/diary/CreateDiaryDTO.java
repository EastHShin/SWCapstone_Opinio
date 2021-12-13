package com.opinio.plantrowth.api.dto.diary;

import java.time.LocalDate;

import com.opinio.plantrowth.domain.plant.PlantDiary;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CreateDiaryDTO {
    private String title;
    private String content;
    private Boolean file_delete;
//    public CreateDiaryDTO(String title, String content, LocalDate date) {
//        this.title = title;
//        this.content = content;
//        this.date = date;
//    }

    public CreateDiaryDTO(String title, String content, LocalDate date, Boolean file_delete) {
        this.title = title;
        this.content = content;
        this.file_delete = file_delete;
    }

    public PlantDiary toEntity() {
        return PlantDiary.builder()
                .title(title)
                .content(content)
                .build();
    }
}
