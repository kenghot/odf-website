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
import { date_YYYYMMDD_TO_DDMMYYYY } from "../../../utils";
import { IInput } from "../../../utils/common-interface";
import {
  date_DDMMYYYY_TO_YYYYMMDD_BE_TO_CE,
  idcardFormatting
} from "../../../utils/format-helper";
import customtypes from "../../../utils/mobx-types-helper";
import { OcupationModel } from "../../admin/occupation";
import { OrgModel } from "../../admin/organization";
import { ProfileModel } from "../../share/profile/ProfileModel";
import { AgreementModel } from "../agreement/AgreementModel";
import { IRequestItemModel, RequestModel } from "../request/RequestModel";
import { Guarantee } from "./GuaranteesService";

export const GuaranteeItemModel = types
  .model("GuaranteeItemModel", {
    id: types.maybe(types.string),
    guaranteeId: types.optional(types.string, ""),
    guarantorTelephone: types.optional(types.string, ""),
    guarantorCompanyName: types.optional(types.string, ""),
    guarantorPosition: types.optional(types.string, ""),
    guarantorSalary: types.optional(types.string, "0"),
    guarantor: types.optional(ProfileModel, {}),
    guarantorRegisteredAddressType: types.optional(types.number, 0),
    guarantorIdCardAddress: types.optional(AddressModel, {}),
    guarantorRegisteredAddress: types.optional(AddressModel, {}),
    guarantorOccupation: types.optional(OcupationModel, {}),
    borrower: types.optional(ProfileModel, {})
  })
  .views((self: any) => ({
    get fullname() {
      const name = `${self.guarantor.title}${self.guarantor.firstname} ${self.guarantor.lastname}`;
      const id = self.guarantor.idCardNo
        ? `(${idcardFormatting(self.guarantor.idCardNo)})`
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
    },
    setFieldProfileGuarantor: (profileCard: IIDCardModel) => {
      profileCard.setField({ fieldname: "id", value: self.guarantor.idCardNo });
      profileCard.setField({ fieldname: "title", value: self.guarantor.title });
      profileCard.setField({
        fieldname: "firstname",
        value: self.guarantor.firstname
      });
      profileCard.setField({
        fieldname: "lastname",
        value: self.guarantor.lastname
      });
      profileCard.setField({
        fieldname: "birthday",
        value: date_YYYYMMDD_TO_DDMMYYYY(self.guarantor.birthDate)
      });
      // profileCard.setField({ fieldname: "gender", value:  });
      profileCard.setField({
        fieldname: "issued_date",
        value: date_YYYYMMDD_TO_DDMMYYYY(self.guarantor.idCardIssuedDate)
      });
      profileCard.setField({
        fieldname: "expired_date",
        value: date_YYYYMMDD_TO_DDMMYYYY(self.guarantor.idCardExpireDate)
      });
      profileCard.setField({
        fieldname: "issuer",
        value: self.guarantor.idCardIssuer
      });
      profileCard.address.setAllField(self.guarantorRegisteredAddress);
    },
    getFieldProfileGuarantor: (profileCard: IIDCardModel) => {
      self.guarantor.setField({ fieldname: "idCardNo", value: profileCard.id });
      self.guarantor.setField({ fieldname: "title", value: profileCard.title });
      self.guarantor.setField({
        fieldname: "firstname",
        value: profileCard.firstname
      });
      self.guarantor.setField({
        fieldname: "lastname",
        value: profileCard.lastname
      });
      self.guarantor.setField({
        fieldname: "birthDate",
        value: date_DDMMYYYY_TO_YYYYMMDD_BE_TO_CE(profileCard.birthday)
      });
      self.guarantor.setField({
        fieldname: "idCardIssuedDate",
        value: date_DDMMYYYY_TO_YYYYMMDD_BE_TO_CE(profileCard.issued_date)
      });
      self.guarantor.setField({
        fieldname: "idCardExpireDate",
        value: date_DDMMYYYY_TO_YYYYMMDD_BE_TO_CE(profileCard.expired_date)
      });
      self.guarantor.setField({
        fieldname: "idCardIssuer",
        value: profileCard.issuer
      });
      self.guarantorRegisteredAddress.setAllField(profileCard.address);
    }
  }));
