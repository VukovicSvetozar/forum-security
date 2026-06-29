package vs.forum.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LogDataResponse {

	@PastOrPresent(message = "Vrijeme log poruke treba da bude u sadašnjosti ili prošlosti.")
	private LocalDateTime date;

	@NotNull(message = "Poruka je obavezna.")
	private String message;

	@NotBlank(message = "Tip je obavezan.")
	@Pattern(regexp = "^[a-zA-Z]*$", message = "Tip može sadržavati samo slova.")
	@Size(min = 3, max = 10, message = "Tip mora imati između 3 i 10 karaktera.")
	private String type;

}
