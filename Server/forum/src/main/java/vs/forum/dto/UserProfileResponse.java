package vs.forum.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponse {

	@NotBlank(message = "Korisničko ime je obavezno.")
	@Pattern(regexp = "^[a-zA-Z0-9_]*$", message = "Korisničko ime može sadržavati samo slova, brojeve i donje crte.")
	@Size(min = 3, max = 30, message = "Korisničko ime mora imati između 3 i 30 karaktera.")
	private String username;

	@NotBlank(message = "Email je obavezan.")
	@Email(message = "Pogrešan format za email.")
	@Size(max = 100, message = "Email može imati maksimalno 100 karaktera.")
	private String email;

	@Pattern(regexp = "^assets/avatars/\\d+\\.png$", message = "Pogrešan URL format za avatar.")
	private String avatarUrl;

}
