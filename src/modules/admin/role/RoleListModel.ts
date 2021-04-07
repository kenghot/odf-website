import { flow } from "mobx";
import { types } from "mobx-state-tree";
import { Role, RoleModel } from ".";
import { ErrorModel } from "../../../components/common/error";
import { IInput } from "../../../utils/common-interface";
import { hasPermission } from "../../../utils/render-by-permission";

export const RoleListModel = types
  .model("RoleListModel", {
    list: types.optional(types.array(RoleModel), []),
    total: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    perPage: types.optional(types.number, 999),
    totalPages: types.optional(types.number, 1),
    loading: types.optional(types.boolean, false),
    checkPermission: types.optional(types.boolean, false),
    error: types.optional(ErrorModel, {})
  })
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    load_data: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        let result: any;
        if (self.checkPermission && !hasPermission("ROLE.ACCESS.PRIVATELIST")) {
          result = yield Role.get({ perPage: self.perPage, isPrivate: false });
        } else {
          result = yield Role.get({ perPage: self.perPage });
        }
        self.setField({ fieldname: "list", value: result.data });
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({
          fieldname: "message",
          value: e.message
        });
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
export type IRoleListModel = typeof RoleListModel.Type;
