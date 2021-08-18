import i18n from "i18next";
import { flow } from "mobx";
import { applySnapshot, clone, types } from "mobx-state-tree";
import { ErrorModel } from "../../../components/common/error";
import {
  AttachedFileModel,
  IAttachedFileModel,
} from "../../../components/common/fileupload/AttachedFileModel";
import { MessageModel } from "../../../components/common/message";
import { date_display_CE_TO_BE } from "../../../utils";
import { IInput } from "../../../utils/common-interface";
import customtypes from "../../../utils/mobx-types-helper";
import { OrgModel } from "../organization";
import { IOrgModel } from "../organization/OrgModel";
import { RoleModel } from "../role";
import { IRoleModel } from "../role/RoleModel";
import { User } from "./UserService";

export const UserModel = types
  .model("UserModel", {
    isSelected: types.optional(types.boolean, false),
    id: types.optional(types.string, ""),
    username: types.optional(types.string, ""),
    email: types.optional(types.string, ""),
    title: types.optional(types.string, ""),
    firstname: types.optional(types.string, ""),
    lastname: types.optional(types.string, ""),
    telephone: types.optional(types.string, ""),
    signinCount: types.optional(types.number, 1),
    registrationAgreement: types.optional(types.boolean, false),
    position: types.optional(types.string, ""),
    responsibilityOrganizations: types.optional(types.array(OrgModel), []),
    organization: customtypes.optional(OrgModel, {}),
    attachedFiles: customtypes.optional(types.array(AttachedFileModel), []),
    lastSigninDate: customtypes.optional(types.string, ""),
    lastSigninIp: types.optional(types.string, ""),
    permissions: types.optional(types.array(types.string), []),
    active: types.optional(types.boolean, false),
    createdDate: types.optional(types.union(types.string, types.null), ""),
    createdBy: types.maybeNull(types.number),
    updatedDate: types.optional(types.string, ""),
    updatedBy: types.maybeNull(types.number),
    createdByName: customtypes.optional(types.string, ""),
    updatedByName: customtypes.optional(types.string, ""),
    password: customtypes.optional(types.string, ""),
    confirmPassword: types.optional(types.string, ""),
    organizationIds: types.optional(types.array(types.string), []),
    roles: types.optional(types.array(RoleModel), []),
    posPinCode: customtypes.optional(types.string, ""),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false),
    posLoading: types.optional(types.boolean, false),
    roleLoading: types.optional(types.boolean, false),
    orgLoading: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {}),
  })
  .views((self: any) => ({
    get listitem() {
      return {
        key: self.id,
        value: self.id,
        text: self.fullname,
      };
    },
    get listitemDescription() {
      return {
        key: self.id,
        value: self.id,
        text: self.fullname,
        description: self.organization.orgName,
      };
    },
    get fullname() {
      const space = self.firstname && self.lastname ? " " : "";
      return `${self.title}${self.firstname || ""}${space}${self.lastname || ""
        }`;
    },
    get last_signin_date_formated() {
      return date_display_CE_TO_BE(self.lastSigninDate, true);
    },
    get status() {
      return self.active
        ? i18n.t("module.admin.userModel.enable")
        : i18n.t("module.admin.userModel.disable");
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
    get rolesSelectedIdList() {
      return self.roles.map((item: IRoleModel) => item.id);
    },
    get rolesIdList() {
      return self.roles.map((item: IRoleModel) => ({
        id: parseInt(item.id),
      }));
    },
    get responsibilityOrgIdList() {
      return self.organizationIds.map((item: string) => ({
        id: parseInt(item),
      }));
    },
    get fileList() {
      return self.attachedFiles.map((item: IAttachedFileModel) => item.file);
    },
    get validateEmail() {
      if (self.email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(self.email);
      } else {
        return false;
      }
    },
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    setAllField: (data: any) => {
      Object.keys(data).forEach((key, index) => {
        try {
          self[key] = data[key];
        } catch (e) {
          console.log("exception on key", key, e);
          throw e;
        }
      });
    },
    resetAll: () => {
      applySnapshot(self, {});
    },
    onSelectedRole: (value: IRoleModel, checked: boolean) => {
      if (checked === true) {
        self.roles.push(clone(value));
      } else {
        const index = self.roles.findIndex(
          (item: IRoleModel) => item.id === value.id
        );
        if (index >= 0) {
          self.roles.splice(index, 1);
        }
      }
    },
    onSelectResponsibleOrg: (activeOrg: IOrgModel, value: boolean) => {
      activeOrg.setField({ fieldname: "active", value });
    },
    getUserDetail: flow(function* () {
      if (self.id) {
        self.setField({ fieldname: "loading", value: true });
        try {
          const result: any = yield User.getById(self.id);
          self.setAllField(result.data);
          self.setField({
            fieldname: "organizationIds",
            value: self.responsibilityOrganizations.map(
              (item: IOrgModel) => item.id
            ),
          });
          self.error.setField({ fieldname: "tigger", value: false });
        } catch (e) {
          self.error.setField({ fieldname: "tigger", value: true });
          self.error.setField({ fieldname: "code", value: e.code });
          self.error.setField({ fieldname: "title", value: e.name });
          self.error.setField({
            fieldname: "message",
            value: e.message,
          });
          self.error.setField({
            fieldname: "technical_stack",
            value: e.technical_stack,
          });
          console.log(e);
        } finally {
          self.setField({ fieldname: "loading", value: false });
        }
      }
    }),
    createUser: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          active: true,
          username: self.username,
          title: self.title,
          firstname: self.firstname,
          lastname: self.lastname,
          position: self.position,
          organizationId: self.organization.id ? self.organization.id : null,
          // organization: self.organization,
          email: self.email,
          telephone: self.telephone,
          attachedFiles: self.attachedFiles,
        };
        const result: any = yield User.create_user(body);
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "ข้อมูลถูกสร้างเรียบร้อยแล้ว",
        });
      } catch (e) {
        self.setField({ fieldname: "loading", value: false });
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({ fieldname: "message", value: e.message });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack,
        });
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateUser: flow(function* (id: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          activeString: self.active ? "true" : "false",
          username: self.username,
          title: self.title,
          firstname: self.firstname,
          lastname: self.lastname,
          position: self.position,
          organizationId: self.organization.id ? self.organization.id : null,
          email: self.email,
          telephone: self.telephone,
          attachedFiles: self.attachedFiles,
        };
        const result: any = yield User.user_update(body, parseInt(id));
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "ข้อมูลถูกปรับปรุงเรียบร้อยแล้ว",
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({ fieldname: "message", value: e.message });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack,
        });
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateUserPosPinCode: flow(function* () {
      try {
        self.setField({ fieldname: "posLoading", value: true });
        const body = {
          posPinCode: self.posPinCode,
        };
        const result: any = yield User.update(body, parseInt(self.id));
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "ข้อมูลถูกปรับปรุงเรียบร้อยแล้ว",
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({ fieldname: "message", value: e.message });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack,
        });
        console.log(e);
      } finally {
        self.setField({ fieldname: "posLoading", value: false });
      }
    }),
    updateRolesUser: flow(function* (id: string) {
      try {
        self.setField({ fieldname: "roleLoading", value: true });
        const body = {
          roles: self.rolesIdList,
        };
        yield User.user_roles_update(body, parseInt(id));
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "ข้อมูลถูกปรับปรุงเรียบร้อยแล้ว",
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({
          fieldname: "message",
          value: e.message,
        });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack,
        });
        console.log(e);
      } finally {
        self.setField({ fieldname: "roleLoading", value: false });
      }
    }),
    updateRoleBorrowerOnly: flow(function* (id: string) {
      try {
        self.setField({ fieldname: "roleLoading", value: true });
        const body = {
          roles: [{ id: 13 }],
        };
        yield User.user_roles_update(body, parseInt(id));
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "ข้อมูลถูกปรับปรุงเรียบร้อยแล้ว",
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({
          fieldname: "message",
          value: e.message,
        });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack,
        });
        console.log(e);
      } finally {
        self.setField({ fieldname: "roleLoading", value: false });
      }
    }),
    updateResponsibilityOrgUser: flow(function* (id: string) {
      try {
        self.setField({ fieldname: "orgLoading", value: true });
        const body = {
          responsibilityOrganizations: self.responsibilityOrgIdList,
        };
        const result: any = yield User.user_responsibility_org_update(
          body,
          parseInt(id)
        );
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "ข้อมูลถูกปรับปรุงเรียบร้อยแล้ว",
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({
          fieldname: "message",
          value: e.message,
        });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack,
        });
        console.log(e);
      } finally {
        self.setField({ fieldname: "orgLoading", value: false });
      }
    }),
    removeResponsibleOrg(value: IOrgModel) {
      self.organizationIds = self.organizationIds.exclude(value.id);
    },
    updatePassword: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          password: self.password,
          confirmPassword: self.confirmPassword,
        };
        const result = yield User.update(body, parseInt(self.id));
        self.setField({ fieldname: "password", value: "" });
        self.setField({ fieldname: "confirmPassword", value: "" });
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "ข้อมูลถูกปรับปรุงเรียบร้อยแล้ว",
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({
          fieldname: "message",
          value: e.message,
        });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack,
        });
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    delete_data: flow(function* () {
      try {
        yield User.user_delete(parseInt(self.id));
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "ข้อมูลถูกลบเรียบร้อยแล้ว",
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({
          fieldname: "message",
          value: e.message,
        });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack,
        });
        console.log(e);
      }
    }),
    addFiles: (files: File[]) => {
      files.forEach((_file: File) => {
        const attachedFile = AttachedFileModel.create({
          file: _file,
          refId: self.id,
          refType: "USER.ATTACHEDFILE",
        });
        self.attachedFiles.push(attachedFile);
      });
    },
    removeFile: (index: number) => {
      try {
        self.attachedFiles[index].deleteFile();
        self.attachedFiles.splice(index, 1);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "ข้อมูลถูกลบเรียบร้อยแล้ว",
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({
          fieldname: "message",
          value: e.message,
        });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack,
        });
        console.log(e);
      }
    },
  }));
export type IUserModel = typeof UserModel.Type;
