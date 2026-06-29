package vs.forum.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import vs.forum.entity.Comment;
import vs.forum.entity.Topic;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

	List<Comment> findAllByTopicOrderByPostedTime(Topic topic);

	Page<Comment> findAllByTopicOrderByPostedTime(Topic topic, Pageable pageable);

}
