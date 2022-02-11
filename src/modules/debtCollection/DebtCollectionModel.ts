import i18n from "i18next";
import { applySnapshot, clone, flow, getRoot, types } from "mobx-state-tree";
import moment from "moment";
import { AddressModel, IAddressModel } from "../../components/address";
import { ErrorModel } from "../../components/common/error";
import {
  AttachedFileModel,
  IAttachedFileModel
} from "../../components/common/fileupload/AttachedFileModel";
import { MessageModel } from "../../components/common/message";
import { isValidDate } from "../../utils";
import { IInput } from "../../utils/common-interface";
import customtypes from "../../utils/mobx-types-helper";
import { AccountReceivableModel } from "../accountReceivable/AccountReceivableModel";
import { OcupationModel } from "../admin/occupation";
import { OrgModel } from "../admin/organization";
import { Config } from "../configuration/ConfigService";
import { IProfileModel } from "../share/profile/ProfileModel";
import {
  DebtCollection,
  DebtCollectionLetter,
  Letter,
  Memo,
  Visit
} from "./DebtCollectionsService";
import { fetchNoService } from "../../utils/request-noservice";

export const DeathNotificationModel = types
  .model("DeathNotificationModel", {
    isConfirm: types.optional(types.boolean, false),
    notificationDate: customtypes.optional(
      types.string,
      moment().format("YYYY-MM-DD")
    ),
    name: customtypes.optional(types.string, ""),
    position: customtypes.optional(types.string, ""),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {})
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
          console.log(e);
        }
      });
    },
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));
export type IDeathNotificationModel = typeof DeathNotificationModel.Type;

