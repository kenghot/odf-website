import { ApiHelper } from "../../../utils/api-helper";

const permissionUrl = `${
  process.env.REACT_APP_API_ENDPOINT
}/api/v1/permissions`;

class PermissionService extends ApiHelper {}

export const Permission = new PermissionService(permissionUrl);
