package com.opinio.plantrowth.api;

import com.google.gson.JsonParser;
import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.service.PlantExpService;
import com.opinio.plantrowth.service.PlantService;
import com.opinio.plantrowth.service.UserPointService;
import com.opinio.plantrowth.service.UserService;
import com.opinio.plantrowth.service.fileUpload.FileUploadService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
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
    private final UserPointService userPointService;
    private final UserService userService;
    private final PlantExpService plantExpService;
    private final String filePath = "diagnosis";
    private final OkHttpClient client = new OkHttpClient();
    private static final String RequestURL = "http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:5000/predict";

    @PostMapping(value = "/api/plants/diagnosis/{plant-id}")
    public ResponseEntity diagnosis(@PathVariable("plant-id") Long id,
                                                  @RequestPart("file_name") Optional<MultipartFile> file) throws FileIsEmptyException, ParseException {
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
            //disease_model1하고 percent_model1 만 프론트로 보내주기
        } catch (IOException e) {
            e.printStackTrace();
        }
        JSONParser jsonParser = new JSONParser();
        Object obj = jsonParser.parse(diagnosisResult);
        JSONObject jsonObj = (JSONObject) obj;
        /*
        질병진단 구독이 들어온다면 포인트를 소비 할지 안할지 정하는 로직 추가해야됨
         */
        Plant plant = plantService.findOnePlant(id);
        User user = userPointService.decreasePoint(plant.getUser().getId());
        Long updatedId = plantExpService.increaseExp(plant.getId());
        Plant updatedPlant = plantService.findOnePlant(updatedId);

        return new ResponseEntity<DiagnosisDto>(new DiagnosisDto(user, updatedPlant, jsonObj), HttpStatus.OK);
    }

    @Getter
    static class DiagnosisDto{
        private Long user_id;
        private Long plant_id;
        private String plant_name;
        private String plant_species;
        private DiagnosisResult diagnosisResult;

        public DiagnosisDto(User user, Plant plant, JSONObject jsonObject) {
            user_id = user.getId();
            plant_id = plant.getId();
            plant_name = plant.getPlantName();
            plant_species = plant.getPlantSpecies();

            diagnosisResult = new DiagnosisResult(jsonObject.get("disease_model_1").toString(),
                    jsonObject.get("percent_model_1").toString());
        }

    }

    @AllArgsConstructor
    @Getter
    static class DiagnosisResult{
        private String disease_model;
        private String percent_model;


    }


    class FileIsEmptyException extends Exception{
        FileIsEmptyException(String msg) {
            super(msg);
        }

    }
}

