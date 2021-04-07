import i18n from "i18next";
import { flow } from "mobx";
import { applySnapshot, IAnyModelType, types } from "mobx-state-tree";
import moment from "moment";
import { AddressModel } from "../../components/address";
import { ErrorModel } from "../../components/common/error";
import {
  AttachedFileModel,
  IAttachedFileModel,
} from "../../components/common/fileupload/AttachedFileModel";
import { MessageModel } from "../../components/common/message";
import { isValidDate } from "../../utils";
import { IInput } from "../../utils/common-interface";
import customtypes from "../../utils/mobx-types-helper";
import { OrgModel } from "../admin/organization";
import { DebtCollectionModel } from "../debtCollection/DebtCollectionModel";
import { AgreementModel } from "../loan/agreement/AgreementModel";
import { GuaranteeModel } from "../loan/guarantee/GuaranteeModel";
import { IProfileModel } from "../share/profile/ProfileModel";
import { AccountReceivable } from "./AccountReceivablesService";
import { AccountReceivableTransactions } from "./AccountReceivableTransactionsService";

export const DebtCollectionAcknowledgementModel = types
  .model("DebtCollectionAcknowledgementModel", {
    id: types.optional(types.string, ""),
    preAccountReceivableId: types.maybe(
      types.union(types.string, types.number, types.null, types.undefined)
    ),
    preAccountReceivableDocumentNumber: customtypes.optional(types.string, ""),
    isAcknowledge: types.optional(types.boolean, false),
    idCardNo: types.optional(types.string, ""),
    title: types.optional(types.string, ""),
    firstname: types.optional(types.string, ""),
    lastname: types.optional(types.string, ""),
    telephone: types.optional(types.string, ""),
    isBehalf: types.optional(types.boolean, false),
    onBehalfOf: customtypes.optional(types.string, ""),
    outstandingDebtBalance: customtypes.optional(
      types.union(types.number, types.string),
      0
    ),
    installmentAmount: customtypes.optional(
      types.union(types.number, types.string),
      0
    ),
    attachedFiles: customtypes.optional(types.array(AttachedFileModel), []),
    birthDate: types.maybe(
      types.union(types.string, types.null, types.undefined)
    ), ////  เพิ่มมา
    isOnlyBirthYear: types.optional(types.boolean, false), ////  เพิ่มมา
    location: customtypes.optional(types.string, ""),
    acknowledgeDate: customtypes.optional(types.string, ""),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {}),
  })
  .views((self: any) => ({
    get fileList() {
      return self.attachedFiles.map((item: IAttachedFileModel) => item.file);
    },
    get debtCollectionAcknowledgementJSON() {
      return self.toJSON();
    },
    get ageDisplay() {
      const untilDate: any = moment();
      const birthDate: any = moment(self.birthDate, "YYYY-MM-DD");
      const yearDiff = moment.duration(untilDate - birthDate).as("years");
      let age = 0;
      if (self.birthDate) {
        age =
          self.birthDate.length === 10 && isValidDate(birthDate.toDate())
            ? Math.floor(yearDiff)
            : 0;
      }
      return !isNaN(age) && age !== 0 ? age : "-";
    },
    setIsBehalfBorrower: (profile: IProfileModel) => {
      self.setField({ fieldname: "idCardNo", value: profile.idCardNo });
      self.setField({ fieldname: "title", value: profile.title });
      self.setField({ fieldname: "firstname", value: profile.firstname });
      self.setField({ fieldname: "lastname", value: profile.lastname });
      self.setField({ fieldname: "telephone", value: profile.telephone });
      self.setField({ fieldname: "birthDate", value: profile.birthDate });
      self.setField({
        fieldname: "isOnlyBirthYear",
        value: profile.isOnlyBirthYear,
      });
    },
    resetIsBehalfBorrower: () => {
      self.setField({ fieldname: "title", value: "" });
      self.setField({ fieldname: "firstname", value: "" });
      self.setField({ fieldname: "lastname", value: "" });
      self.setField({ fieldname: "telephone", value: "" });
      self.setField({ fieldname: "birthDate", value: undefined });
      self.setField({ fieldname: "isOnlyBirthYear", value: false });
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
    addFiles: (files: File[]) => {
      files.forEach((_file: File) => {
        const attachedFile = AttachedFileModel.create({
          file: _file,
          refId: `${self.id || self.preAccountReceivableId}`,
          refType: "ACKNOWLEDGEMENT.ATTACHEDFILE",
        });
        self.attachedFiles.push(attachedFile);
      });
    },
    removeFile: (index: number) => {
      try {
        self.attachedFiles[index].deleteFile();
        self.attachedFiles.splice(index, 1);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "ข้อมูลถูกลบเรียบร้อยแล้ว",
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
        console.log(e);
        throw e;
      }
    },
    resetAll: () => {
      applySnapshot(self, {});
    },
  }));
export type IDebtCollectionAcknowledgementModel = typeof DebtCollectionAcknowledgementModel.Type;

export const AccountReceivableControlModel = types
  .model("AccountReceivableControlModel", {
    id: customtypes.optional(types.string, ""),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdBy: types.maybeNull(types.number),
    createdByName: customtypes.optional(types.string, ""),
    updatedBy: types.maybeNull(types.number),
    updatedByName: customtypes.optional(types.string, ""),
    accountReceivableId: customtypes.optional(types.string, ""),
    accountReceivable: types.maybeNull(
      types.late((): IAnyModelType => AccountReceivableModel)
    ),
    asOfDate: customtypes.optional(types.string, ""),
    sourceARTTotalPaidAmount: customtypes.optional(types.string, ""),
    sourceARTLastPaidDate: customtypes.optional(types.string, ""),
    expectedPaidTimes: customtypes.optional(types.number, 0),
    outstandingDebtBalance: customtypes.optional(types.string, ""),
    expectedPaidAmount: customtypes.optional(types.string, ""),
    totalPaidAmount: customtypes.optional(types.string, ""),
    overDueBalance: customtypes.optional(types.string, ""),
    paidRatio: customtypes.optional(types.string, ""),
    paidPercentage: customtypes.optional(types.string, ""),
    status: customtypes.optional(types.string, ""),
    paidInstallmentCount: customtypes.optional(
      types.union(types.string, types.number),
      ""
    ),
  })
  .views((self: any) => ({
    get paidRatioLabel() {
      if (+self.paidRatio) {
        return `${(+self.paidRatio * 1000) / 10}%`;
      }
      return "0%";
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
  }));
export type IAccountReceivableControlModel = typeof AccountReceivableControlModel.Type;

export const AccountReceivableTransactionsModel = types
  .model("AccountReceivableTransactionsModel", {
    id: customtypes.optional(types.string, ""),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdBy: types.maybeNull(types.number),
    createdByName: customtypes.optional(types.string, ""),
    updatedBy: types.maybeNull(types.number),
    updatedByName: customtypes.optional(types.string, ""),
    accountReceivableId: customtypes.optional(types.string, ""),
    paymentType: customtypes.optional(types.string, ""),
    paymentId: customtypes.optional(types.string, ""),
    paymentMethod: customtypes.optional(types.string, ""),
    paymentReferenceNo: customtypes.optional(types.string, ""),
    paidDate: customtypes.optional(types.string, ""),
    paidAmount: customtypes.optional(types.string, ""),
    outstandingDebtBalance: customtypes.optional(types.string, ""),
    status: customtypes.optional(types.string, ""),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {}),
  })
  .views((self: any) => ({
    get arTransactionsJSON() {
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
          console.log("exception on key", key, e);
          throw e;
        }
      });
    },
    createArTransaction: flow(function* (accountReceivableId: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          // createdDate: self.createdDate,
          accountReceivableId,
          paidDate: self.paidDate,
          paymentType: self.paymentType,
          paymentMethod: self.paymentMethod,
          paidAmount: self.paidAmount,
          paymentReferenceNo: self.paymentReferenceNo,
        };
        const result: any = yield AccountReceivableTransactions.create(body);
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.error.setErrorMessage(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateArTransaction: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          // createdDate: self.createdDate,
          accountReceivableId: self.accountReceivableId,
          paidDate: self.paidDate,
          paymentMethod: self.paymentMethod,
          paidAmount: self.paidAmount,
          paymentReferenceNo: self.paymentReferenceNo,
        };
        const result: any = yield AccountReceivableTransactions.update(
          body,
          parseInt(self.id)
        );
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
    delete_data: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        yield AccountReceivableTransactions.delete(parseInt(self.id));
        self.error.setField({ fieldname: "tigger", value: false });

        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "ประวัติการชำระเงินถูกลบเรียบร้อยแล้ว",
        });
      } catch (e) {
        self.error.setErrorMessage(e);

        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    resetAll: () => {
      applySnapshot(self, {});
    },
  }));
