package vs.forum.dto;

import java.util.Set;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangePermissionsRequest {

	@NotNull(message = "Id korisnika je obavezan.")
	@Positive(message = "Id korisnika treba da je pozitivan cijeli broj.")
	private Integer userId;

	private Set<String> newPermissions;

}