export const DebtCollectionMemoModel = types
  .model("DebtCollectionMemoModel", {
    id: customtypes.optional(types.string, ""),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdBy: types.maybeNull(types.number),
    createdByName: customtypes.optional(types.string, ""),
    updatedBy: types.maybeNull(types.number),
    updatedByName: customtypes.optional(types.string, ""),
    refId: types.maybe(
      types.union(types.string, types.number, types.null, types.undefined)
    ),
    refType: customtypes.optional(types.string, ""),
    location: customtypes.optional(types.string, ""),
    documentDate: customtypes.optional(types.string, ""),
    memoInformer: customtypes.optional(types.string, ""), /// memoInformerTypeSet
    memoInformerRelationship: types.maybe(
      types.union(types.string, types.number, types.null, types.undefined)
    ), /// guarantorBorrowerRelationshipSet
    title: customtypes.optional(types.string, ""),
    firstname: customtypes.optional(types.string, ""),
    lastname: customtypes.optional(types.string, ""),
    age: types.maybeNull(types.number),
    occupation: types.optional(OcupationModel, {}),
    currentAddress: types.optional(AddressModel, {}),
    mobilePhone: customtypes.optional(types.string, ""),
    memoTitle: customtypes.optional(types.string, ""),
    memoNote: customtypes.optional(types.string, ""),
    interviewerName: customtypes.optional(types.string, ""),
    interviewerPosition: customtypes.optional(types.string, ""),
    attachedFiles: customtypes.optional(types.array(AttachedFileModel), []),
    isWorking: types.optional(types.boolean, false), ////  เพิ่มมา
    birthDate: types.maybe(
      types.union(types.string, types.null, types.undefined)
    ), ////  เพิ่มมา
    isOnlyBirthYear: types.optional(types.boolean, false), ////  เพิ่มมา
    comments: customtypes.optional(types.string, ""), ////  เพิ่มมา
    documentTime: customtypes.optional(types.string, ""),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {})
  })
  .views((self: any) => ({
    get timeDisplay() {
      return self.documentTime ? self.documentTime.substring(0, 5) : "";
    },
    get fileList() {
      return self.attachedFiles.map((item: IAttachedFileModel) => item.file);
    },
    get debtCollectionMemoJSON() {
      return self.toJSON();
    },
    get fullname() {
      const space = self.firstname && self.lastname ? " " : "";
      return `${self.title || ""}${self.firstname ||
        ""}${space}${self.lastname || ""}`;
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
          console.log(e);
        }
      });
    },
    setInformer: (profile: IProfileModel, address: IAddressModel) => {
      self.setField({ fieldname: "title", value: profile.title });
      self.setField({ fieldname: "firstname", value: profile.firstname });
      self.setField({ fieldname: "lastname", value: profile.lastname });
      self.setField({
        fieldname: "currentAddress",
        value: clone(address)
      });
      self.setField({ fieldname: "mobilePhone", value: profile.mobilePhone });
      self.setField({ fieldname: "isWorking", value: profile.isWorking });
      self.setField({ fieldname: "birthDate", value: profile.birthDate });
      self.setField({
        fieldname: "isOnlyBirthYear",
        value: profile.isOnlyBirthYear
      });
      self.setField({ fieldname: "age", value: self.ageDisplay });
    },
    resetInformer: () => {
      self.setField({ fieldname: "title", value: "" });
      self.setField({ fieldname: "firstname", value: "" });
      self.setField({ fieldname: "lastname", value: "" });
      self.setField({ fieldname: "currentAddress", value: {} });
      self.setField({ fieldname: "mobilePhone", value: "" });
      self.setField({ fieldname: "isWorking", value: false });
      self.setField({ fieldname: "birthDate", value: undefined });
      self.setField({ fieldname: "isOnlyBirthYear", value: false });
      self.setField({ fieldname: "age", value: null });
    },
    createDebtCollectionMemo: flow(function* (id: string) {
      if (id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          const body = {
            refId: +id,
            refType: "DEBTCOLLECTION",
            location: self.location,
            documentDate: self.documentDate,
            memoInformer: self.memoInformer,
            memoInformerRelationship: self.memoInformerRelationship
              ? self.memoInformerRelationship
              : undefined,
            title: self.title,
            firstname: self.firstname,
            lastname: self.lastname,
            age: self.age,
            occupation: self.occupation,
            currentAddress: self.currentAddress,
            mobilePhone: self.mobilePhone,
            memoTitle: self.memoTitle,
            memoNote: self.memoNote,
            interviewerName: self.interviewerName,
            interviewerPosition: self.interviewerPosition,
            isWorking: self.isWorking,
            birthDate: self.birthDate,
            isOnlyBirthYear: self.isOnlyBirthYear,
            comments: self.comments,
            documentTime: self.documentTime
          };
          const result: any = yield Memo.create(body);
          self.setAllField(result.data);
          self.error.setField({ fieldname: "tigger", value: false });
          self.alert.setAlertMessage(
            "บันทึกสำเร็จค่ะ",
            "เอกสารถูกบันทึกเรียบร้อยแล้ว"
          );
        } catch (e) {
          self.error.setErrorMessage(e);
          throw e;
        } finally {
          self.setField({ fieldname: "loading", value: false });
        }
      }
    }),
    updateMemo: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          refId: self.refId,
          refType: self.refType,
          location: self.location,
          documentDate: self.documentDate,
          memoInformer: self.memoInformer,
          memoInformerRelationship: self.memoInformerRelationship
            ? self.memoInformerRelationship
            : undefined,
          title: self.title,
          firstname: self.firstname,
          lastname: self.lastname,
          age: self.age,
          occupation: self.occupation,
          currentAddress: self.currentAddress,
          mobilePhone: self.mobilePhone,
          memoTitle: self.memoTitle,
          memoNote: self.memoNote,
          interviewerName: self.interviewerName,
          interviewerPosition: self.interviewerPosition,
          attachedFiles: self.attachedFiles,
          isWorking: self.isWorking,
          birthDate: self.birthDate,
          isOnlyBirthYear: self.isOnlyBirthYear,
          comments: self.comments,
          documentTime: self.documentTime
        };
        const result: any = yield Memo.formUpdate(body, parseInt(self.id));
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "เอกสารถูกปรับปรุงเรียบร้อยแล้ว"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    deleteMemo: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        yield Memo.delete(parseInt(self.id));
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "เอกสารถูกลบเรียบร้อยแล้ว"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    printMemo: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          yield Memo.getById(self.id, {
            name: "print_form"
          });
        } catch (e) {
          self.error.setErrorMessage(e);
          throw e;
        } finally {
          self.setField({ fieldname: "loading", value: false });
        }
      }
    }),
    addFiles: (files: File[]) => {
      files.forEach((_file: File) => {
        const attachedFile = AttachedFileModel.create({
          file: _file,
          refId: self.id,
          refType: "MEMO.ATTACHEDFILE"
        });
        self.attachedFiles.push(attachedFile);
      });
    },
    removeFile: (index: number) => {
      try {
        self.attachedFiles[index].deleteFile();
        self.attachedFiles.splice(index, 1);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "เอกสารถูกลบเรียบร้อยแล้ว"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
        throw e;
      }
    },
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));
export type IDebtCollectionMemoModel = typeof DebtCollectionMemoModel.Type;

