package vs.forum.security;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

import vs.forum.entity.User;
import vs.forum.exception.AuthenticationFailureException;
import vs.forum.exception.EntityNotFoundException;
import vs.forum.repository.UserRepository;

@RequiredArgsConstructor
@Component
public class CredentialsAuthenticationProvider implements AuthenticationProvider {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		String username = authentication.getName();
		String password = authentication.getCredentials().toString();
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen.", "username", username));
		if (!passwordEncoder.matches(password, user.getPassword())) {
			throw new AuthenticationFailureException("Neispravna lozinka.", "password", password);
		}
		return new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return authentication.equals(UsernamePasswordAuthenticationToken.class);
	}

}
