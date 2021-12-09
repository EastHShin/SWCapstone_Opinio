package com.opinio.plantrowth.domain.plant;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.opinio.plantrowth.domain.user.User;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Builder
@Entity
@Getter @Setter
@NoArgsConstructor
public class Plant {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plant_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @Column(name = "plant_species")
    private String plantSpecies;
    @Column(name = "plant_name")
    private String plantName;
    @Column(name = "plant_birth")
    private LocalDate plantBirth;
    @Column(name = "plant_level")
    private Integer plantLevel;
    @Column(name = "plant_exp")
    private Integer plantExp;
    @Column(name = "file_name")
    private String fileName;
    @Column(name = "water_supply")
    private Integer waterSupply;
    @Column(name = "alarm_cycle")
    private Integer alarmCycle;
    @Column(name = "recent_watering")
    private LocalDate recentWatering;

    // @Version    //스케줄러를 실행할 때 동시성 처리를 위해 Optimistic Lock 사용
    @Column(name = "remain_cycle")
    private Integer remainCycle;

    @OneToMany(fetch = FetchType.LAZY,cascade = {CascadeType.MERGE, CascadeType.REMOVE}, mappedBy = "plant")
    @Builder.Default
    private List<PlantDiary> diaries = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "plant")
    @Builder.Default
    private List<DiagnosisRecord> records = new ArrayList<>();

}
