package vs.forum.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import vs.forum.dto.LogDataResponse;
import vs.forum.exception.EntityNotFoundException;
import vs.forum.exception.ErrorMessage;

@Service
@RequiredArgsConstructor
public class LoggingService {

	private static final Logger lOGGER = LoggerFactory.getLogger(LoggingService.class);
	private static final String LOG_DIRECTORY = "log/";
	private static final String LOG_FILE = "logError.json";

	private final ObjectMapper objectMapper;

	public List<LogDataResponse> getDataLogs(String logLevelInfo, String logLevelTrace, String logLevelDebug,
			String logLevelWarn, String logLevelError, String logLevelFatal, String startTime, String endTime)
			throws IOException {

		StringBuilder logContent = new StringBuilder();
		StringBuilder filteredContent = new StringBuilder();

		try (Stream<Path> fileStream = Files.list(Paths.get(LOG_DIRECTORY))) {
			fileStream.filter(path -> path.getFileName().toString().matches(".*\\.log.*")).forEach(path -> {
				try {
					String loadedContent = Files.readString(path, StandardCharsets.UTF_8);
					logContent.append(loadedContent).append("\n");
				} catch (IOException e) {
					lOGGER.error("Greška pri čitanju datoteka o log podacima", e);
				}
			});
		} catch (IOException e) {
			lOGGER.error("Greška. Nije pronađen direktorijum o log podacima", e);
		}
		try {
			String[] logLines = logContent.toString().split(System.lineSeparator());
			for (String line : logLines) {
				if (!line.contains("java.base")) {
					if (filteringDataLogs(line, logLevelInfo, logLevelTrace, logLevelDebug, logLevelWarn, logLevelError,
							logLevelFatal, startTime, endTime)) {
						filteredContent.append(line).append(System.lineSeparator());
					}
				}
			}
		} catch (Exception e) {
			lOGGER.error("Greška tokom rada sa log podacima.", e);
		}

		List<LogDataResponse> logDataResponses = new ArrayList<>();
		String[] lines = filteredContent.toString().split("\n");
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
		for (String line : lines) {
			if (line.isEmpty())
				continue;
			try {

				String[] parts = line.split("#");

				LocalDateTime date = LocalDateTime.parse(parts[0].trim(), formatter);
				String type = parts[1].trim();
				String message = parts[2].trim();
				logDataResponses.add(new LogDataResponse(date, message, type));
			} catch (Exception e) {
				continue;
			}
		}
		return logDataResponses;
	}

	private boolean filteringDataLogs(String logLine, String logLevelInfo, String logLevelTrace, String logLevelDebug,
			String logLevelWarn, String logLevelError, String logLevelFatal, String startTime, String endTime) {

		if (logLine.isBlank())
			return false;

		boolean successfully = false;

		try {
			String logLevel = logLine.split("#")[1].trim();

			String[] logLevels = { logLevelInfo, logLevelTrace, logLevelDebug, logLevelWarn, logLevelError,
					logLevelFatal };

			successfully = Arrays.stream(logLevels).allMatch(element -> element == null) || Arrays.stream(logLevels)
					.filter(element -> element != null).anyMatch(element -> element.equalsIgnoreCase(logLevel));

			if (successfully) {
				if (startTime != null && endTime != null && !startTime.isEmpty() && !endTime.isEmpty()) {
					DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
					String logDateTimeString = logLine.split("#")[0].trim().replace(" ", "T");
					LocalDateTime logDateTime = LocalDateTime.parse(logDateTimeString, formatter);
					LocalDateTime startDateTime = LocalDateTime.parse(startTime, formatter);
					LocalDateTime endDateTime = LocalDateTime.parse(endTime, formatter);
					if (logDateTime.isBefore(startDateTime) || logDateTime.isAfter(endDateTime)) {
						successfully = false;
					}
				}
			}
		} catch (Exception e) {
			return false;
		}
		return successfully;
	}

	public void logErrorMessages(ErrorMessage errorMessage) {
		lOGGER.warn("Handling exception: " + errorMessage);
		Path logFilePath = Paths.get(LOG_DIRECTORY, LOG_FILE);
		try {
			List<ErrorMessage> errorMessages = readErrorMessagesFromFile(null, null);
			errorMessages.add(errorMessage);
			String jsonLogEntries = objectMapper.writeValueAsString(errorMessages);
			Files.write(logFilePath, jsonLogEntries.getBytes(), StandardOpenOption.CREATE,
					StandardOpenOption.TRUNCATE_EXISTING);
		} catch (IOException e) {
			lOGGER.error("Greška tokom ispisivanja poruke o grešci u fajl.", e);
		}
	}

	public List<ErrorMessage> readErrorMessagesFromFile(String startTime, String endTime) {
		List<ErrorMessage> errorMessages = new ArrayList<>();
		Path logFilePath = Paths.get(LOG_DIRECTORY, LOG_FILE);
		DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
		try {
			if (Files.exists(logFilePath) && Files.size(logFilePath) > 0) {
				byte[] jsonData = Files.readAllBytes(logFilePath);
				errorMessages = objectMapper.readValue(jsonData, new TypeReference<List<ErrorMessage>>() {
				});
			}
			LocalDateTime startDateTime = startTime != null ? LocalDateTime.parse(startTime, formatter) : null;
			LocalDateTime endDateTime = endTime != null ? LocalDateTime.parse(endTime, formatter) : null;
			if (startDateTime != null && endDateTime != null) {
				errorMessages = errorMessages.stream().filter(errorMessage -> {
					LocalDateTime errorTime = LocalDateTime.parse(errorMessage.getTime(), formatter);
					return !errorTime.isBefore(startDateTime) && !errorTime.isAfter(endDateTime);
				}).collect(Collectors.toList());
			}
		} catch (IOException e) {
			lOGGER.error("Greška tokom čitanja poruka o grešci iz fajla.", e);
		}
		return errorMessages;
	}

	public ErrorMessage getErrorMessage(Integer id) {
		List<ErrorMessage> errorMessages = readErrorMessagesFromFile(null, null);
		ErrorMessage errorMessage = errorMessages.stream().filter(em -> em.getId() == id).findFirst().orElseThrow(
				() -> new EntityNotFoundException("Poruka o grešci nije pronađena.", "id", String.valueOf(id)));
		return errorMessage;
	}

	public Integer generateUniqueId() {
		List<ErrorMessage> errorMessages = readErrorMessagesFromFile(null, null);
		Optional<Integer> maxId = errorMessages.stream().map(ErrorMessage::getId).max(Integer::compare);
		return maxId.map(id -> id + 1).orElse(1);
	}

}
