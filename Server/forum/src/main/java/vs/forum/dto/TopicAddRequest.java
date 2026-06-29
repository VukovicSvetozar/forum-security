package vs.forum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TopicAddRequest {

	@NotBlank(message = "Naziv teme je obavezan.")
	@Pattern(regexp = "^[a-zA-Z0-9_]*$", message = "Naziv teme  može sadržavati samo slova, brojeve i donje crte.")
	@Size(min = 3, max = 100, message = "Naziv teme  mora imati između 3 i 100 karaktera.")
	private String name;

	@Pattern(regexp = "^assets/topics/\\d+\\.png$", message = "Pogrešan URL format za sliku.")
	private String imageUrl;

}
