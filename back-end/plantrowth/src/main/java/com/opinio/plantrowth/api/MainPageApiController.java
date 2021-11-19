package com.opinio.plantrowth.api;

import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.service.PlantService;
import com.opinio.plantrowth.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class MainPageApiController {

    private final UserService userService;
    private final PlantService plantService;

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
        //List<Board> boards = boardService.findBestPost();      나중에 게시판 구현하면 수정
        return new ResponseEntity<>(new MainPageResult<MainPageDto>(new MainPageDto(user,plants)), HttpStatus.OK);
    }

    @Getter
    @AllArgsConstructor
    static class MainPageResult<T>{
        private T data;
    }

    @Getter
    static class MainPageDto{
        private Long user_id;
        private String user_name;
        private Integer point;
        private Integer max_plant_num;
        private Integer plant_num;
        private List<MainPagePlantDto> plants;
        //private List<Board> boards;

        public MainPageDto(User user, List<Plant> plantList) { //List<Board> boardList
            user_id = user.getId();
            user_name = user.getName();
            point = user.getPoint();
            plant_num = user.getPlantNum();
            max_plant_num = user.getMaxPlantNum();

            plants = plantList.stream()
                    .map(plant -> new MainPagePlantDto(plant))
                    .collect(Collectors.toList());
        }
    }

    @Getter
    static class MainPagePlantDto{
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
    /* 게시판 구현하면 풀기
    @Getter
    static class MainPageBoardDto{
        private String postName;
    }
     */

}