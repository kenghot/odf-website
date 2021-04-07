import i18n from "i18next";
import { flow } from "mobx";
import { applySnapshot, clone, detach, getRoot, types } from "mobx-state-tree";
import moment from "moment";
import { AddressModel } from "../../../components/address";
import { ErrorModel } from "../../../components/common/error";
import { MessageModel } from "../../../components/common/message";
import {
  IDCardModel,
  IIDCardModel
} from "../../../components/idcard/IDCardModel";
import { IInput } from "../../../utils/common-interface";
import {
  date_YYYYMMDD_TO_DDMMYYYY,
  idcardFormatting
} from "../../../utils/format-helper";
import customtypes from "../../../utils/mobx-types-helper";
import { OrgModel } from "../../admin/organization";
import { VoucherModel } from "../../finance/voucher/VoucherModel";
import { ProfileModel } from "../../share/profile/ProfileModel";
import { IRequestItemModel, RequestModel } from "../request/RequestModel";
import { Agreement } from "./AgreementService";

export const AgreementItemModel = types
  .model("AgreementItemModel", {
    id: types.maybe(types.string),
    agreementId: types.optional(types.string, ""),
    borrowerTelephone: types.optional(types.string, ""),
    borrowerRegisteredAddressType: types.optional(types.number, 0),
    borrowerIdCardAddress: types.optional(AddressModel, {}),
    borrower: types.optional(ProfileModel, {}),
    borrowerRegisteredAddress: types.optional(AddressModel, {}),
    guarantor: types.optional(ProfileModel, {})
  })
  .views((self: any) => ({
    get fullname() {
      const name = `${self.borrower.title}${self.borrower.firstname} ${self.borrower.lastname}`;
      const id = self.borrower.idCardNo
        ? ` (${idcardFormatting(self.borrower.idCardNo)})`
        : "";
      return `${name}  ${id}`;
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
    onRemove: () => {
      let root: any;
      root = getRoot(self);
      root.onRemoveItem(self);
    }
  }));
export type IAgreementItemModel = typeof AgreementItemModel.Type;

export const AgreementModel = types
  .model("AgreementModel", {
    isSelected: types.optional(types.boolean, false),
    id: types.optional(types.string, ""),

    organizationId: types.optional(types.string, ""),
    organization: types.optional(OrgModel, {}),
    fiscalYear: types.optional(types.string, ""),
    documentDate: customtypes.optional(
      types.string,
      moment().format("YYYY-MM-DD")
    ),
    documentNumber: types.optional(types.string, ""),
    refReportCode: types.optional(types.string, ""),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdByName: customtypes.optional(types.string, ""),
    updatedByName: customtypes.optional(types.string, ""),
    createdBy: types.maybeNull(types.number),
    updatedBy: types.maybeNull(types.number),

    agreementType: types.optional(types.string, "P"),
    name: types.optional(types.string, ""),

    status: types.optional(types.string, ""),
    startDate: types.maybeNull(types.string),
    endDate: types.maybeNull(types.string),
    loanPaymentDate: types.maybeNull(types.string),
    disclaimDate: types.maybeNull(types.string),
    cancelDate: types.maybeNull(types.string),
    closeDate: types.maybeNull(types.string),

    requestId: types.maybeNull(types.string),
    request: types.maybeNull(RequestModel),
    guaranteeId: types.maybeNull(types.string),
    guaranteeDocumentNumber: customtypes.optional(types.string, ""),
    guaranteeDocumentDate: customtypes.optional(types.string, ""),

    signLocation: types.optional(types.string, ""),
    signLocationAddress: types.optional(AddressModel, {}),
    agreementAuthorizedTitle: types.optional(types.string, ""),
    agreementAuthorizedFirstname: types.optional(types.string, ""),
    agreementAuthorizedLastname: types.optional(types.string, ""),
    agreementAuthorizedPosition: types.optional(types.string, ""),
    agreementAuthorizedCommandNo: types.optional(types.string, ""),
    agreementAuthorizedCommandDate: types.maybeNull(types.string),
    witness1: types.optional(types.string, ""),
    witness2: types.optional(types.string, ""),

    loanAmount: types.optional(types.string, ""),
    loanDurationYear: types.optional(types.string, ""),
    loanDurationMonth: types.optional(types.string, ""),
    loanPaymentLocation: types.optional(types.string, ""),
    installmentAmount: types.optional(types.string, ""),
    installmentLastAmount: types.optional(types.string, ""),
    installmentPeriodValue: types.optional(types.number, 0),
    installmentPeriodUnit: types.optional(types.string, ""),
    installmentPeriodDay: types.optional(types.number, 0),
    installmentTimes: types.optional(types.number, 0),
    installmentFirstDate: types.maybeNull(types.string),
    installmentLastDate: types.maybeNull(types.string),
    agreementCancelReason: types.optional(types.string, ""),
    agreementItems: types.optional(types.array(AgreementItemModel), []),
    idCardItems: types.optional(types.array(IDCardModel), []),
    voucher: types.optional(VoucherModel, {}),
    error: types.optional(ErrorModel, {}),
    alert: types.optional(MessageModel, {}),
    loading: types.optional(types.boolean, false)
  })
  .views((self: any) => ({
    get listitem() {
      return {
        key: self.id,
        value: self.id,
        text: self.documentNumber,
        description: self.documentNumber
      };
    },
    get fullname() {
      return self.agreementType === "G"
        ? self.name
        : self.agreementItems.length > 0
          ? self.agreementItems[0].fullname
          : "";
    },
    get last_signin_date_formated() {
      return self.lastSigninDate;
    },
    get statusLabel() {
      return self.active
        ? i18n.t("module.admin.userModel.enable")
        : i18n.t("module.admin.userModel.disable");
    },
    get ref2ArLabel() {
      const spaceText = `${"0"}`;
      if (self.id.length < 8) {
        const diff = 8 - +self.id.length;
        return `${spaceText.repeat(+diff)}${self.id}`;
      } else {
        return self.id;
      }
    }
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      if (typeof self[fieldname] === "number") {
        value = value !== "" ? +value : undefined;
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
    addAgreementItems: (
      item: IAgreementItemModel,
      idCardItem: IIDCardModel
    ) => {
      if (self.agreementItems.length < 5) {
        self.agreementItems.push(item);
        self.idCardItems.push(idCardItem);
      }
    },
    retrieveRequestData: flow(function* () {
      if (self.requestId) {
        self.request = RequestModel.create({ id: self.requestId });
        yield self.request.getRequestDetail();
        const agreementItems: IAgreementItemModel[] = [];
        self.request.requestItems.forEach((item: IRequestItemModel) => {
          agreementItems.push(
            AgreementItemModel.create({
              agreementId: self.id,
              borrower: clone(item.borrower),
              borrowerTelephone: item.borrower.telephone,
              borrowerIdCardAddress: clone(item.borrower.idCardAddress),
              borrowerRegisteredAddressType:
                item.borrower.registeredAddressType,
              borrowerRegisteredAddress: clone(item.borrower.registeredAddress),
              guarantor: clone(item.guarantor)
            })
          );
        });
        self.setField({
          fieldname: "agreementAuthorizedTitle",
          value: self.request.organization.agreementAuthorizedTitle
        });
        self.setField({
          fieldname: "agreementAuthorizedFirstname",
          value: self.request.organization.agreementAuthorizedFirstname
        });
        self.setField({
          fieldname: "agreementAuthorizedLastname",
          value: self.request.organization.agreementAuthorizedLastname
        });
        self.setField({
          fieldname: "agreementAuthorizedPosition",
          value: self.request.organization.agreementAuthorizedPosition
        });
        self.setField({
          fieldname: "agreementAuthorizedCommandNo",
          value: self.request.organization.agreementAuthorizedCommandNo
        });
        self.setField({
          fieldname: "agreementAuthorizedCommandDate",
          value: self.request.organization.agreementAuthorizedCommandDate
        });

        self.setField({
          fieldname: "witness1",
          value: self.request.organization.witness1
        });
        self.setField({
          fieldname: "witness2",
          value: self.request.organization.witness2
        });
        self.setField({ fieldname: "agreementItems", value: agreementItems });
        //////////////////////////////////  รายละเอียดการกู้มีเวลาผ่อนชำระเป็น  //////////////////////////////////
        // if (self.request.installmentPeriodUnit === "month") {
        if (self.request.result3.approveBudget) {
          self.setField({
            fieldname: "loanAmount",
            value: self.request.result3.approveBudget
          });
          if (
            self.request.installmentPeriodValue &&
            self.request.installmentTimes
          ) {
            const year = Math.floor(
              (self.request.installmentPeriodValue *
                +self.request.installmentTimes) /
              12
            );
            const month =
              (self.request.installmentPeriodValue *
                +self.request.installmentTimes) %
              12;
            self.setField({
              fieldname: "loanDurationYear",
              value: year.toString()
            });
            self.setField({
              fieldname: "loanDurationMonth",
              value: month.toString()
            });
          }
        }
        ////////////////////////////////////////////////////////////////////////////////////////
        self.setField({
          fieldname: "installmentAmount",
          value: self.request.installmentAmount
        });
        self.setField({
          fieldname: "installmentPeriodValue",
          value: self.request.installmentPeriodValue
        });
        self.setField({
          fieldname: "installmentTimes",
          value: self.request.installmentTimes
        });
        self.setField({
          fieldname: "installmentPeriodDay",
          value: self.request.installmentPeriodDay
        });
        self.setField({
          fieldname: "installmentFirstDate",
          value: self.request.installmentFirstDate
        });
        self.setField({
          fieldname: "installmentLastDate",
          value: self.request.installmentLastDate
        });
        self.setField({
          fieldname: "installmentLastAmount",
          value: self.request.installmentLastAmount
        });
      }
    }),
    setAgreementItems: () => {
      const tempAgreementItems = [];
      const tempIdCardItems = [];
      tempAgreementItems.push(AgreementItemModel.create({}));
      tempIdCardItems.push(IDCardModel.create({}));

      self.setField({
        fieldname: "agreementItems",
        value: tempAgreementItems
      });
      self.setField({ fieldname: "idCardItems", value: tempIdCardItems });
    },
    onRemoveItem: (item: IAgreementItemModel) => {
      detach(item);
    },
    createAgreement: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        for (const item of self.agreementItems) {
          ///// เซตค่าให้ที่อยู่ตามทะเบียนบ้าน ผู้กู้
          if (item.borrowerRegisteredAddressType === 0) {
            item.setField({
              fieldname: "borrowerRegisteredAddress",
              value: clone(item.borrowerIdCardAddress)
            });
          }
        }
        const body = {
          organization: {
            id: self.organizationId
          },
          request: {
            id: self.requestId ? self.requestId : undefined
          },
          agreementType: self.agreementType,
          documentDate: self.documentDate,
          startDate: self.startDate,
          endDate: self.endDate,
          name: self.name,
          signLocation: self.signLocation,
          signLocationAddress: self.signLocationAddress,
          agreementAuthorizedTitle: self.agreementAuthorizedTitle,
          agreementAuthorizedFirstname: self.agreementAuthorizedFirstname,
          agreementAuthorizedLastname: self.agreementAuthorizedLastname,
          agreementAuthorizedPosition: self.agreementAuthorizedPosition,
          agreementAuthorizedCommandNo: self.agreementAuthorizedCommandNo,
          agreementAuthorizedCommandDate: self.agreementAuthorizedCommandDate,
          witness1: self.witness1,
          witness2: self.witness2,
          agreementItems: self.agreementItems,
          loanAmount: self.loanAmount,
          loanDurationYear: self.loanDurationYear,
          loanDurationMonth: self.loanDurationMonth,
          loanPaymentLocation: self.loanPaymentLocation,
          installmentAmount: self.installmentAmount,
          installmentLastAmount: self.installmentLastAmount,
          installmentPeriodValue: self.installmentPeriodValue,
          installmentPeriodUnit: self.installmentPeriodUnit,
          installmentPeriodDay: self.installmentPeriodDay,
          installmentFirstDate: self.installmentFirstDate,
          installmentTimes: self.installmentTimes,
          installmentLastDate: self.installmentLastDate,
          agreementCancelReason: self.agreementCancelReason
        };
        const result = yield Agreement.create(body);
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "เอกสารถูกสร้างเรียบร้อยแล้ว"
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({ fieldname: "message", value: e.message });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack
        });
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    getAgreementDetail: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          const result = yield Agreement.getById(self.id);
          self.setAllField(result.data);
          const idCardList: IIDCardModel[] = [];
          self.agreementItems.forEach((item: IAgreementItemModel) => {
            idCardList.push(
              IDCardModel.create({
                id: item.borrower.idCardNo,
                title: item.borrower.title,
                firstname: item.borrower.firstname,
                lastname: item.borrower.lastname,
                birthday: date_YYYYMMDD_TO_DDMMYYYY(item.borrower.birthDate),
                issued_date: date_YYYYMMDD_TO_DDMMYYYY(
                  item.borrower.idCardIssuedDate
                ),
                expired_date: date_YYYYMMDD_TO_DDMMYYYY(
                  item.borrower.idCardExpireDate
                ),
                issuer: item.borrower.idCardIssuer,
                address: clone(item.borrowerIdCardAddress),
                age: item.borrower.age
              })
            );
          });

          self.setField({
            fieldname: "idCardItems",
            value: idCardList
          });
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
    updateAgreement: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        for (const item of self.agreementItems) {
          ///// เซตค่าให้ที่อยู่ตามทะเบียนบ้าน ผู้กู้
          if (item.borrowerRegisteredAddressType === 0) {
            item.setField({
              fieldname: "borrowerRegisteredAddress",
              value: clone(item.borrowerIdCardAddress)
            });
          }
        }
        const body = {
          request: {
            id: self.requestId
          },
          fiscalYear: self.fiscalYear,
          documentDate: self.documentDate,
          startDate: self.startDate,
          endDate: self.endDate,
          name: self.name,
          signLocation: self.signLocation,
          signLocationAddress: self.signLocationAddress,
          agreementAuthorizedTitle: self.agreementAuthorizedTitle,
          agreementAuthorizedFirstname: self.agreementAuthorizedFirstname,
          agreementAuthorizedLastname: self.agreementAuthorizedLastname,
          agreementAuthorizedPosition: self.agreementAuthorizedPosition,
          agreementAuthorizedCommandNo: self.agreementAuthorizedCommandNo,
          agreementAuthorizedCommandDate: self.agreementAuthorizedCommandDate,
          witness1: self.witness1,
          witness2: self.witness2,
          agreementItems: self.agreementItems,
          loanAmount: self.loanAmount,
          loanDurationYear: self.loanDurationYear,
          loanDurationMonth: self.loanDurationMonth,
          loanPaymentLocation: self.loanPaymentLocation,
          installmentAmount: self.installmentAmount,
          installmentLastAmount: self.installmentLastAmount,
          installmentPeriodValue: self.installmentPeriodValue,
          installmentPeriodUnit: self.installmentPeriodUnit,
          installmentPeriodDay: self.installmentPeriodDay,
          installmentFirstDate: self.installmentFirstDate,
          installmentTimes: self.installmentTimes,
          installmentLastDate: self.installmentLastDate,
          agreementCancelReason: self.agreementCancelReason
        };

        yield Agreement.update(body, parseInt(self.id));

        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "เอกสารถูกปรับปรุงเรียบร้อยแล้ว"
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({ fieldname: "message", value: e.message });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack
        });
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateAgreementStatus: flow(function* (updatedStatus: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          agreementCancelReason: self.agreementCancelReason,
          status: updatedStatus
        };
        yield Agreement.update(body, parseInt(self.id));
        self.error.setField({ fieldname: "tigger", value: false });
        // self.alert.setField({ fieldname: "tigger", value: true });
        // self.alert.setField({
        //   fieldname: "title",
        //   value: "บันทึกสำเร็จค่ะ"
        // });
        // self.alert.setField({
        //   fieldname: "message",
        //   value: "เอกสารถูกปรับปรุงเรียบร้อยแล้ว"
        // });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({ fieldname: "message", value: e.message });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack
        });
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    delete_data: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        yield Agreement.delete(parseInt(self.id));
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "เอกสารถูกลบเรียบร้อยแล้ว"
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({ fieldname: "message", value: e.message });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack
        });
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    printAgreement: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });

          yield Agreement.getById(self.id, { name: "print_agreement" });
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
        } finally {
          self.setField({ fieldname: "loading", value: false });
        }
      }
    }),
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));
export type IAgreementModel = typeof AgreementModel.Type;
