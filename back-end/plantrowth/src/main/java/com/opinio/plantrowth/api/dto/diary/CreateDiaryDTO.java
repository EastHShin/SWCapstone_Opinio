package com.opinio.plantrowth.api.dto.diary;

import com.opinio.plantrowth.domain.PlantDiary;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class CreateDiaryDTO {
    private String title;
    private String content;
    private LocalDate date;
    private String filename;
    public CreateDiaryDTO(String title, String content, LocalDate date, String filename) {
        this.title = title;
        this.content = content;
        this.date = date;
        this.filename = filename;
    }

    public PlantDiary toEntity() {
        return PlantDiary.builder()
                .title(title)
                .content(content)
                .date(date)
                .filename(filename)
                .build();
    }
}
