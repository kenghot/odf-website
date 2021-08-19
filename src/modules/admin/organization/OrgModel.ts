import i18n from "i18next";
import {
  applySnapshot,
  detach,
  flow,
  IAnyModelType,
  types,
} from "mobx-state-tree";
import { Org } from ".";
import { AddressModel } from "../../../components/address";
import { ErrorModel } from "../../../components/common/error";
import {
  AttachedFileModel,
  IAttachedFileModel,
} from "../../../components/common/fileupload/AttachedFileModel";
import { MessageModel } from "../../../components/common/message";
import { IInput } from "../../../utils/common-interface";
import customtypes from "../../../utils/mobx-types-helper";
import { ISpecialPosModel, SpecialPosModel } from "../../pos/SpecialPosModel";
import { SequenceModel } from "../sequence";

export const OrgModel = types
  .model("OrgModel", {
    id: types.optional(types.string, ""),
    orgName: types.optional(types.string, ""),
    orgCode: types.optional(types.string, ""),
    agreementAuthorizedTitle: types.optional(types.string, ""),
    agreementAuthorizedFirstname: types.optional(types.string, ""),
    agreementAuthorizedLastname: types.optional(types.string, ""),
    agreementAuthorizedPosition: types.optional(types.string, ""),
    agreementAuthorizedCommandNo: types.optional(types.string, ""),
    agreementAuthorizedCommandDate: types.maybeNull(types.string),
    donationAuthorizedTitle: types.optional(types.string, ""),
    donationAuthorizedFirstname: types.optional(types.string, ""),
    donationAuthorizedLastname: types.optional(types.string, ""),
    donationAuthorizedPosition: types.optional(types.string, ""),
    attachedFiles: customtypes.optional(types.array(AttachedFileModel), []),
    witness1: types.optional(types.string, ""),
    witness2: types.optional(types.string, ""),
    telephone: types.optional(types.string, ""),
    active: types.optional(types.boolean, false),
    address: types.optional(AddressModel, {}),
    parent: types.maybeNull(types.late((): IAnyModelType => OrgModel)),
    requestSequence: customtypes.optional(SequenceModel, {}),
    requestOnlineSequence: customtypes.optional(SequenceModel, {}),
    agreementSequence: customtypes.optional(SequenceModel, {}),
    guaranteeSequence: customtypes.optional(SequenceModel, {}),
    voucherSequence: customtypes.optional(SequenceModel, {}),
    bankName: customtypes.optional(types.string, ""),
    bankAccountName: customtypes.optional(types.string, ""),
    bankAccountNo: customtypes.optional(types.string, ""),
    bankBranchCode: customtypes.optional(types.string, ""),
    region: customtypes.optional(types.string, ""),
    specialPOS: customtypes.optional(types.array(SpecialPosModel), []),
    isSelcted: types.optional(types.boolean, true),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {}),
  })
  .views((self: any) => ({
    get fileList() {
      return self.attachedFiles.map((item: IAttachedFileModel) => item.file);
    },
    get posDonateAllowaceId() {
      const value = self.specialPOS.find(
        (item: ISpecialPosModel) => item.type === "DonateAllowace"
      );
      return value ? value.posId : undefined;
    },
    get posDonateAllowace() {
      const value = self.specialPOS.find(
        (item: ISpecialPosModel) => item.type === "DonateAllowace"
      );
      return value ? value : undefined;
    },
    get posDonateDirectId() {
      const value = self.specialPOS.find(
        (item: ISpecialPosModel) => item.type === "DonateDirect"
      );
      return value ? value.posId : undefined;
    },
    get posDonateDirect() {
      const value = self.specialPOS.find(
        (item: ISpecialPosModel) => item.type === "DonateDirect"
      );
      return value ? value : undefined;
    },
    get listitem() {
      return {
        key: self.id,
        value: self.id,
        text: self.orgName,
        description: self.orgCode,
      };
    },
    get listitem2() {
      return {
        key: self.id,
        value: self.orgCode,
        text: self.orgName,
        description: self.orgCode,
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
    getOrgDetail: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          const result: any = yield Org.getById(self.id);
          self.setAllField(result.data);
          if (!self.bankBranchCode) {
            self.setField({ fieldname: "bankBranchCode", value: "0000" });
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
    createOrg: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });

        let body = {
          active: self.active,
          orgName: self.orgName,
          orgCode: self.orgCode,
          address: self.address,
          telephone: self.telephone,
          region: self.region,
        };
        if (self.parent && self.parent.id) {
          body = { ...body, parent: { id: self.parent.id } } as any;
        }
        const result: any = yield Org.create(body);
        self.setAllField(result.data);

        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "หน่วยงานใหม่ถูกสร้างเรียบร้อยแล้ว",
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
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateOrg: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });

        let body = {
          active: self.active,
          orgName: self.orgName,
          orgCode: self.orgCode,
          address: self.address,
          telephone: self.telephone,
          region: self.region,
        };
        if (self.parent && self.parent.id) {
          body = { ...body, parent: { id: self.parent.id } } as any;
        }
        yield Org.update(body, parseInt(self.id));

        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "ข้อมูลหน่วยงานถูกปรับปรุงเรียบร้อยแล้ว",
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
    updateAuthorizedPersonOrg: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });

        const body = {
          witness1: self.witness1,
          witness2: self.witness2,
          agreementAuthorizedTitle: self.agreementAuthorizedTitle,
          agreementAuthorizedFirstname: self.agreementAuthorizedFirstname,
          agreementAuthorizedLastname: self.agreementAuthorizedLastname,
          agreementAuthorizedPosition: self.agreementAuthorizedPosition,
          agreementAuthorizedCommandNo: self.agreementAuthorizedCommandNo,
          agreementAuthorizedCommandDate: self.agreementAuthorizedCommandDate
            ? self.agreementAuthorizedCommandDate
            : null,
        };

        yield Org.update(body, parseInt(self.id));

        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "ข้อมูลหน่วยงานถูกปรับปรุงเรียบร้อยแล้ว",
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
    updateBankOrg: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          bankName: self.bankName,
          bankAccountName: self.bankAccountName,
          bankAccountNo: self.bankAccountNo,
          bankBranchCode: self.bankBranchCode,
        };
        yield Org.update(body, parseInt(self.id));
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "ข้อมูลหน่วยงานถูกปรับปรุงเรียบร้อยแล้ว"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateManagePos: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          specialPOS: self.specialPOS,
        };
        yield Org.update(body, parseInt(self.id));
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "ข้อมูลหน่วยงานถูกปรับปรุงเรียบร้อยแล้ว"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateManageDocumentOrg: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });

        const body = {
          requestSequence: self.requestSequence.id
            ? {
              id: self.requestSequence.id,
            }
            : undefined,
          requestOnlineSequence: self.requestOnlineSequence.id
            ? {
              id: self.requestOnlineSequence.id,
            }
            : undefined,
          agreementSequence: self.agreementSequence.id
            ? {
              id: self.agreementSequence.id,
            }
            : undefined,
          guaranteeSequence: self.guaranteeSequence.id
            ? {
              id: self.guaranteeSequence.id,
            }
            : undefined,
          voucherSequence: self.voucherSequence.id
            ? {
              id: self.voucherSequence.id,
            }
            : undefined,
        };

        yield Org.update(body, parseInt(self.id));

        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "ข้อมูลหน่วยงานถูกปรับปรุงเรียบร้อยแล้ว",
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
    deleteOrg: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });

        yield Org.delete(parseInt(self.id));

        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "หน่วยงานถูกลบเรียบร้อยแล้ว",
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
    selectPosDonateAllowace(specialPos?: ISpecialPosModel) {
      if (self.posDonateAllowace) {
        detach(self.posDonateAllowace);
      }
      if (specialPos) {
        self.specialPOS.push(specialPos);
      }
    },
    selectPosDonateDirect(specialPos?: ISpecialPosModel) {
      if (self.posDonateDirect) {
        detach(self.posDonateDirect);
      }
      if (specialPos) {
        self.specialPOS.push(specialPos);
      }
    },
    updateDonationAuthorized: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          donationAuthorizedTitle: self.donationAuthorizedTitle,
          donationAuthorizedFirstname: self.donationAuthorizedFirstname,
          donationAuthorizedLastname: self.donationAuthorizedLastname,
          donationAuthorizedPosition: self.donationAuthorizedPosition,
          attachedFiles: self.attachedFiles,
        };
        const result: any = yield Org.formUpdate(body, `${self.id}/donation_authorization`);
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
    addFiles: (files: File[]) => {
      files.forEach((_file: File) => {
        const attachedFile = AttachedFileModel.create({
          file: _file,
          refId: self.id,
          refType: "SIGNATURE.ATTACHEDFILE",
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
  }));
export type IOrgModel = typeof OrgModel.Type;
