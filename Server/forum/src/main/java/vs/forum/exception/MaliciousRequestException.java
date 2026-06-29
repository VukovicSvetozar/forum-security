package vs.forum.exception;

import lombok.Getter;

public class MaliciousRequestException  extends RuntimeException {

	private static final long serialVersionUID = 863190698083069874L;

	@Getter
	private final String fieldName;

	@Getter
	private final String fieldError;

	public MaliciousRequestException (String message, String fieldName, String fieldError) {
		super(message);
		this.fieldName = fieldName;
		this.fieldError = fieldError;
	}

}
