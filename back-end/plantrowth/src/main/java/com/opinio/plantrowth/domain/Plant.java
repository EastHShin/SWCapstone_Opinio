package com.opinio.plantrowth.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Getter @Setter
public class Plant {

    @Id @GeneratedValue
    @Column(name = "plant_id")
    private Long id;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id")
//    private User user;      //User 클래스 완성하면 풀기
    private String plantSpecies;
    private String plantName;
    private LocalDate plantBirth;
    private int plantExp;
    private String fileName;
    private int waterSupply;
    private int alarmCycle;


}
