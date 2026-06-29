package vs.forum.security;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MaliciousRequestCheck {

	private boolean isMalicious;

	private String cause;

	private Map<String, Object> maliciousParams;

}