export const DebtCollectionVisitModel = types
  .model("DebtCollectionVisitModel", {
    id: customtypes.optional(types.string, ""),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdBy: types.maybeNull(types.number),
    createdByName: customtypes.optional(types.string, ""),
    updatedBy: types.maybeNull(types.number),
    updatedByName: customtypes.optional(types.string, ""),
    debtCollectionId: customtypes.optional(types.string, ""),
    visitDate: customtypes.optional(
      types.string,
      moment().format("YYYY-MM-DD")
    ),
    visitType: customtypes.optional(types.string, ""),
    contactTelephone: customtypes.optional(types.string, ""),
    isMeetTarget: types.maybeNull(types.boolean),
    overdueReasons: customtypes.optional(types.string, ""),
    dismissReason: customtypes.optional(types.string, ""),
    currentAddress: types.optional(AddressModel, {}),
    isWorking: customtypes.optional(types.boolean, false),
    occupation: types.optional(OcupationModel, {}),
    hasExtraIncome: customtypes.optional(types.boolean, false),
    extraIncome: customtypes.optional(
      types.union(types.number, types.string),
      0
    ),
    extraIncomeDescription: customtypes.optional(types.string, ""),
    familyMember: customtypes.optional(
      types.union(types.number, types.string),
      0
    ),
    familyMemberDescription: customtypes.optional(types.string, ""),
    expenseDeclaration: customtypes.optional(types.string, ""),
    problem1: customtypes.optional(types.string, ""),
    problem2: customtypes.optional(types.string, ""),
    problem3: customtypes.optional(types.string, ""),
    inspection1: customtypes.optional(types.string, ""),
    inspection2: customtypes.optional(types.string, ""),
    inspection3: customtypes.optional(types.string, ""),
    visitorName: customtypes.optional(types.string, ""),
    visitorPosition: customtypes.optional(types.string, ""),
    comments: customtypes.optional(types.string, ""),
    attachedFiles: customtypes.optional(types.array(AttachedFileModel), []),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {})
  })
  .views((self: any) => ({
    get fileList() {
      return self.attachedFiles.map((item: IAttachedFileModel) => item.file);
    },
    get debtCollectionVisitJSON() {
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
          console.log(e);
        }
      });
    },
    createDebtCollectionVisit: flow(function* (id: string) {
      if (id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          let body = {
            debtCollectionId: id,
            visitDate: self.visitDate,
            visitType: self.visitType,
            isMeetTarget: self.isMeetTarget,
            overdueReasons: self.overdueReasons,
            dismissReason: self.dismissReason,
            currentAddress: self.currentAddress,
            isWorking: self.isWorking,
            occupation: self.occupation,
            hasExtraIncome: self.hasExtraIncome,
            extraIncome: self.extraIncome,
            extraIncomeDescription: self.extraIncomeDescription,
            familyMember: self.familyMember,
            familyMemberDescription: self.familyMemberDescription,
            ExpenseDeclaration: self.ExpenseDeclaration,
            problem1: self.problem1,
            problem2: self.problem2,
            problem3: self.problem3,
            inspection1: self.inspection1,
            inspection2: self.inspection2,
            inspection3: self.inspection3,
            visitorName: self.visitorName,
            visitorPosition: self.visitorPosition,
            comments: self.comments,
            contactTelephone: self.contactTelephone,
            expenseDeclaration: self.expenseDeclaration
          };
          if (self.isMeetTarget) {
            body = { ...body, dismissReason: "" } as any;
          } else {
            body = { ...body, overdueReasons: "" } as any;
          }
          const result: any = yield DebtCollection.create(body, {
            name: `${id}/visits`
          });
          self.setAllField(result.data);
          self.error.setField({ fieldname: "tigger", value: false });
          self.alert.setAlertMessage(
            "บันทึกสำเร็จค่ะ",
            "เอกสารถูกบันทึกเรียบร้อยแล้ว"
          );
        } catch (e) {
          self.error.setErrorMessage(e);
          throw e;
        } finally {
          self.setField({ fieldname: "loading", value: false });
        }
      }
    }),
    updateVisit: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          visitDate: self.visitDate,
          visitType: self.visitType,
          isMeetTarget: self.isMeetTarget,
          overdueReasons: self.overdueReasons,
          dismissReason: self.dismissReason,
          currentAddress: self.currentAddress,
          isWorking: self.isWorking,
          occupation: self.occupation,
          hasExtraIncome: self.hasExtraIncome,
          extraIncome: self.extraIncome,
          extraIncomeDescription: self.extraIncomeDescription,
          familyMember: self.familyMember,
          familyMemberDescription: self.familyMemberDescription,
          ExpenseDeclaration: self.ExpenseDeclaration,
          problem1: self.problem1,
          problem2: self.problem2,
          problem3: self.problem3,
          inspection1: self.inspection1,
          inspection2: self.inspection2,
          inspection3: self.inspection3,
          visitorName: self.visitorName,
          visitorPosition: self.visitorPosition,
          comments: self.comments,
          attachedFiles: self.attachedFiles,
          contactTelephone: self.contactTelephone,
          expenseDeclaration: self.expenseDeclaration
        };
        const result: any = yield Visit.formUpdate(body, parseInt(self.id));
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "เอกสารถูกปรับปรุงเรียบร้อยแล้ว"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    deleteVisit: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        yield Visit.delete(parseInt(self.id));
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "เอกสารถูกลบเรียบร้อยแล้ว"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    printVisit: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          yield Visit.getById(self.id, {
            name: "print_visit_form"
          });
        } catch (e) {
          self.error.setErrorMessage(e);
          throw e;
        } finally {
          self.setField({ fieldname: "loading", value: false });
        }
      }
    }),
    addFiles: (files: File[]) => {
      files.forEach((_file: File) => {
        const attachedFile = AttachedFileModel.create({
          file: _file,
          refId: self.id,
          refType: "VISIT.ATTACHEDFILE"
        });
        self.attachedFiles.push(attachedFile);
      });
    },
    removeFile: (index: number) => {
      try {
        self.attachedFiles[index].deleteFile();
        self.attachedFiles.splice(index, 1);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "ข้อมูลถูกลบเรียบร้อยแล้ว"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
        throw e;
      }
    },
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));
export type IDebtCollectionVisitModel = typeof DebtCollectionVisitModel.Type;

