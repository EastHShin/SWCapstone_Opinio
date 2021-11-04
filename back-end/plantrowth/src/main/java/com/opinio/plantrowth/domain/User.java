package com.opinio.plantrowth.domain;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.time.LocalDate;

@AllArgsConstructor
@Entity
@Getter @Setter
@Builder
public class User {
    @Id @GeneratedValue
    @Column(name = "user_id")
    private Long id;

    @Column(name = "user_name")
    private String name;
    @Column(name = "user_birth")
    private LocalDate birth;

    private String email;
    private String password;
    private int point;
    @Column(name = "plant_num")
    private int plantNum;
    @Column(name = "max_plant_num")
    private int maxPlantNum;



}
