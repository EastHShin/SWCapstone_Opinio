package com.opinio.plantrowth.api.dto.diary;

import com.opinio.plantrowth.domain.PlantDiary;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class CreateDiaryDTO {
    private String title;
    private String content;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    public CreateDiaryDTO(String title, String content, LocalDate date) {
        this.title = title;
        this.content = content;
        this.date = date;
    }

    public PlantDiary toEntity() {
        return PlantDiary.builder()
                .title(title)
                .content(content)
                .date(date)
                .build();
    }
}
