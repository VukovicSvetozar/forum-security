package vs.forum.entity;

import java.util.Collections;
import java.util.Set;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import static vs.forum.entity.Permission.*;

@RequiredArgsConstructor
public enum Group {

	GUEST(Collections.emptySet()),
	ADMIN(Set.of(ADMIN_MANAGE_ACCESS, ADMIN_MODIFY_PERMISSIONS, ADMIN_CHANGE_GROUP, ADMIN_SUSPEND_USER,
			ADMIN_DEACTIVATE_USER, ADMIN_TOPIC, MODERATOR_UPDATE_COMMENT, MODERATOR_DELETE_COMMENT,
			MEMBER_UPDATE_COMMENT, MEMBER_CREATE_COMMENT, MEMBER_DELETE_COMMENT)),
	MODERATOR(Set.of(MODERATOR_UPDATE_COMMENT, MODERATOR_DELETE_COMMENT, MEMBER_UPDATE_COMMENT, MEMBER_CREATE_COMMENT,
			MEMBER_DELETE_COMMENT)),
	MEMBER(Set.of(MEMBER_UPDATE_COMMENT, MEMBER_CREATE_COMMENT, MEMBER_DELETE_COMMENT));

	@Getter
	private final Set<Permission> permissions;

}
