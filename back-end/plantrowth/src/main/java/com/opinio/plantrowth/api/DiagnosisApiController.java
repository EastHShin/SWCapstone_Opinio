package com.opinio.plantrowth.api;

import com.opinio.plantrowth.service.PlantService;
import com.opinio.plantrowth.service.fileUpload.FileUploadService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RequiredArgsConstructor
@RestController
public class DiagnosisApiController {

    private final PlantService plantService;
    private final FileUploadService fileUploadService;
    private final String filePath = "diagnosis";

    @PostMapping(value = "/api/plants/diagnosis/{plant-id}")
    public ResponseEntity diagnosis(@PathVariable("plant-id") Long id,
                                                  @RequestPart("file_name") Optional<MultipartFile> file) throws FileIsEmptyException {
        if (file.isEmpty()) {
            throw new FileIsEmptyException("파일을 업로드 하세요");
        }

//        String uploadImageName = fileUploadService.uploadImage(file.get(), filePath);
//        String json = "{ \"file_name\" : \"" + uploadImageName + "\" }";
//        RequestBody requestBody = RequestBody.create(MediaType.get("application/json; charset=utf-8"), json);
//        Request request = new Request.Builder()
//                .url("")
//                .post(requestBody)
//                .build();


//        return new ResponseEntity<DiagnosisDto>(new DiagnosisDto())
        return ResponseEntity.ok().build();
    }

    @Getter
    static class DiagnosisDto{
        private Long user_id;
        private Long plant_id;
        private String plant_name;
        private String plant_species;
        private String diagnosisResult;

    }

    class FileIsEmptyException extends Exception{
        FileIsEmptyException(String msg) {
            super(msg);
        }

    }
}

