import authStore from "../modules/auth/AuthModel";

export const hasPermission = (code: string) => {
  const permissions = authStore.permissions.slice();
  return permissions.includes(code);
};

export const hasPermissionMode = (
  permissionView: string,
  permissionEdit: string,
  editMode?: boolean
) => {
  const permissions = authStore.permissions.slice();
  if (editMode) {
    return (
      permissions.includes(permissionView) ||
      permissions.includes(permissionEdit)
    );
  } else {
    return permissions.includes(permissionView);
  }
};
