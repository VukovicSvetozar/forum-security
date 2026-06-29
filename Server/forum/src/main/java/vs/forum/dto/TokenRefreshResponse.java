package vs.forum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vs.forum.entity.Group;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TokenRefreshResponse {

	@NotBlank(message = "Korisničko ime je obavezno.")
	@Pattern(regexp = "^[a-zA-Z0-9_]*$", message = "Korisničko ime može sadržavati samo slova, brojeve i donje crte.")
	@Size(min = 3, max = 30, message = "Korisničko ime mora imati između 3 i 30 karaktera.")
	private String username;

	@NotNull(message = "Naziv grupe je obavezan.")
	private Group group;
	
	@Pattern(regexp = "^assets/avatars/\\d+\\.png$", message = "Pogrešan URL format za avatar.")
	private String avatarUrl;

	@NotBlank(message = "JWT token je obavezan.")
	private String jwtToken;

	@NotBlank(message = "Refresh JWT token je obavezan.")
	private String refreshJwtToken;

}
