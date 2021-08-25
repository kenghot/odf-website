import { applySnapshot, flow, types } from "mobx-state-tree";
import { ErrorModel } from "../../components/common/error";
import { MessageModel } from "../../components/common/message";
import { IInput } from "../../utils/common-interface";
import { UserModel } from "../admin/user/UserModel";
import {
  ConfirmPasswordToken,
  NewPasswordRequest,
  CheckUser,
  RegisterUser,
  RegisterPassword,
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
    otpSms: types.optional(types.string, ""),
    alert: types.optional(MessageModel, {}),
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
    get isRandomOtpNumber() {
      return Math.floor(100000 + Math.random() * 900000).toString();
    },
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    resetAll: () => {
      applySnapshot(self, {});
    },
    checkUser: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          username: self.idCardNo
        };
        const result: any = yield CheckUser.check_user(body);
        self.error.tigger = false;
      } catch (e) {
        self.error.tigger = true;
        self.error.code = e.code;
        self.error.title = e.name;
        self.error.message = e.message;
        self.error.technical_stack = e.technical_stack;
        throw e;
      } finally {
        // self.resetAll();
        self.loading = false;
      }
    }),
    generatorOtpSmsSend: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const smsApiUrl = `${process.env.REACT_APP_SMS_SERVICE_API}/odf_sms_api.php`;
        const result: any = yield fetch(`${smsApiUrl}?msisdn=${self.userProfile.telephone}&message=OTP:${self.otpSms} ใช้สำหรับลงทะเบียนผู้ใช้งานระบบกองทุนผู้สูงอายุ`);
        const response: any = yield result.json();
        if (response.QUEUE.Status == "0") {
          self.error.tigger = true;
          self.error.title = "ส่ง SMS OTP ไม่สำเร็จ";
          self.error.message = "โปรดตรวจสอบหมายเลขโทรศัพท์ หรือลองใหม่อีกครั้ง Error:" + response.QUEUE.Detail;
        } else {
          self.error.tigger = false;
        }
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
    resetPasswordOtpSmsSend: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const smsApiUrl = `${process.env.REACT_APP_SMS_SERVICE_API}/odf_sms_api.php`;
        const result: any = yield fetch(`${smsApiUrl}?msisdn=${self.userProfile.telephone}&message=OTP:${self.otpSms} ใช้ยืนยันตัวตนเพื่อรีเซ็ตรหัสผ่านระบบกองทุนผู้สูงอายุ`);
        const response: any = yield result.json();
        if (response.QUEUE.Status == "0") {
          self.error.tigger = true;
          self.error.title = "ส่ง SMS OTP ไม่สำเร็จ";
          self.error.message = "โปรดตรวจสอบหมายเลขโทรศัพท์ หรือลองใหม่อีกครั้ง Error:" + response.QUEUE.Detail;
        } else {
          self.error.tigger = false;
        }
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
    createUser: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          active: true,
          username: self.idCardNo,
          password: self.userProfile.password,
          title: self.userProfile.title,
          firstname: self.userProfile.firstname,
          lastname: self.userProfile.lastname,
          position: self.userProfile.position,
          organizationId: self.userProfile.organization.id ? self.userProfile.organization.id : null,
          email: self.userProfile.email ? self.userProfile.email : "registeronline@odf.dop.go.th",
          telephone: self.userProfile.telephone,
          attachedFiles: self.userProfile.attachedFiles,
        };
        const result: any = yield RegisterUser.create_user(body);
        self.userProfile.setAllField(result.data);
        // console.log(result.data)
        self.uid = result.data.id;
        self.username = result.data.username;
        self.userProfile.id = result.data.id;
        self.setLocalStorage("uid", +result.data.id);
        self.error.tigger = false;
        self.alert.tigger = true;
        self.alert.setField({
          fieldname: "title",
          value: "ลงทะเบียนผู้ใช้งานสำเร็จ",
        });
      } catch (e) {
        self.error.tigger = true;
        self.error.code = e.code;
        self.error.title = e.name;
        self.error.message = e.message;
        self.error.technical_stack = e.technical_stack;
        throw e;
      } finally {
        // self.resetAll();
        self.loading = false;
      }
    }),
    register_password: flow(function* () {
      self.loading = true;
      try {
        const result: any = yield RegisterPassword.register_password({
          uid: self.uid,
          password: self.password,
          confirmPassword: self.confirmPassword,
        });
        // self.passwordRegis = self.password;
        self.error.tigger = false;
      } catch (e) {
        self.error.tigger = true;
        self.error.code = e.code;
        self.error.title = e.name;
        self.error.message = e.message;
        self.error.technical_stack = e.technical_stack;
        console.log("=============== register password ========", self.error);
        throw e;
      } finally {
        self.loading = false;
      }
    }),
    sign_in_api: flow(function* () {
      self.loading = true;
      try {
        const result: any = yield SignIn.sign_in({
          username: "odf_api_user",
          password: "odfapi1234",
        });
        // self.userProfile = {
        //   ...result,
        // };
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
        self.userProfile.telephone = result.telephone;
        self.otpSms = result.otp;
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
