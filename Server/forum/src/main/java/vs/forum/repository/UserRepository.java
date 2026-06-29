package vs.forum.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import vs.forum.entity.Group;
import vs.forum.entity.Status;
import vs.forum.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

	Optional<User> findByUsername(String username);

	Optional<User> findByEmail(String email);

	boolean existsByUsername(String username);

	boolean existsByEmail(String email);

	List<User> findByGroup(Group group);

	List<User> findByStatus(Status status);

	List<User> findByGroupAndStatus(Group group, Status status);

	List<User> findByStatusAndSuspendExpirationBefore(Status status, LocalDate date);

}
