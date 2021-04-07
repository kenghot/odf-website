import { IAttachedFileModel } from "../../../components/common/fileupload/AttachedFileModel";
import { ApiHelper, IApiResponse } from "../../../utils/api-helper";
import { IOrgModel } from "../organization/OrgModel";

const userUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/users`;

interface IUserStatusUpdate {
  active: boolean;
}
export interface IUserUpdateId {
  id: number;
}
interface IUserRolesUpdate {
  roles: IUserUpdateId[];
}
interface IResponsibilityOrgUpdate {
  responsibilityOrganizations: IUserUpdateId[];
}
interface IUserCreate {
  active: boolean;
  username: string;
  title: string;
  firstname: string;
  lastname: string;
  organizationId: string;
  organization?: IOrgModel;
  email: string;
  telephone: string;
}
interface IUserUpdate {
  activeString?: string;
  username: string;
  title: string;
  firstname: string;
  lastname: string;
  position?: string;
  organization?: string;
  email?: string;
  telephone?: string;
  attachedFiles?: IAttachedFileModel[];
  files?: FileList;
}
export interface IUserGet {
  username?: string;
  firstname?: string;
  lastname?: string;
  organizationId?: string;
  roleId?: string;
  active?: string;
  perPage: number;
  currentPage: number;
}
class UserService extends ApiHelper {
  public async create_user(body: IUserCreate): Promise<IApiResponse | void> {
    try {
      const result = await this.create(body);
      return result;
    } catch (e) {
      throw e;
    }
  }
  public async search(body: IUserGet): Promise<IApiResponse | void> {
    try {
      let result: any;
      result = await this.get(body);
      return result;
    } catch (e) {
      throw e;
    }
  }
  public async user_status_update(
    body: IUserStatusUpdate,
    id: number
  ): Promise<IApiResponse | void> {
    try {
      const result = await this.update(body, id);
      return result;
    } catch (e) {
      throw e;
    }
  }
  public async user_roles_update(
    body: IUserRolesUpdate,
    id: number
  ): Promise<IApiResponse | void> {
    try {
      const result = await this.update(body, id);
      return result;
    } catch (e) {
      throw e;
    }
  }
  public async user_responsibility_org_update(
    body: IResponsibilityOrgUpdate,
    id: number
  ): Promise<IApiResponse | void> {
    try {
      const result = await this.update(body, id);
      return result;
    } catch (e) {
      throw e;
    }
  }
  public async user_update(
    body: IUserUpdate,
    id: number
  ): Promise<IApiResponse | void> {
    try {
      const result = await this.formUpdate(body, id);
      return result;
    } catch (e) {
      throw e;
    }
  }
  public async user_delete(id: number): Promise<IApiResponse | void> {
    try {
      const result = await this.delete(id);
      return result;
    } catch (e) {
      throw e;
    }
  }
}

export const User = new UserService(userUrl);
