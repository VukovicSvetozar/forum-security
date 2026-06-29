package vs.forum.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class BlacklistJwtService {

	private final RedisTemplate<String, Object> redisTemplate;

	@Value("${application.security.redis.maxattempts}")
	private int maxAttempts;

	@Value("${application.security.redis.keyprefix}")
	private String maliciousRequestsKeyPrefix;

	public BlacklistJwtService(RedisTemplate<String, Object> redisTemplate) {
		this.redisTemplate = redisTemplate;
	}

	public void blacklistToken(String token) {
		redisTemplate.opsForValue().set(token, true, 1, TimeUnit.HOURS);
	}

	public boolean isTokenBlacklisted(String token) {
		return Boolean.TRUE.equals(redisTemplate.opsForValue().get(token));
	}

	public void recordMaliciousRequest(String username) {
		String key = maliciousRequestsKeyPrefix + username;
		Integer attempts = (Integer) redisTemplate.opsForValue().get(key);
		if (attempts == null) {
			attempts = 0;
		}
		attempts++;
		redisTemplate.opsForValue().set(key, attempts, 1, TimeUnit.HOURS);
		if (attempts >= maxAttempts) {
			blacklistToken(username);
		}
	}

	public boolean hasReachedMaxAttempts(String username) {
		String key = maliciousRequestsKeyPrefix + username;
		Integer attempts = (Integer) redisTemplate.opsForValue().get(key);
		return attempts != null && attempts >= maxAttempts;
	}

}
