package vs.forum.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TopicDataResponse {

	@NotNull(message = "Id teme je obavezan.")
	@Positive(message = "Id teme treba da je pozitivan cijeli broj.")
	private Integer id;

	@NotBlank(message = "Naziv teme je obavezan.")
	@Pattern(regexp = "^[a-zA-Z0-9_]*$", message = "Naziv teme  može sadržavati samo slova, brojeve i donje crte.")
	@Size(min = 3, max = 100, message = "Naziv teme  mora imati između 3 i 100 karaktera.")
	private String name;

	@Pattern(regexp = "^assets/topics/\\d+\\.png$", message = "Pogrešan URL format za sliku.")
	private String imageUrl;

	@PositiveOrZero(message = "Broj komentara teme treba da je pozitivan cijeli broj ili nula.")
	private Integer totalComments;

	@Past(message = "Prikazano vrijeme poslednjeg komentara treba da bude u prošlosti.")
	private LocalDateTime lastCommentTime;

}
