package vs.forum.exception;

import lombok.Getter;

public class BadRequestException extends RuntimeException {

	private static final long serialVersionUID = -6662720563129773521L;

	@Getter
	private final String fieldName;

	@Getter
	private final String fieldError;

	public BadRequestException(String message, String fieldName, String fieldError) {
		super(message);
		this.fieldName = fieldName;
		this.fieldError = fieldError;
	}

}
