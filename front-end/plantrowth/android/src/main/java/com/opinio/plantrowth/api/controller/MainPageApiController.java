package com.opinio.plantrowth.api.controller;

import com.opinio.plantrowth.api.dto.community.board.BoardDTO;
import com.opinio.plantrowth.domain.plant.Plant;
import com.opinio.plantrowth.domain.user.User;
import com.opinio.plantrowth.service.community.BoardService;
import com.opinio.plantrowth.service.plant.PlantService;
import com.opinio.plantrowth.service.user.UserService;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class MainPageApiController {

	private final UserService userService;
	private final PlantService plantService;
	private final BoardService boardService;

	//    @PostConstruct
	//    public void testInit(){
	//        User user = new User();
	//        user.setEmail("fff");
	//        user.setPassword("eerre");
	//        user.setName("east");
	//        User savedUser = userRepository.save(user);
	//    }

	@GetMapping("/api/main/{user-id}")
	public ResponseEntity<MainPageResult> getMainPage(@PathVariable("user-id") Long id) {
		User user = userService.findUser(id);
		List<Plant> plants = plantService.findPlants(id);
		List<BoardDTO> boards = boardService.getHotPost();

		return new ResponseEntity<>(new MainPageResult<MainPageDto>(new MainPageDto(user, plants, boards)), HttpStatus.OK);
	}

	@Getter
	@AllArgsConstructor
	static class MainPageResult<T> {
		private T data;
	}

	@Getter
	public static class MainPageDto {
		private Long user_id;
		private String user_name;
		private Integer point;
		private Integer max_plant_num;
		private Integer plant_num;
		private List<MainPagePlantDto> plants;
		private List<BoardDTO> boards;

		public MainPageDto(User user, List<Plant> plantList, List<BoardDTO> boardsList) { //List<Board> boardList
			user_id = user.getId();
			user_name = user.getName();
			point = user.getPoint();
			plant_num = user.getPlantNum();
			max_plant_num = user.getMaxPlantNum();

			plants = plantList.stream()
				.map(plant -> new MainPagePlantDto(plant))
				.sorted(Comparator.comparing(MainPagePlantDto::getPlant_level).reversed())
				.collect(Collectors.toList());

			boards = boardsList;
		}
	}

	@Getter
	static class MainPagePlantDto {
		private Long plant_id;
		private String plant_name;
		private Integer plant_exp;
		private Integer plant_level;
		private String file_name;

		public MainPagePlantDto(Plant plant) {
			plant_id = plant.getId();
			plant_name = plant.getPlantName();
			plant_exp = plant.getPlantExp();
			plant_level = plant.getPlantLevel();
			file_name = plant.getFileName();
		}
	}


}
