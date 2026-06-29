package vs.forum.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import lombok.RequiredArgsConstructor;

import vs.forum.dto.AuthenticationRequest;
import vs.forum.dto.ChangePermissionsRequest;
import vs.forum.dto.ChangeUserGroupRequest;
import vs.forum.dto.CodeVerificationRequest;
import vs.forum.dto.CodeVerificationResponse;
import vs.forum.dto.CommentAddRequest;
import vs.forum.dto.CommentCorrectionRequest;
import vs.forum.dto.CommentCorrectionResponse;
import vs.forum.dto.CommentDeleteRequest;
import vs.forum.dto.CommentInfoResponse;
import vs.forum.dto.LogDataResponse;
import vs.forum.dto.LoginVerificationResponse;
import vs.forum.dto.LogoutRequest;
import vs.forum.dto.OAuth2Request;
import vs.forum.dto.SuspendUserRequest;
import vs.forum.dto.TokenRefreshRequest;
import vs.forum.dto.TokenRefreshResponse;
import vs.forum.dto.TopicAddRequest;
import vs.forum.dto.TopicChangeRequest;
import vs.forum.dto.TopicDataResponse;
import vs.forum.dto.TopicInfoResponse;
import vs.forum.dto.UserDataResponse;
import vs.forum.dto.UserInfoResponse;
import vs.forum.dto.UserProfileRequest;
import vs.forum.dto.UserProfileResponse;
import vs.forum.dto.UserRegistrationRequest;
import vs.forum.dto.UserVerificationRequest;
import vs.forum.exception.ErrorMessage;
import vs.forum.service.AuthenticationService;
import vs.forum.service.ForumService;
import vs.forum.service.LoggingService;
import vs.forum.service.UserService;

@CrossOrigin(origins = "https://localhost:4200")
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
@Validated
public class AccessController {

	private final AuthenticationService authenticationService;
	private final UserService userService;
	private final ForumService forumService;
	private final LoggingService loggingService;

// Registracija

