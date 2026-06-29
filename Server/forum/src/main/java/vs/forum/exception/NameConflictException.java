package vs.forum.exception;

import lombok.Getter;

public class NameConflictException extends RuntimeException {

	private static final long serialVersionUID = -71070777243755139L;

	@Getter
	private final String fieldName;

	@Getter
	private final String fieldError;

	public NameConflictException(String message, String fieldName, String fieldError) {
		super(message);
		this.fieldName = fieldName;
		this.fieldError = fieldError;
	}
}
