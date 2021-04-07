import { flow, types } from "mobx-state-tree";
import { Role } from ".";
import { ErrorModel } from "../../../components/common/error";
import { MessageModel } from "../../../components/common/message";
import { IInput } from "../../../utils/common-interface";
import customtypes from "../../../utils/mobx-types-helper";

export const RoleModel = types
  .model("RoleModel", {
    id: types.optional(types.string, ""),
    name: types.optional(types.string, ""),
    description: types.optional(types.string, ""),
    permissions: customtypes.optional(types.array(types.string), []),
    isPrivate: types.optional(types.boolean, false),
    loading: types.optional(types.boolean, false),
    error: types.optional(ErrorModel, {}),
    alert: types.optional(MessageModel, {})
  })
  .views((self: any) => ({
    get listitem() {
      return {
        key: self.id,
        value: self.id,
        text: self.description
      };
    },
    get permissionsSelectedCodeList() {
      const selectedCodeList: string[] = [];
      self.permissions.forEach((item: string, index: number) => {
        selectedCodeList.push(item);
      });
      return selectedCodeList;
    }
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
          console.log(e);
        }
      });
    },
    onSelectedPermissions: (value: string, checked: boolean) => {
      if (checked === true) {
        self.permissions.push(value);
      } else {
        const index = self.permissions.findIndex(
          (item: string) => item === value
        );
        if (index >= 0) {
          self.permissions.splice(index, 1);
        }
      }
    },
    getRole: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          const result: any = yield Role.getById(self.id);
          self.setAllField(result.data);
          self.error.setField({ fieldname: "tigger", value: false });
        } catch (e) {
          self.error.setField({ fieldname: "tigger", value: true });
          self.error.setField({ fieldname: "code", value: e.code });
          self.error.setField({ fieldname: "title", value: e.name });
          self.error.setField({ fieldname: "message", value: e.message });
          self.error.setField({
            fieldname: "technical_stack",
            value: e.technical_stack
          });
          console.log(e);
        } finally {
          self.setField({ fieldname: "loading", value: false });
        }
      }
    }),
    create_data: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          name: self.name,
          description: self.description,
          isPrivate: self.isPrivate
        };
        yield Role.role_create(body);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "กลุ่มผู้ใช้งานใหม่ถูกสร้างเรียบร้อยแล้ว"
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({ fieldname: "message", value: e.message });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack
        });
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateRolelist: flow(function* (id: string) {
      try {
        const body = {
          name: self.name,
          description: self.description,
          isPrivate: self.isPrivate
        };
        yield Role.role_update(body, parseInt(id));
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "ข้อมูลกลุ่มผู้ใข้งานถูกปรับปรุงเรียบร้อยแล้ว"
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({ fieldname: "message", value: e.message });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack
        });
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateRolePermission: flow(function* (id: string) {
      try {
        const body = {
          permissions: self.permissions
        };
        yield Role.role_update(body, parseInt(id));
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "ข้อมูลกลุ่มผู้ใข้งานถูกปรับปรุงเรียบร้อยแล้ว"
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({ fieldname: "message", value: e.message });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack
        });
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    delete_data: flow(function* (id: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        yield Role.delete(parseInt(self.id));
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "กลุ่มผู้ใช้งานถูกลบเรียบร้อยแล้ว"
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({ fieldname: "message", value: e.message });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack
        });
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    })
  }));

export type IRoleModel = typeof RoleModel.Type;
