import { flow } from "mobx";
import { applySnapshot, types } from "mobx-state-tree";
import { ErrorModel } from "../../components/common/error";
import { MessageModel } from "../../components/common/message";
import { IInput } from "../../utils/common-interface";
import customtypes from "../../utils/mobx-types-helper";
import { KTB } from "./KTBService";

export const KTBModel = types
  .model("KTBModel", {
    id: customtypes.optional(types.string, ""),
    createdDate: customtypes.optional(types.string, ""),
    type: customtypes.optional(types.string, ""),

    user: customtypes.optional(types.string, ""),
    password: customtypes.optional(types.string, ""),

    comCode: customtypes.optional(types.string, ""),
    prodCode: customtypes.optional(types.string, ""),
    command: customtypes.optional(types.string, ""),
    bankCode: customtypes.optional(types.number, 0),
    bankRef: customtypes.optional(types.string, ""),
    dateTime: customtypes.optional(types.string, ""),
    effDate: customtypes.optional(types.string, ""),
    channel: customtypes.optional(types.string, ""),
    ref1: customtypes.optional(types.string, ""),
    ref2: customtypes.optional(types.string, ""),
    ref3: customtypes.optional(types.string, ""),
    ref4: customtypes.optional(types.string, ""),

    tranxId: customtypes.optional(types.string, ""),
    amount: customtypes.optional(types.string, "0.00"),
    cusName: customtypes.optional(types.string, ""),
    respCode: customtypes.optional(types.number, 0),
    respMsg: customtypes.optional(types.string, ""),
    balance: customtypes.optional(types.string, "0.00"),
    print1: customtypes.optional(types.string, ""),
    print2: customtypes.optional(types.string, ""),
    print3: customtypes.optional(types.string, ""),
    print4: customtypes.optional(types.string, ""),
    print5: customtypes.optional(types.string, ""),
    print6: customtypes.optional(types.string, ""),
    print7: customtypes.optional(types.string, ""),
    info: customtypes.optional(types.string, ""),

    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {})
  })
  .views((self: any) => ({
    get KTBJSON() {
      return self.toJSON();
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
          console.log("exception on key", key, e);
          throw e;
        }
      });
    },
    getKTBDetail: flow(function*() {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          const result: any = yield KTB.getById(self.id);
          self.setAllField(result.data);
          self.error.setField({ fieldname: "tigger", value: false });
        } catch (e) {
          self.error.setErrorMessage(e);
          console.log(e);
        } finally {
          self.setField({ fieldname: "loading", value: false });
        }
      }
    }),
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));
export type IKTBModel = typeof KTBModel.Type;
