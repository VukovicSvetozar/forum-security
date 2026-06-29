package vs.forum.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Pattern;

import vs.forum.exception.ErrorMessage;
import vs.forum.service.LoggingService;

@Component
@RequiredArgsConstructor

public class WafFilter extends OncePerRequestFilter {

	private final JwtService jwtService;
	private final BlacklistJwtService blacklistJwtService;
	private final LoggingService loggingService;

	private final ConcurrentHashMap<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();
	private final ConcurrentHashMap<String, Long> lastRequestTimes = new ConcurrentHashMap<>();

	@Value("${application.security.ddos.limit}")
	private long limit;

	@Value("${application.security.ddos.interval}")
	private long interval;

	private static final int BUFFER_OVERFLOW_LIMIT = 1024 * 1024;

	private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile(
			"\\b(SELECT|UPDATE|DELETE|INSERT|DROP|ALTER|TRUNCATE|CREATE|RENAME|WHERE|AND|OR|UNION|ORDER BY|GROUP BY|LIMIT|"
					+ "CONCAT|SUBSTRING|LENGTH|FROM|JOIN|EXECUTE|DECLARE|EXEC|INSERT|META|DATABASE|SCHEMA|INFORMATION_SCHEMA|"
					+ "SYSTEM|MASTER|MSDB|TEMPDB|ROOT|'|\\)|\\(|--|#)\\b",
			Pattern.CASE_INSENSITIVE);

	private static final Pattern XSS_PATTERN = Pattern.compile(
			"(<script>|</script>|<.*\\son\\w+=|\\bjavascript:|\\balert\\b|\\bconsole.log\\b|\\bwindow.location\\b|\\bdocument.cookie\\b|\\bonerror\\b|\\bonload\\b|\\bonclick\\b|\\bonmouseover\\b|\\bonfocus\\b)",
			Pattern.CASE_INSENSITIVE);

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		CachedBodyHttpServletRequest wrappedRequest = new CachedBodyHttpServletRequest(request);

		if (isMaliciousRequest(wrappedRequest)) {
			String authHeader = request.getHeader("Authorization");
			if (authHeader != null && authHeader.startsWith("Bearer ")) {
				String jwt = authHeader.substring(7);
				String username = jwtService.extractUsername(jwt);
				blacklistJwtService.recordMaliciousRequest(username);
				if (blacklistJwtService.hasReachedMaxAttempts(username)) {
					blacklistJwtService.blacklistToken(jwt);
				}
			}
			response.sendError(HttpServletResponse.SC_FORBIDDEN, "Detektovan je maliciozan zahtjev.");
			return;
		}