	@PostMapping("/public/registration")
	public ResponseEntity<Void> registrationUser(@RequestBody @Valid UserRegistrationRequest request) {
		authenticationService.registrationUser(request);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/public/availability-username/{username}")
	public ResponseEntity<Boolean> checkUsernameAvailability(
			@PathVariable @NotBlank(message = "Korisničko ime je obavezno.") @Pattern(regexp = "^[a-zA-Z0-9_]*$", message = "Korisničko ime može sadržavati samo slova, brojeve i donje crte.") @Size(min = 3, max = 30, message = "Korisničko ime mora imati između 3 i 30 karaktera.") String username) {
		boolean available = authenticationService.checkUsernameAvailability(username);
		return ResponseEntity.ok(available);
	}

	@GetMapping("/public/availability-email/{email}")
	public ResponseEntity<Boolean> checkEmailAvailability(
			@PathVariable @NotBlank(message = "Email je obavezan.") @Email(message = "Pogrešan format za email.") @Size(max = 100, message = "Email može imati maksimalno 100 karaktera.") String email) {
		boolean available = authenticationService.checkEmailAvailability(email);
		return ResponseEntity.ok(available);
	}

	@PreAuthorize("hasAuthority('ADMIN_MANAGE_ACCESS')")
	@PostMapping("/admin/verification-account")
	public ResponseEntity<Void> verifyUserAccount(@RequestBody @Valid UserVerificationRequest request) {
		authenticationService.verifyUserAccount(request);
		return ResponseEntity.ok().build();
	}

// Autentifikacija

	@PostMapping("/public/login")
	public ResponseEntity<LoginVerificationResponse> login(@RequestBody @Valid AuthenticationRequest request) {
		LoginVerificationResponse response = authenticationService.login(request);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/public/verification-code")
	public ResponseEntity<CodeVerificationResponse> verifyCode(@RequestBody @Valid CodeVerificationRequest request) {
		CodeVerificationResponse response = authenticationService.verifyCode(request);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/public/refresh-token")
	public ResponseEntity<TokenRefreshResponse> refreshToken(@RequestBody @Valid TokenRefreshRequest request) {
		TokenRefreshResponse response = authenticationService.refreshToken(request);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/public/login-oauth2")
	public ResponseEntity<LoginVerificationResponse> loginOAuth2(@RequestBody @Valid OAuth2Request request) {
		LoginVerificationResponse response = authenticationService.loginOAuth2(request);
		return ResponseEntity.ok(response);
	}

// Odjava

	@PreAuthorize("hasAnyRole('MEMBER', 'MODERATOR', 'ADMIN') and authentication.principal.username == #request.username")
	@PostMapping("/member/logout")
	public ResponseEntity<Void> logout(@RequestBody @Valid LogoutRequest request) {
		authenticationService.logout(request);
		return ResponseEntity.ok().build();
	}

// Korisnik

	@PreAuthorize("hasAnyRole('MEMBER', 'MODERATOR', 'ADMIN') and #status != 'BANNED'")
	@GetMapping("/member/users")
	public ResponseEntity<List<UserDataResponse>> getUsers(@RequestParam(required = false) String group,
			@RequestParam(required = false) String status) {
		List<UserDataResponse> users = userService.getUsers(group, status);
		if (users.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		else
			return new ResponseEntity<>(users, HttpStatus.OK);
	}

	@PreAuthorize("hasAnyRole('MEMBER', 'MODERATOR', 'ADMIN')")
	@GetMapping("/member/user-info/{id}")
	public ResponseEntity<UserInfoResponse> getUserInfo(
			@PathVariable @NotNull(message = "Id je obavezan.") @Positive(message = "Id treba da je pozitivan cijeli broj.") Integer id) {
		UserInfoResponse userInfo = userService.getUserInfo(id);
		return ResponseEntity.ok(userInfo);
	}

	@PreAuthorize("hasRole('ADMIN') or authentication.principal.username == #username")
	@GetMapping("/member/user-profile/{username}")
	public ResponseEntity<UserProfileResponse> getUserProfile(
			@PathVariable @NotBlank(message = "Korisničko ime je obavezno.") @Pattern(regexp = "^[a-zA-Z0-9_]*$", message = "Korisničko ime može sadržavati samo slova, brojeve i donje crte.") @Size(min = 3, max = 30, message = "Korisničko ime mora imati između 3 i 30 karaktera.") String username) {
		UserProfileResponse userProfile = userService.getUserProfile(username);
		return ResponseEntity.ok(userProfile);
	}

	@PreAuthorize("hasRole('ADMIN') or authentication.principal.username == #request.username")
	@PutMapping("/member/user-profile/change")
	public ResponseEntity<CodeVerificationResponse> changeUserProfile(@RequestBody @Valid UserProfileRequest request) {
		CodeVerificationResponse response = userService.changeUserProfile(request);
		return ResponseEntity.ok(response);
	}

// Admin

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/admin/groups")
	public ResponseEntity<Set<String>> getAllGroupNames() {
		Set<String> groupNames = userService.getAllGroupNames();
		return ResponseEntity.ok(groupNames);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/admin/statuses")
	public ResponseEntity<Set<String>> getAllStatusNames() {
		Set<String> groupNames = userService.getAllStatusNames();
		return ResponseEntity.ok(groupNames);
	}

	@PreAuthorize("hasAuthority('ADMIN_CHANGE_GROUP') and authentication.principal.id != #request.userId")
	@PutMapping("/admin/change-group")
	public ResponseEntity<Void> changeUserGroup(@RequestBody @Valid ChangeUserGroupRequest request) {
		userService.changeUserGroup(request);
		return ResponseEntity.ok().build();
	}

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/admin/groups/{groupName}/permissions")
	public ResponseEntity<Set<String>> getGroupPermissions(
			@PathVariable @NotNull(message = "Naziv grupe je obavezan.") String groupName) {
		Set<String> groupPermissions = userService.getGroupPermissions(groupName);
		return ResponseEntity.ok(groupPermissions);
	}

	@PreAuthorize("hasAuthority('ADMIN_MODIFY_PERMISSIONS')")
	@GetMapping("/admin/user-permissions/{userId}")
	public ResponseEntity<Set<String>> getUserPermissions(
			@PathVariable @NotNull(message = "Id korisnika je obavezan.") @Positive(message = "Id korisnika treba da je pozitivan cijeli broj.") Integer userId) {
		Set<String> groupPermissions = userService.getUserPermissions(userId);
		return ResponseEntity.ok(groupPermissions);
	}

	@PreAuthorize("hasAuthority('ADMIN_MODIFY_PERMISSIONS') and authentication.principal.id != #request.userId")
	@PutMapping("/admin/change-permissions")
	public ResponseEntity<Void> changePermissions(@RequestBody @Valid ChangePermissionsRequest request) {
		userService.changePermissions(request);
		return ResponseEntity.ok().build();
	}

	@PreAuthorize("hasAuthority('ADMIN_SUSPEND_USER') and authentication.principal.id != #request.userId")
	@PutMapping("/admin/user-suspend")
	public ResponseEntity<Void> suspendUser(@RequestBody @Valid SuspendUserRequest request) {
		userService.suspendUser(request);
		return ResponseEntity.ok().build();
	}

	@PreAuthorize("hasAuthority('ADMIN_DEACTIVATE_USER') and authentication.principal.username != #username")
	@PutMapping("/admin/user-deactivate/{username}")
	public ResponseEntity<Void> deactivateUser(
			@PathVariable @NotBlank(message = "Korisničko ime je obavezno.") @Pattern(regexp = "^[a-zA-Z0-9_]*$", message = "Korisničko ime može sadržavati samo slova, brojeve i donje crte.") @Size(min = 3, max = 30, message = "Korisničko ime mora imati između 3 i 30 karaktera.") String username) {
		userService.deactivateUser(username);
		return ResponseEntity.ok().build();
	}

// Komentari

	@PreAuthorize("hasAuthority('MEMBER_CREATE_COMMENT')")
	@PostMapping("/member/comment-add")
	public ResponseEntity<Void> addComment(@RequestBody @Valid CommentAddRequest request) {
		forumService.addComment(request);
		return ResponseEntity.ok().build();
	}

	@PreAuthorize("hasAuthority('MODERATOR_UPDATE_COMMENT') or (hasAuthority('MEMBER_UPDATE_COMMENT') and authentication.principal.username == #request.commentCreatorUsername)")
	@PutMapping("/member/comment-correct")
	public ResponseEntity<CommentCorrectionResponse> correctComment(
			@RequestBody @Valid CommentCorrectionRequest request) {
		CommentCorrectionResponse response = forumService.correctComment(request);
		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAuthority('MODERATOR_DELETE_COMMENT') or (hasAuthority('MEMBER_DELETE_COMMENT') and authentication.principal.username == #request.commentCreatorUsername)")
	@DeleteMapping("/member/comment-delete")
	public ResponseEntity<Void> deleteComment(@RequestBody @Valid CommentDeleteRequest request) {
		forumService.deleteComment(request);
		return ResponseEntity.ok().build();
	}

	@PreAuthorize("hasAnyRole('MEMBER', 'MODERATOR', 'ADMIN')")
	@GetMapping("/member/comment-topic/{topicId}")
	public ResponseEntity<Map<String, Object>> getAllCommentsByTopic(
			@PathVariable(value = "topicId") @NotNull(message = "Id je obavezan.") @Positive(message = "Id treba da je pozitivan cijeli broj.") Integer topicId,
			@RequestParam(defaultValue = "0") int currentPage, @RequestParam(defaultValue = "20") int elementsPerPage) {
		Map<String, Object> response = forumService.getAllCommentsByTopic(topicId, currentPage, elementsPerPage);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PreAuthorize("hasAnyRole('MEMBER', 'MODERATOR', 'ADMIN')")
	@GetMapping("/member/comment-info/{id}")
	public ResponseEntity<CommentInfoResponse> getCommentInfo(
			@PathVariable @NotNull(message = "Id je obavezan.") @Positive(message = "Id treba da je pozitivan cijeli broj.") Integer id) {
		CommentInfoResponse comment = forumService.getCommentInfo(id);
		return ResponseEntity.ok(comment);
	}

// Teme

	@PreAuthorize("hasAuthority('ADMIN_TOPIC')")
	@PostMapping("/admin/topic-add")
	public ResponseEntity<Void> createTopic(@RequestBody @Valid TopicAddRequest request) {
		forumService.createTopic(request);
		return ResponseEntity.ok().build();
	}

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/admin/topic-availability-name/{name}")
	public ResponseEntity<Boolean> checkTopicNameAvailability(
			@PathVariable @NotBlank(message = "Naziv teme je obavezan.") @Pattern(regexp = "^[a-zA-Z0-9_]*$", message = "Naziv teme može sadržavati samo slova, brojeve i donje crte.") @Size(min = 3, max = 100, message = "Naziv teme mora imati između 3 i 100 karaktera.") String name) {
		boolean available = forumService.checkTopicNameAvailability(name);
		return ResponseEntity.ok(available);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/admin/topic-info-list")
	public ResponseEntity<List<TopicInfoResponse>> getTopicInfoList() {
		List<TopicInfoResponse> topics = forumService.getTopicInfoList();
		if (topics.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		else
			return new ResponseEntity<>(topics, HttpStatus.OK);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/admin/topic-info/{id}")
	public ResponseEntity<TopicInfoResponse> getTopicInfo(
			@PathVariable @NotNull(message = "Id je obavezan.") @Positive(message = "Id treba da je pozitivan cijeli broj.") Integer id) {
		TopicInfoResponse topic = forumService.getTopicInfo(id);
		return ResponseEntity.ok(topic);
	}

	@PreAuthorize("hasAuthority('ADMIN_TOPIC')")
	@PutMapping("/admin/topic-change")
	public ResponseEntity<Void> changeTopic(@RequestBody @Valid TopicChangeRequest request) {
		forumService.changeTopic(request);
		return ResponseEntity.ok().build();
	}

	@PreAuthorize("hasAuthority('ADMIN_TOPIC')")
	@PutMapping("/admin/topic-archive/{id}")
	public ResponseEntity<Void> archiveTopic(
			@PathVariable @NotNull(message = "Id je obavezan.") @Positive(message = "Id treba da je pozitivan cijeli broj.") Integer id) {
		forumService.archiveTopic(id);
		return ResponseEntity.ok().build();
	}

	@PreAuthorize("hasAnyRole('MEMBER', 'MODERATOR', 'ADMIN')")
	@GetMapping("/member/topic")
	public ResponseEntity<List<TopicDataResponse>> getTopics() {
		List<TopicDataResponse> topics = forumService.getTopics();
		if (topics.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		else
			return new ResponseEntity<>(topics, HttpStatus.OK);
	}

// Logovanje

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/monitoring/data")
	public ResponseEntity<List<LogDataResponse>> getLogs(
			@RequestParam(required = false) @Pattern(regexp = "info|trace|debug|warn|error|fatal", message = "Pogrešan log level") String logLevelInfo,
			@RequestParam(required = false) @Pattern(regexp = "info|trace|debug|warn|error|fatal", message = "Pogrešan log level") String logLevelTrace,
			@RequestParam(required = false) @Pattern(regexp = "info|trace|debug|warn|error|fatal", message = "Pogrešan log level") String logLevelDebug,
			@RequestParam(required = false) @Pattern(regexp = "info|trace|debug|warn|error|fatal", message = "Pogrešan log level") String logLevelWarn,
			@RequestParam(required = false) @Pattern(regexp = "info|trace|debug|warn|error|fatal", message = "Pogrešan log level") String logLevelError,
			@RequestParam(required = false) @Pattern(regexp = "info|trace|debug|warn|error|fatal", message = "Pogrešan log level") String logLevelFatal,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) String startTime,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) String endTime)
			throws IOException {

		List<LogDataResponse> logs = loggingService.getDataLogs(logLevelInfo, logLevelTrace, logLevelDebug,
				logLevelWarn, logLevelError, logLevelFatal, startTime, endTime);

		if (logs.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		else
			return new ResponseEntity<>(logs, HttpStatus.OK);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/monitoring/errors")
	public ResponseEntity<List<ErrorMessage>> readErrorMessagesFromFile(
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) String startTime,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) String endTime) {
		List<ErrorMessage> message = loggingService.readErrorMessagesFromFile(startTime, endTime);
		if (message.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		else
			return new ResponseEntity<>(message, HttpStatus.OK);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/monitoring/error/{id}")
	public ResponseEntity<ErrorMessage> getErrorMessage(
			@PathVariable @NotNull(message = "Id je obavezan.") @Positive(message = "Id treba da je pozitivan cijeli broj.") Integer id) {
		ErrorMessage errorMessages = loggingService.getErrorMessage(id);
		return ResponseEntity.ok(errorMessages);
	}

}
