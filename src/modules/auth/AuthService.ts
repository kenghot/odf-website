import { request } from "../../utils";
import { ApiHelper, IApiResponse } from "../../utils/api-helper";

const signinUrl = `${process.env.REACT_APP_API_ENDPOINT}/auth/v1/signin`;
const newPasswordRequestUrl = `${
  process.env.REACT_APP_API_ENDPOINT
}/auth/v1/new_password_request`;
const confirmPasswordTokenUrl = `${
  process.env.REACT_APP_API_ENDPOINT
}/auth/v1/confirm_password_token`;
const resetPasswordUrl = `${
  process.env.REACT_APP_API_ENDPOINT
}/auth/v1/reset_password`;
const signOutUrl = `${process.env.REACT_APP_API_ENDPOINT}/auth/v1/signout`;

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

export const SignIn = new AuthService(signinUrl);
export const NewPasswordRequest = new AuthService(newPasswordRequestUrl);
export const ConfirmPasswordToken = new AuthService(confirmPasswordTokenUrl);
export const ResetPassword = new AuthService(resetPasswordUrl);
export const SignOut = new AuthService(signOutUrl);
