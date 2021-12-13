package com.opinio.plantrowth.domain.payment;

import java.time.LocalDate;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
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
@Getter
@Setter
@NoArgsConstructor
@Builder
@Entity
@Table(name = "point_record")
public class PointRecord {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
	@JoinColumn(name = "user_id")
	private User user;

	@Column(name = "spent_point")
	private Integer spentPoint;

	@Column(name = "remain_point")
	private Integer remainPoint;

	@Column(name = "is_negative")
	private Boolean isNegative;

	@Enumerated(EnumType.STRING)
	@Column(name = "spend_type")
	private PointSpendType pointSpendType;

	@Column(name = "spend_date")
	private LocalDate date;
}
