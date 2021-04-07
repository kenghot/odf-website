import { ApiHelper, IApiResponse } from "../../../utils/api-helper";

const roleUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/roles`;
interface IRole {
  name?: string;
  description?: string;
  permissions?: string[];
  isPrivate?: boolean;
}
class RoleService extends ApiHelper {
  public async role_create(body: IRole): Promise<IApiResponse | void> {
    try {
      const result = await this.create(body);
      return result;
    } catch (e) {
      throw e;
    }
  }
  public async role_update(
    body: IRole,
    id: number
  ): Promise<IApiResponse | void> {
    try {
      const result = await this.update(body, id);
      return result;
    } catch (e) {
      throw e;
    }
  }
  public async role_delete(id: number): Promise<IApiResponse | void> {
    try {
      const result = await this.delete(id);
      return result;
    } catch (e) {
      throw e;
    }
  }
}

export const Role = new RoleService(roleUrl);
