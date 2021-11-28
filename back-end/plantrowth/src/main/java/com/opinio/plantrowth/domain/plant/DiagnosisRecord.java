package com.opinio.plantrowth.domain.plant;

import java.time.LocalDate;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.opinio.plantrowth.domain.user.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "diagnosis_record")
public class DiagnosisRecord {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
	@JoinColumn(name = "plant_id")
	private Plant plant;

	@Column(name = "diagnosis_date")
	private LocalDate diagnosisDate;

	@Column(name = "disease_name")
	private String diseaseName;

	@Column(name = "disease_percent")
	private String diseasePercent;

	@Column(name = "image_url")
	private String imageUrl;




}
