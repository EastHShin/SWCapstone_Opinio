package com.opinio.plantrowth.service;

import com.opinio.plantrowth.api.dto.diary.CreatePlantDiaryDTO;
import com.opinio.plantrowth.domain.PlantDiary;
import com.opinio.plantrowth.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class DiaryService {
    private final DiaryRepository diaryRepository;
    @Transactional
    public Long create(CreatePlantDiaryDTO diary){
        Long diaryId = diaryRepository.save(
                PlantDiary.builder()
                    .title(diary.getTitle())
                    .content(diary.getContent())
                    .date(diary.getDate())
                    .build())
                .getId();

        return diaryId;
    }

    public PlantDiary findDiarys(Long diaryId) {
        PlantDiary diary =  diaryRepository.findByDiaryId(diaryId).orElseThrow(IllegalAccessError::new);
        return diary;
    }
}
