export const UserRoles = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
};
export const AvailableUserRoles = Object.values(UserRoles);

export const TaskStatus = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};
export const AvailableTaskStatus = Object.values(TaskStatus);

export default {
  UserRoles,
  AvailableUserRoles,
  TaskStatus,
  AvailableTaskStatus,
};
