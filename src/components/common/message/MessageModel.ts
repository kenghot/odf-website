import { types } from "mobx-state-tree";
import { IInput } from "../../../utils/common-interface";

export const MessageModel = types
  .model("MessageModel", {
    icon: types.optional(types.string, "check"),
    messageType: types.optional(types.string, "success"),
    tigger: types.optional(types.boolean, false),
    title: types.optional(types.string, ""),
    message: types.optional(types.string, "")
  })
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    setAlertMessage: (title?: string, message?: string) => {
      self.setField({ fieldname: "tigger", value: true });
      self.setField({
        fieldname: "title",
        value: title || ""
      });
      self.setField({
        fieldname: "message",
        value: message || ""
      });
    }
  }));
export type IMessageModel = typeof MessageModel.Type;
