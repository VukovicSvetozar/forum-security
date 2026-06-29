package vs.forum.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SuspendUserRequest {

	@NotNull(message = "Id korisnika je obavezan.")
	@Positive(message = "Id korisnika treba da je pozitivan cijeli broj.")
	private Integer userId;

	@Future(message = "Odabrano vrijeme treba da bude u budućnosti.")
	private LocalDate suspendExpiration;

}
