package vs.forum.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import vs.forum.entity.Group;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoResponse {

	@NotNull(message = "Id korisnika je obavezan.")
	@Positive(message = "Id korisnika treba da je pozitivan cijeli broj.")
	private Integer id;

	@NotBlank(message = "Korisničko ime je obavezno.")
	@Pattern(regexp = "^[a-zA-Z0-9_]*$", message = "Korisničko ime može sadržavati samo slova, brojeve i donje crte.")
	@Size(min = 3, max = 30, message = "Korisničko ime mora imati između 3 i 30 karaktera.")
	private String username;

	@NotBlank
	@Email
	@Size(max = 100)
	private String email;

	@Pattern(regexp = "^assets/avatars/\\d+\\.png$", message = "Pogrešan URL format za avatar.")
	private String avatarUrl;

	@NotNull(message = "Naziv grupe je obavezan.")
	private Group group;

	@PastOrPresent(message = "Odabrano vrijeme treba da bude u sadašnjosti ili prošlosti.")
	private LocalDate accessDate;

	@PastOrPresent(message = "Odabrano vrijeme treba da bude u sadašnjosti ili prošlosti.")
	private LocalDate lastVisit;

	@Positive(message = "Broj postova treba da je pozitivan cijeli broj ili nula.")
	private Integer totalPosts;

}