export type IAccountReceivableTransactionsModel = typeof AccountReceivableTransactionsModel.Type;

export const AccountReceivableModel = types
  .model("AccountReceivableModel", {
    isSelected: types.optional(types.boolean, false),
    id: types.optional(types.string, ""),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdBy: types.maybeNull(types.number),
    createdByName: customtypes.optional(types.string, ""),
    updatedBy: types.maybeNull(types.number),
    updatedByName: customtypes.optional(types.string, ""),
    collection: types.maybeNull(
      types.late((): IAnyModelType => DebtCollectionModel)
    ),
    organizationId: types.optional(types.string, ""),
    refReportCode: types.optional(types.string, ""),
    fiscalYear: types.optional(types.string, ""),
    agreementId: types.optional(types.string, ""),
    guaranteeId: customtypes.optional(types.string, ""),
    documentDate: customtypes.optional(types.string, ""),
    documentNumber: customtypes.optional(types.string, ""),
    internalRef: customtypes.optional(types.string, ""),
    status: customtypes.optional(types.string, ""),
    startDate: customtypes.optional(types.string, ""),
    endDate: customtypes.optional(types.string, ""),
    closeDate: customtypes.optional(types.string, ""),
    name: types.optional(types.string, ""),
    loanAmount: customtypes.optional(types.string, ""),
    loanDurationYear: customtypes.optional(types.string, ""),
    loanDurationMonth: types.optional(types.string, ""),
    installmentAmount: customtypes.optional(types.string, ""),
    installmentLastAmount: customtypes.optional(types.string, ""),
    installmentPeriodValue: types.optional(types.number, 0),
    installmentPeriodUnit: customtypes.optional(types.string, ""),
    installmentPeriodDay: types.optional(types.number, 0),
    installmentTimes: types.optional(types.number, 0),
    installmentFirstDate: customtypes.optional(types.string, ""),
    installmentLastDate: customtypes.optional(types.string, ""),
    paidTimeCounts: types.optional(types.number, 0),
    paidMonthCounts: types.optional(types.number, 0),
    paidInstallmentCount: types.optional(types.number, 0),
    overDueInstallmentCount: customtypes.optional(types.number, 0),
    lastPaymentDate: customtypes.optional(types.string, ""),
    // outstandingDebtBalance: customtypes.optional(types.string, ""),
    outstandingDebtBalance: customtypes.optional(
      types.union(types.number, types.string),
      0
    ),
    // overDueBalance: customtypes.optional(types.string, ""),
    overDueBalance: customtypes.optional(
      types.union(types.number, types.string),
      0
    ),
    unpaidMonthCountsInArow: customtypes.optional(types.number, 0),
    aging: customtypes.optional(types.number, 0),
    paidRatio: customtypes.optional(types.string, ""),
    borrowerContactTelephone: types.optional(types.string, ""),
    guarantorContactTelephone: types.optional(types.string, ""),
    borrowerContactAddress: types.optional(AddressModel, {}),
    guarantorContactAddress: types.optional(AddressModel, {}),
    organization: types.optional(OrgModel, {}),
    guarantee: customtypes.optional(GuaranteeModel, {}),
    agreement: customtypes.optional(AgreementModel, {}),
    startOverdueDate: customtypes.optional(types.string, ""),
    transactions: types.optional(
      types.array(AccountReceivableTransactionsModel),
      []
    ),
    control: customtypes.optional(AccountReceivableControlModel, {}),
    controls: types.optional(types.array(AccountReceivableControlModel), []),
    debtAcknowledgement: customtypes.optional(
      DebtCollectionAcknowledgementModel,
      {}
    ),
    caseExpirationDate: customtypes.optional(types.string, ""),
    comments: types.optional(types.string, ""),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {}),
  })
  .views((self: any) => ({
    get fullname() {
      return self.name || self.agreement.name;
    },
    get last_signin_date_formated() {
      return self.lastSigninDate;
    },
    get statusLabel() {
      return self.active
        ? i18n.t("module.admin.userModel.enable")
        : i18n.t("module.admin.userModel.disable");
    },
    get arAging() {
      return "-";
    },
    get totalPayment() {
      const loanAmount = self.loanAmount ? +self.loanAmount : 0;
      const outstandingDebtBalance = self.outstandingDebtBalance
        ? +self.outstandingDebtBalance
        : 0;
      return loanAmount - outstandingDebtBalance;
    },
    get transactions_sort_by_date() {
      return self.transactions.sort((a: any, b: any) => {
        const c: any = new Date(a.paidDate);
        const d: any = new Date(b.paidDate);
        return c - d;
      });
    },
    get diffMonths() {
      if (self.endDate) {
        const month = moment(self.endDate).diff(moment(), "months");
        if (month > 0) {
          return month;
        } else {
          return "0";
        }
      } else {
        return "";
      }
    },
    get accountReceivableModelJSON() {
      return self.toJSON();
    },
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      if (typeof self[fieldname] === "number") {
        const cleaned = ("" + value).replace(/\D/g, "");
        value = cleaned === "" ? 0 : +cleaned;
      }
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
    getAccountReceivableDetail: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          const result: any = yield AccountReceivable.getById(self.id);
          self.setAllField(result.data);
          self.error.setField({ fieldname: "tigger", value: false });
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
          console.log(e);
        } finally {
          self.setField({ fieldname: "loading", value: false });
        }
      }
    }),
    updateAccountReceivable: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          loanAmount: self.loanAmount,
          loanDurationYear: self.loanDurationYear,
          loanDurationMonth: self.loanDurationMonth,
          installmentAmount: self.installmentAmount,
          installmentLastAmount: self.installmentLastAmount,
          installmentPeriodValue: self.installmentPeriodValue,
          installmentPeriodUnit: self.installmentPeriodUnit,
          installmentPeriodDay: self.installmentPeriodDay,
          installmentTimes: self.installmentTimes,
          installmentFirstDate: self.installmentFirstDate,
          installmentLastDate: self.installmentLastDate,
          name: self.name,
        };
        const result: any = yield AccountReceivable.update(
          body,
          parseInt(self.id)
        );
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
    closeAccountReceivable: flow(function* (status: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          status,
          comments: self.comments,
        };
        const result: any = yield AccountReceivable.update(
          body,
          parseInt(self.id)
        );
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
    updateDebtAcknowledgement: flow(function* (
      debtAcknowledgement: IDebtCollectionAcknowledgementModel,
      createMode: boolean
    ) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          debtAcknowledgement: {
            ...debtAcknowledgement,
            debtAmount: +self.outstandingDebtBalance,
          },
          accountReceivable: createMode ? { ...self } : undefined,
        };
        let result: any;
        if (createMode) {
          result = yield AccountReceivable.formCreate(
            body,
            `${self.id}/acknowledge`
          );
        } else {
          result = yield AccountReceivable.formUpdate(
            body,
            `${self.id}/acknowledge`
          );
        }
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "เอกสารถูกบันทึกเรียบร้อยแล้ว",
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({ fieldname: "message", value: e.message });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack,
        });
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateBorrowerContactAddress: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          borrowerContactTelephone: self.borrowerContactTelephone,
          borrowerContactAddress: self.borrowerContactAddress,
          name: self.name,
        };
        yield AccountReceivable.update(body, parseInt(self.id));
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
    updateGuarantorContactAddress: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          guarantorContactTelephone: self.guarantorContactTelephone,
          guarantorContactAddress: self.guarantorContactAddress,
          name: self.name,
        };
        yield AccountReceivable.update(body, parseInt(self.id));
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
    printAcknowledge: flow(function* (
      debtAcknowledgement: IDebtCollectionAcknowledgementModel,
      accountReceivable?: any
    ) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          debtAcknowledgement,
          accountReceivable: accountReceivable
            ? { ...accountReceivable }
            : { ...self },
        };
        yield AccountReceivable.create(body, {
          name: `${self.id}/print_dept_acknowledge_form`,
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
    }),
    delete_data: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        yield AccountReceivable.delete(parseInt(self.id));
        self.error.setField({ fieldname: "tigger", value: false });

        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "เอกสารถูกลบเรียบร้อยแล้ว",
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({ fieldname: "message", value: e.message });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack,
        });
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    printForm: flow(function* (name?: string) {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });

          yield AccountReceivable.getById(self.id, {
            name: name ? name : "print_form",
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
        } finally {
          self.setField({ fieldname: "loading", value: false });
        }
      }
    }),
    resetAll: () => {
      applySnapshot(self, {});
    },
  }));
export type IAccountReceivableModel = typeof AccountReceivableModel.Type;
