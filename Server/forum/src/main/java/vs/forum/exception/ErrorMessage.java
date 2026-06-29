package vs.forum.exception;

import java.io.Serializable;
import java.util.Map;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorMessage implements Serializable {

	private static final long serialVersionUID = 8627880734745764532L;

	private Integer id;
	private HttpStatus status;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private String time;
	private String requestUrl;
	private String method;
	private String clientIp;
	private Map<String, String> messages;
	private Map<String, Object> fieldErrors;

	@Override
	public String toString() {
		return "ErrorMessage{" + "id=" + id + ", status=" + status + ", time=" + time + ", requestUrl='" + requestUrl
				+ '\'' + ", method='" + method + '\'' + ", clientIp='" + clientIp + '\'' + ", messages=" + messages
				+ ", fieldErrors=" + fieldErrors + '}';
	}

}
