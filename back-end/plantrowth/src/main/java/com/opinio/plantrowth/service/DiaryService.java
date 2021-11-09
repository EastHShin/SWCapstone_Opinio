package com.opinio.plantrowth.service;

import com.opinio.plantrowth.api.dto.CreatePlantDiaryDTO;
import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.PlantDiary;
import com.opinio.plantrowth.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class DiaryService {
    private final DiaryRepository diaryRepository;
    @Transactional
    public Long create(CreatePlantDiaryDTO diary){
        PlantDiary savedDiary = PlantDiary.builder()
                .title(diary.getTitle())
                .content(diary.getContent())
                .date(diary.getDate())
                .user(diary.getUserid())
                .plant(diary.getPlant())
                .build();

        return savedDiary.getId();
    }

    public PlantDiary findDiarys(Long diaryId) {
        PlantDiary diary =  DiaryRepository.findByDiaryId(diaryId).orElseThrow(IllegalAccessError::new);
        return diary;
    }
}
