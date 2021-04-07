import { flow } from "mobx";
import { applySnapshot, types } from "mobx-state-tree";
import { ErrorModel } from "../../components/common/error";
import {
  AttachedFileModel,
  IAttachedFileModel
} from "../../components/common/fileupload/AttachedFileModel";
import { MessageModel } from "../../components/common/message";
import { IInput } from "../../utils/common-interface";
import customtypes from "../../utils/mobx-types-helper";
import { UserModel } from "../admin/user";
import { PosModel } from "../pos/PosModel";
import { ReceiptControlLogAPI } from "./ReceiptControlLogService";

export enum receiveControlLogStatusEnum {
  waiting = "WT",
  approved = "AP",
  notApproved = "RJ"
}

export enum logTypeEnum {
  request = "REQUEST",
  used = "USED"
}

export const ReceiptControlLogModel = types
  .model("ReceiptControlLogModel", {
    id: types.optional(types.string, ""),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdBy: types.maybeNull(types.number),
    createdByName: customtypes.optional(types.string, ""),
    updatedBy: types.maybeNull(types.number),
    updatedByName: customtypes.optional(types.string, ""),
    posId: types.optional(types.string, ""),
    documentDate: types.optional(types.string, ""),
    onDutymanagerId: types.optional(types.string, ""),
    userId: types.optional(types.string, ""),
    logType: types.optional(types.string, ""),
    status: types.optional(types.string, receiveControlLogStatusEnum.waiting),
    requestQuantity: types.optional(types.number, 0),
    approveQuantity: types.optional(types.number, 0),
    unit: types.optional(types.string, ""),
    pos: types.optional(PosModel, {}),
    user: types.optional(UserModel, {}),
    onDutymanager: types.optional(UserModel, {}),
    requestAttachedFiles: customtypes.optional(
      types.array(AttachedFileModel),
      []
    ),
    approveAttachedFiles: customtypes.optional(
      types.array(AttachedFileModel),
      []
    ),
    error: types.optional(ErrorModel, {}),
    alert: types.optional(MessageModel, {}),
    loading: types.optional(types.boolean, false)
  })
  .views((self: any) => ({
    get requestAttachedFilesList() {
      return self.requestAttachedFiles.map(
        (item: IAttachedFileModel) => item.file
      );
    },
    get approveAttachedFilesList() {
      return self.approveAttachedFiles.map(
        (item: IAttachedFileModel) => item.file
      );
    },
    get receiptControlLogSON() {
      return self.toJSON();
    }
  }))
  .actions((self: any) => ({
    create_data: flow(function*(
      posId: string,
      pin: string,
      onDutymanagerId: string,
      logType: logTypeEnum
    ) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body: any = {
          attachedFiles: self.requestAttachedFiles,
          logType,
          posId,
          pin,
          onDutymanagerId
        };

        // ประเภทการเบิกจ่ายใบเสร็จที่เป็น นำไปใช้ จะต้องส่ง requestQuantity ไปในชื่อ approveQuantity
        if (logType === logTypeEnum.request) {
          body.requestQuantity = self.requestQuantity;
        } else if (logType === logTypeEnum.used) {
          body.approveQuantity = self.approveQuantity;
        }

        const result: any = yield ReceiptControlLogAPI.formCreate(body);
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "สร้างรายการเบิกจ่ายใบเสร็จเรียบร้อยแล้ว"
        );
        self.setAllField(result.data);
      } catch (e) {
        self.error.setErrorMessage(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    approve_data: flow(function*() {
      try {
        const body = {
          status: receiveControlLogStatusEnum.approved,
          approveQuantity: self.approveQuantity,
          attachedFiles: self.approveAttachedFiles
        };
        const result: any = yield ReceiptControlLogAPI.formUpdate(
          body,
          self.id
        );
        self.setAllField(result.data);
      } catch (e) {
        throw e;
      } finally {
        //
      }
    }),
    notApprove_data: flow(function*() {
      try {
        const body = {
          status: receiveControlLogStatusEnum.notApproved
        };
        const result: any = yield ReceiptControlLogAPI.formUpdate(
          body,
          self.id
        );
        self.setAllField(result.data);
      } catch (e) {
        throw e;
      } finally {
        //
      }
    }),
    delete_data: flow(function*() {
      try {
        self.setField({ fieldname: "loading", value: true });
        yield ReceiptControlLogAPI.delete(self.id);
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    addAttachedFiles: (
      type: "requestAttachedFiles" | "approveAttachedFiles",
      files: File[]
    ) => {
      files.forEach((_file: File) => {
        const attachedFile = AttachedFileModel.create({
          file: _file,
          refId: self.id,
          refType:
            type === "requestAttachedFiles"
              ? "RECEIPT.REQUEST"
              : "RECEIPT.APPROVE"
        });
        self[type].push(attachedFile);
      });
    },
    removeAttachedFile: (
      type: "requestAttachedFiles" | "approveAttachedFiles",
      index?: number
    ) => {
      if (index !== undefined && index >= 0) {
        self[type].splice(index, 1);
      }
    },
    setStatus: (status: receiveControlLogStatusEnum) => {
      self.status = status;
    },
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
    }
  }));
export type IReceiptControlLogModel = typeof ReceiptControlLogModel.Type;
