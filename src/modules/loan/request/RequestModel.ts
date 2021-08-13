import i18n from "i18next";
import { flow } from "mobx";
import { applySnapshot, clone, detach, getRoot, types } from "mobx-state-tree";
import moment from "moment";
import { AddressModel } from "../../../components/address";
import { ErrorModel } from "../../../components/common/error";
import { IAttachedFileModel } from "../../../components/common/fileupload/AttachedFileModel";
import { MessageModel } from "../../../components/common/message";
import {
  IDCardModel,
  IIDCardModel
} from "../../../components/idcard/IDCardModel";
import {
  BORROWER,
  GUARANTOR,
  GUARANTORSPOUSE,
  SPOUSE
} from "../../../constants";
import { date_YYYYMMDD_TO_DDMMYYYY, idcardFormatting } from "../../../utils";
import { IInput } from "../../../utils/common-interface";
import customtypes from "../../../utils/mobx-types-helper";
import { OcupationModel } from "../../admin/occupation";
import { OrgModel } from "../../admin/organization";
import { IProfileModel, ProfileModel } from "../../share/profile/ProfileModel";
import { AgreementRequests } from "../agreement/AgreementService";
import {
  FactSheetModel,
  ICriteriaGroupModel,
  ICriteriaModel
} from "./FactSheetModel";
import { Request } from "./RequestsService";
import { ValidationModel } from "./ValidationModel";
import { hasPermission } from "../../../utils/render-by-permission";

