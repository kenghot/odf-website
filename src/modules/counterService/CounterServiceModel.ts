import { flow } from "mobx";
import { applySnapshot, types } from "mobx-state-tree";
import { ErrorModel } from "../../components/common/error";
import { MessageModel } from "../../components/common/message";
import { IInput } from "../../utils/common-interface";
import customtypes from "../../utils/mobx-types-helper";
import { CounterService } from "./CounterServiceService";

export const CounterServiceModel = types
  .model("CounterServiceModel", {
    id: customtypes.optional(types.string, ""),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdBy: types.maybeNull(types.number),
    createdByName: customtypes.optional(types.string, ""),
    updatedBy: types.maybeNull(types.number),
    updatedByName: customtypes.optional(types.string, ""),
    type: customtypes.optional(types.string, ""),
    csMethod: customtypes.optional(types.string, ""),
    TX_ID: customtypes.optional(types.string, ""),
    LOG_ID: customtypes.optional(types.string, ""),
    VENDOR_ID: customtypes.optional(types.string, ""),
    SERVICE_ID: customtypes.optional(types.string, ""),
    METHOD: customtypes.optional(types.string, ""),
    COUNTER_NO: customtypes.optional(types.string, ""),
    TERM_NO: customtypes.optional(types.string, ""),
    POS_TAX_ID: customtypes.optional(types.string, ""),
    SERVICE_RUN_NO: customtypes.optional(types.string, ""),
    RECORD_STATUS: customtypes.optional(types.string, ""),
    CLIENT_SERVICE_RUNNO: customtypes.optional(types.string, ""),
    AMOUNT_RECEIVED: customtypes.optional(types.string, ""),
    VAT_AMOUNT: customtypes.optional(types.string, ""),
    BILL_TYPE: customtypes.optional(types.string, ""),
    REFERENCE_1: customtypes.optional(types.string, ""),
    REFERENCE_2: customtypes.optional(types.string, ""),
    REFERENCE_3: customtypes.optional(types.string, ""),
    REFERENCE_4: customtypes.optional(types.string, ""),
    CUSTOMER_NAME: customtypes.optional(types.string, ""),
    CUSTOMER_ADDR_1: customtypes.optional(types.string, ""),
    CUSTOMER_ADDR_2: customtypes.optional(types.string, ""),
    CUSTOMER_ADDR_3: customtypes.optional(types.string, ""),
    CUSTOMER_TEL_NO: customtypes.optional(types.string, ""),
    ZONE: customtypes.optional(types.string, ""),
    R_SERVICE_RUNNO: customtypes.optional(types.string, ""),
    CANCEL_OPERATING: customtypes.optional(types.string, ""),
    OPERATE_BY_STAFF: customtypes.optional(types.string, ""),
    SYSTEM_DATE_TIME: customtypes.optional(types.string, ""),
    USERID: customtypes.optional(types.string, ""),
    PASSWORD: customtypes.optional(types.string, ""),
    SUCCESS: types.maybeNull(types.boolean),
    CODE: customtypes.optional(types.string, ""),
    DESC: customtypes.optional(types.string, ""),
    RETURN1: customtypes.optional(types.string, ""),
    RETURN2: customtypes.optional(types.string, ""),
    RETURN3: customtypes.optional(types.string, ""),
    PRINT_SLIP: customtypes.optional(types.string, ""),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {})
  })
  .views((self: any) => ({
    get counterServiceJSON() {
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
    getCounterServiceDetail: flow(function*() {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          const result: any = yield CounterService.getById(self.id);
          self.setAllField(result.data);
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
      }
    }),
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));
export type ICounterServiceModel = typeof CounterServiceModel.Type;