export const DebtCollectionSueModel = types
  .model("DebtCollectionSueModel", {
    isApprovedSue: types.optional(types.boolean, false),
    debtAmount: customtypes.optional(
      types.union(types.number, types.string),
      0
    ),
    interestStartDate: customtypes.optional(types.string, ""),
    interestEndDate: customtypes.optional(types.string, ""),
    interestRate: customtypes.optional(
      types.union(types.number, types.string),
      0
    ),
    interestAmount: customtypes.optional(
      types.union(types.number, types.string),
      0
    ),
    totalDebtAmount: customtypes.optional(
      types.union(types.number, types.string),
      0
    ),
    judgementInterestStartDate: customtypes.optional(types.string, ""),
    judgementInterestEndDate: customtypes.optional(types.string, ""),
    judgementInterestRate: customtypes.optional(
      types.union(types.number, types.string),
      0
    ),
    judgementInterestAmount: customtypes.optional(
      types.union(types.number, types.string),
      0
    ),
    judgementBalance: customtypes.optional(
      types.union(types.number, types.string),
      0
    ),
    lawyerFee: customtypes.optional(types.union(types.number, types.string), 0),
    fee: customtypes.optional(types.union(types.number, types.string), 0),
    otherExpense: customtypes.optional(
      types.union(types.number, types.string),
      0
    ),
    totalAmount: customtypes.optional(
      types.union(types.number, types.string),
      0
    ),

    attachedFiles: customtypes.optional(types.array(AttachedFileModel), []),
    submitDate: customtypes.optional(types.string, ""),
    judgementDate: customtypes.optional(types.string, ""),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {})
  })
  .views((self: any) => ({
    get attachedFilesList() {
      return self.attachedFiles.map((item: IAttachedFileModel) => item.file);
    },
    get totalDebtAmountView() {
      return +self.debtAmount + +self.interestAmount;
    },
    get totalJudmentDebtAmountView() {
      return +self.judgementBalance + +self.judgementInterestAmount;
    },
    get totalAmountView() {
      return (
        +self.judgementBalance +
        +self.judgementInterestAmount +
        +self.lawyerFee +
        +self.fee +
        +self.otherExpense
      );
    }
  }))
  .actions((self: any) => ({
    addFiles: (files: File[]) => {
      let root: any;
      root = getRoot(self);
      files.forEach((_file: File) => {
        const attachedFile = AttachedFileModel.create({
          file: _file,
          refId: root.id,
          refType: "DEBT_SUE_ATTACHEDFILE"
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
          value: "บันทึกสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "ข้อมูลถูกลบเรียบร้อยแล้ว"
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
        console.log(e);
        throw e;
      }
    },
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
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));
export type IDebtCollectionSueModel = typeof DebtCollectionSueModel.Type;

export const DebtCollectionLetterModel = types
  .model("DebtCollectionLetterModel", {
    id: customtypes.optional(types.string, ""),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdBy: types.maybeNull(types.number),
    createdByName: customtypes.optional(types.string, ""),
    updatedBy: types.maybeNull(types.number),
    updatedByName: customtypes.optional(types.string, ""),
    debtCollectionId: customtypes.optional(types.string, ""),
    letterType: types.optional(types.string, ""),
    documentDate: types.optional(types.string, moment().format("YYYY-MM-DD")),
    postDate: customtypes.optional(types.string, ""),
    attachedFiles: customtypes.optional(types.array(AttachedFileModel), []),
    isSentBack: types.maybeNull(types.boolean),
    sentBackReasonType: types.maybeNull(types.number),
    sentBackReasonTypeDescription: types.optional(types.string, ""),
    isCollectable: types.maybeNull(types.boolean),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {})
  })
  .views((self: any) => ({
    get fileList() {
      return self.attachedFiles.map((item: IAttachedFileModel) => item.file);
    },
    get debtCollectionLetterJSON() {
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
          console.log(e);
        }
      });
    },
    addFiles: (files: File[]) => {
      files.forEach((_file: File) => {
        const attachedFile = AttachedFileModel.create({
          file: _file,
          refId: self.id,
          refType: "LETTER.ATTACHEDFILE"
        });
        self.attachedFiles.push(attachedFile);
      });
    },
    removeFile: (index: number) => {
      try {
        self.attachedFiles[index].deleteFile();
        self.attachedFiles.splice(index, 1);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "ข้อมูลถูกลบเรียบร้อยแล้ว"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
        throw e;
      }
    },
    getDebtCollectionLetterDetail: flow(function* (id: number) {
      if (id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          const result: any = yield DebtCollectionLetter.getById(self.id);
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
    createDebtCollectionLetter: flow(function* (id: string) {
      if (id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          const body = {
            debtCollectionId: id,
            letterType: self.letterType,
            documentDate: self.documentDate,
            postDate: self.postDate ? self.postDate : undefined,
            attachedFiles: self.attachedFiles,
            sentBackReasonType: self.sentBackReasonType,
            sentBackReasonTypeDescription: self.sentBackReasonTypeDescription,
            isSentBack: self.isSentBack,
            isCollectable: self.isCollectable
          };
          const result: any = yield DebtCollection.create(body, {
            name: `${id}/letters`
          });
          self.setAllField(result.data);
          self.error.setField({ fieldname: "tigger", value: false });
          self.alert.setAlertMessage(
            i18n.t(
              "module.debtCollection.debtCollectionDemandLetterTable.successfullySaved"
            ),
            i18n.t(
              "module.debtCollection.debtCollectionDemandLetterTable.documentSavedSuccessfully"
            )
          );
        } catch (e) {
          self.error.setErrorMessage(e);
          throw e;
        } finally {
          self.setField({ fieldname: "loading", value: false });
        }
      }
    }),
    updateLetter: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          letterType: self.letterType,
          documentDate: self.documentDate,
          postDate: self.postDate ? self.postDate : undefined,
          attachedFiles: self.attachedFiles,
          sentBackReasonType: self.sentBackReasonType,
          sentBackReasonTypeDescription: self.sentBackReasonTypeDescription,
          isSentBack: self.isSentBack !== null && self.isSentBack.toString(),
          isCollectable:
            self.isCollectable !== null && self.isCollectable.toString()
        };
        const result: any = yield Letter.formUpdate(body, parseInt(self.id));
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          i18n.t(
            "module.debtCollection.debtCollectionDemandLetterTable.successfullySaved"
          ),
          i18n.t(
            "module.debtCollection.debtCollectionDemandLetterTable.documentSavedSuccessfully"
          )
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    deleteLetter: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        yield Letter.delete(parseInt(self.id));
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "เอกสารถูกลบเรียบร้อยแล้ว"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    printLetter: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });

          yield DebtCollectionLetter.getById(self.id, {
            name: "print_letter"
          });
        } catch (e) {
          self.error.setErrorMessage(e);
          throw e;
        } finally {
          self.setField({ fieldname: "loading", value: false });
        }
      }
    }),
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));
export type IDebtCollectionLetterModel = typeof DebtCollectionLetterModel.Type;

