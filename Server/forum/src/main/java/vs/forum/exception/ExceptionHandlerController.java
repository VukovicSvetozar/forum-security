package vs.forum.exception;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;

import lombok.RequiredArgsConstructor;

import vs.forum.service.LoggingService;

@RestControllerAdvice
@RequiredArgsConstructor
public class ExceptionHandlerController {

	private final LoggingService loggingService;

	@ExceptionHandler(AuthenticationFailureException.class)
	@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
	public ResponseEntity<ErrorMessage> authenticationFailureException(AuthenticationFailureException exception,
			HttpServletRequest request) {
		Map<String, String> messages = new HashMap<>();
		messages.put("errorMessage", exception.getMessage());
		Map<String, Object> fieldErrors = new HashMap<>();
		fieldErrors.put(exception.getFieldName(), exception.getFieldError());
		ErrorMessage message = new ErrorMessage(loggingService.generateUniqueId(), HttpStatus.UNAUTHORIZED,
				LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS).toString(), request.getRequestURL().toString(),
				request.getMethod(), request.getRemoteAddr(), messages, fieldErrors);
		loggingService.logErrorMessages(message);
		return new ResponseEntity<>(message, message.getStatus());
	}

	@ExceptionHandler(BadRequestException.class)
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	public ResponseEntity<ErrorMessage> badRequestException(BadRequestException exception, HttpServletRequest request) {
		Map<String, String> messages = new HashMap<>();
		messages.put("errorMessage", exception.getMessage());
		Map<String, Object> fieldErrors = new HashMap<>();
		fieldErrors.put(exception.getFieldName(), exception.getFieldError());
		ErrorMessage message = new ErrorMessage(loggingService.generateUniqueId(), HttpStatus.BAD_REQUEST,
				LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS).toString(), request.getRequestURL().toString(),
				request.getMethod(), request.getRemoteAddr(), messages, fieldErrors);
		loggingService.logErrorMessages(message);
		return new ResponseEntity<>(message, message.getStatus());
	}

	@ExceptionHandler(BannedUserException.class)
	@ResponseStatus(value = HttpStatus.FORBIDDEN)
	public ResponseEntity<ErrorMessage> bannedUserException(BannedUserException exception, HttpServletRequest request) {
		Map<String, String> messages = new HashMap<>();
		messages.put("errorMessage", exception.getMessage());
		Map<String, Object> fieldErrors = new HashMap<>();
		fieldErrors.put(exception.getFieldName(), exception.getFieldError());
		ErrorMessage message = new ErrorMessage(loggingService.generateUniqueId(), HttpStatus.FORBIDDEN,
				LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS).toString(), request.getRequestURL().toString(),
				request.getMethod(), request.getRemoteAddr(), messages, fieldErrors);
		loggingService.logErrorMessages(message);
		return new ResponseEntity<>(message, message.getStatus());
	}

	@ExceptionHandler(EntityNotFoundException.class)
	@ResponseStatus(value = HttpStatus.NOT_FOUND)
	public ResponseEntity<ErrorMessage> entityNotFoundException(EntityNotFoundException exception,
			HttpServletRequest request) {
		Map<String, String> messages = new HashMap<>();
		messages.put("errorMessage", exception.getMessage());
		Map<String, Object> fieldErrors = new HashMap<>();
		fieldErrors.put(exception.getFieldName(), exception.getFieldError());
		ErrorMessage message = new ErrorMessage(loggingService.generateUniqueId(), HttpStatus.NOT_FOUND,
				LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS).toString(), request.getRequestURL().toString(),
				request.getMethod(), request.getRemoteAddr(), messages, fieldErrors);
		loggingService.logErrorMessages(message);
		return new ResponseEntity<>(message, message.getStatus());
	}

	@ExceptionHandler(NameConflictException.class)
	@ResponseStatus(value = HttpStatus.CONFLICT)
	public ResponseEntity<ErrorMessage> handleNameConflict(NameConflictException exception,
			HttpServletRequest request) {
		Map<String, String> messages = new HashMap<>();
		messages.put("errorMessage", exception.getMessage());
		Map<String, Object> fieldErrors = new HashMap<>();
		fieldErrors.put(exception.getFieldName(), exception.getFieldError());
		ErrorMessage message = new ErrorMessage(loggingService.generateUniqueId(), HttpStatus.CONFLICT,
				LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS).toString(), request.getRequestURL().toString(),
				request.getMethod(), request.getRemoteAddr(), messages, fieldErrors);
		loggingService.logErrorMessages(message);
		return new ResponseEntity<>(message, message.getStatus());
	}

	@ExceptionHandler(Exception.class)
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	public ResponseEntity<ErrorMessage> generalExceptionHandling(Exception exception, HttpServletRequest request) {
		Map<String, String> messages = new HashMap<>();
		Map<String, Object> fieldErrors = new HashMap<>();
		if (exception instanceof MethodArgumentNotValidException) {
			MethodArgumentNotValidException methodArgumentException = (MethodArgumentNotValidException) exception;
			for (FieldError error : methodArgumentException.getBindingResult().getFieldErrors()) {
				messages.put(error.getField(), error.getDefaultMessage());
				fieldErrors.put(error.getField(), error.getRejectedValue());
			}
		} else if (exception instanceof ConstraintViolationException) {
			ConstraintViolationException constraintViolationException = (ConstraintViolationException) exception;
			constraintViolationException.getConstraintViolations().forEach(constraint -> {
				String fullPath = constraint.getPropertyPath().toString();
				String fieldName = fullPath.substring(fullPath.lastIndexOf('.') + 1);
				messages.put(fieldName, constraint.getMessage());
				fieldErrors.put("invalidValue", constraint.getInvalidValue());
			});
		} else if (exception instanceof HttpMessageNotReadableException) {
			Throwable cause = exception.getCause();
			if (cause != null && cause instanceof InvalidFormatException) {
				messages.put("errorMessage", ((InvalidFormatException) cause).getOriginalMessage());
				fieldErrors.put("invalidValue", ((InvalidFormatException) cause).getValue().toString());
			} else {
				messages.put("errorMessage", "Greška. Http poruka nije čitljiva.");
				messages.put("errorMessage", exception.getMessage());
			}
			messages.put("exception", exception.getClass().getCanonicalName());
		} else {
			messages.put("errorMessage", "Greška na serverskoj strani.");
			messages.put("exception", exception.getClass().getCanonicalName());
		}
		ErrorMessage message = new ErrorMessage(loggingService.generateUniqueId(), HttpStatus.INTERNAL_SERVER_ERROR,
				LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS).toString(), request.getRequestURL().toString(),
				request.getMethod(), request.getRemoteAddr(), messages, fieldErrors);
		loggingService.logErrorMessages(message);
		return new ResponseEntity<>(message, message.getStatus());
	}

}
