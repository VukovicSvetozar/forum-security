package vs.forum.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.RequiredArgsConstructor;

import vs.forum.exception.EntityNotFoundException;
import vs.forum.repository.UserRepository;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class ApplicationConfiguration {

	private final UserRepository userRepository;

	@Bean
	UserDetailsService userDetailsService() {
		return username -> {
			return userRepository.findByUsername(username)
					.orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronadjen.", "username", username));
		};
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration AuthenticationConfiguration)
			throws Exception {
		return AuthenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
		RedisTemplate<String, Object> template = new RedisTemplate<>();
		template.setConnectionFactory(connectionFactory);
		template.setKeySerializer(new StringRedisSerializer());
		template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
		return template;
	}

}
