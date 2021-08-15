import { flow } from "mobx";
import { applySnapshot, IAnyModelType, types } from "mobx-state-tree";
import moment from "moment";
import { ErrorModel } from "../../components/common/error";
import { MessageModel } from "../../components/common/message";
import { IInput } from "../../utils/common-interface";
import customtypes from "../../utils/mobx-types-helper";
import { IAccountReceivableModel } from "../accountReceivable/AccountReceivableModel";
import { IOrgModel, OrgModel } from "../admin/organization/OrgModel";
import { PosModel, PosShiftModel } from "../pos/PosModel";
import { Receipt } from "./ReceiptService";
import { IAddressModel } from "../../components/address";

export const ReceiptPrintLog = types
  .model("ReceiptPrintLog", {
    id: customtypes.optional(types.string, ""),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdBy: types.maybeNull(types.number),
    createdByName: customtypes.optional(types.string, ""),
    updatedBy: types.maybeNull(types.number),
    updatedByName: customtypes.optional(types.string, ""),
    receiptId: customtypes.optional(types.string, ""),
    printedDatetime: customtypes.optional(types.string, ""),
    receipt: types.maybeNull(types.late((): IAnyModelType => ReceiptModel)),
    POSId: types.maybeNull(types.number),
    recieptPrintType: customtypes.optional(types.string, ""),
    manageBy: types.maybeNull(types.number),
    manageByName: customtypes.optional(types.string, ""),
    manageByPosition: customtypes.optional(types.string, ""),
    error: types.optional(ErrorModel, {}),
    alert: types.optional(MessageModel, {}),
    loading: types.optional(types.boolean, false),
  })
  .views((self: any) => ({
    //
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
    resetAll: () => {
      applySnapshot(self, {});
    },
  }));
export type IReceiptPrintLog = typeof ReceiptPrintLog.Type;

export const ReceiptItem = types
  .model("ReceiptItem", {
    id: types.maybe(types.union(types.string, types.null)),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdBy: types.maybeNull(types.number),
    createdByName: customtypes.optional(types.string, ""),
    updatedBy: types.maybeNull(types.number),
    updatedByName: customtypes.optional(types.string, ""),
    receiptId: types.maybe(types.union(types.string, types.null)),
    receipt: types.maybe(
      types.union(
        types.late((): IAnyModelType => ReceiptModel),
        types.null
      )
    ),
    refType: customtypes.optional(types.string, ""),
    refId: types.maybe(types.union(types.number, types.null, types.string)),
    ref1: customtypes.optional(types.string, ""),
    ref2: customtypes.optional(types.string, ""),
    ref3: customtypes.optional(types.string, ""),
    ref4: customtypes.optional(types.string, ""),
    name: customtypes.optional(types.string, ""),
    description1: customtypes.optional(types.string, ""),
    description2: customtypes.optional(types.string, ""),
    description3: customtypes.optional(types.string, ""),
    description4: customtypes.optional(types.string, ""),
    quantity: customtypes.optional(types.number, 1),
    price: customtypes.optional(types.string, ""),
    subtotal: customtypes.optional(types.string, ""),
    error: types.optional(ErrorModel, {}),
    alert: types.optional(MessageModel, {}),
    loading: types.optional(types.boolean, false),
  })
  .views((self: any) => ({
    get checkValueAddItem() {
      if (
        self.name &&
        self.ref1 &&
        self.ref2 &&
        self.price &&
        +self.price > 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    get ref1IdCardNo() {
      let ref1 = self.ref1;
      ref1 = ref1.replace(/-/g, "");
      if (ref1.length === 13) {
        return "xxxxxxxxx" + ref1.substr(9, 13);
      } else {
        return ref1;
      }
    },
    get ref2ArLabel() {
      const spaceText = `${"0"}`;
      if (self.ref2.length < 8) {
        const diff = 8 - +self.ref2.length;
        return `${spaceText.repeat(+diff)}${self.ref2}`;
      } else {
        return self.ref2;
      }
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
          console.log("exception on key", key, e);
          throw e;
        }
      });
    },
    setReceiptItemByAr: (name: string, ar: IAccountReceivableModel) => {
      self.setField({
        fieldname: "name",
        value: name,
      });
      self.setField({
        fieldname: "ref1",
        value: ar.agreement.agreementItems[0].borrower.idCardNo,
      });
      const spaceText = `${"0"}`;
      let ref2 = "";
      if (ar.agreement.id.length < 8) {
        const diff = 8 - +ar.agreement.id.length;
        ref2 = `${spaceText.repeat(+diff)}${ar.agreement.id}`;
      } else {
        ref2 = ar.agreement.id;
      }
      self.setField({
        fieldname: "ref2",
        value: ref2,
      });
      self.setField({
        fieldname: "ref3",
        value: ar.agreement.documentNumber,
      });
      // self.setField({
      //   fieldname: "description1",
      //   value: "บัตรประชาชน",
      // });
      // self.setField({
      //   fieldname: "description2",
      //   value: "หมายเลขอ้างอิงลูกหนี้",
      // });
      // self.setField({
      //   fieldname: "description3",
      //   value: "รหัสจังหวัด/ปี/เลขที่สัญญา",
      // });
      // self.setField({
      //   fieldname: "description4",
      //   value: ar.name,
      // });
      self.setField({
        fieldname: "description1",
        value: ar.name,
      });
      self.setField({ fieldname: "refType", value: "AR" });
      self.setField({
        fieldname: "price",
        value: ar.installmentAmount,
      });
      self.setField({
        fieldname: "subtotal",
        value: (+ar.installmentAmount * self.quantity).toString(),
      });
    },
    resetAll: () => {
      applySnapshot(self, {});
    },
  }));
