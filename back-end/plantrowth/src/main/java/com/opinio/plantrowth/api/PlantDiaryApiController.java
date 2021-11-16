package com.opinio.plantrowth.api;


import com.opinio.plantrowth.api.dto.diary.CreateDiaryDTO;
import com.opinio.plantrowth.api.dto.diary.DiaryDTO;
import com.opinio.plantrowth.api.dto.diary.DiaryLookUpDTO;
import com.opinio.plantrowth.api.dto.diary.DiaryResult;
import com.opinio.plantrowth.domain.Message;
import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.PlantDiary;
import com.opinio.plantrowth.service.DiaryService;
import com.opinio.plantrowth.service.PlantService;
import com.opinio.plantrowth.service.fileUpload.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.Charset;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Transactional(readOnly = true)
@RestController
@RequiredArgsConstructor
public class PlantDiaryApiController {

    private final FileUploadService fileUploadService;
    private final DiaryService diaryService;
    private final PlantService plantService;
    private final String filePath = "diary";

    @GetMapping("/api/plants/diary/{plant-id}/all")
    public ResponseEntity<DiaryResult> diaries(@PathVariable("plant-id") Long id){
        List<PlantDiary> findDiaries = diaryService.findDiariesByPlantId(id);
        List<DiaryDTO> collect = findDiaries.stream()
                .map(m -> new DiaryDTO(m.getTitle(), m.getContent(), m.getDate(),m.getFilename(), m.getId()))
                .collect(Collectors.toList());

        return new ResponseEntity<DiaryResult>(new DiaryResult(collect), HttpStatus.OK);
    }

    @Transactional
    @PostMapping(value = "/api/plants/diary/{plant-id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,MediaType.APPLICATION_JSON_VALUE}, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity createDiary(
            @PathVariable("plant-id") Long plantId,
            @ModelAttribute CreateDiaryDTO dto,
            @RequestPart(required = false) Optional<MultipartFile> file){


        PlantDiary diary = PlantDiary.builder()
                .title(dto.getTitle())
                .date(dto.getDate())
                .content(dto.getContent())
                .build();
        Plant plant = plantService.findOnePlant(plantId);
        diary.setPlant(plant);

        if(file.isPresent()) {
            String uploadImageName = fileUploadService.uploadImage(file.get(), filePath);
            diary.setFilename(uploadImageName);
        }
        Long result = diaryService.createDiary(diary);

        return result !=null?
                ResponseEntity.ok().body("식물 일기 생성 완료"):
                ResponseEntity.badRequest().build();
    }

    @GetMapping("/api/plants/diary/{diary-id}")
    public ResponseEntity<?> lookUpDiary(@PathVariable("diary-id") Long id){
        DiaryLookUpDTO diary = diaryService.LookupDiary(id);
        Message message= new Message();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        message.setStatus(Message.StatusEnum.OK);
        message.setMessage("식물일기 조회 성공");
        message.setData(diary);

        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }

    @Transactional
    @PutMapping("/api/plants/diary/{diary-id}")
    public ResponseEntity<?> updateDiary(@PathVariable("diary-id") Long id, @RequestBody CreateDiaryDTO dto){
        diaryService.updateDiary(id, dto);
        Message message = new Message();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        message.setStatus(Message.StatusEnum.OK);
        message.setMessage("식물일기가 수정되었습니다.");
        message.setData(dto);

        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }

    @Transactional
    @DeleteMapping("/api/plants/diary/{diary-id}")
    public ResponseEntity<?> deleteDiary(@PathVariable("diary-id") Long id){
        Long result = diaryService.deleteDiary(id);
        return result !=null?
                ResponseEntity.ok().body("식물 일기 삭제 완료"):
                ResponseEntity.badRequest().build();
    }


}
