package com.opinio.plantrowth.api;

import com.opinio.plantrowth.service.PlantService;
import com.opinio.plantrowth.service.fileUpload.FileUploadService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
public class DiagnosisApiController {

    private final PlantService plantService;
    private final FileUploadService fileUploadService;
    private final String filePath = "diagnosis";
    private final OkHttpClient client = new OkHttpClient();
    private static final String RequestURL = "http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:5000/predict";

    @PostMapping(value = "/api/plants/diagnosis/{plant-id}")
    public ResponseEntity diagnosis(@PathVariable("plant-id") Long id,
                                                  @RequestPart("file_name") Optional<MultipartFile> file) throws FileIsEmptyException{
        if (file.isEmpty()) {
            throw new FileIsEmptyException("파일을 업로드 하세요");
        }

        String uploadImageName = fileUploadService.uploadImage(file.get(), filePath);
        String json = "{ \"file_name\" : \"" + uploadImageName + "\" }";
        RequestBody requestBody = RequestBody.create(MediaType.get("application/json; charset=utf-8"), json);
        Request request = new Request.Builder()
                .url(RequestURL)
                .post(requestBody)
                .build();
        String diagnosisResult = "";
        try (Response response = client.newCall(request).execute()) {
            if(!response.isSuccessful())
                throw new IOException("Unexpected code " + response);
            diagnosisResult = response.body().string();
            System.out.println(diagnosisResult);
        } catch (IOException e) {
            e.printStackTrace();
        }

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