export type IGuaranteeItemModel = typeof GuaranteeItemModel.Type;

export const GuaranteeModel = types
  .model("GuaranteeModel", {
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

    guaranteeType: types.optional(types.string, "P"),
    name: customtypes.optional(types.string, ""),

    status: customtypes.optional(types.string, ""),
    startDate: types.maybeNull(types.string),
    endDate: types.maybeNull(types.string),
    cancelDate: types.maybeNull(types.string),

    requestId: types.maybeNull(types.string),
    request: types.maybeNull(RequestModel),
    agreementId: types.maybeNull(types.string),
    agreement: types.maybeNull(AgreementModel),
    isSelectedAgreement: types.optional(AgreementModel, {}),
    existingAgreementId: customtypes.optional(types.string, ""),
    existingAgreementDocumentNumber: customtypes.optional(types.string, ""),
    agreementDocumentNumber: customtypes.optional(types.string, ""),
    agreementDocumentDate: customtypes.optional(types.string, ""),

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

    guaranteeCancelReason: types.optional(types.string, ""),
    guaranteeItems: types.optional(types.array(GuaranteeItemModel), []),
    idCardItems: types.optional(types.array(IDCardModel), []),

    error: types.optional(ErrorModel, {}),
    alert: types.optional(MessageModel, {}),
    loading: types.optional(types.boolean, false)
  })
  .views((self: any) => ({
    get fullname() {
      return self.guaranteeType === "G"
        ? self.name
        : self.guaranteeItems.length > 0
          ? self.guaranteeItems[0].fullname
          : "";
    },

    get last_signin_date_formated() {
      return self.lastSigninDate;
    },
    get statusLabel() {
      return self.isActive
        ? i18n.t("module.admin.userModel.enable")
        : i18n.t("module.admin.userModel.disable");
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
    addGuaranteeItems: (
      item: IGuaranteeItemModel,
      idCardItem: IIDCardModel
    ) => {
      if (self.guaranteeItems.length < 5) {
        self.guaranteeItems.push(item);
        self.idCardItems.push(idCardItem);
      }
    },
    setGuaranteeItems: () => {
      const tempGuaranteeItems = [];
      const tempIdCardItems = [];
      tempGuaranteeItems.push(GuaranteeItemModel.create({}));
      tempIdCardItems.push(IDCardModel.create({}));
      self.setField({ fieldname: "guaranteeItems", value: tempGuaranteeItems });
      self.setField({ fieldname: "idCardItems", value: tempIdCardItems });
    },
    onRemoveItem: (item: IGuaranteeItemModel) => {
      detach(item);
    },
    createGuarantee: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        for (const item of self.guaranteeItems) {
          ///// เซตค่าให้ที่อยู่ตามทะเบียนบ้าน
          if (item.guarantorRegisteredAddressType === 0) {
            item.setField({
              fieldname: "guarantorRegisteredAddress",
              value: clone(item.guarantorIdCardAddress)
            });
          }
        }
        const body = {
          organization: {
            id: self.organizationId
          },
          documentDate: self.documentDate,
          guaranteeType: self.guaranteeType,
          name: self.name,
          status: "NW",
          startDate: self.startDate,
          endDate: self.endDate,

          request: {
            id: self.requestId
          },
          agreement: {
            id: self.agreementId
          },
          agreementDocumentNumber: self.agreementDocumentNumber,
          agreementDocumentDate: self.agreementDocumentDate,

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
          loanAmount: self.loanAmount,
          guaranteeCancelReason: self.guaranteeCancelReason,
          guaranteeItems: self.guaranteeItems
        };
        const result: any = yield Guarantee.create(body);
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
    createGuaranteeByAgreement: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          agreementId: self.agreementId
        };
        const result: any = yield Guarantee.create(body);
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
    getGuaranteeDetail: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          const result: any = yield Guarantee.getById(self.id);
          self.setAllField(result.data);
          const idCardList: IIDCardModel[] = [];
          self.guaranteeItems.forEach(
            (item: IGuaranteeItemModel, index: number) => {
              idCardList.push(
                IDCardModel.create({
                  id: item.guarantor.idCardNo,
                  title: item.guarantor.title,
                  firstname: item.guarantor.firstname,
                  lastname: item.guarantor.lastname,
                  birthday: date_YYYYMMDD_TO_DDMMYYYY(item.guarantor.birthDate),
                  issued_date: date_YYYYMMDD_TO_DDMMYYYY(
                    item.guarantor.idCardIssuedDate
                  ),
                  expired_date: date_YYYYMMDD_TO_DDMMYYYY(
                    item.guarantor.idCardExpireDate
                  ),
                  issuer: item.guarantor.idCardIssuer,
                  address: clone(item.guarantorIdCardAddress),
                  age: item.guarantor.age
                })
              );
            }
          );
          self.setField({ fieldname: "idCardItems", value: idCardList });
          self.setField({
            fieldname: "existingAgreementId",
            value: self.agreementId
          });
          self.error.setField({ fieldname: "tigger", value: false });
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
      }
    }),
    updateGuarantee: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        for (const item of self.guaranteeItems) {
          ///// เซตค่าให้ที่อยู่ตามทะเบียนบ้าน
          if (item.guarantorRegisteredAddressType === 0) {
            item.setField({
              fieldname: "guarantorRegisteredAddress",
              value: clone(item.guarantorIdCardAddress)
            });
          }
        }
        const body = {
          documentDate: self.documentDate,
          documentNumber: self.documentNumber,
          name: self.name,
          request: {
            id: self.requestId
          },
          agreement: {
            id: self.agreementId
          },
          agreementDocumentNumber: self.agreement
            ? self.agreement.documentNumber
            : undefined,
          agreementDocumentDate: self.agreement
            ? self.agreement.documentDate
            : undefined,
          startDate: self.startDate,
          endDate: self.endDate,
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
          loanAmount: self.loanAmount,
          guaranteeCancelReason: self.guaranteeCancelReason,
          guaranteeItems: self.guaranteeItems
        };
        yield Guarantee.update(body, +self.id);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({ fieldname: "title", value: "บันทึกสำเร็จค่ะ" });
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
    updateGuaranteeCancelReason: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          guaranteeCancelReason: self.guaranteeCancelReason,
          status: "CL"
        };
        yield Guarantee.update(body, +self.id);
        self.error.setField({ fieldname: "tigger", value: false });
        // self.alert.setField({ fieldname: "tigger", value: true });
        // self.alert.setField({ fieldname: "title", value: "บันทึกสำเร็จค่ะ" });
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
    cancelGuarantee: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          status: "CL",
          guaranteeCancelReason: self.guaranteeCancelReason
          // cancelDate: moment().toDate()
        };
        yield Guarantee.update(body, +self.id);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({ fieldname: "title", value: "บันทึกสำเร็จค่ะ" });
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
    delete_data: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        yield Guarantee.delete(+self.id);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({ fieldname: "title", value: "บันทึกสำเร็จค่ะ" });
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
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    printGuarantee: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });

          yield Guarantee.getById(self.id, {
            name: "print_guarantee"
          });
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
    retrieveRequestData: flow(function* () {
      if (self.requestId) {
        self.request = RequestModel.create({ id: self.requestId });
        yield self.request.getRequestDetail();
        const guaranteeItems: IGuaranteeItemModel[] = [];
        self.request.requestItems.forEach((item: IRequestItemModel) => {
          guaranteeItems.push(
            GuaranteeItemModel.create({
              guaranteeId: self.id,
              guarantorTelephone: item.guarantor.mobilePhone,
              guarantorRegisteredAddressType:
                item.guarantor.registeredAddressType,
              guarantorIdCardAddress: clone(item.guarantor.idCardAddress),
              guarantorRegisteredAddress: clone(
                item.guarantor.registeredAddress
              ),
              guarantorPosition: item.guarantorPosition,
              guarantorSalary: item.guarantor.occupation.salary,
              guarantorOccupation: clone(item.guarantor.occupation),
              borrower: clone(item.borrower),
              guarantor: clone(item.guarantor),
              guarantorCompanyName: item.guarantorCompanyName
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
        self.setField({ fieldname: "guaranteeItems", value: guaranteeItems });
      }
    }),
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));
export type IGuaranteeModel = typeof GuaranteeModel.Type;
