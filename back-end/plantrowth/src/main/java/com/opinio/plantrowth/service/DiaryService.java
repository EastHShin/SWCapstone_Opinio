package com.opinio.plantrowth.service;

import com.opinio.plantrowth.api.dto.diary.CreateDiaryDTO;
import com.opinio.plantrowth.api.dto.diary.DiaryLookUpDTO;
import com.opinio.plantrowth.domain.PlantDiary;
import com.opinio.plantrowth.repository.PlantDiaryRepository;
import com.opinio.plantrowth.repository.PlantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DiaryService {
    private final PlantDiaryRepository plantDiaryRepository;
    private final PlantRepository plantRepository;

    @Transactional
    public Long createDiary(PlantDiary diary){

        PlantDiary plantDiary = plantDiaryRepository.save(diary);
        return plantDiary.getId();
    }
    public DiaryLookUpDTO LookupDiary(Long id){
        PlantDiary diary = findDiary(id);
        DiaryLookUpDTO page = new DiaryLookUpDTO();
        page.setTitle(diary.getTitle());
        page.setContent(diary.getContent());
        page.setDate(diary.getDate());
        page.setFilename(diary.getFilename());

        return page;
    }
    public PlantDiary findDiary(Long diaryId) {
        return plantDiaryRepository.findById(diaryId).
                orElseThrow(()->new IllegalArgumentException("해당 식물일기를 찾을 수 없습니다."));
    }

    public List<PlantDiary> findDiariesByPlantId(Long plantId){
        return plantDiaryRepository.findAllByPlantId(plantId);
    }
    @Transactional
    public void updateDiary(Long id, CreateDiaryDTO dto){
        PlantDiary diary = findDiary(id);
        diary.setTitle(dto.getTitle());
        diary.setContent(dto.getContent());
        diary.setDate(dto.getDate());
        plantDiaryRepository.save(diary);
    }

    @Transactional
    public Long deleteDiary(Long id){
        PlantDiary diary = plantDiaryRepository.findById(id).
                orElseThrow(()->new IllegalArgumentException("해당 식물일기가 존재하지 않습니다"));
        plantDiaryRepository.delete(diary);
        return id;
    }

}

