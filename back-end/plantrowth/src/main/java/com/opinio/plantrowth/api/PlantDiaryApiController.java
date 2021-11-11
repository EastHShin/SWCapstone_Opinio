package com.opinio.plantrowth.api;


import com.opinio.plantrowth.api.dto.diary.CreateDiaryDTO;
import com.opinio.plantrowth.api.dto.diary.DiaryDTO;
import com.opinio.plantrowth.api.dto.diary.DiaryLookUpDTO;
import com.opinio.plantrowth.api.dto.diary.DiaryResult;
import com.opinio.plantrowth.domain.Message;
import com.opinio.plantrowth.domain.PlantDiary;
import com.opinio.plantrowth.service.DiaryService;
import com.opinio.plantrowth.service.fileUpload.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.Charset;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class PlantDiaryApiController {

    private final FileUploadService fileUploadService;
    private final DiaryService diaryService;

    @GetMapping("/api/plants/diary/{plant-id}")
    public ResponseEntity<DiaryResult> diaries(@PathVariable("plant-id") Long id){
        List<PlantDiary> findDiaries = diaryService.findDiariesByPlantId(id);
        List<DiaryDTO> collect = findDiaries.stream()
                .map(m -> new DiaryDTO(m.getTitle(), m.getFilename(), m.getContent()))
                .collect(Collectors.toList());

        return new ResponseEntity<DiaryResult>(new DiaryResult(collect), HttpStatus.OK);
    }
    @PostMapping("/api/plants/diary/{plant-id}")
    public ResponseEntity createDiary(
            @PathVariable("plant-id") Long plantId,
            @RequestBody CreateDiaryDTO dto,
            @RequestPart(required = false) Optional<MultipartFile> file){

        Long result = diaryService.create(dto, plantId);
        if(file.isPresent()) {

            String uploadImageName = fileUploadService.uploadImage(file.get());
            PlantDiary diary = diaryService.findDiary(result);
            diary.setFilename(uploadImageName);
        }
        return result !=null?
                ResponseEntity.ok().body("식물 일기 생성 완료"):
                ResponseEntity.badRequest().build();
    }
    @GetMapping("/api/plants/diary/{diary-id}")
    public ResponseEntity<?> lookUpDiary(@PathVariable("diary-id") Long id){
        DiaryLookUpDTO diary = diaryService.Lookup(id);
        Message message= new Message();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        message.setStatus(Message.StatusEnum.OK);
        message.setMessage("식물일기 조회 성공");
        message.setData(diary);

        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }


}
