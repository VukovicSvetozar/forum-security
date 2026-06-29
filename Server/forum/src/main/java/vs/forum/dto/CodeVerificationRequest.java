package vs.forum.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CodeVerificationRequest {

	@NotBlank(message = "Korisničko ime je obavezno.")
	@Pattern(regexp = "^[a-zA-Z0-9_]*$", message = "Korisničko ime može sadržavati samo slova, brojeve i donje crte.")
	@Size(min = 3, max = 30, message = "Korisničko ime mora imati između 3 i 30 karaktera.")
	private String username;

	@NotNull(message = "Tajni kod je obavezan.")
	@Digits(integer = 6, fraction = 0, message = "Kod mora imati tačno 6 cifara.")
	private Integer secretCode;
	
	@NotBlank(message = "Login JWT token je obavezan.")
	private String loginJwtToken;

}
