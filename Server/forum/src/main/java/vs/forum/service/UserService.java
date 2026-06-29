package vs.forum.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import vs.forum.dto.ChangePermissionsRequest;
import vs.forum.dto.ChangeUserGroupRequest;
import vs.forum.dto.CodeVerificationResponse;
import vs.forum.dto.SuspendUserRequest;
import vs.forum.dto.UserDataResponse;
import vs.forum.dto.UserInfoResponse;
import vs.forum.dto.UserProfileRequest;
import vs.forum.dto.UserProfileResponse;
import vs.forum.entity.Group;
import vs.forum.entity.Permission;
import vs.forum.entity.Status;
import vs.forum.entity.User;
import vs.forum.exception.BadRequestException;
import vs.forum.exception.EntityNotFoundException;
import vs.forum.exception.NameConflictException;
import vs.forum.repository.UserRepository;
import vs.forum.security.JwtService;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final ModelMapper modelMapper;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;

	public List<UserDataResponse> getUsers(String group, String status) {
		List<User> users = new ArrayList<>();
		if (group == null && status == null) {
			users = userRepository.findAll();
		} else if (group != null && status == null) {
			users = userRepository.findByGroup(Group.valueOf(group));
		} else if (group == null) {
			users = userRepository.findByStatus(Status.valueOf(status));
		} else {
			users = userRepository.findByGroupAndStatus(Group.valueOf(group), Status.valueOf(status));
		}
		return users.stream().map(this::mapUserEntityToDTO).collect(Collectors.toList());
	}

	public UserInfoResponse getUserInfo(@PathVariable @Valid Integer id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen.", "id", String.valueOf(id)));
		UserInfoResponse userInfo = modelMapper.map(user, UserInfoResponse.class);
		return userInfo;
	}

	public UserProfileResponse getUserProfile(@PathVariable @Valid String username) {
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen.", "username", username));
		UserProfileResponse userProfile = modelMapper.map(user, UserProfileResponse.class);
		return userProfile;
	}

	public CodeVerificationResponse changeUserProfile(@RequestBody @Valid UserProfileRequest request) {
		User user = userRepository.findByUsername(request.getUsername()).orElseThrow(
				() -> new EntityNotFoundException("Korisnik nije pronađen.", "username", request.getUsername()));
		if (!(request.getOldPassword().isBlank() || request.getNewPassword().isBlank())) {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(user.getUsername(), request.getOldPassword()));
			user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		}
		if (!request.getEmail().equals(user.getEmail())) {
			if (userRepository.existsByEmail(request.getEmail())) {
				throw new NameConflictException("Email adresa se već koristi.", "email", request.getEmail());
			}
			user.setEmail(request.getEmail());
		}
		user.setAvatarUrl(request.getAvatarUrl());
		userRepository.saveAndFlush(user);
		var jwtToken = jwtService.generateToken(user);
		var refreshJwtTokens = jwtService.generateRefreshToken(user);
		return CodeVerificationResponse.builder().jwtToken(jwtToken).refreshJwtToken(refreshJwtTokens)
				.username(user.getUsername()).group(user.getGroup()).avatarUrl(request.getAvatarUrl()).build();
	}

	public Set<String> getAllGroupNames() {
		return Arrays.stream(Group.values()).map(Enum::name).collect(Collectors.toSet());
	}

	public Set<String> getAllStatusNames() {
		return Arrays.stream(Status.values()).map(Enum::name).collect(Collectors.toSet());
	}

	public void changeUserGroup(ChangeUserGroupRequest request) {
		User user = userRepository.findById(request.getUserId())
				.orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen.", "userId",
						String.valueOf(request.getUserId())));
		if (request.getNewGroup() == user.getGroup())
			throw new BadRequestException("Korisnikova grupa nije promjenjena.", "group", request.getNewGroup().name());
		if (Status.APPROVED != user.getStatus())
			throw new BadRequestException("Nije dozvoljena promjena grupe korisnika.", "status",
					user.getStatus().name());
		user.setGroup(request.getNewGroup());
		Set<Permission> userPermissions = new HashSet<>(user.getGroup().getPermissions());
		user.setPermissions(userPermissions);
		userRepository.save(user);
	}

	public Set<String> getGroupPermissions(String groupName) {
		Group group = Group.valueOf(groupName.toUpperCase());
		return group.getPermissions().stream().map(permission -> permission.name()).collect(Collectors.toSet());
	}

	public Set<String> getUserPermissions(Integer userId) {
		User user = userRepository.findById(userId).orElseThrow(
				() -> new EntityNotFoundException("Korisnik nije pronađen.", "userId", String.valueOf(userId)));
		return user.getPermissions().stream().map(permission -> permission.name()).collect(Collectors.toSet());
	}

	public void changePermissions(ChangePermissionsRequest request) {
		User user = userRepository.findById(request.getUserId())
				.orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen.", "userId",
						String.valueOf(request.getUserId())));
		Set<Permission> allowedPermissions = user.getGroup().getPermissions();
		Set<Permission> newPermissions = request.getNewPermissions().stream()
				.map(permission -> Permission.valueOf(permission)).collect(Collectors.toSet());
		if (!allowedPermissions.containsAll(newPermissions))
			throw new BadRequestException("Pronađene su nedozvoljene permisije.", "permissions",
					newPermissions.stream().map(Permission::name).collect(Collectors.joining()));
		user.setPermissions(newPermissions);
		userRepository.saveAndFlush(user);
	}

	public void suspendUser(SuspendUserRequest request) {
		User user = userRepository.findById(request.getUserId())
				.orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen.", "userId",
						String.valueOf(request.getUserId())));
		if (Status.SUSPENDED == user.getStatus())
			throw new BadRequestException("Korisnik je trenutno suspendovan.", "status", Status.SUSPENDED.name());
		if (Status.DEACTIVATED == user.getStatus())
			throw new BadRequestException("Korisnik je obrisan.", "status", Status.DEACTIVATED.name());
		user.setStatus(Status.SUSPENDED);
		user.setSuspendExpiration(request.getSuspendExpiration());
		userRepository.saveAndFlush(user);
	}

	@Scheduled(fixedRate = 86400000)
	public void checkSuspendExpirations() {
		List<User> suspendUsers = userRepository.findByStatusAndSuspendExpirationBefore(Status.SUSPENDED,
				LocalDate.now());
		for (User user : suspendUsers)
			unsuspendUser(user.getId());
	}

	private void unsuspendUser(Integer id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen.", "id", String.valueOf(id)));
		user.setStatus(Status.APPROVED);
		user.setSuspendExpiration(null);
		userRepository.saveAndFlush(user);
	}

	public void deactivateUser(String username) {
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen.", "username", username));
		user.setStatus(Status.DEACTIVATED);
		user.setPermissions(Collections.emptySet());
		userRepository.saveAndFlush(user);
	}

	private UserDataResponse mapUserEntityToDTO(User user) {
		return modelMapper.map(user, UserDataResponse.class);
	}

}
