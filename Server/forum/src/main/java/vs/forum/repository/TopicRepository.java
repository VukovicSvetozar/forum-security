package vs.forum.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vs.forum.entity.Topic;

public interface TopicRepository extends JpaRepository<Topic, Integer> {

	boolean existsByName(String name);

	List<Topic> findByActiveTrue();

	@Query("SELECT COUNT(c) FROM Topic t LEFT JOIN t.comments c WHERE t.id = :topicId")
	Integer countCommentsById(@Param("topicId") Integer topicId);

	@Query("SELECT MAX(c.postedTime) FROM Topic t LEFT JOIN t.comments c WHERE t.id = :topicId")
	LocalDateTime findLastPostedTimeByTopicId(@Param("topicId") Integer topicId);

}
