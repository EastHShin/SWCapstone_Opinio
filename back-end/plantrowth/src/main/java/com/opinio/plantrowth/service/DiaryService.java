package com.opinio.plantrowth.service;

import com.opinio.plantrowth.api.dto.diary.CreatePlantDiaryDTO;
import com.opinio.plantrowth.domain.PlantDiary;
import com.opinio.plantrowth.repository.DiaryRepository;
import com.opinio.plantrowth.repository.PlantRepository;
import com.opinio.plantrowth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class DiaryService {
    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;
    private final PlantRepository plantRepository;
    @Transactional
    public Long create(CreatePlantDiaryDTO diary){
        Long diaryId = diaryRepository.save(
                PlantDiary.builder()
                    .title(diary.getTitle())
                    .content(diary.getContent())
                    .date(diary.getDate())
                    .user(userRepository.findUserByUserId(diary.getUserId()))
                    .plant(plantRepository.findPlantByPlantId(diary.getPlantId()))
                    .build())
                .getId();

        return diaryId;
    }

    public PlantDiary findDiarys(Long diaryId) {
        PlantDiary diary =  diaryRepository.findByDiaryId(diaryId).orElseThrow(IllegalAccessError::new);
        return diary;
    }

    public PlantDiary findAllDiarysByPlantId(Long plantId){
        PlantDiary diary = diaryRepository.findDiaryByPlnatId(plantId);
    }
}
