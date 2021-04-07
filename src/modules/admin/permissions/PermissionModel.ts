import { types } from "mobx-state-tree";
import { IInput } from "../../../utils/common-interface";
import customtypes from "../../../utils/mobx-types-helper";

export const PermissionItemModel = types
  .model("PermissionItemModel", {
    code: types.optional(types.string, ""),
    description: types.optional(types.string, "")
  })
  .views((self: any) => ({
    //
  }));
export type IPermissionItemModel = typeof PermissionItemModel.Type;

export const PermissionModel = types
  .model("PermissionModel", {
    icon: types.optional(types.string, ""),
    color: types.optional(types.string, ""),
    title: types.optional(types.string, ""),
    description: types.optional(types.string, ""),
    permissions: customtypes.optional(types.array(PermissionItemModel), [])
  })
  .views((self: any) => ({
    get permissionsSelectedCodeList() {
      const selectedCodeList: string[] = [];
      self.roles.forEach((item: IPermissionItemModel, index: number) => {
        selectedCodeList.push(item.code);
      });
      return selectedCodeList;
    }
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    }
  }));

export type IPermissionModel = typeof PermissionModel.Type;
