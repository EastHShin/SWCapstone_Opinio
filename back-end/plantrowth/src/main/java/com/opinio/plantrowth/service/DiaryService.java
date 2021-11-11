package com.opinio.plantrowth.service;

import com.opinio.plantrowth.api.dto.diary.CreateDiaryDTO;
import com.opinio.plantrowth.api.dto.diary.DiaryLookUpDTO;
import com.opinio.plantrowth.domain.PlantDiary;
import com.opinio.plantrowth.repository.PlantDiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DiaryService {
    private final PlantDiaryRepository plantDiaryRepository;
    private final PlantService plantService;
    @Transactional
    public Long create(CreateDiaryDTO dto, Long plantId){

        PlantDiary diary = PlantDiary.builder()
                    .title(dto.getTitle())
                    .date(dto.getDate())
                    .content(dto.getContent())
                    .filename(dto.getFilename())
                    .build();
//        User user = plant.getUser();
//        diary.setUser(user);
        diary.setPlant( plantService.findPlant(plantId));
        PlantDiary plantDiary = plantDiaryRepository.save(diary);
        return plantDiary.getId();
    }
    public DiaryLookUpDTO Lookup(Long id){
        PlantDiary diary = findDiary(id);
        DiaryLookUpDTO page = new DiaryLookUpDTO();
        page.setTitle(diary.getTitle());
        page.setContent(diary.getContent());
        page.setDate(diary.getDate());
        page.setFilename(diary.getFilename());

        return page;
    }
    public PlantDiary findDiary(Long diaryId) {
        return plantDiaryRepository.findById(diaryId).orElseThrow(IllegalAccessError::new);
    }

    public List<PlantDiary> findDiariesByPlantId(Long plantId){
        return plantDiaryRepository.findAllByPlantId(plantId);
    }
//
//    public List<PlantDiary> findDiariesByUserId(Long userId){
//        List<PlantDiary> diaries = plantDiaryRepository.findAllByUserId(userId);
//        return diaries;
//    }
}

