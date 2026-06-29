package vs.forum.service;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Set;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

import com.fasterxml.jackson.databind.JsonNode;

import vs.forum.dto.AuthenticationRequest;
import vs.forum.dto.CodeVerificationRequest;
import vs.forum.dto.CodeVerificationResponse;
import vs.forum.dto.LoginVerificationResponse;
import vs.forum.dto.LogoutRequest;
import vs.forum.dto.OAuth2Request;
import vs.forum.dto.TokenRefreshRequest;
import vs.forum.dto.TokenRefreshResponse;
import vs.forum.dto.UserRegistrationRequest;
import vs.forum.dto.UserVerificationRequest;
import vs.forum.entity.Group;
import vs.forum.entity.Permission;
import vs.forum.entity.Status;
import vs.forum.entity.User;
import vs.forum.exception.AuthenticationFailureException;
import vs.forum.exception.BadRequestException;
import vs.forum.exception.EntityNotFoundException;
import vs.forum.exception.NameConflictException;
import vs.forum.repository.UserRepository;
import vs.forum.security.JwtService;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

	private final UserRepository userRepository;
	private final ModelMapper modelMapper;
	private final PasswordEncoder passwordEncoder;
	private final MailService mailService;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;
	private final UserDetailsService userDetailsService;

	@Value("${spring.security.oauth2.client.registration.github.client-id}")
	private String clientId;

	@Value("${spring.security.oauth2.client.registration.github.client-secret}")
	private String clientSecret;

	@Value("${spring.security.oauth2.client.provider.github.token-uri}")
	private String tokenUri;

	@Value("${spring.security.oauth2.client.provider.github.user-info-uri}")
	private String userInfoUri;

	@Value("${application.security.github.user-emails-uri}")
	private String userEmailsUri;

	public void registrationUser(UserRegistrationRequest request) {
		if (userRepository.existsByUsername(request.getUsername())) {
			throw new NameConflictException("Korisničko ime se već koristi.", "username", request.getUsername());
		}
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new NameConflictException("Email adresa se već koristi.", "email", request.getEmail());
		}
		User user = modelMapper.map(request, User.class);
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		user.setAccessDate(LocalDate.now());
		user.setLastVisit(LocalDate.now());
		user.setTotalPosts(0);
		user.setGroup(Group.GUEST);
		user.setStatus(Status.PENDING);
		userRepository.saveAndFlush(user);
	}

	public boolean checkUsernameAvailability(String username) {
		Optional<User> user = userRepository.findByUsername(username);
		return !user.isPresent();
	}

	public boolean checkEmailAvailability(String email) {
		Optional<User> user = userRepository.findByEmail(email);
		return !user.isPresent();
	}

	public void verifyUserAccount(UserVerificationRequest request) {
		User user = userRepository.findById(request.getUserId()).orElseThrow(
				() -> new EntityNotFoundException("Korisnik nije pronađen.", "userId", request.getUserId().toString()));
		if (Status.PENDING != user.getStatus() && Status.OAUTH2 != user.getStatus()) {
			throw new BadRequestException("Korisnik ne čeka na verifikaciju naloga.", "status",
					user.getStatus().name());
		}
		String password = null;
		if (Status.OAUTH2 == user.getStatus()) {
			password = generateRandomPassword(10);
			user.setPassword(passwordEncoder.encode(password));
		}

		if (request.getApproved()) {
			if (!mailService.sendVerificationSuccessEmail(user.getEmail(), user.getUsername(), password)) {
				throw new BadRequestException("Slanje email-a o verifikaciji naloga nije bilo uspješno.", "email",
						user.getEmail());
			}
			user.setGroup(request.getGroup());
			Set<Permission> userPermissions = new HashSet<>(request.getGroup().getPermissions());
			user.setPermissions(userPermissions);
			user.setStatus(Status.APPROVED);
		} else {
			user.setStatus(Status.REJECTED);
		}
		userRepository.saveAndFlush(user);
	}

	public LoginVerificationResponse login(AuthenticationRequest request) {
		authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
		User user = userRepository.findByUsername(request.getUsername()).orElseThrow(
				() -> new EntityNotFoundException("Korisnik nije pronađen.", "username", request.getUsername()));
		if (Group.GUEST == user.getGroup()) {
			throw new AuthenticationFailureException("Korisnik čeka na verifikaciju naloga.", "group",
					user.getGroup().name());
		}
		String code = generateVerificationCode(6);
		user.setSecretCode(passwordEncoder.encode(code));
		user.setSecretTime(LocalDateTime.now());
		if (!mailService.sendVerificationCode(user.getEmail(), code)) {
			throw new BadRequestException("Slanje verifikacionog koda nije bilo uspješno.", "email", user.getEmail());
		}
		userRepository.saveAndFlush(user);
		var loginJwtToken = jwtService.generateLoginToken(user);
		return LoginVerificationResponse.builder().loginJwtToken(loginJwtToken).username(request.getUsername()).build();
	}

	public CodeVerificationResponse verifyCode(CodeVerificationRequest request) {
		UserDetails userDetails = this.userDetailsService.loadUserByUsername(request.getUsername());
		String loginToken = request.getLoginJwtToken();
		if (loginToken == null || !jwtService.isTokenValid(loginToken, userDetails)) {
			throw new AuthenticationFailureException("Prvi korak autentifikacije nije završen.", "loginToken",
					loginToken);
		}
		User user = userRepository.findByUsername(request.getUsername()).orElseThrow(
				() -> new EntityNotFoundException("Korisnik nije pronađen.", "username", request.getUsername()));
		LocalDateTime currentTime = LocalDateTime.now();
		LocalDateTime creationCodeTime = user.getSecretTime();
		long minutesPassed = ChronoUnit.MINUTES.between(creationCodeTime, currentTime);
		if (minutesPassed > 3) {
			throw new AuthenticationFailureException("Vrijeme predviđeno za unos koda je isteklo.", "minutesPassed",
					String.valueOf(minutesPassed));
		}
		if (passwordEncoder.matches(request.getSecretCode().toString(), user.getSecretCode())) {
			var group = user.getGroup();
			var avatarUrl = user.getAvatarUrl();
			var jwtToken = jwtService.generateToken(user);
			var refreshJwtTokens = jwtService.generateRefreshToken(user);
			return CodeVerificationResponse.builder().jwtToken(jwtToken).refreshJwtToken(refreshJwtTokens)
					.username(request.getUsername()).group(group).avatarUrl(avatarUrl).build();
		} else {
			throw new AuthenticationFailureException("Uneseni kod nije korektan.", "secretCode",
					request.getSecretCode().toString());
		}
	}

	public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
		String refreshToken = request.getRefreshJwtToken();
		if (!jwtService.isTokenExpired(refreshToken)) {
			String username = jwtService.extractUsername(refreshToken);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtService.isTokenValid(refreshToken, userDetails)) {
				User user = userRepository.findByUsername(username).orElseThrow(
						() -> new EntityNotFoundException("Korisnik nije pronađen.", "username", username));
				var group = user.getGroup();
				var avatarUrl = user.getAvatarUrl();
				var jwtToken = jwtService.generateToken(user);
				var refreshJwtTokens = jwtService.generateRefreshToken(user);
				return TokenRefreshResponse.builder().jwtToken(jwtToken).refreshJwtToken(refreshJwtTokens)
						.username(username).group(group).avatarUrl(avatarUrl).build();
			} else {
				throw new AuthenticationFailureException("Nevalidan refresh token.", "refreshToken", refreshToken);
			}
		} else {
			throw new AuthenticationFailureException("Refresh token je istekao.", "refreshToken", refreshToken);
		}
	}

	public LoginVerificationResponse loginOAuth2(OAuth2Request request) {

		RestTemplate restTemplate = new RestTemplate();

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		String body = "client_id=" + clientId + "&client_secret=" + clientSecret + "&code=" + request.getCode();

		HttpEntity<String> entity = new HttpEntity<>(body, headers);

		ResponseEntity<JsonNode> response = restTemplate.postForEntity(tokenUri, entity, JsonNode.class);
		String accessToken = response.getBody().path("access_token").asText();

		headers = new HttpHeaders();
		headers.set("Authorization", "token " + accessToken);
		entity = new HttpEntity<>("", headers);

		ResponseEntity<JsonNode> userResponse = restTemplate.exchange(userInfoUri, HttpMethod.GET, entity,
				JsonNode.class);
		String username = userResponse.getBody().path("login").asText();
		String email = userResponse.getBody().path("email").asText();

		if (email == null || email.isEmpty() || email == "null") {
			ResponseEntity<JsonNode> emailsResponse = restTemplate.exchange(userEmailsUri, HttpMethod.GET, entity,
					JsonNode.class);
			JsonNode emails = emailsResponse.getBody();
			for (JsonNode emailNode : emails) {
				if (emailNode.path("primary").asBoolean() && emailNode.path("verified").asBoolean()) {
					email = emailNode.path("email").asText();
					break;
				}
			}
		}

		if (username == null || username.isEmpty() || username == "null") {
			throw new BadRequestException("Korisnicko ime nije pronađeno.", "username", username);
		}
		if (email == null || email.isEmpty() || email == "null") {
			throw new BadRequestException("Email nije pronađen.", "email", email);
		}

		Optional<User> userByUsername = userRepository.findByUsername(username);
		Optional<User> userByEmail = userRepository.findByEmail(email);

		if (userByUsername.isEmpty() && userByEmail.isEmpty()) {
			User newUser = new User();
			newUser.setUsername(username);
			newUser.setEmail(email);
			newUser.setAvatarUrl("assets/avatars/0.png");
			newUser.setPassword(passwordEncoder.encode(generateRandomPassword(10)));
			newUser.setAccessDate(LocalDate.now());
			newUser.setLastVisit(LocalDate.now());
			newUser.setTotalPosts(0);
			newUser.setGroup(Group.GUEST);
			newUser.setStatus(Status.OAUTH2);
			userRepository.saveAndFlush(newUser);
			return null;
		} else if (userByUsername.isPresent() && userByEmail.isEmpty()) {
			throw new AuthenticationFailureException(
					"Pronađen je korisnik sa datim korisničkim imenom, ali ne i sa email-om.", "username", username);
		} else if (userByUsername.isEmpty() && userByEmail.isPresent()) {
			throw new AuthenticationFailureException(
					"Pronađen je korisnik sa datim email-om, ali ne i sa korisničkim imenom.", "email", email);
		} else {
			User user = userByUsername.get();
			if (!user.getEmail().equals(email)) {
				throw new AuthenticationFailureException(
						"Kod pronađenog korisnika korisničko ime i email se ne podudaraju.", "username / email",
						username + " / " + email);
			} else {
				if (Group.GUEST == user.getGroup()) {
					throw new AuthenticationFailureException("Korisnik čeka na verifikaciju naloga.", "group",
							user.getGroup().name());
				}
				String code = generateVerificationCode(6);
				user.setSecretCode(passwordEncoder.encode(code));
				user.setSecretTime(LocalDateTime.now());
				if (!mailService.sendVerificationCode(user.getEmail(), code)) {
					throw new BadRequestException("Slanje verifikacionog koda nije bilo uspješno.", "email",
							user.getEmail());
				}
				userRepository.saveAndFlush(user);
				var loginJwtToken = jwtService.generateLoginToken(user);
				return LoginVerificationResponse.builder().loginJwtToken(loginJwtToken).username(user.getUsername())
						.build();
			}
		}
	}

	public void logout(LogoutRequest request) {
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		if (request.getUsername().equals(username)) {
			SecurityContextHolder.clearContext();
		} else {
			throw new AuthenticationFailureException("Pogrešno korisnicko ime.", "username", request.getUsername());
		}
	}

	private String generateVerificationCode(int length) {
		Random random = new Random();
		StringBuilder sb = new StringBuilder();
		sb.append(random.nextInt(9) + 1);
		for (int i = 1; i < length; i++) {
			sb.append(random.nextInt(10));
		}
		return sb.toString();
	}

	private String generateRandomPassword(int length) {

		String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		final String LOWER = "abcdefghijklmnopqrstuvwxyz";
		final String DIGITS = "0123456789";
		final String SPECIAL = "@#$%^&*_=+-";
		final String ALL_ALLOWED = UPPER + LOWER + DIGITS + SPECIAL;

		SecureRandom random = new SecureRandom();
		StringBuilder password = new StringBuilder(length);

		password.append(LOWER.charAt(random.nextInt(LOWER.length())));
		password.append(UPPER.charAt(random.nextInt(UPPER.length())));
		password.append(DIGITS.charAt(random.nextInt(DIGITS.length())));
		password.append(SPECIAL.charAt(random.nextInt(SPECIAL.length())));

		for (int i = 4; i < length; i++) {
			password.append(ALL_ALLOWED.charAt(random.nextInt(ALL_ALLOWED.length())));
		}
		List<Character> passwordChars = new ArrayList<>();
		for (char c : password.toString().toCharArray()) {
			passwordChars.add(c);
		}
		Collections.shuffle(passwordChars);
		StringBuilder shuffledPassword = new StringBuilder();
		for (char c : passwordChars) {
			shuffledPassword.append(c);
		}

		return shuffledPassword.toString();
	}

}
