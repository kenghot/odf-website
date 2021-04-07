import { applySnapshot, types } from "mobx-state-tree";
import { IInput } from "../../../utils/common-interface";

export const ErrorModel = types
  .model("ErrorModel", {
    tigger: types.optional(types.boolean, false),
    code: types.optional(types.string, ""),
    title: types.optional(types.string, ""),
    message: types.optional(types.string, ""),
    technical_stack: types.optional(types.string, "")
  })
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    resetAll: () => {
      applySnapshot(self, {});
    },
    setErrorMessage: (e: any) => {
      self.setField({ fieldname: "tigger", value: true });
      self.setField({ fieldname: "code", value: e.code });
      self.setField({ fieldname: "title", value: e.name });
      self.setField({
        fieldname: "message",
        value: e.message
      });
      self.setField({
        fieldname: "technical_stack",
        value: e.technical_stack
      });
    }
  }));
export type IErrorModel = typeof ErrorModel.Type;