export type IReceiptItem = typeof ReceiptItem.Type;

export const ReceiptModel = types
  .model("ReceiptModel", {
    id: types.maybe(types.union(types.string, types.null)),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdBy: types.maybeNull(types.number),
    createdByName: customtypes.optional(types.string, ""),
    updatedBy: types.maybeNull(types.number),
    updatedByName: customtypes.optional(types.string, ""),
    organizationId: customtypes.optional(types.string, ""),
    organization: types.optional(OrgModel, {}),
    posShiftId: customtypes.optional(types.string, ""),
    posShift: customtypes.optional(PosShiftModel, {}),
    posId: customtypes.optional(types.string, ""),
    pos: customtypes.optional(PosModel, {}),
    refReportCode: customtypes.optional(types.string, ""),
    fiscalYear: customtypes.optional(types.string, ""),
    documentDate: customtypes.optional(types.string, ""),
    documentNumber: customtypes.optional(types.string, ""),
    organizationName: customtypes.optional(types.string, ""),
    organizationAddress: customtypes.optional(types.string, ""),
    organizationAddressLine1: customtypes.optional(types.string, ""),
    organizationAddressLine2: customtypes.optional(types.string, ""),
    organizationAddressLine3: customtypes.optional(types.string, ""),
    organizationAddressLine4: customtypes.optional(types.string, ""),
    createdByPosition: customtypes.optional(types.string, ""),
    cancelApprovedManagerName: customtypes.optional(types.string, ""),
    cancelApprovedManagerPosition: customtypes.optional(types.string, ""),
    organizationTaxNo: customtypes.optional(types.string, ""),
    POSVATCode: customtypes.optional(types.string, ""),
    clientType: customtypes.optional(types.string, ""),
    clientTaxNumber: customtypes.optional(types.string, ""),
    clientName: customtypes.optional(types.string, ""),
    clientTitle: customtypes.optional(types.string, ""),
    clientFirstname: customtypes.optional(types.string, ""),
    clientLastname: customtypes.optional(types.string, ""),
    clientBranch: customtypes.optional(types.string, ""),
    clientTelephone: customtypes.optional(types.string, ""),
    clientAddress: customtypes.optional(types.string, ""),
    exteranalRef: customtypes.optional(types.string, ""),
    internalRef1: customtypes.optional(types.string, ""),
    internalRef2: customtypes.optional(types.string, ""),
    subtotal: customtypes.optional(types.string, ""),
    discountFactor: customtypes.optional(
      types.union(types.number, types.string),
      ""
    ),
    discount: customtypes.optional(types.string, ""),
    vatIncluded: customtypes.optional(types.boolean, false),
    vat: customtypes.optional(types.string, ""),
    excludeVat: customtypes.optional(types.string, ""),
    withHoldingFactor: customtypes.optional(types.string, ""),
    withHoldingTax: customtypes.optional(types.string, ""),
    total: customtypes.optional(types.union(types.number, types.string), ""),
    documentNote: customtypes.optional(types.string, ""),
    internalNote: customtypes.optional(types.string, ""),
    recieveBy: types.maybeNull(types.union(types.string, types.number)),
    recieveByName: customtypes.optional(types.string, ""),
    recieveByPosition: customtypes.optional(types.string, ""),
    paymentMethod: customtypes.optional(types.string, ""),
    paidAmount: customtypes.optional(types.string, ""),
    changeAmount: customtypes.optional(types.string, ""),
    paymentBank: customtypes.optional(types.string, ""),
    paymentBankBranch: customtypes.optional(types.string, ""),
    paymentRefNo: customtypes.optional(types.string, ""),
    paidDate: customtypes.optional(types.string, ""),
    printCount: customtypes.optional(
      types.union(types.string, types.number),
      ""
    ),
    receiptItems: types.optional(types.array(ReceiptItem), []),
    receiptPrintLogs: types.optional(types.array(ReceiptPrintLog), []),
    status: customtypes.optional(types.string, ""),
    pin: customtypes.optional(types.string, ""),
    managerId: customtypes.optional(types.string, ""),
    tempPaymentRefNo: customtypes.optional(types.string, ""),
    tempTransferDate: customtypes.optional(types.string, ""),
    error: types.optional(ErrorModel, {}),
    alert: types.optional(MessageModel, {}),
    loading: types.optional(types.boolean, false),
  })
  .views((self: any) => ({
    get subtotalLabel() {
      return self.receiptItems.reduce(
        (sum: number, item: IReceiptItem) => sum + +item.subtotal,
        0
      );
    },
    get discountLabel() {
      const discount = +self.subtotalLabel * (+self.discountFactor / 100);
      return discount;
    },
    get amountAfterDiscountLabel() {
      const discount = +self.subtotalLabel * (+self.discountFactor / 100);
      return +self.subtotalLabel - discount;
    },
    get vatLabel() {
      const discount = +self.subtotalLabel * (+self.discountFactor / 100);
      const sumValue = +self.subtotalLabel - discount;
      return self.vatIncluded ? sumValue * 0.07 : 0;
    },
    get sumTotalLabel() {
      const discount = +self.subtotalLabel * (+self.discountFactor / 100);
      const sumValue = +self.subtotalLabel - discount;
      if (!self.vatIncluded) {
        return sumValue;
      } else {
        return sumValue + +self.vatLabel;
      }
    },
    get changeAmountLabel() {
      const amount = self.sumTotalLabel;
      if (+self.paidAmount > +amount) {
        return +self.paidAmount - +amount;
      } else {
        return "0";
      }
    },
    get receiptJSON() {
      return self.toJSON();
    },
    get posShiftIdLocalStorage() {
      return window.localStorage.getItem("posShiftId") || "";
    },
    get posText() {
      const posCode = self.pos.posCode ? self.pos.posCode + " " : "";
      const posName = self.pos.posName ? self.pos.posName : "";
      return posCode + posName;
    },
    get receiptCreateButton() {
      if (self.receiptItems.length > 0 && self.paymentMethod) {
        if (+self.paidAmount >= +self.sumTotalLabel) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
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
          console.log("exception on key", key, e);
          throw e;
        }
      });
    },
    setOrganizationName: (org: IOrgModel) => {
      self.setField({
        fieldname: "organizationName",
        value: `${org.address.province}${org.orgCode ? ` (${org.orgCode})` : ""}`,
      });
    },
    setOrganizationAddress: (address: IAddressModel) => {
      self.setField({
        fieldname: "organizationAddressLine1",
        value: address.line1,
      });
      self.setField({
        fieldname: "organizationAddressLine2",
        value: address.line2,
      });
      self.setField({
        fieldname: "organizationAddressLine3",
        value: address.line3,
      });
      self.setField({
        fieldname: "organizationAddressLine4",
        value: address.line4,
      });
    },
    addReceiptItems: (item: IReceiptItem) => {
      self.receiptItems.push(item);
    },
    deleteReceiptItems: (index: number) => {
      self.receiptItems.splice(index, 1);
    },
    getReceiptDetail: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          const result: any = yield Receipt.getById(self.id);
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
    getReceiptCashierDetail: flow(function* (posId: string) {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          const result: any = yield Receipt.get({ posId }, { name: self.id });
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
    createReceipt: flow(function* (
      posId: string,
      organizationId: string,
      organization: IOrgModel,
      recieveByName: string
    ) {
      try {
        self.setField({ fieldname: "loading", value: true });
        for (const item of self.receiptItems) {
          if (item.refType === "D" || item.refType === "PR") {
            if (self.paymentMethod === "TRANSFER") {
              item.setField({
                fieldname: "description3",
                value: self.tempTransferDate,
              });
              item.setField({
                fieldname: "description4",
                value: self.tempPaymentRefNo,
              });
            }
            item.setField({
              fieldname: "description1",
              value: `${self.clientTitle || ""}${self.clientFirstname || ""} ${self.clientLastname || ""
                }`,
            });
          }
          if (item.refType === "LR" || item.refType === "FR") {
            if (self.paymentMethod === "TRANSFER") {
              item.setField({
                fieldname: "description3",
                value: self.tempTransferDate,
              });
              item.setField({
                fieldname: "description4",
                value: self.tempPaymentRefNo,
              });
            }
          }
          if (item.refType === "AR") {
            if (self.paymentMethod === "TRANSFER") {
              item.setField({
                fieldname: "description2",
                value: self.tempTransferDate,
              });
              item.setField({
                fieldname: "description3",
                value: self.tempPaymentRefNo,
              });
            }
          }
        }
        let body = { ...self };
        body = {
          ...body,
          documentDate: moment().format("YYYY-MM-DD"),
          paidDate:
            self.paymentMethod === "CASH"
              ? undefined
              : self.paidDate || undefined,
          withHoldingFactor: undefined,
          pos: undefined,
          withHoldingTax: undefined,
          discountFactor: self.discountFactor ? +self.discountFactor / 100 : 0,
          posId,
          fromPos: true,
          recieveByName,
          organizationTaxNo: self.organizationTaxNo
            ? self.organizationTaxNo
            : "0994001013314",
          posShiftId: self.posShiftIdLocalStorage,
          organizationId,
          organization,
          subtotal: self.subtotalLabel.toFixed(2),
          discount: self.discountLabel.toFixed(2),
          vat: +self.vatLabel.toFixed(2),
          excludeVat: self.amountAfterDiscountLabel.toFixed(2),
          changeAmount:
            self.changeAmountLabel === "0"
              ? 0
              : self.changeAmountLabel.toFixed(2),
          total: +self.sumTotalLabel.toFixed(2),
          posShift: undefined,
          clientTaxNumber: self.clientTaxNumber.replace(/-/g, ""),
        };
        const result: any = yield Receipt.create(body);
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกรายการรับชำระสำเร็จค่ะ",
          `ระบบกำลังจัดพิมพ์ใบเสร็จเลขที่: ${self.documentNumber}`
        );
        // Beer14082021 post api odoo
        if (result.success) {
          for (const item of self.receiptItems) {
            if (item.refType === "AR") {
              const odooApiUrl = `${process.env.REACT_APP_API_ODOO_ENDPOINT}/rest_sync_payment.php`;
              const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contract_no: item.ref3,
                  citizen_id: "",
                  last_max_payment_id: 0
                })
              };
              const res: any = yield fetch(odooApiUrl, requestOptions);
              const response: any = yield res.json();
              console.log(response);
            }
          }
        }
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateReceipt: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          clientType: self.clientType,
          clientTaxNumber: self.clientTaxNumber,
          clientName: self.clientName,
          clientTitle: self.clientTitle,
          clientFirstname: self.clientFirstname,
          clientLastname: self.clientLastname,
          clientTelephone: self.clientTelephone,
          clientAddress: self.clientAddress,
          organizationName: self.organizationName,
          organizationAddress: self.organizationAddress,
          organizationTaxNo: self.organizationTaxNo,
          POSVATCode: self.POSVATCode,
          internalRef1: self.internalRef1,
          internalRef2: self.internalRef2,
          exteranalRef: self.exteranalRef,
          documentNote: self.documentNote,
          internalNote: self.internalNote,
          organizationAddressLine1: self.organizationAddressLine1,
          organizationAddressLine2: self.organizationAddressLine2,
          organizationAddressLine3: self.organizationAddressLine3,
          organizationAddressLine4: self.organizationAddressLine4,
        };
        const result: any = yield Receipt.update(body, parseInt(self.id));
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "เอกสารถูกปรับปรุงเรียบร้อยแล้ว"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    createReceiptPrintLog: flow(function* (
      printedDatetime: string,
      recieptPrintType?: string
    ) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          recieptPrintType: recieptPrintType || "IP",
          printedDatetime,
        };
        const result: any = yield Receipt.create(body, {
          name: `${self.id}/printlogs`,
        });
        // self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        // self.alert.setAlertMessage("บันทึกสำเร็จค่ะ", "การชำระเรียบร้อยแล้ว");
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    reprintReceiptPrintLog: flow(function* (
      printedDatetime: string,
      recieptPrintType: string
    ) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          fromPos: true,
          posShiftId: self.posShiftIdLocalStorage,
          onDutymanagerId: self.managerId,
          pin: self.pin,
          recieptPrintType,
          printedDatetime,
        };
        const result: any = yield Receipt.create(body, {
          name: `${self.id}/reprint`,
        });
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage("บันทึกสำเร็จค่ะ", "การชำระเรียบร้อยแล้ว");
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    cancelReceiptPayment: flow(function* (posId: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          fromPos: true,
          posId,
          documentNote: self.documentNote,
          pin: self.pin,
          onDutymanagerId: self.managerId,
          posShiftId: self.posShiftIdLocalStorage,
        };
        const result: any = yield Receipt.update(body, `${self.id}/cancel`);
        // self.setField({ fieldname: "pin", value: "" });
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
    onApproveReceipt: flow(function* (posId: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          fromPos: true,
          pin: self.pin,
          onDutymanagerId: self.managerId,
          posShiftId: self.posShiftIdLocalStorage,
        };
        const result: any = yield Receipt.create(body, { name: self.id });
        self.setField({ fieldname: "pin", value: "" });
        // self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    deleteReceipt: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        yield Receipt.delete(parseInt(self.id));
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "เอกสารถูกลบเรียบร้อยแล้ว"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    resetAll: () => {
      applySnapshot(self, {});
    },
  }));
export type IReceiptModel = typeof ReceiptModel.Type;
