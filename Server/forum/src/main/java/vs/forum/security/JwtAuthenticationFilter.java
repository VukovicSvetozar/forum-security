package vs.forum.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import vs.forum.entity.Status;
import vs.forum.entity.User;
import vs.forum.exception.AuthenticationFailureException;
import vs.forum.exception.BadRequestException;
import vs.forum.exception.ErrorMessage;
import vs.forum.service.LoggingService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;

import io.jsonwebtoken.ExpiredJwtException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final UserDetailsService userDetailsService;
	private final JwtService jwtService;
	private final BlacklistJwtService blacklistJwtService;
	private final LoggingService loggingService;

	@Value("${application.security.jwt.header.name}")
	private String HeaderAuthorization;

	@Value("${application.security.jwt.header.prefix}")
	private String headerPrefix;

	@Override
	protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain) throws ServletException, IOException {
		String username = null;
		try {
			if (request.getServletPath().contains("/api/public")) {
				ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
				filterChain.doFilter(wrappedRequest, response);
				return;
			}

			final String authHeader = request.getHeader(HeaderAuthorization);
			final String jwt;
			if (authHeader == null || !authHeader.startsWith("Bearer ")) {
				filterChain.doFilter(request, response);
				return;
			}
			jwt = authHeader.substring(7);
			username = jwtService.extractUsername(jwt);

			if (blacklistJwtService.isTokenBlacklisted(jwt)) {
				logMessage(request, null, HttpStatus.FORBIDDEN, "Token je na crnoj listi.", username);
				response.sendError(HttpServletResponse.SC_FORBIDDEN, "Token je na crnoj listi.");
				return;
			}

			UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

			if (((User) userDetails).getStatus() == Status.SUSPENDED)
				throw new BadRequestException("Nemate pristup jer ste banovani.", "status",
						Status.SUSPENDED.toString());
			if (username == null)
				throw new AuthenticationFailureException("Korisničko ime nije pronađen.", "username", username);
			if (!jwtService.isTokenValid(jwt, userDetails))
				throw new AuthenticationFailureException("Nevalidan jwt.", "jwt", jwt);
			if (SecurityContextHolder.getContext().getAuthentication() == null) {
				UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
						null, userDetails.getAuthorities());
				authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContext context = SecurityContextHolder.createEmptyContext();
				context.setAuthentication(authToken);
				SecurityContextHolder.setContext(context);
			}
			filterChain.doFilter(request, response);
		} catch (ExpiredJwtException e) {
			logMessage(request, e, HttpStatus.UNAUTHORIZED, "Token je istekao.", username);
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType("application/json");
			response.getWriter().write("{\"message\": \"Token has expired.\"}");
			response.getWriter().flush();
			return;
		} catch (Exception e) {
			logMessage(request, e, HttpStatus.BAD_REQUEST, "Greška tokom rada jwt filtera.", username);
		}
	}

	private void logMessage(HttpServletRequest request, Exception exception, HttpStatus status, String message,
			String field) {
		Map<String, String> messages = new HashMap<>();
		if (exception != null)
			messages.put("errorMessage", exception.getMessage());
		messages.put("message", message);
		Map<String, Object> fieldErrors = new HashMap<>();
		if (field != null)
			fieldErrors.put("username", field);
		ErrorMessage errorMessage = new ErrorMessage(loggingService.generateUniqueId(), status,
				LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS).toString(), request.getRequestURL().toString(),
				request.getMethod(), request.getRemoteAddr(), messages, fieldErrors);
		loggingService.logErrorMessages(errorMessage);
	}

}