		filterChain.doFilter(wrappedRequest, response);
	}

	private boolean isMaliciousRequest(HttpServletRequest request) throws IOException {

		MaliciousRequestCheck checkHeader = containsMaliciousHeaders(request);
		if (checkHeader.isMalicious()) {
			logMaliciousRequest(request, checkHeader.getCause(), checkHeader.getMaliciousParams());
			return true;
		}

		MaliciousRequestCheck checkParameters = containsMaliciousParameters(request);
		if (checkParameters.isMalicious()) {
			logMaliciousRequest(request, checkParameters.getCause(), checkParameters.getMaliciousParams());
			return true;
		}

		MaliciousRequestCheck checkBody = containsMaliciousBody(request);
		if (checkBody.isMalicious()) {
			logMaliciousRequest(request, checkBody.getCause(), checkBody.getMaliciousParams());
			return true;
		}

		if (isRateLimitExceeded(request)) {
			logMaliciousRequest(request, "Prekoračen je limit broja zahtjeva.", null);
			return true;
		}

		return false;
	}

	private MaliciousRequestCheck containsMaliciousHeaders(HttpServletRequest request) {
		boolean hasMaliciousHeader = Collections.list(request.getHeaderNames()).stream().anyMatch(headerName -> {
			String headerValue = request.getHeader(headerName);
			return headerValue.length() > BUFFER_OVERFLOW_LIMIT || SQL_INJECTION_PATTERN.matcher(headerValue).find()
					|| XSS_PATTERN.matcher(headerValue).find();
		});

		if (hasMaliciousHeader) {
			return new MaliciousRequestCheck(true,
					"Detektovano je maliciozno ili nedozvoljeno veliko zaglavlje zahtjeva.", null);
		} else {
			return new MaliciousRequestCheck(false, "", null);
		}
	}

	public MaliciousRequestCheck containsMaliciousParameters(HttpServletRequest request) {
		Map<String, Object> maliciousParams = new HashMap<>();
		StringBuilder messageBuilder = new StringBuilder();

		boolean hasMaliciousSQL = request.getParameterMap().entrySet().stream().anyMatch(entry -> {
			String paramName = entry.getKey();
			List<String> paramValues = Arrays.asList(entry.getValue());
			boolean isMalicious = paramValues.stream().anyMatch(value -> SQL_INJECTION_PATTERN.matcher(value).find());
			if (isMalicious) {
				paramValues.forEach(value -> maliciousParams.put(paramName, value));
			}
			return isMalicious;
		});
		if (hasMaliciousSQL) {
			messageBuilder.append("SQL Injection napad je detektovan. ");
		}

		boolean hasMaliciousXSS = request.getParameterMap().entrySet().stream().anyMatch(entry -> {
			String paramName = entry.getKey();
			List<String> paramValues = Arrays.asList(entry.getValue());
			boolean isMalicious = paramValues.stream().anyMatch(value -> XSS_PATTERN.matcher(value).find());
			if (isMalicious) {
				paramValues.forEach(value -> maliciousParams.put(paramName, value));
			}
			return isMalicious;
		});

		if (hasMaliciousXSS) {
			messageBuilder.append("XSS napad je detektovan.");
		}

		boolean isMalicious = hasMaliciousSQL || hasMaliciousXSS;
		String cause = messageBuilder.toString();

		return new MaliciousRequestCheck(isMalicious, cause, maliciousParams);
	}

	private MaliciousRequestCheck containsMaliciousBody(HttpServletRequest request) throws IOException {
		boolean hasBody = request.getContentLengthLong() > 0 || request.getHeader("Content-Length") != null;
		if (hasBody) {
			ServletInputStream inputStream = request.getInputStream();
			String body = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
			if (body.length() == 0) {
				return new MaliciousRequestCheck(true, "Dužina tijela malicioznog zahtjeva je 0.", null);
			}
			if (body.length() > BUFFER_OVERFLOW_LIMIT) {
				return new MaliciousRequestCheck(true, "Dužina tijela zahtjeva prekoračuje veličinu bafera.", null);
			}
			if (SQL_INJECTION_PATTERN.matcher(body).find()) {
				return new MaliciousRequestCheck(true, "SQL Injection napad je detektovan u tijelu zahtjeva.", null);
			}
			if (XSS_PATTERN.matcher(body).find()) {
				return new MaliciousRequestCheck(true, "XSS napad je detektovan u tijelu zahtjeva.", null);
			}
		}
		return new MaliciousRequestCheck(false, "", null);
	}

	private ResponseEntity<ErrorMessage> logMaliciousRequest(HttpServletRequest request, String cause,
			Map<String, Object> maliciousParams) {
		Map<String, String> messages = new HashMap<>();
		messages.put("cause", cause);
		Map<String, Object> fieldErrors = new HashMap<>();
		if (maliciousParams != null)
			fieldErrors = maliciousParams;
		ErrorMessage message = new ErrorMessage(generateUniqueId(), HttpStatus.FORBIDDEN,
				LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS).toString(), request.getRequestURI(),
				request.getMethod(), request.getRemoteAddr(), messages, fieldErrors);
		loggingService.logErrorMessages(message);
		return new ResponseEntity<>(message, message.getStatus());
	}

	private Integer generateUniqueId() {
		List<ErrorMessage> errorMessages = loggingService.readErrorMessagesFromFile(null, null);
		Optional<Integer> maxId = errorMessages.stream().map(ErrorMessage::getId).max(Integer::compare);
		return maxId.map(id -> id + 1).orElse(1);
	}

	private boolean isRateLimitExceeded(HttpServletRequest request) {
		String ipAddress = request.getRemoteAddr();
		AtomicInteger requestCounter = getRequestCounter(ipAddress);
		long now = System.currentTimeMillis();
		long lastRequestTime = getLastRequestTime(ipAddress);

		if (now - lastRequestTime > interval) {
			requestCounts.put(ipAddress, new AtomicInteger(1));
			lastRequestTimes.put(ipAddress, now);
		} else {
			requestCounter.incrementAndGet();
		}

		if (requestCounter.get() > limit) {
			return true;
		}

		return false;
	}

	private AtomicInteger getRequestCounter(String ipAddress) {
		return requestCounts.computeIfAbsent(ipAddress, k -> new AtomicInteger(0));
	}

	private long getLastRequestTime(String ipAddress) {
		return lastRequestTimes.computeIfAbsent(ipAddress, k -> 0L);
	}

}
