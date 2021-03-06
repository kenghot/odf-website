import { request } from "../../utils";
import { ApiHelper, IApiResponse } from "../../utils/api-helper";

const signinUrl = `${process.env.REACT_APP_API_ENDPOINT}/auth/v1/signin`;
const checkUserUrl = `${process.env.REACT_APP_API_ENDPOINT
  }/auth/v1/check_user`;
const registerUserUrl = `${process.env.REACT_APP_API_ENDPOINT
  }/auth/v1/register_user`;
const registerPasswordUrl = `${process.env.REACT_APP_API_ENDPOINT
  }/auth/v1/register_password`;
const newPasswordRequestUrl = `${process.env.REACT_APP_API_ENDPOINT
  }/auth/v1/new_password_request`;
const confirmPasswordTokenUrl = `${process.env.REACT_APP_API_ENDPOINT
  }/auth/v1/confirm_password_token`;
const resetPasswordUrl = `${process.env.REACT_APP_API_ENDPOINT
  }/auth/v1/reset_password`;
const signOutUrl = `${process.env.REACT_APP_API_ENDPOINT}/auth/v1/signout`;

interface IUserCheck {
  username: string;
}
interface IUserCreate {
  active: boolean;
  username: string;
  title: string;
  firstname: string;
  lastname: string;
  organizationId: string;
  email: string;
  telephone: string;
}
interface IRegisterPassword {
  uid: string;
  password: string;
  confirmPassword: string;
}
interface IAuthSignin {
  username: string;
  password: string;
}
interface IAuthNewPasswordRequest {
  username: string;
}
interface IAuthConfirmPasswordToken {
  resetPasswordToken: string;
}
interface IAuthResetPassword {
  password: string;
  confirmPassword: string;
}

class AuthService extends ApiHelper {
  public async check_user(body: IUserCheck): Promise<IApiResponse | void> {
    try {
      const result = await this.create(body);
      return result;
    } catch (e) {
      throw e;
    }
  }
  public async create_user(body: IUserCreate): Promise<IApiResponse | void> {
    try {
      const result = await this.create(body);
      return result;
    } catch (e) {
      throw e;
    }
  }
  public async register_password(
    body: IRegisterPassword
  ): Promise<IApiResponse | void> {
    try {
      const result = await request.post(this.url, { body });
      return result.data;
    } catch (e) {
      throw e;
    }
  }
  public async sign_in(body: IAuthSignin): Promise<IApiResponse | void> {
    try {
      const result = await request.post(this.url, { body });
      return result.data;
    } catch (e) {
      throw e;
    }
  }
  public async new_password_request(
    body: IAuthNewPasswordRequest
  ): Promise<IApiResponse | void> {
    try {
      const result = await request.post(this.url, { body });
      return result.data;
    } catch (e) {
      throw e;
    }
  }
  public async confirm_password_token(
    body: IAuthConfirmPasswordToken
  ): Promise<IApiResponse | void> {
    try {
      const result = await request.post(this.url, { body });
      return result.data;
    } catch (e) {
      throw e;
    }
  }
  public async reset_password(
    body: IAuthResetPassword
  ): Promise<IApiResponse | void> {
    try {
      const result = await request.post(this.url, { body });
      return result.data;
    } catch (e) {
      throw e;
    }
  }
  public async sign_out(): Promise<IApiResponse | void> {
    try {
      const result = await request.post(this.url, {});
      return result.data;
    } catch (e) {
      throw e;
    }
  }
}
export const CheckUser = new AuthService(checkUserUrl);
export const RegisterUser = new AuthService(registerUserUrl);
export const RegisterPassword = new AuthService(registerPasswordUrl);
export const SignIn = new AuthService(signinUrl);
export const NewPasswordRequest = new AuthService(newPasswordRequestUrl);
export const ConfirmPasswordToken = new AuthService(confirmPasswordTokenUrl);
export const ResetPassword = new AuthService(resetPasswordUrl);
export const SignOut = new AuthService(signOutUrl);
