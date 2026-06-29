package vs.forum.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import vs.forum.entity.Group;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserVerificationRequest {

	@NotNull(message = "Id korisnika je obavezan.")
	@Positive(message = "Id korisnika treba da je pozitivan cijeli broj.")
	private Integer userId;

	@NotNull(message = " Postavljanje odobrenja je obavezno.")
	private Boolean approved;

	@NotNull(message = "Naziv grupe je obavezan.")
	private Group group;

}