export const BudgetAllocationItemsModel = types
  .model("BudgetAllocationItemsModel", {
    id: types.maybe(types.string),
    requestId: types.optional(types.string, ""),
    description: types.optional(types.string, ""),
    quality: types.optional(types.number, 0),
    cost: types.optional(types.string, "0"),
    subTotal: types.optional(types.string, "0"),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdBy: types.maybeNull(types.number),
    createdByName: customtypes.optional(types.string, ""),
    updatedBy: types.maybeNull(types.number),
    updatedByName: customtypes.optional(types.string, "")
  })
  .views((self: any) => ({
    get totalItem() {
      return (+self.cost * self.quality).toString();
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
    addQuality: () => {
      self.setField({ fieldname: "quality", value: self.quality + 1 });
      self.setFieldSubTotal();
    },
    reduceQuality: () => {
      if (self.quality > 0) {
        self.setField({ fieldname: "quality", value: self.quality - 1 });
        self.setFieldSubTotal();
      }
    },
    setFieldSubTotal: () => {
      self.setField({
        fieldname: "subTotal",
        value: (+self.cost * self.quality).toString()
      });
    },
    onRemove: () => {
      let root: any;
      root = getRoot(self);
      root.onRemoveItem(self);
    }
  }));
export type IBudgetAllocationItemsModel = typeof BudgetAllocationItemsModel.Type;

export const RequestItemModel = types
  .model("RequestItemModel", {
    id: types.maybe(types.string),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdByName: customtypes.optional(types.string, ""),
    updatedByName: customtypes.optional(types.string, ""),
    createdBy: types.maybeNull(types.number),
    updatedBy: types.maybeNull(types.number),
    requestId: types.optional(types.string, ""),
    guarantorBorrowerRelationship: types.optional(types.number, 0),
    guarantorCompanyName: types.optional(types.string, ""),
    guarantorPosition: types.optional(types.string, ""),
    guarantorCompanyTelephone: types.optional(types.string, ""),
    borrower: types.optional(ProfileModel, {}),
    spouse: types.optional(ProfileModel, {}),
    guarantorSpouse: types.optional(ProfileModel, {}),
    guarantor: types.optional(ProfileModel, {}),
    guarantorCompanyAddress: types.optional(AddressModel, {}),
    error: types.optional(ErrorModel, {}),
    alert: types.optional(MessageModel, {}),
    loading: types.optional(types.boolean, false)
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
    getAttachedFiles: flow(function* (requestId: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const result: any = yield Request.getById(requestId, {
          name: `request_items/${self.id}/attachedfiles`
        });
        self.borrower.setField({
          fieldname: "attachedFiles",
          value: result.data.borrower.attachedFiles
        });
        self.guarantor.setField({
          fieldname: "attachedFiles",
          value: result.data.guarantor.attachedFiles
        });
        self.spouse.setField({
          fieldname: "attachedFiles",
          value: result.data.spouse.attachedFiles
        });
        self.guarantorSpouse.setField({
          fieldname: "attachedFiles",
          value: result.data.guarantorSpouse.attachedFiles
        });
        self.setAttachedFiles();
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateAttachedFiles: flow(function* (
      requestId: string,
      resource: "borrower" | "spouse" | "guarantorSpouse" | "guarantor",
      profile: IProfileModel
    ) {
      try {
        profile.setField({ fieldname: "loading", value: true });
        const body: any = {};
        profile.attachedFiles.forEach((att: IAttachedFileModel) => {
          att.refId = self.id;
        });
        body[resource] = profile;
        const result: any = yield Request.formUpdateResource(body, +requestId, {
          name: `request_items/${self.id}/${resource}`
        });
        self[resource].setField({
          fieldname: "attachedFiles",
          value: result.data[resource].attachedFiles
        });
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
        profile.setField({ fieldname: "loading", value: false });
      }
    }),
    setAttachedFiles: () => {
      if (self.borrower.attachedFiles.length === 0) {
        self.borrower.setField({
          fieldname: "attachedFiles",
          value: BORROWER
        });
      }
      if (
        self.borrower.marriageStatus === 1 &&
        self.spouse.attachedFiles.length === 0
      ) {
        self.spouse.setField({
          fieldname: "attachedFiles",
          value: SPOUSE
        });
      }
      if (
        self.borrower.marriageStatus === 3 &&
        self.spouse.attachedFiles.length === 0
      ) {
        self.spouse.setField({
          fieldname: "attachedFiles",
          value: SPOUSE
        });
      }
      if (
        self.borrower.marriageStatus === 4 &&
        self.spouse.attachedFiles.length === 0
      ) {
        self.spouse.setField({
          fieldname: "attachedFiles",
          value: SPOUSE
        });
      }
      if (self.guarantor.attachedFiles.length === 0) {
        self.guarantor.setField({
          fieldname: "attachedFiles",
          value: GUARANTOR
        });
      }
      if (
        self.guarantor.marriageStatus === 1 &&
        self.guarantorSpouse.attachedFiles.length === 0
      ) {
        self.guarantorSpouse.setField({
          fieldname: "attachedFiles",
          value: GUARANTORSPOUSE
        });
      }
      if (
        self.guarantor.marriageStatus === 3 &&
        self.guarantorSpouse.attachedFiles.length === 0
      ) {
        self.guarantorSpouse.setField({
          fieldname: "attachedFiles",
          value: GUARANTORSPOUSE
        });
      }
      if (
        self.guarantor.marriageStatus === 4 &&
        self.guarantorSpouse.attachedFiles.length === 0
      ) {
        self.guarantorSpouse.setField({
          fieldname: "attachedFiles",
          value: GUARANTORSPOUSE
        });
      }
    },
    onRemove: () => {
      let root: any;
      root = getRoot(self);
      root.onRemoveItem(self);
    }
  }));
export type IRequestItemModel = typeof RequestItemModel.Type;

export const ResultModel = types
  .model("ResultModel", {
    meetingDate: customtypes.optional(types.string, ""),
    meetingNumber: types.optional(types.union(types.string, types.number), "-"),
    result: customtypes.optional(types.string, ""),
    approveBudget: types.optional(types.union(types.number, types.string), 0),
    comments: customtypes.optional(types.string, ""),
  })
  .views((self: any) => ({
    //
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
    }
  }));
export type IResultModel = typeof ResultModel.Type;

export const RequestModel = types
  .model("RequestModel", {
    isSelected: types.optional(types.boolean, false),
    id: types.maybeNull(types.string),
    organizationId: types.optional(types.string, ""),
    fiscalYear: types.optional(types.string, ""),
    documentDate: customtypes.optional(
      types.string,
      moment().format("YYYY-MM-DD")
    ),
    documentNumber: customtypes.optional(types.string, ""),
    requestType: types.optional(types.string, "P"),
    name: types.optional(types.string, ""),
    requestLocation: types.optional(types.string, ""),
    status: types.optional(types.string, ""),
    requestBudget: types.optional(types.string, ""),
    receiveBankName: types.optional(types.string, ""),
    recieveBankAccountNo: types.optional(types.string, ""),
    recieveBankAccountName: types.optional(types.string, ""),
    recieveBankAccountRefNo: customtypes.optional(types.string, ""),
    installmentAmount: types.optional(types.string, ""),
    installmentDurationMonth: types.optional(
      types.union(types.number, types.string),
      0
    ),
    installmentLastAmount: types.optional(types.string, ""),
    installmentPeriodValue: types.optional(
      types.union(types.number, types.string),
      0
    ),
    installmentPeriodUnit: types.optional(types.string, ""),
    installmentPeriodDay: types.optional(
      types.union(types.number, types.string),
      0
    ),
    installmentTimes: types.optional(
      types.union(types.number, types.string),
      0
    ),
    installmentFirstDate: types.maybeNull(types.string),
    installmentLastDate: types.maybeNull(types.string),
    validationChecklist: types.maybeNull(types.array(ValidationModel)),
    validationCheckValue: types.optional(types.boolean, false),
    requestOccupation: types.optional(OcupationModel, {}),
    requestOccupationAddress: types.optional(AddressModel, {}),
    result1: types.optional(ResultModel, {}),
    result2: types.optional(ResultModel, {}),
    result3: types.optional(ResultModel, {}),
    requestItems: types.optional(types.array(RequestItemModel), []),
    budgetAllocationItems: types.optional(
      types.array(BudgetAllocationItemsModel),
      []
    ),
    idCardBorrowerItems: types.optional(types.array(IDCardModel), []),
    idCardGuarantorItems: types.optional(types.array(IDCardModel), []),
    idCardSpouseItems: types.optional(types.array(IDCardModel), []),
    documentDateAgreement: types.optional(types.string, ""),
    factSheet: types.maybeNull(FactSheetModel),
    factSheetCheckValue: types.optional(types.boolean, false),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdByName: customtypes.optional(types.string, ""),
    updatedByName: customtypes.optional(types.string, ""),
    loadingResultItem1: types.optional(types.boolean, false),
    loadingResultItem2: types.optional(types.boolean, false),
    loadingResultItem3: types.optional(types.boolean, false),
    createdBy: types.maybeNull(types.number),
    updatedBy: types.maybeNull(types.number),
    organization: types.optional(OrgModel, {}),
    error: types.optional(ErrorModel, {}),
    alert: types.optional(MessageModel, {}),
    loading: types.optional(types.boolean, false),
    successRequest: types.optional(types.boolean, false)
  })
  .views((self: any) => ({
    get full_name_id_card() {
      if (self.requestType === "P" && self.requestItems.length > 0) {
        const borrower = self.requestItems[0].borrower;
        const space = borrower.firstname && borrower.lastname ? " " : "";
        return `${borrower.firstname || ""}${space}${borrower.lastname ||
          ""} (${idcardFormatting(borrower.idCardNo) || ""})`;
      } else if (self.requestType === "G") {
        return self.name;
      } else {
        return "";
      }
    },
    get id_card() {
      if (self.requestType === "P" && self.requestItems.length > 0) {
        const borrower = self.requestItems[0].borrower;
        return borrower.idCardNo || "";
      } else {
        return "";
      }
    },
    get full_name() {
      if (self.requestType === "P" && self.requestItems.length > 0) {
        const borrower = self.requestItems[0].borrower;
        const space = borrower.firstname && borrower.lastname ? " " : "";
        return `${borrower.firstname || ""}${space}${borrower.lastname || ""}`;
      } else if (self.requestType === "G") {
        return self.name;
      } else {
        return "";
      }
    },
    get check_list_verify() {
      if (self.requestItems.length > 0) {
        const verifyListBorrower = self.requestItems.map(
          (item: IRequestItemModel) => item.borrower.isVerify
        );
        const verifyListGuarantor = self.requestItems.map(
          (item: IRequestItemModel) => item.guarantor.isVerify
        );
        return (
          verifyListBorrower.every((item: boolean) => item) &&
          verifyListGuarantor.every((item: boolean) => item)
        );
      } else {
        return false;
      }
    },
    get listitem() {
      return {
        key: self.id,
        value: self.id,
        text: self.documentNumber,
        description: self.documentNumber
      };
    },
    get statusLabel() {
      return self.active
        ? i18n.t("module.admin.userModel.enable")
        : i18n.t("module.admin.userModel.disable");
    },
    get totalBudgetAllocationItems() {
      return self.budgetAllocationItems.reduce(
        (sum: number, item: IBudgetAllocationItemsModel) =>
          sum + +item.totalItem,
        0
      );
    },
    get checkTotalBudgetAllocationItems() {
      const reqBugget = self.requestBudget ? +self.requestBudget : 0;
      return self.requestBudget && self.totalBudgetAllocationItems < reqBugget;
    },
    get checkEmptyBudgetAllocationItems() {
      const items = self.budgetAllocationItems.filter(
        (item: IBudgetAllocationItemsModel) => item.quality && item.cost
      );
      return items.length ? items : [];
    },
    get validationRecieveBankAccountRefNo() {
      const cleanValue = self.recieveBankAccountRefNo.replace(/[^\d.]/g, "");
      if (cleanValue.length === 18) {
        return true;
      } else {
        return false;
      }
    }
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      // if (typeof self[fieldname] === "number") {
      //   value = value !== "" ? +value : undefined;
      // }
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
    addBudgetAllocationItem: (
      budgetAllocationItem: IBudgetAllocationItemsModel
    ) => {
      self.budgetAllocationItems.push(budgetAllocationItem);
    },
    addRequestItems: (
      item: IRequestItemModel,
      idCardBorrowerItems: IIDCardModel,
      idCardGuarantorItems: IIDCardModel,
      idCardSpouseItems: IIDCardModel
    ) => {
      if (self.requestItems.length < 5) {
        self.requestItems.push(item);
        self.idCardBorrowerItems.push(idCardBorrowerItems);
        self.idCardGuarantorItems.push(idCardGuarantorItems);
        self.idCardSpouseItems.push(idCardSpouseItems);
      }
    },
    setRequestItems: () => {
      const tempRequestItems = [];
      const tempIdCardBorrowerItems = [];
      const tempIdCardGuarantorItems = [];
      const tempIdCardSpouseItems = [];
      tempRequestItems.push(RequestItemModel.create({}));
      tempIdCardBorrowerItems.push(IDCardModel.create({}));
      tempIdCardGuarantorItems.push(IDCardModel.create({}));
      tempIdCardSpouseItems.push(IDCardModel.create({}));
      self.setField({
        fieldname: "requestItems",
        value: tempRequestItems
      });
      self.setField({
        fieldname: "idCardBorrowerItems",
        value: tempIdCardBorrowerItems
      });
      self.setField({
        fieldname: "idCardGuarantorItems",
        value: tempIdCardGuarantorItems
      });
      self.setField({
        fieldname: "idCardSpouseItems",
        value: tempIdCardSpouseItems
      });
    },
    setRequestItemPersonType: () => {
      self.setField({
        fieldname: "requestItems",
        value: self.requestItems.slice(0, 1)
      });
      self.setField({
        fieldname: "idCardBorrowerItems",
        value: self.idCardBorrowerItems.slice(0, 1)
      });
      self.setField({
        fieldname: "idCardGuarantorItems",
        value: self.idCardGuarantorItems.slice(0, 1)
      });
      self.setField({
        fieldname: "idCardSpouseItems",
        value: self.idCardSpouseItems.slice(0, 1)
      });
    },
    onRemoveItem: (item: IRequestItemModel) => {
      detach(item);
    },
    createRequest: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        for (const item of self.requestItems) {
          ///// เซตค่าให้ที่อยู่ตามทะเบียนบ้าน ผู้กู้
          if (item.borrower.registeredAddressType === 0) {
            item.borrower.setField({
              fieldname: "registeredAddress",
              value: clone(item.borrower.idCardAddress)
            });
          }
          ///// เซตค่าให้ที่อยู่ปัจบัน ผู้กู้
          if (item.borrower.currentAddressType === 0) {
            item.borrower.setField({
              fieldname: "currentAddress",
              value: clone(item.borrower.idCardAddress)
            });
          } else if (item.borrower.currentAddressType === 1) {
            item.borrower.setField({
              fieldname: "currentAddress",
              value: clone(item.borrower.registeredAddress)
            });
          }
          ///// เซตค่าให้ที่อยู่ตามทะเบียนบ้าน ผู้ค้ำ
          if (item.guarantor.registeredAddressType === 0) {
            item.guarantor.setField({
              fieldname: "registeredAddress",
              value: clone(item.guarantor.idCardAddress)
            });
          }
          ///// เซตค่าให้ที่อยู่ปัจบัน ผู้ค้ำ
          if (item.guarantor.currentAddressType === 0) {
            item.guarantor.setField({
              fieldname: "currentAddress",
              value: clone(item.guarantor.idCardAddress)
            });
          } else if (item.guarantor.currentAddressType === 1) {
            item.guarantor.setField({
              fieldname: "currentAddress",
              value: clone(item.guarantor.registeredAddress)
            });
          }
        }
        self.setField({ fieldname: "loading", value: true });
        const body = {
          organization: {
            id: self.organizationId
          },
          // status: "DF",
          status: self.status,
          requestType: self.requestType,
          documentDate: self.documentDate,
          requestItems: self.requestItems,
          name: self.requestType === "G" ? self.name : self.full_name + "test"
        };
        const result: any = yield Request.create(body);
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
    updateRequest: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        for (const item of self.requestItems) {
          ///// เซตค่าให้ที่อยู่ตามทะเบียนบ้าน ผู้กู้
          if (item.borrower.registeredAddressType === 0) {
            item.borrower.setField({
              fieldname: "registeredAddress",
              value: clone(item.borrower.idCardAddress)
            });
          }
          ///// เซตค่าให้ที่อยู่ปัจบัน ผู้กู้
          if (item.borrower.currentAddressType === 0) {
            item.borrower.setField({
              fieldname: "currentAddress",
              value: clone(item.borrower.idCardAddress)
            });
          } else if (item.borrower.currentAddressType === 1) {
            item.borrower.setField({
              fieldname: "currentAddress",
              value: clone(item.borrower.registeredAddress)
            });
          }
          ///// เซตค่าให้ที่อยู่ตามทะเบียนบ้าน ผู้ค้ำ
          if (item.guarantor.registeredAddressType === 0) {
            item.guarantor.setField({
              fieldname: "registeredAddress",
              value: clone(item.guarantor.idCardAddress)
            });
          }
          ///// เซตค่าให้ที่อยู่ปัจบัน ผู้ค้ำ
          if (item.guarantor.currentAddressType === 0) {
            item.guarantor.setField({
              fieldname: "currentAddress",
              value: clone(item.guarantor.idCardAddress)
            });
          } else if (item.guarantor.currentAddressType === 1) {
            item.guarantor.setField({
              fieldname: "currentAddress",
              value: clone(item.guarantor.registeredAddress)
            });
          }
        }
        const body = {
          organization: {
            id: self.organizationId
          },
          status: self.status,
          requestType: self.requestType,
          documentDate: self.documentDate,
          requestItems: self.requestItems,
          name: self.requestType === "G" ? self.name : self.full_name
        };
        const result: any = yield Request.update(body, self.id);
        self.setAllField(result.data);
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
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateRequesLoanDetails: flow(function* () {
      try {
        self.setField({ fieldname: "status", value: "DF9" });
        const body = {
          status: self.status,
          requestBudget: self.requestBudget,
          requestOccupation: self.requestOccupation,
          budgetAllocationItems: self.checkEmptyBudgetAllocationItems,
          requestOccupationAddress: self.requestOccupationAddress
        };
        const result: any = yield Request.update(body, self.id);
        console.log(result);
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "รายละเอียดการกู้ถูกปรับปรุงเรียบร้อยแล้ว"
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
    updateRequestAll: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          organization: {
            id: self.organizationId
          },
          requestBudget: self.requestBudget,
          requestOccupation: self.requestOccupation,
          budgetAllocationItems: self.checkEmptyBudgetAllocationItems,
          requestOccupationAddress: self.requestOccupationAddress,
          status: self.status,
          name: self.requestType === "G" ? self.name : self.full_name,
          requestType: self.requestType,
          documentDate: self.documentDate,
          requestItems: self.requestItems
        };
        const result: any = yield Request.update(body, self.id);
        console.log(result);
        self.setAllField(result.data);
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
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateRequestStatusCreate: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          // status: "NW"
          status: self.status
        };
        const result: any = yield Request.update(body, self.id);
        // console.log(result);
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "เอกสารสร้างคำร้องเรียบร้อยแล้ว"
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
    createRequestAllStatusCreate: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          organization: {
            id: self.organizationId
          },
          requestBudget: self.requestBudget,
          requestOccupation: self.requestOccupation,
          budgetAllocationItems: self.checkEmptyBudgetAllocationItems,
          requestOccupationAddress: self.requestOccupationAddress,
          // status: "NW",
          status: self.status,
          name: self.requestType === "G" ? self.name : self.full_name,
          requestType: self.requestType,
          documentDate: self.documentDate,
          requestItems: self.requestItems
        };
        const result: any = yield Request.update(body, self.id);
        console.log(result);
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
    getRequestDetail: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          const result: any = yield Request.getById(self.id);
          self.setAllField(result.data);
          const idCardBorrowerList: IIDCardModel[] = [];
          const idCardGuarantorList: IIDCardModel[] = [];
          const idCardSpouseList: IIDCardModel[] = [];

          self.requestItems.forEach(
            (item: IRequestItemModel, index: number) => {
              idCardBorrowerList.push(
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
                  address: clone(item.borrower.idCardAddress),
                  age: item.borrower.age
                })
              );
              idCardGuarantorList.push(
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
                  address: clone(item.guarantor.idCardAddress),
                  age: item.guarantor.age
                })
              );
              idCardSpouseList.push(
                IDCardModel.create({
                  id: item.spouse.idCardNo,
                  title: item.spouse.title,
                  firstname: item.spouse.firstname,
                  lastname: item.spouse.lastname,
                  birthday: date_YYYYMMDD_TO_DDMMYYYY(item.spouse.birthDate),
                  issued_date: date_YYYYMMDD_TO_DDMMYYYY(
                    item.spouse.idCardIssuedDate
                  ),
                  expired_date: date_YYYYMMDD_TO_DDMMYYYY(
                    item.spouse.idCardExpireDate
                  ),
                  issuer: item.spouse.idCardIssuer,
                  address: clone(item.spouse.idCardAddress),
                  age: item.spouse.age
                })
              );
            }
          );

          self.setField({
            fieldname: "idCardBorrowerItems",
            value: idCardBorrowerList
          });
          self.setField({
            fieldname: "idCardGuarantorItems",
            value: idCardGuarantorList
          });
          self.setField({
            fieldname: "idCardSpouseItems",
            value: idCardSpouseList
          });
          if (self.validationChecklist) {
            self.setField({ fieldname: "validationCheckValue", value: true });
          }
          if (self.factSheet) {
            self.setField({ fieldname: "factSheetCheckValue", value: true });
          }
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
    sendRequestAgreement: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          ids: [self.id],
          documentDate: self.documentDateAgreement
        };
        const result: any = yield AgreementRequests.create(body);
        if (
          result.data.failedRequests.length === 0 &&
          result.data.successRequests.length === 0
        ) {
          self.error.setField({ fieldname: "tigger", value: true });
          self.error.setField({ fieldname: "code", value: "-" });
          self.error.setField({
            fieldname: "title",
            value: "สร้างสัญญาไม่สำเร็จ"
          });
          self.error.setField({
            fieldname: "message",
            value: "กรุณาตรวจสอบสถานะสัญญาค่ะ"
          });
          self.error.setField({
            fieldname: "technical_stack",
            value: "-"
          });
        } else if (
          result.data.failedRequests.length === 0 &&
          result.data.successRequests.length === 1
        ) {
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
          self.setField({
            fieldname: "successRequest",
            value: true
          });
        } else {
          self.error.setField({ fieldname: "tigger", value: true });
          self.error.setField({ fieldname: "code", value: "-" });
          self.error.setField({
            fieldname: "title",
            value: "สร้างสัญญาไม่สำเร็จ"
          });
          self.error.setField({
            fieldname: "message",
            value: "กรุณาตรวจสอบสถานะสัญญาค่ะ"
          });
          self.error.setField({
            fieldname: "technical_stack",
            value: "-"
          });
        }
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
    updateResultItem: flow(function* (resultItemNumber: number) {
      try {
        let body = {};
        switch (resultItemNumber) {
          case 1:
            self.setField({ fieldname: "loadingResultItem1", value: true });
            body = {
              ...body,
              result1: self.result1
            } as any;
            if (self.result1.result) {
              body = {
                ...body,
                result1: self.result1,
                status:
                  self.result1.result === "AP" || self.result1.result === "AJ"
                    ? "AP1"
                    : "RJ"
              } as any;
            }
            break;
          case 2:
            self.setField({ fieldname: "loadingResultItem2", value: true });
            body = { ...body, result2: self.result2 } as any;
            if (self.result2.result) {
              body = {
                ...body,
                result2: self.result2,
                status:
                  self.result2.result === "AP" || self.result2.result === "AJ"
                    ? "AP2"
                    : "RJ"
              } as any;
            }
            break;
          default:
            break;
        }
        const result: any = yield Request.update(body, self.id);
        self.setAllField(result.data);
        if (!self.recieveBankAccountName) {
          self.setField({
            fieldname: "recieveBankAccountName",
            value: self.name
          });
        }
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "เอกสารบันทึกเรียบร้อยแล้ว"
        });
        switch (resultItemNumber) {
          case 1:
            if (self.result1.result === "AP" || self.result1.result === "AJ") {
              self.result2.setField({
                fieldname: "approveBudget",
                value: self.result1.approveBudget
              });
            }
            break;
          case 2:
            if (self.result2.result === "AP" || self.result2.result === "AJ") {
              self.result3.setField({
                fieldname: "approveBudget",
                value: self.result2.approveBudget
              });
            }
            break;
          default:
            break;
        }
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
        switch (resultItemNumber) {
          case 1:
            self.setField({ fieldname: "loadingResultItem1", value: false });
            break;
          case 2:
            self.setField({ fieldname: "loadingResultItem2", value: false });
            break;
          default:
            break;
        }
      }
    }),
    deleteRequest: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          status: "CL"
        };
        const result: any = yield Request.update(body, self.id);
        console.log(result);
        self.setAllField(result.data);
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
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateRequestConsideration: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        let body = {
          result3: self.result3,
          receiveBankName: self.receiveBankName,
          recieveBankAccountNo: self.recieveBankAccountNo,
          recieveBankAccountName: self.recieveBankAccountName,
          recieveBankAccountRefNo: self.recieveBankAccountRefNo,
          installmentAmount: self.installmentAmount,
          installmentPeriodValue: self.installmentPeriodValue,
          installmentTimes: self.installmentTimes,
          installmentPeriodDay: self.installmentPeriodDay,
          installmentFirstDate: self.installmentFirstDate,
          installmentLastDate: self.installmentLastDate,
          installmentLastAmount: self.installmentLastAmount
        };
        if (self.result3.result) {
          body = {
            ...body,
            result3: self.result3,
            status:
              self.result3.result === "AP" || self.result3.result === "AJ"
                ? "AP3"
                : "RJ"
          } as any;
        }
        const result: any = yield Request.update(body, self.id);
        console.log(result);
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "เอกสารถูกบันทึกเรียบร้อยแล้ว"
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
    updateFactSheet: flow(function* (updateStatus?: boolean) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const borrowerScore =
          self.factSheet.factSheetItems.credit_scroll_criteria[0]
            .summary_scroll;
        const guarantorScore =
          self.factSheet.factSheetItems.credit_scroll_criteria[1]
            .summary_scroll;
        self.factSheet.setField({
          fieldname: "borrowerScore",
          value: borrowerScore
        });
        self.factSheet.setField({
          fieldname: "guarantorScore",
          value: guarantorScore
        });

        const factSheet: any = JSON.parse(
          JSON.stringify(self.factSheet.toJSON())
        ); // ใช้ Deep clone เพื่อให้สามารถ Add/Edit properties ใน object ได้โดยไม่ติด Error

        self.factSheet.factSheetItems.credit_scroll_criteria.forEach(
          (criteriaGroup: ICriteriaGroupModel, groupIndex: number) => {
            let resultScoreTotal = 0;
            criteriaGroup.criteria_list.forEach(
              (criteria: ICriteriaModel, index: number) => {
                const resultScore = criteria.result;
                factSheet.factSheetItems.credit_scroll_criteria[
                  groupIndex
                ].criteria_list[index].result_score = resultScore;
                resultScoreTotal += resultScore;
              }
            );

            factSheet.factSheetItems.credit_scroll_criteria[
              groupIndex
            ].result_score = resultScoreTotal;
          }
        );

        let body = {
          factSheet: { ...factSheet, attachedFiles: undefined }
        };

        console.log("body", body);
        if (updateStatus) {
          // tslint:disable-next-line: prefer-conditional-expression
          if (self.factSheet.isApproved) {
            body = { ...body, status: "QF" } as any;
          } else {
            body = { ...body, status: "DQF" } as any;
          }
        }
        const result: any = yield Request.update(body, self.id);
        self.setAllField(result.data);
        if (self.factSheet) {
          self.setField({ fieldname: "factSheetCheckValue", value: true });
        }
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "เอกสารถูกบันทึกเรียบร้อยแล้ว"
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
    updateFactSheetAttachedFiles: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          id: self.factSheet.id,
          request: { id: self.id },
          attachedFiles: self.factSheet.attachedFiles
        };
        const result: any = yield Request.formUpdateResource(body, self.id, {
          name: "factsheet"
        });
        self.setAllField(result.data);
        if (self.factSheet) {
          self.setField({ fieldname: "factSheetCheckValue", value: true });
        }
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "เอกสารถูกบันทึกเรียบร้อยแล้ว"
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
    delete_data: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        yield Request.delete(parseInt(self.id));
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
    printForm: flow(function* (name?: string) {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });

          yield Request.getById(self.id, { name: name ? name : "print_form" });
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
    getValidationChecklist: flow(function* (name?: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        // const result = yield RequestValidationAPI.get();
        const result: any = yield require("./request_validation.json");
        self.setField({
          fieldname: "validationChecklist",
          value: result.data
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
    }),
    onConfirmValidation: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          validationChecklist: self.validationChecklist
          // requestItems: self.requestItems
        };
        const result: any = yield Request.update(body, self.id);
        console.log("onConfirmValidation==>", result);
        self.setAllField(result.data);
        if (self.validationChecklist) {
          self.setField({ fieldname: "validationCheckValue", value: true });
        }
        self.setRequestItemsAttachedFiles();
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
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    setRequestItemsAttachedFiles: () => {
      self.requestItems.forEach((item: IRequestItemModel) => {
        if (item.borrower.attachedFiles.length === 0) {
          item.borrower.setField({
            fieldname: "attachedFiles",
            value: BORROWER
          });
        }
        if (
          item.borrower.marriageStatus === 1 &&
          item.spouse.attachedFiles.length === 0
        ) {
          item.spouse.setField({
            fieldname: "attachedFiles",
            value: SPOUSE
          });
        }
        if (
          item.borrower.marriageStatus === 3 &&
          item.spouse.attachedFiles.length === 0
        ) {
          item.spouse.setField({
            fieldname: "attachedFiles",
            value: SPOUSE
          });
        }
        if (
          item.borrower.marriageStatus === 4 &&
          item.spouse.attachedFiles.length === 0
        ) {
          item.spouse.setField({
            fieldname: "attachedFiles",
            value: SPOUSE
          });
        }
        if (item.guarantor.attachedFiles.length === 0) {
          item.guarantor.setField({
            fieldname: "attachedFiles",
            value: GUARANTOR
          });
        }
        if (
          item.guarantor.marriageStatus === 1 &&
          item.guarantorSpouse.attachedFiles.length === 0
        ) {
          item.guarantorSpouse.setField({
            fieldname: "attachedFiles",
            value: GUARANTORSPOUSE
          });
        }
        if (
          item.guarantor.marriageStatus === 3 &&
          item.guarantorSpouse.attachedFiles.length === 0
        ) {
          item.guarantorSpouse.setField({
            fieldname: "attachedFiles",
            value: GUARANTORSPOUSE
          });
        }
        if (
          item.guarantor.marriageStatus === 4 &&
          item.guarantorSpouse.attachedFiles.length === 0
        ) {
          item.guarantorSpouse.setField({
            fieldname: "attachedFiles",
            value: GUARANTORSPOUSE
          });
        }
      });
    },
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));
export type IRequestModel = typeof RequestModel.Type;
