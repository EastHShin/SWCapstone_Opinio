package com.opinio.plantrowth.api.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class addPlantDTO {
    private Integer max_plant_num;
    private Integer point;
}
