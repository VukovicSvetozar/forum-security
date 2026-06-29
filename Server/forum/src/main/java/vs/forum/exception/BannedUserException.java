package vs.forum.exception;

import lombok.Getter;

public class BannedUserException extends RuntimeException {

	private static final long serialVersionUID = 863190698083069874L;

	@Getter
	private final String fieldName;

	@Getter
	private final String fieldError;

	public BannedUserException(String message, String fieldName, String fieldError) {
		super(message);
		this.fieldName = fieldName;
		this.fieldError = fieldError;
	}

}
