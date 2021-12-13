package com.opinio.plantrowth.domain.user;

import lombok.*;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import com.opinio.plantrowth.domain.community.Board;
import com.opinio.plantrowth.domain.community.BoardLike;
import com.opinio.plantrowth.domain.community.Comment;
import com.opinio.plantrowth.domain.community.Report;
import com.opinio.plantrowth.domain.payment.PaymentRecord;
import com.opinio.plantrowth.domain.payment.PointRecord;
import com.opinio.plantrowth.domain.payment.Subscription;
import com.opinio.plantrowth.domain.plant.DiagnosisRecord;
import com.opinio.plantrowth.domain.plant.Plant;

@AllArgsConstructor
@Entity
@Getter
@Setter
@NoArgsConstructor
@Builder
public class User implements UserDetails {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Long id;

	@Column(name = "user_name")
	private String name;
	@Column(name = "user_birth")
	private LocalDate birth;
	private String email;
	private String password;
	private Integer point;
	@Column(name = "plant_num")
	private Integer plantNum;
	@Column(name = "max_plant_num")
	private Integer maxPlantNum;
	@Column(name = "fcm_access_token")
	private String FCMAccessToken;

	@Column(name = "is_subscription")
	private Boolean subscription;

	@ElementCollection(fetch = FetchType.EAGER)
	@Builder.Default
	private List<String> roles = new ArrayList<>();

	@OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.REMOVE}, mappedBy = "user")
	@Builder.Default
	List<Plant> plants = new ArrayList<>();

	@OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.REMOVE}, mappedBy = "user")
	@Builder.Default
	List<Board> boards = new ArrayList<>();

	@OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.REMOVE}, mappedBy = "user")
	@Builder.Default
	List<Comment> comments = new ArrayList<>();

	@OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.REMOVE}, mappedBy = "user")
	@Builder.Default
	List<PaymentRecord> paymentRecords = new ArrayList<>();

	@OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.REMOVE}, mappedBy = "user")
	@Builder.Default
	List<PointRecord> pointRecords = new ArrayList<>();

	@OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.REMOVE}, mappedBy = "user")
	@Builder.Default
	List<BoardLike> boardLikes = new ArrayList<>();

	@OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.REMOVE}, mappedBy = "user")
	@Builder.Default
	List<Subscription> subscriptions = new ArrayList<>();

	@OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.REMOVE}, mappedBy = "user")
	@Builder.Default
	List<Report> reports = new ArrayList<>();

	@OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.REMOVE}, mappedBy = "user")
	@Builder.Default
	List<DiagnosisRecord> diagnosisRecords = new ArrayList<>();

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return this.roles.stream()
			.map(SimpleGrantedAuthority::new)
			.collect(Collectors.toList());
	}

	@Override
	public String getUsername() {
		return email;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

}
