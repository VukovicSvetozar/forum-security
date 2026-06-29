package vs.forum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OAuth2Request {

	@NotBlank(message = "Kod je obavezan.")
	@Pattern(regexp = "^[a-zA-Z0-9_]*$", message = "Kod može sadržavati samo slova, brojeve i donje crte.")
	@Size(min = 3, max = 30, message = "Kod mora imati između 3 i 30 karaktera.")
	private String code;
}
