import { flow } from "mobx";
import { types } from "mobx-state-tree";
import { Permission, PermissionModel } from ".";
import { ErrorModel } from "../../../components/common/error";
import { IInput } from "../../../utils/common-interface";

export const PermissionListModal = types
  .model("PermissionListModal", {
    list: types.optional(types.array(PermissionModel), []),
    error: types.optional(ErrorModel, {}),
    total: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    perPage: types.optional(types.number, 10),
    totalPages: types.optional(types.number, 1)
  })
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    load_data: flow(function*() {
      try {
        const result = yield Permission.get();
        self.setField({ fieldname: "list", value: result.data });
      } catch (e) {
        console.log(e);
      }
    })
  }));
export type IPermissionListModal = typeof PermissionListModal.Type;
