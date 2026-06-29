package vs.forum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentCorrectionRequest {

	@NotNull(message = "Id je obavezan.")
	@Positive(message = "Id treba da je pozitivan cijeli broj.")
	private Integer id;

	@NotBlank(message = "Sadržaj komentara je obavezan.")
	@Size(min = 3, max = 300, message = "Sadržaj komentara mora imati između 3 i 300 karaktera.")
	@Pattern(regexp = "^[a-zA-Z0-9_ .,!?čćžđšČĆŽĐŠ\\s]*", message = "Sadržaj komentara nije u skladu sa sigurnosnim zahtjevima.")
	private String content;

	@NotBlank(message = "Korisničko ime je obavezno.")
	@Pattern(regexp = "^[a-zA-Z0-9_]*$", message = "Korisničko ime može sadržavati samo slova, brojeve i donje crte.")
	@Size(min = 3, max = 30, message = "Korisničko ime mora imati između 3 i 30 karaktera.")
	private String correctionUsername;

	@NotBlank(message = "Korisničko ime je obavezno.")
	@Pattern(regexp = "^[a-zA-Z0-9_]*$", message = "Korisničko ime može sadržavati samo slova, brojeve i donje crte.")
	@Size(min = 3, max = 30, message = "Korisničko ime mora imati između 3 i 30 karaktera.")
	private String commentCreatorUsername;

}
