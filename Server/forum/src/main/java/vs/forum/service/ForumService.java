package vs.forum.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.RequiredArgsConstructor;
import vs.forum.dto.CommentAddRequest;
import vs.forum.dto.CommentCorrectionRequest;
import vs.forum.dto.CommentCorrectionResponse;
import vs.forum.dto.CommentDeleteRequest;
import vs.forum.dto.CommentInfoResponse;
import vs.forum.dto.TopicAddRequest;
import vs.forum.dto.TopicChangeRequest;
import vs.forum.dto.TopicDataResponse;
import vs.forum.dto.TopicInfoResponse;
import vs.forum.entity.Comment;
import vs.forum.entity.Topic;
import vs.forum.entity.User;
import vs.forum.exception.BadRequestException;
import vs.forum.exception.EntityNotFoundException;
import vs.forum.exception.NameConflictException;
import vs.forum.repository.CommentRepository;
import vs.forum.repository.TopicRepository;
import vs.forum.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class ForumService {

	private final UserRepository userRepository;
	private final CommentRepository commentRepository;
	private final TopicRepository topicRepository;
	private final ModelMapper modelMapper;

// Komentari

	public void addComment(CommentAddRequest request) {
		User user = userRepository.findByUsername(request.getUsername()).orElseThrow(
				() -> new EntityNotFoundException("Korisnik nije pronađen.", "username", request.getUsername()));
		Topic topic = topicRepository.findById(request.getTopicId())
				.orElseThrow(() -> new EntityNotFoundException("Navedena tema ne postoji.", "topicId",
						String.valueOf(request.getTopicId())));
		if (!topic.isActive())
			throw new BadRequestException("Tema je arhivirana.", "active", String.valueOf(false));
		user.setTotalPosts(user.getTotalPosts() + 1);
		userRepository.saveAndFlush(user);
		Comment comment = Comment.builder().content(request.getContent())
				.postedTime(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS)).user(user).topic(topic).build();
		commentRepository.saveAndFlush(comment);
	}

	public CommentCorrectionResponse correctComment(CommentCorrectionRequest request) {
		if (!userRepository.existsByUsername(request.getCorrectionUsername()))
			throw new EntityNotFoundException("Korisnik nije pronađen.", "username", request.getCorrectionUsername());
		User creatorUser = userRepository.findByUsername(request.getCommentCreatorUsername())
				.orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen.", "username",
						request.getCommentCreatorUsername()));
		Comment comment = commentRepository.findById(request.getId()).orElseThrow(
				() -> new EntityNotFoundException("Komentar nije pronađen.", "id", String.valueOf(request.getId())));
		Topic topic = topicRepository.findById(comment.getTopic().getId())
				.orElseThrow(() -> new EntityNotFoundException("Odabrana tema ne postoji.", "topicId",
						String.valueOf(comment.getTopic().getId())));
		if (!topic.isActive())
			throw new BadRequestException("Tema je arhivirana.", "active", String.valueOf(false));
		Comment correctedComment = Comment.builder().id(comment.getId()).content(request.getContent())
				.postedTime(comment.getPostedTime()).correctionTime(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
				.correctionUsername(request.getCorrectionUsername()).user(creatorUser).topic(comment.getTopic())
				.build();
		commentRepository.saveAndFlush(correctedComment);
		return modelMapper.map(correctedComment, CommentCorrectionResponse.class);
	}

	public void deleteComment(CommentDeleteRequest request) {
		Comment comment = commentRepository.findById(request.getId()).orElseThrow(
				() -> new EntityNotFoundException("Komentar nije pronađen.", "id", String.valueOf(request.getId())));
		Topic topic = topicRepository.findById(comment.getTopic().getId())
				.orElseThrow(() -> new EntityNotFoundException("Odabrana tema ne postoji.", "topicId",
						String.valueOf(comment.getTopic().getId())));
		if (!topic.isActive())
			throw new BadRequestException("Tema je arhivirana.", "active", String.valueOf(false));
		if (!commentRepository.existsById(request.getId()))
			throw new EntityNotFoundException("Komentar nije pronađen.", "id", String.valueOf(request.getId()));
		commentRepository.deleteById(request.getId());
	}

	public Map<String, Object> getAllCommentsByTopic(Integer topicId, @RequestParam(defaultValue = "0") int currentPage,
			@RequestParam(defaultValue = "20") int elementsPerPage) {

		Topic topic = topicRepository.findById(topicId).orElseThrow(
				() -> new EntityNotFoundException("Odabrana tema ne postoji.,", "topicId", String.valueOf(topicId)));

		Map<String, Object> response = new HashMap<>();
		List<Comment> commentsList = new ArrayList<>();

		Pageable pageable = PageRequest.of(currentPage, elementsPerPage);
		Page<Comment> pageComments = commentRepository.findAllByTopicOrderByPostedTime(topic, pageable);
		commentsList = pageComments.getContent();

		List<CommentInfoResponse> commentInfoList = commentsList.stream().map(this::mapCommentsToDTOs)
				.collect(Collectors.toList());

		response.put("comments", commentInfoList);
		response.put("currentPage", pageComments.getNumber());
		response.put("totalElements", pageComments.getTotalElements());
		response.put("totalPages", pageComments.getTotalPages());

		return response;
	}

	public CommentInfoResponse getCommentInfo(Integer id) {
		Comment comment = commentRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Komentar nije pronađen.", "id", String.valueOf(id)));
		return modelMapper.map(comment, CommentInfoResponse.class);
	}

	private CommentInfoResponse mapCommentsToDTOs(Comment comment) {
		CommentInfoResponse dto = modelMapper.map(comment, CommentInfoResponse.class);
		User user = userRepository.findById(comment.getUser().getId())
				.orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen", "id",
						String.valueOf(comment.getUser().getId())));
		dto.setId(comment.getId());
		dto.setUserId(user.getId());
		dto.setUsername(user.getUsername());
		dto.setAvatarUrl(user.getAvatarUrl());
		dto.setAccessDate(user.getAccessDate());
		dto.setTotalPosts(user.getTotalPosts());
		return dto;
	}

