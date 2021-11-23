package com.opinio.plantrowth.api;

import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.service.UserService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class StoreApiController {

    private final UserService userService;

    @GetMapping("/api/store/{user-id}")
    public ResponseEntity<StoreDTO> getStore(@PathVariable("user-id") Long userId) {
        User user = userService.findUser(userId);
        return new ResponseEntity<>(new StoreDTO(user), HttpStatus.OK);
    }

    @Getter
    static class StoreDTO{
        private Long user_id;
        private String user_name;
        private Integer point;
        private String email;

        public StoreDTO(User user) {
            user_id = user.getId();
            user_name = user.getName();
            point = user.getPoint();
            email = user.getEmail();
        }
    }
}
