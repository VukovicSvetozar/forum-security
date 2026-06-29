package vs.forum.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Table(name = "user")
public class User implements UserDetails {

	private static final long serialVersionUID = -2285377235114055348L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private Integer id;

	@Column(name = "username", nullable = false, unique = true)
	private String username;

	@Column(nullable = false)
	private String password;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(name = "avatar_url", nullable = true)
	private String avatarUrl;

	@Column(name = "access_date", nullable = false)
	private LocalDate accessDate;

	@Column(name = "last_visit", nullable = false)
	private LocalDate lastVisit;

	@Column(name = "total_posts", nullable = false)
	private Integer totalPosts;

	@Column(name = "secret_code", nullable = true)
	private String secretCode;

	@Column(name = "secret_time", nullable = true)
	private LocalDateTime secretTime;

	@Column(name = "suspend_expiration", nullable = true)
	private LocalDate suspendExpiration;

	@Enumerated(EnumType.STRING)
	@Column(name = "user_status")
	private Status status;

	@Enumerated(EnumType.STRING)
	@Column(name = "user_group")
	private Group group;

	@ElementCollection(targetClass = Permission.class, fetch = FetchType.EAGER)
	@Enumerated(EnumType.STRING)
	@CollectionTable(name = "user_permissions", joinColumns = @JoinColumn(name = "user_id"))
	@Column(name = "permission", nullable = false)
	private Set<Permission> permissions;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		List<GrantedAuthority> authorities = new ArrayList<>();
		authorities = permissions.stream().map(permission -> new SimpleGrantedAuthority(permission.name()))
				.collect(Collectors.toList());
		authorities.add(new SimpleGrantedAuthority("ROLE_" + this.group.name()));
		return authorities;
	}

	@Override
	public String getUsername() {
		return username;
	}

	@Override
	public String getPassword() {
		return password;
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
