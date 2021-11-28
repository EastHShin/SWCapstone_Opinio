package com.opinio.plantrowth.api.controller.plant;

import com.opinio.plantrowth.domain.plant.Plant;
import com.opinio.plantrowth.domain.user.User;
import com.opinio.plantrowth.service.plant.DiagnosisRecordService;
import com.opinio.plantrowth.service.plant.PlantExpService;
import com.opinio.plantrowth.service.plant.PlantService;
import com.opinio.plantrowth.service.user.UserPointService;
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
	private final PlantExpService plantExpService;
	private final DiagnosisRecordService diagnosisRecordService;
	private final String filePath = "diagnosis";
	private final OkHttpClient client = new OkHttpClient();
	private static final String RequestURL = "http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:5000/predict";
	private final Integer decreasingPoint = 30;

	@PostMapping(value = "/api/plants/diagnosis/{plant-id}")
	public ResponseEntity diagnosis(@PathVariable("plant-id") Long id,
		@RequestPart("file_name") Optional<MultipartFile> file) throws FileIsEmptyException, ParseException {
		if (file.isEmpty()) {
			throw new FileIsEmptyException("파일을 업로드 하세요");
		}

		Plant plant = plantService.findOnePlant(id);
		User user = plant.getUser();
		if (user.getPoint() < decreasingPoint) {
			return new ResponseEntity<DiagnosisDto>(new DiagnosisDto(user, plant, false), HttpStatus.OK);
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
			if (!response.isSuccessful())
				throw new IOException("Unexpected code " + response);
			diagnosisResult = response.body().string();
			System.out.println(diagnosisResult);
			//disease_model1하고 percent_model1만 프론트로 보내주기
		} catch (IOException e) {
			e.printStackTrace();
		}
		JSONParser jsonParser = new JSONParser();
		Object obj = jsonParser.parse(diagnosisResult);
		JSONObject jsonObj = (JSONObject)obj;
        /*
        질병진단 구독이 들어온다면 포인트를 소비 할지 안할지 정하는 로직 추가해야됨 -> (21/11/28 추가) 프론트측에서 구독여부로 거름
         */

		User updatedUser = userPointService.decreasePoint(plant.getUser().getId(), decreasingPoint);
		Integer curLevel = plant.getPlantLevel();
		plantExpService.increaseExp(plant.getId());
		Integer updatedLevel = plant.getPlantLevel();
		Boolean isLevelUp = false;
		if (curLevel < updatedLevel) {
			isLevelUp = true;
		}
		Plant updatedPlant = plantService.findOnePlant(plant.getId());
		diagnosisRecordService.saveDiagnosisRecord(updatedPlant, jsonObj.get("disease_model_1").toString(),
			jsonObj.get("percent_model_1").toString(), uploadImageName);

		return new ResponseEntity<DiagnosisDto>(new DiagnosisDto(updatedUser, updatedPlant, true, jsonObj, isLevelUp),
			HttpStatus.OK);
	}

	@Getter
	static class DiagnosisDto {
		private Long user_id;
		private Integer point;
		private Long plant_id;
		private String plant_name;
		private String plant_species;
		private Integer plant_exp;
		private Integer plant_level;
		private Boolean isEnoughPoint;
		private DiagnosisResult diagnosisResult;
		private Boolean isLevelUp;

		public DiagnosisDto(User user, Plant plant, Boolean enoughPoint, JSONObject jsonObject, Boolean IsLevelUp) {
			user_id = user.getId();
			point = user.getPoint();
			plant_id = plant.getId();
			plant_name = plant.getPlantName();
			plant_species = plant.getPlantSpecies();
			plant_exp = plant.getPlantExp();
			plant_level = plant.getPlantLevel();
			isEnoughPoint = enoughPoint;
			isLevelUp = IsLevelUp;

			diagnosisResult = new DiagnosisResult(jsonObject.get("disease_model_1").toString(),
				jsonObject.get("percent_model_1").toString());
		}

		public DiagnosisDto(User user, Plant plant, Boolean enoughPoint) {
			user_id = user.getId();
			plant_id = plant.getId();
			plant_name = plant.getPlantName();
			plant_species = plant.getPlantSpecies();
			isEnoughPoint = enoughPoint;
		}

	}

	@AllArgsConstructor
	@Getter
	static class DiagnosisResult {
		private String disease_model;
		private String percent_model;

	}

	class FileIsEmptyException extends Exception {
		FileIsEmptyException(String msg) {
			super(msg);
		}

	}
}

