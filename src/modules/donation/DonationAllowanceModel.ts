import { applySnapshot, clone, flow, types } from "mobx-state-tree";
import { ErrorModel } from "../../components/common/error";
import {
  AttachedFileModel,
  IAttachedFileModel,
} from "../../components/common/fileupload/AttachedFileModel";
import { MessageModel } from "../../components/common/message";
import { IDCardModel } from "../../components/idcard";
import { date_YYYYMMDD_TO_DDMMYYYY } from "../../utils";
import { IInput } from "../../utils/common-interface";
import customtypes from "../../utils/mobx-types-helper";
import { IOrgModel, OrgModel } from "../admin/organization/OrgModel";
import { PosModel } from "../pos/PosModel";
import { ReceiptModel } from "../receipt/ReceiptModel";
import { ProfileModel } from "../share/profile/ProfileModel";
import { DonationAllowances } from "./DonationService";

export const DonationAllowanceModel = types
  .model("DonationAllowanceModel", {
    id: customtypes.optional(types.string, ""),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdBy: types.maybeNull(types.number),
    createdByName: customtypes.optional(types.string, ""),
    updatedBy: types.maybeNull(types.number),
    updatedByName: customtypes.optional(types.string, ""),
    organizationId: customtypes.optional(types.string, ""),
    receiptOrganization: customtypes.optional(types.string, ""),
    donationDate: customtypes.optional(types.string, ""),
    receiptDate: customtypes.optional(types.string, ""),
    receiptId: customtypes.optional(types.string, ""),
    posId: customtypes.optional(types.string, ""),
    paidAmount: types.optional(types.string, ""),
    donator: types.optional(ProfileModel, {}),
    organization: types.optional(OrgModel, {}),
    pos: customtypes.optional(PosModel, {}),
    note: customtypes.optional(types.string, ""),
    receipt: customtypes.optional(ReceiptModel, {}),
    idCard: types.optional(IDCardModel, {}),
    attachedFiles: customtypes.optional(types.array(AttachedFileModel), []),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false),
    isSelected: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {}),
  })
  .views((self: any) => ({
    get fileList() {
      return self.attachedFiles.map((item: IAttachedFileModel) => item.file);
    },
    get debtCollectionToJSON() {
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
    addFiles: (files: File[]) => {
      files.forEach((_file: File) => {
        const attachedFile = AttachedFileModel.create({
          file: _file,
          refId: self.id,
          refType: "DONATIONALLOWANCE.ATTACHEDFILE",
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
    },
    getDonationAllowanceDetail: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          const result: any = yield DonationAllowances.getById(self.id);
          self.setAllField(result.data);
          const idCard = IDCardModel.create({
            id: self.donator.idCardNo,
            title: self.donator.title,
            firstname: self.donator.firstname,
            lastname: self.donator.lastname,
            birthday: date_YYYYMMDD_TO_DDMMYYYY(self.donator.birthDate),
            issued_date: date_YYYYMMDD_TO_DDMMYYYY(
              self.donator.idCardIssuedDate
            ),
            expired_date: date_YYYYMMDD_TO_DDMMYYYY(
              self.donator.idCardExpireDate
            ),
            issuer: self.donator.idCardIssuer,
            address: clone(self.donator.registeredAddress),
            age: self.donator.age,
          });
          self.setField({
            fieldname: "idCard",
            value: idCard,
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
    createDonationAllowance: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });

        
        const body = {
          donationDate: self.donationDate,
          receiptDate: self.receiptDate,
          paidAmount: self.paidAmount,
          organizationId: self.organization.id,
          receiptOrganization: self.receiptOrganization,
          posId: self.organization.posDonateAllowaceId || "",
          note: self.note,
          donator: self.donator,
        };
        const result: any = yield DonationAllowances.create(body);
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.error.setErrorMessage(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    createDonationAllowanceReceipts: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {};
        const result: any = yield DonationAllowances.create(body, {
          name: `${self.id}/receipts`,
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
    updateDonationAllowance: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          donationDate: self.donationDate,
          receiptDate: self.receiptDate,
          paidAmount: self.paidAmount,
          organizationId: self.organizationId,
          receiptOrganization: self.receiptOrganization,
          posId: self.posId,
          donator: self.donator,
          note: self.note,
          attachedFiles: self.attachedFiles,
        };
        const result: any = yield DonationAllowances.formUpdate(body, self.id);
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
    delete_data: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        yield DonationAllowances.delete(self.id);
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
  }));
export type IDonationAllowanceModel = typeof DonationAllowanceModel.Type;
