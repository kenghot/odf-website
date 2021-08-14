import { applySnapshot, flow, types } from "mobx-state-tree";
import { ErrorModel } from "../../components/common/error";
import { IInput } from "../../utils/common-interface";
import { UserModel } from "../admin/user/UserModel";
import {
  ConfirmPasswordToken,
  NewPasswordRequest,
  ResetPassword,
  SignIn,
  SignOut,
} from "./AuthService";
import {
  date_YYYYMMDD_BE_TO_CE,
  dateFormatingYYYYMMDD,
  idcardFormatting,
  isInValidThaiIdCard,
  isValidDate
} from "../../utils";

export const AuthModel = types
  .model("AuthModel", {
    uid: types.maybe(types.string),
    username: types.optional(types.string, ""),
    password: types.optional(types.string, ""),
    confirmPassword: types.optional(types.string, ""),
    resetPasswordToken: types.maybe(types.string),
    permissions: types.optional(types.array(types.string), []),
    loading: types.optional(types.boolean, false),
    error: types.optional(ErrorModel, {}),
    userProfile: types.optional(UserModel, {}),
    idCardNo: types.optional(types.string, ""),
  })
  .views((self: any) => ({
    get access_token() {
      return window.localStorage.getItem("access_token") || "";
    },
    get isPasswordMissMatch() {
      return (
        self.password !== self.confirmPassword && self.confirmPassword !== ""
      );
    },
    get isPasswordInCorrectFormat() {
      return (
        self.password !== "" &&
        !self.password.match(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,}$/)
      );
    },
    get idCardformated() {
      return self.idCardNo !== "" ? idcardFormatting(self.idCardNo) : "";
    },
    get idCardIsIncorrectFormat() {
      return isInValidThaiIdCard(self.idCardNo);
    },
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    resetAll: () => {
      applySnapshot(self, {});
    },
    sign_in: flow(function* () {
      self.loading = true;
      try {
        const result: any = yield SignIn.sign_in({
          username: self.username,
          password: self.password,
        });
        self.userProfile = {
          ...result,
        };
        self.uid = result.id;
        self.permissions = result.permissions;
        self.setLocalStorage("uid", +result.id);
        self.setLocalStorage("permissions", result.permissions);
        self.error.tigger = false;
      } catch (e) {
        self.error.tigger = true;
        self.error.code = e.code;
        self.error.title = e.name;
        self.error.message = e.message;
        self.error.technical_stack = e.technical_stack;
        throw e;
      } finally {
        self.loading = false;
      }
    }),
    new_password_request: flow(function* () {
      self.loading = true;
      try {
        const result: any = yield NewPasswordRequest.new_password_request({
          username: self.userProfile.email,
        });
        self.userProfile.email = result.email;
        self.password = "";
        self.error.tigger = false;
      } catch (e) {
        self.error.tigger = true;
        self.error.code = e.code;
        self.error.title = e.name;
        self.error.message = e.message;
        self.error.technical_stack = e.technical_stack;
        throw e;
      } finally {
        self.loading = false;
      }
    }),
    confirm_password_token: flow(function* () {
      self.loading = true;
      try {
        const result: any = yield ConfirmPasswordToken.confirm_password_token({
          resetPasswordToken: self.resetPasswordToken,
        });
        self.uid = result.uid;
        self.setLocalStorage("uid", +result.uid);
        self.error.tigger = false;
      } catch (e) {
        self.error.tigger = true;
        self.error.code = e.code;
        self.error.title = e.name;
        self.error.message = e.message;
        self.error.technical_stack = e.technical_stack;
        throw e;
      } finally {
        self.loading = false;
      }
    }),
    reset_password: flow(function* () {
      self.loading = true;
      try {
        yield ResetPassword.reset_password({
          password: self.password,
          confirmPassword: self.confirmPassword,
        });
        self.error.tigger = false;
      } catch (e) {
        self.error.tigger = true;
        self.error.code = e.code;
        self.error.title = e.name;
        self.error.message = e.message;
        self.error.technical_stack = e.technical_stack;
        console.log("=============== reset password ========", self.error);
        throw e;
      } finally {
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("uid");
        self.resetAll();
        self.loading = false;
      }
    }),
    sign_out: flow(function* () {
      try {
        yield SignOut.sign_out();
      } catch (e) {
        throw e;
      } finally {
        self.resetAll();
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("uid");

        window.location.href = "/login";
      }
    }),
    setLocalStorage: (key: string, value: string) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    getUserProfile() {
      const uidStorage = window.localStorage.getItem("uid");
      const permissions = window.localStorage.getItem("permissions");
      if (!self.userProfile.id && uidStorage) {
        self.userProfile.setField({
          fieldname: "id",
          value: uidStorage,
        });
        self.userProfile.getUserDetail();
        self.permissions =
          permissions && permissions !== "undefined"
            ? JSON.parse(permissions)
            : [];
      }
      return self.userProfile;
    },
  }));
export type IAuthModel = typeof AuthModel.Type;
export const authStore = AuthModel.create({});
export default authStore;
