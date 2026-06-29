package vs.forum.exception;

import lombok.Getter;

public class EntityNotFoundException extends RuntimeException {

	private static final long serialVersionUID = -6343162659756484076L;

	@Getter
	private final String fieldName;

	@Getter
	private final String fieldError;

	public EntityNotFoundException(String message, String fieldName, String fieldError) {
		super(message);
		this.fieldName = fieldName;
		this.fieldError = fieldError;
	}

}
