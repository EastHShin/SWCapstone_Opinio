package com.opinio.plantrowth.service.plant;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.opinio.plantrowth.api.dto.diary.CreateDiaryDTO;
import com.opinio.plantrowth.api.dto.diary.DiaryLookUpDTO;
import com.opinio.plantrowth.domain.plant.PlantDiary;
import com.opinio.plantrowth.repository.plant.PlantDiaryRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DiaryService {
    private final PlantDiaryRepository plantDiaryRepository;

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
        page.setFile_name(diary.getFilename());

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
    public Long updateDiary(Long id, CreateDiaryDTO dto){
        PlantDiary diary = plantDiaryRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("존재하지 않는 식물일기 입니다."));
        if(!(dto.getTitle()==null))
            diary.setTitle(dto.getTitle());
        if(!(dto.getContent()==null))
            diary.setContent(dto.getContent());
            diary.setDate(LocalDate.now());

        return diary.getId();
    }

    @Transactional
    public Long deleteDiary(Long id){
        PlantDiary diary = plantDiaryRepository.findById(id).
                orElseThrow(()->new IllegalArgumentException("해당 식물일기가 존재하지 않습니다"));
        plantDiaryRepository.delete(diary);
        return id;
    }

    @Transactional
    public Long updateImage(Long id, String imageName){
        PlantDiary diary = plantDiaryRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("존재하지 않는 식물일기 입니다."));
        diary.setFilename(imageName);

        return diary.getId();
    }

}

