import { deleteUser } from '../api';
import { ROLE } from '../constans';
import { sessions } from '../sessions';

export const removeUser = async (hash, userId, newUserRoleId) => {
	const accessRoles = [ROLE.ADMIN];

	const access = await sessions.access(hash, accessRoles);

	if (!access) {
		return {
			error: 'Доступ запрещен',
			res: null,
		};
	}

	deleteUser(userId, newUserRoleId);

	return {
		error: null,
		res: true,
	};
};

