import { applySnapshot, flow, types } from "mobx-state-tree";
import { ErrorModel } from "../../../components/common/error";
import { MessageModel } from "../../../components/common/message";
import { IInput } from "../../../utils/common-interface";
import customtypes from "../../../utils/mobx-types-helper";
import { OrgModel } from "../../admin/organization";
import { vouchersAPI } from "./VoucherService";

export const VoucherItemModel = types
  .model("VoucherItemModel", {
    id: customtypes.optional(types.string, ""),
    description: types.optional(types.string, ""),
    subTotal: types.optional(types.number, 0),
  })
  .views((self: any) => ({
    //
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
  }));
export type IVoucherItemModel = typeof VoucherItemModel.Type;

export const RefDocumentModel = types
  .model("RefDocumentModel", {
    id: types.optional(types.string, ""),
    documentNumber: types.optional(types.string, ""),
  })
  .views((self: any) => ({
    //
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
  }));
export type IRefDocumentModel = typeof RefDocumentModel.Type;

export const VoucherModel = types
  .model("VoucherModel", {
    id: types.optional(types.string, ""),
    createdDate: types.maybeNull(types.string),
    updatedDate: types.maybeNull(types.string),
    createdBy: types.maybeNull(types.number),
    createdByName: types.optional(types.string, ""),
    updatedBy: types.maybeNull(types.number),
    updatedByName: types.optional(types.string, ""),
    organizationId: types.optional(types.string, ""),
    organization: types.optional(OrgModel, {}),
    refReportCode: types.optional(types.string, ""),
    fiscalYear: types.optional(types.string, ""),
    documentDate: types.maybeNull(types.string),
    documentNumber: types.optional(types.string, ""),
    dueDate: types.maybeNull(types.string),
    refDocument: customtypes.optional(RefDocumentModel, {}),
    voucherType: types.optional(types.string, ""),
    status: types.optional(types.string, ""),
    refType: types.optional(types.string, ""),
    refId: customtypes.optional(types.string, ""),
    exteranalRef: types.optional(types.string, ""),
    partnerName: types.optional(types.string, ""),
    partnerAddress: types.optional(types.string, ""),
    partnerTaxNumber: types.optional(types.string, ""),
    totalAmount: types.optional(types.string, ""),
    paymentMethod: types.optional(types.string, ""),
    fromAccountRef1: types.optional(types.string, ""),
    fromAccountRef2: types.optional(types.string, ""),
    fromAccountRef3: types.optional(types.string, ""),
    toBankName: types.optional(types.string, ""),
    toAccountNo: types.optional(types.string, ""),
    toAccountName: types.optional(types.string, ""),
    toSms: customtypes.optional(types.string, ""),
    toEmail: customtypes.optional(types.string, ""),
    toAccountBranch: customtypes.optional(types.string, ""),
    toBranchCode: customtypes.optional(types.string, ""),
    toAccountType: customtypes.optional(types.string, ""),
    paidAmount: types.optional(types.string, ""),
    paidDate: types.maybeNull(types.string),
    paidRef1: types.optional(types.string, ""),
    paidRef2: types.optional(types.string, ""),
    reciever: types.optional(types.string, ""),
    payBy: types.maybeNull(types.number),
    payByName: types.optional(types.string, ""),
    payByPosition: types.optional(types.string, ""),
    approvedBy: types.maybeNull(types.number),
    approvedByName: types.optional(types.string, ""),
    approvedByPosition: types.optional(types.string, ""),
    voucherItems: types.optional(types.array(VoucherItemModel), []),
    isSelected: types.optional(types.boolean, false),
    loading: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {}),
    error: types.optional(ErrorModel, {}),
  })
  .views((self: any) => ({
    get voucherJSON() {
      return self.toJSON();
    },
  }))
  .actions((self: any) => ({
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
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    updateVoucher: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          toBankName: self.toBankName,
          toAccountNo: self.toAccountNo,
          toAccountName: self.toAccountName,
          toAccountBranch: self.toAccountBranch,
          toAccountType: self.toAccountType,
          toBranchCode: self.toBranchCode,
          partnerName: self.partnerName,
          partnerAddress: self.partnerAddress,
          toSms: self.toSms,
          toEmail: self.toEmail,
          totalAmount: self.totalAmount,
        };
        const result: any = yield vouchersAPI.update(body, parseInt(self.id));
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "เอกสารถูกปรับปรุงเรียบร้อยแล้ว"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    cancelVoucher: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          status: "CL",
        };
        const result: any = yield vouchersAPI.update(body, parseInt(self.id));
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "เอกสารถูกปรับปรุงเรียบร้อยแล้ว"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    printReceipt: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });

          yield vouchersAPI.getById(self.id, {
            name: "print_receipt",
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
          throw e;
        } finally {
          self.setField({ fieldname: "loading", value: false });
        }
      }
    }),
    resetAll: () => {
      applySnapshot(self, {});
    },
  }));
export type IVoucherModel = typeof VoucherModel.Type;
