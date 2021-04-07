import { applySnapshot, flow, types } from "mobx-state-tree";
import { ErrorModel } from "../../components/common/error";
import { MessageModel } from "../../components/common/message";
import { IInput } from "../../utils/common-interface";
import customtypes from "../../utils/mobx-types-helper";
import { OrgModel } from "../admin/organization";
import { ReceiptModel } from "../receipt/ReceiptModel";
import { DonationDirects } from "./DonationService";

export const DonationDirectModel = types
  .model("DonationDirectModel", {
    id: customtypes.optional(types.string, ""),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdBy: types.maybeNull(types.number),
    createdByName: customtypes.optional(types.string, ""),
    updatedBy: types.maybeNull(types.number),
    updatedByName: customtypes.optional(types.string, ""),
    donationDate: customtypes.optional(types.string, ""),
    receiptDate: customtypes.optional(types.string, ""),
    receiptId: customtypes.optional(types.string, ""),
    name: customtypes.optional(types.string, ""),
    organizationId: customtypes.optional(types.string, ""),
    donatorName: customtypes.optional(types.string, ""),
    paidAmount: types.optional(types.string, ""),
    donatorAddress: customtypes.optional(types.string, ""),
    deliveryAddress: customtypes.optional(types.string, ""),
    note: customtypes.optional(types.string, ""),
    organization: types.optional(OrgModel, {}),
    receipt: customtypes.optional(ReceiptModel, {}),
    donatorIdCardNo: customtypes.optional(types.string, ""),
    donatorTitle: customtypes.optional(types.string, ""),
    donatorFirstname: customtypes.optional(types.string, ""),
    donatorLastname: customtypes.optional(types.string, ""),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false),
    isSelected: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {}),
  })
  .views((self: any) => ({
    get fullname() {
      const space = self.donatorFirstname && self.donatorLastname ? " " : "";
      return `${self.donatorTitle}${self.donatorFirstname || ""}${space}${
        self.donatorLastname || ""
      }`;
    },
    get donationDirectToJSON() {
      return self.toJSON();
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
          console.log(e);
        }
      });
    },
    getDonationDirectDetail: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          const result: any = yield DonationDirects.getById(self.id);
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
    updateDonationDirect: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          donatorIdCardNo: self.donatorIdCardNo,
          donatorTitle: self.donatorTitle,
          donatorFirstname: self.donatorFirstname,
          donatorLastname: self.donatorLastname,
          donatorAddress: self.donatorAddress,
          deliveryAddress: self.deliveryAddress,
          name: self.name,
          donationDate: self.donationDate,
          receiptDate: self.receiptDate,
          paidAmount: self.paidAmount,
          note: self.note,
        };
        const result: any = yield DonationDirects.update(body, self.id);
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "เอกสารถูกสร้างเรียบร้อยแล้ว",
        });
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.error.setErrorMessage(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    resetAll: () => {
      applySnapshot(self, {});
    },
  }));
export type IDonationDirectModel = typeof DonationDirectModel.Type;