export const DebtCollectionModel = types
  .model("DebtCollectionModel", {
    id: customtypes.optional(types.string, ""),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdBy: types.maybeNull(types.number),
    createdByName: customtypes.optional(types.string, ""),
    updatedBy: types.maybeNull(types.number),
    updatedByName: customtypes.optional(types.string, ""),
    // accountReceivable: types.maybeNull(
    //   types.late((): IAnyModelType => AccountReceivableModel)
    // ),
    memos: customtypes.optional(types.array(DebtCollectionMemoModel), []),
    accountReceivableId: customtypes.optional(types.string, ""),
    accountReceivable: customtypes.optional(AccountReceivableModel, {}),
    // overDueBalance: customtypes.optional(types.number, 0),
    overDueBalance: customtypes.optional(
      types.union(types.number, types.string),
      0
    ),
    outstandingDebtBalance: customtypes.optional(types.number, 0),
    prescriptionStartDate: customtypes.optional(types.string, ""),
    prescriptionValue: customtypes.optional(types.number, 0),
    prescriptionUnit: customtypes.optional(types.string, ""),
    interruptReason: customtypes.optional(types.string, ""), ////  debtInterruptReasonSet
    comments: customtypes.optional(types.string, ""),
    attachedFiles: customtypes.optional(types.array(AttachedFileModel), []),
    letters: customtypes.optional(types.array(DebtCollectionLetterModel), []),
    visits: customtypes.optional(types.array(DebtCollectionVisitModel), []), ////  DebtCollectionVisit
    debtSue: customtypes.optional(DebtCollectionSueModel, {}), /// EmbeddedDebtSue
    step: types.maybeNull(types.number),
    active: types.optional(types.boolean, false),
    prescriptionRemainingMonth: types.maybeNull(types.number),
    organization: types.optional(OrgModel, {}),
    isPassAway: types.optional(types.boolean, false),
    deathNotification: customtypes.optional(DeathNotificationModel, {}),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {})
  })
  .views((self: any) => ({
    get listitem() {
      return {
        key: self.id,
        value: self.id,
        text: self.orgName,
        description: self.orgCode
      };
    },
    get status() {
      return self.active
        ? i18n.t("module.admin.orgModel.enable")
        : i18n.t("module.admin.orgModel.disable");
    },
    get parentname() {
      return self.parent ? self.parent.orgName : "-";
    },
    get prescriptionRemainingMonthDisplay() {
      return self.prescriptionRemainingMonth
        ? Math.ceil(self.prescriptionRemainingMonth)
        : "";
    },
    get letter_list_inheritance() {
      return self.letters.filter(
        (item: IDebtCollectionLetterModel) => item.letterType === "CSM"
      );
    },
    get letter_list_ascertain_heirs() {
      return self.letters.filter(
        (item: IDebtCollectionLetterModel) => item.letterType === "CSH"
      );
    },
    get letter_list_heir() {
      return self.letters.filter(
        (item: IDebtCollectionLetterModel) => item.letterType === "CLR"
      );
    },
    get letter_list_borrower() {
      return self.letters.filter(
        (item: IDebtCollectionLetterModel) => item.letterType === "CLB"
      );
    },
    get letter_list_guarantor() {
      return self.letters.filter(
        (item: IDebtCollectionLetterModel) => item.letterType === "CLG"
      );
    },
    get diffMonths() {
      if (self.accountReceivable && self.accountReceivable.endDate) {
        const month = moment().diff(
          moment(self.accountReceivable.endDate),
          "months"
        );
        if (month > 0) {
          return month.toString();
        } else {
          return "0";
        }
      } else {
        return "";
      }
    },
    get debtCollectionToJSON() {
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
          console.log(e);
        }
      });
    },
    resetAll: () => {
      applySnapshot(self, {});
    },
    getDebtCollectionDetail: flow(function* (nonLoading?: boolean) {
      if (self.id) {
        try {
          if (nonLoading) {
            self.setField({ fieldname: "loading", value: false });
          } else {
            self.setField({ fieldname: "loading", value: true });
          }
          const result: any = yield DebtCollection.getById(self.id);
          self.setAllField(result.data);
          if (self.deathNotification.isConfirm) {
            self.setField({ fieldname: "isPassAway", value: true });
          }
          self.error.setField({ fieldname: "tigger", value: false });
        } catch (e) {
          self.error.setErrorMessage(e);
          console.log(e);
        } finally {
          self.setField({ fieldname: "loading", value: false });
        }
      }
    }),
    createDebtCollection: flow(function* (id: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          accountReceivableId: id
        };
        const result: any = yield DebtCollection.create(body);
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.error.setErrorMessage(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateDeathNotification: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          deathNotification: self.deathNotification
        };
        const result: any = yield DebtCollection.update(
          body,
          parseInt(self.id)
        );
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "เอกสารถูกบันทึกเรียบร้อยแล้ว"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateDebtCollectionInfomationSue: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          debtSue: {
            submitDate: self.debtSue.submitDate,
            judgementDate: self.debtSue.judgementDate,
            debtAmount: self.debtSue.debtAmount,
            interestStartDate: self.debtSue.interestStartDate,
            interestEndDate: self.debtSue.interestEndDate,
            interestRate: self.debtSue.interestRate,
            attachedFiles: self.debtSue.attachedFiles
          }
        };
        const result: any = yield DebtCollection.formUpdate(body, self.id);
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "ข้อมูลถูกปรับปรุงเรียบร้อยแล้ว"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateDebtCollectionResultSue: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          debtSue: {
            judgementInterestStartDate: self.debtSue.judgementInterestStartDate,
            judgementInterestEndDate: self.debtSue.judgementInterestEndDate,
            judgementInterestRate: self.debtSue.judgementInterestRate,
            debtAmount: self.debtSue.debtAmount,
            judgementBalance: self.debtSue.judgementBalance,
            interestAmount: self.debtSue.interestAmount,
            judgementInterestAmount: self.debtSue.judgementInterestAmount,
            lawyerFee: self.debtSue.lawyerFee,
            fee: self.debtSue.fee,
            otherExpense: self.debtSue.otherExpense
          }
        };
        const result: any = yield DebtCollection.update(body, self.id);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "ข้อมูลถูกปรับปรุงเรียบร้อยแล้ว"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    printCancelBorrower: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          yield DebtCollection.getById(self.id, {
            name: "print_cancel_borrower"
          });
          self.error.setField({ fieldname: "tigger", value: false });
        } catch (e) {
          self.error.setErrorMessage(e);
          console.log(e);
        } finally {
          self.setField({ fieldname: "loading", value: false });
        }
      }
    }),
    printCancelGurantor: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          yield DebtCollection.getById(self.id, {
            name: "print_cancel_gurantor"
          });
          self.error.setField({ fieldname: "tigger", value: false });
        } catch (e) {
          self.error.setErrorMessage(e);
          console.log(e);
        } finally {
          self.setField({ fieldname: "loading", value: false });
        }
      }
    }),
    onCalculateInterestRate: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const result: any = yield Config.get(
          {
            startDate: self.debtSue.interestStartDate,
            endDate: self.debtSue.interestEndDate,
            interestType: "FIX",
            interestRate: self.debtSue.interestRate,
            debtAmount: self.debtSue.debtAmount,
            calculateType: "FLAT"
          },
          {
            name: "interest_calculate"
          }
        );
        self.debtSue.interestAmount = result.data;
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    onCalculateJudgementInterestRate: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const result: any = yield Config.get(
          {
            startDate: self.debtSue.judgementInterestStartDate,
            endDate: self.debtSue.judgementInterestEndDate,
            interestType: "FIX",
            interestRate: self.debtSue.judgementInterestRate,
            debtAmount: self.debtSue.judgementBalance,
            calculateType: "FLAT"
          },
          {
            name: "interest_calculate"
          }
        );
        self.debtSue.judgementInterestAmount = result.data;
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    printEnvelops: flow(function* (addressType: string,
      fileType: string,
      isReport: boolean,
      commonAddress: boolean,
      envelopSize: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        // const addressType = "idCardAddress";
        // const fileType = "pdf";
        // const isReport = false;
        // const envelopSize = "1";
        const result: any = yield fetchNoService(
          `${process.env.REACT_APP_DOP_DOCS_ENDPOINT}/opentbs/tbs/template_envelop_debtcollection_borrower.php`,
          {
            show_debug: "0",
            ids: self.accountReceivableId ? self.accountReceivableId : "0",
            isReport,
            fileType: isReport ? undefined : fileType,
            envelopSize: envelopSize ? envelopSize : undefined,
            addressType,
          },
          "template_envelop",
          isReport ? undefined : fileType
        );
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage("", "");
      } catch (e) {
        self.error.setErrorMessage(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    printEnvelopsGuarantor: flow(function* (addressType: string,
      fileType: string,
      isReport: boolean,
      commonAddress: boolean,
      envelopSize: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        // const addressType = "idCardAddress";
        // const fileType = "pdf";
        // const isReport = false;
        // const envelopSize = "1";
        const result: any = yield fetchNoService(
          `${process.env.REACT_APP_DOP_DOCS_ENDPOINT}/opentbs/tbs/template_envelop_debtcollection_guarantor.php`,
          {
            show_debug: "0",
            ids: self.accountReceivableId ? self.accountReceivableId : "0",
            isReport,
            fileType: isReport ? undefined : fileType,
            envelopSize: envelopSize ? envelopSize : undefined,
            addressType,
          },
          "template_envelop",
          isReport ? undefined : fileType
        );
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage("", "");
      } catch (e) {
        self.error.setErrorMessage(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    printFormMemo: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          yield Memo.getById(self.id, {
            name: "print_form"
          });
        } catch (e) {
          self.error.setErrorMessage(e);
          throw e;
        } finally {
          self.setField({ fieldname: "loading", value: false });
        }
      }
    }),
    deleteVisitFromList: (item: IDebtCollectionVisitModel) => {
      const index = self.visits.indexOf(item);
      if (index !== -1) self.visits.splice(index, 1);
    },
    deleteMemoFromList: (item: IDebtCollectionMemoModel) => {
      const index = self.memos.indexOf(item);
      if (index !== -1) self.memos.splice(index, 1);
    }
  }));
export type IDebtCollectionModel = typeof DebtCollectionModel.Type;
