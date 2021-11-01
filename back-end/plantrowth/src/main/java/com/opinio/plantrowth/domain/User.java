package com.opinio.plantrowth.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.time.LocalDate;

@Entity
@Getter @Setter
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