// Teme

	public void createTopic(TopicAddRequest request) {
		if (topicRepository.existsByName(request.getName()))
			throw new NameConflictException("Naziv teme je zauzet.", "name", request.getName());
		Topic topic = Topic.builder().name(request.getName()).imageUrl(request.getImageUrl()).active(true).build();
		topicRepository.saveAndFlush(topic);
	}

	public boolean checkTopicNameAvailability(String name) {
		return !topicRepository.existsByName(name);
	}

	public List<TopicInfoResponse> getTopicInfoList() {
		List<Topic> topics = topicRepository.findAll();
		return topics.stream().map(this::mapTopicEntityToDTOInfo).collect(Collectors.toList());
	}

	public TopicInfoResponse getTopicInfo(Integer id) {
		Topic topic = topicRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Navedena tema ne postoji.", "id", String.valueOf(id)));
		return modelMapper.map(topic, TopicInfoResponse.class);
	}

	public void changeTopic(TopicChangeRequest request) {
		Topic topic = topicRepository.findById(request.getId()).orElseThrow(
				() -> new EntityNotFoundException("Navedena tema ne postoji.", "id", String.valueOf(request.getId())));
		if (!topic.getName().equals(request.getName()))
			if (topicRepository.existsByName(request.getName()))
				throw new NameConflictException("Ime teme je zauzeto.", "name", request.getName());
		if (!topic.isActive())
			throw new BadRequestException("Tema je arhivirana.", "active", String.valueOf(false));
		topic.setName(request.getName());
		topic.setImageUrl(request.getImageUrl());
		topicRepository.saveAndFlush(topic);
	}

	public void archiveTopic(Integer id) {
		Topic topic = topicRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Navedena tema ne postoji.", "id", String.valueOf(id)));
		if (!topic.isActive())
			throw new BadRequestException("Tema je već arhivirana.", "active", String.valueOf(false));
		topic.setActive(false);
		topicRepository.saveAndFlush(topic);
	}

	public List<TopicDataResponse> getTopics() {
		List<Topic> topics = topicRepository.findByActiveTrue();
		return topics.stream().map(this::mapTopicEntityToDTO).collect(Collectors.toList());
	}

	private TopicInfoResponse mapTopicEntityToDTOInfo(Topic topic) {
		TopicInfoResponse response = modelMapper.map(topic, TopicInfoResponse.class);
		return response;
	}

	private TopicDataResponse mapTopicEntityToDTO(Topic topic) {
		TopicDataResponse response = modelMapper.map(topic, TopicDataResponse.class);
		response.setTotalComments(topicRepository.countCommentsById(topic.getId()));
		response.setLastCommentTime(topicRepository.findLastPostedTimeByTopicId(topic.getId()));
		return response;
	}

}
