import i18n from "i18next";
import { flow } from "mobx";
import { applySnapshot, IAnyModelType, types } from "mobx-state-tree";
import { ErrorModel } from "../../components/common/error";
import { MessageModel } from "../../components/common/message";
import { mainCharLabel } from "../../utils";
import { IInput } from "../../utils/common-interface";
import { dateTime_display_CE_TO_BE } from "../../utils/format-helper";
import customtypes from "../../utils/mobx-types-helper";
import { hasPermission } from "../../utils/render-by-permission";
import { OrgModel } from "../admin/organization";
import { SequenceModel } from "../admin/sequence";
import { UserModel } from "../admin/user";
import { Pos, PosShifts } from "./PosService";

export const PosShiftModel = types
  .model("PosShiftModel", {
    id: customtypes.optional(types.string, ""),
    posId: customtypes.optional(types.string, ""),
    pos: types.maybeNull(types.late((): IAnyModelType => PosModel)),
    startedShift: customtypes.optional(types.string, ""),
    endedShift: customtypes.optional(types.string, ""),
    onDutymanagerId: customtypes.optional(types.string, ""),
    onDutymanager: customtypes.optional(UserModel, {}),
    currentCashierId: customtypes.optional(types.string, ""),
    currentCashier: customtypes.optional(UserModel, {}),
    openingAmount: customtypes.optional(types.string, ""),
    expectedDrawerAmount: customtypes.optional(types.string, ""),
    drawerAmount: customtypes.optional(types.string, ""),
    transactionCount: customtypes.optional(types.string, ""),
    transactionAmount: customtypes.optional(types.string, ""),
    transactionCashCount: customtypes.optional(types.string, ""),
    transactionCashAmount: customtypes.optional(types.string, ""),
    transactionMoneyOrderCount: customtypes.optional(types.string, ""),
    transactionMoneyOrderAmount: customtypes.optional(types.string, ""),
    transactionCheckCount: customtypes.optional(types.string, ""),
    transactionCheckAmount: customtypes.optional(types.string, ""),
    dropAmount: customtypes.optional(types.string, ""),
    addAmount: customtypes.optional(types.string, ""),
    overShortAmount: customtypes.optional(types.string, ""),
    isOnline: customtypes.optional(types.boolean, false),
    error: types.optional(ErrorModel, {}),
    alert: types.optional(MessageModel, {}),
    loading: types.optional(types.boolean, false),
  })
  .views((self: any) => ({
    get onDutymanagerIdLabel() {
      const spaceText = `${"0"}`;
      if (self.onDutymanagerId.length < 5) {
        const diff = 5 - +self.onDutymanagerId.length;
        return `${spaceText.repeat(+diff)}${self.onDutymanagerId}`;
      } else {
        return self.onDutymanagerId;
      }
    },
    get currentCashierIdLabel() {
      const spaceText = `${"0"}`;
      if (self.currentCashierId.length < 5) {
        const diff = 5 - +self.currentCashierId.length;
        return `${spaceText.repeat(+diff)}${self.currentCashierId}`;
      } else {
        return self.currentCashierId;
      }
    },
    get overShortAmountLabelView() {
      const drawerAmount = +self.drawerAmount;
      const expectedDrawerAmount = +self.expectedDrawerAmount;
      return drawerAmount - expectedDrawerAmount;
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
    getPosShiftDetail: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          const result: any = yield PosShifts.getById(self.id);
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
    resetAll: () => {
      applySnapshot(self, {});
    },
  }));
export type IPosShiftModel = typeof PosShiftModel.Type;

export const PosShiftLogUserColorModel = types
  .model("PosShiftLogUserColorModel", {
    id: types.maybeNull(types.number),
    username: customtypes.optional(types.string, ""),
    userColor: customtypes.optional(types.string, ""),
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
export type IPosShiftLogUserColorModel = typeof PosShiftLogUserColorModel.Type;

export const PosShiftLogsModel = types
  .model("PosShiftLogsModel", {
    id: customtypes.optional(types.string, ""),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdBy: types.maybeNull(types.number),
    createdByName: types.optional(types.string, ""),
    updatedBy: types.maybeNull(types.number),
    updatedByName: customtypes.optional(types.string, ""),
    posShiftId: customtypes.optional(types.string, ""),
    posShift: customtypes.optional(PosShiftModel, {}),
    action: customtypes.optional(types.string, ""),
    transactionAmount: customtypes.optional(types.string, ""),
    expectedDrawerAmount: customtypes.optional(types.string, ""),
    note: customtypes.optional(types.string, ""),
    refType: customtypes.optional(types.string, ""),
    refId: types.maybe(types.union(types.number, types.null)),
    userColor: customtypes.optional(types.string, ""),
    error: types.optional(ErrorModel, {}),
    alert: types.optional(MessageModel, {}),
    loading: types.optional(types.boolean, false),
  })
  .views((self: any) => ({
    get createByLabel() {
      if (self.createdByName) {
        const name = self.createdByName.replace(/นาย|นาง|น.ส.|นางสาว/gi, "");
        return mainCharLabel(name, 2);
      } else {
        return "";
      }
    },
    get actionLabelCol4() {
      switch (self.action) {
        case "OPEN":
          return i18n.t("module.pos.posShiftSummaryItem.balanceBrought");
        case "CLOSE":
          return i18n.t("module.pos.posShiftSummaryItem.countableAmount");
        case "ADD":
          return i18n.t("module.pos.posShiftSummaryItem.balance");
        case "DROP":
          return i18n.t("module.pos.posShiftSummaryItem.balance");
        default:
          return "";
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
  }));
export type IPosShiftLogsModel = typeof PosShiftLogsModel.Type;

export const PosModel = types
  .model("PosModel", {
    id: customtypes.optional(types.string, ""),
    printerIP: customtypes.optional(types.string, ""),
    printerPort: customtypes.optional(types.string, "8008"),
    createdDate: customtypes.optional(types.string, ""),
    updatedDate: customtypes.optional(types.string, ""),
    createdBy: types.maybeNull(types.number),
    createdByName: customtypes.optional(types.string, ""),
    updatedBy: types.maybeNull(types.number),
    updatedByName: customtypes.optional(types.string, ""),
    organizationId: customtypes.optional(types.string, ""),
    organization: types.optional(OrgModel, {}),
    posCode: customtypes.optional(types.string, ""),
    posName: customtypes.optional(types.string, ""),
    registedVAT: customtypes.optional(types.boolean, false),
    registedVATCode: customtypes.optional(types.string, ""),
    managerId: customtypes.optional(types.string, ""),
    manager: customtypes.optional(UserModel, {}),
    receiptSequenceId: customtypes.optional(types.string, ""),
    receiptSequence: customtypes.optional(SequenceModel, {}),
    active: customtypes.optional(types.boolean, true),
    isOnline: customtypes.optional(types.boolean, false),
    shifts: types.optional(types.array(PosShiftModel), []),
    lastestPosShift: customtypes.optional(PosShiftModel, {}),
    historyDisplay: types.optional(types.boolean, false),
    pin: types.maybe(types.string),
    defaultActiveMenu: types.maybe(types.number),
    onhandReceipt: types.optional(types.number, 0),
    requestReceipt: types.optional(types.union(types.number, types.string), 0),
    orgName: customtypes.optional(types.string, ""),
    error: types.optional(ErrorModel, {}),
    alert: types.optional(MessageModel, {}),
    loading: types.optional(types.boolean, false),
  })
  .views((self: any) => ({
    get listitem() {
      return {
        key: self.posCode,
        value: self.id,
        text: `${self.posCode}${self.posName ? " - " + self.posName : ""}`,
      };
    },
    get posJSON() {
      return self.toJSON();
    },
    get activeLabel() {
      return self.active
        ? i18n.t("module.pos.posTable.active")
        : i18n.t("module.pos.posTable.inActive");
    },
    get isOnlineLabel() {
      return self.isOnline
        ? i18n.t("module.pos.posTable.isOnline")
        : i18n.t("module.pos.posTable.isOffline");
    },
    get registedVATLabel() {
      return self.registedVAT
        ? i18n.t("module.pos.posManagementForm.registedVATTrue")
        : i18n.t("module.pos.posManagementForm.registedVATFalse");
    },
    get lastestPosShiftTimeStartedShift() {
      if (self.lastestPosShift && self.lastestPosShift.startedShift) {
        return `${dateTime_display_CE_TO_BE(
          self.lastestPosShift.startedShift,
          true
        )} - `;
      } else {
        return "";
      }
    },
    get lastestPosShiftTimeEndShift() {
      if (self.lastestPosShift && self.lastestPosShift.endShift) {
        return dateTime_display_CE_TO_BE(self.lastestPosShift.endShift, true);
      } else {
        return "";
      }
    },
    get posShiftIdLocalStorage() {
      return window.localStorage.getItem("posShiftId") || "";
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
    setPosShiftId: (posShiftId?: string) => {
      window.localStorage.setItem("posShiftId", posShiftId || "");
    },
    getPosDetailCashierReload: flow(function* () {
      try {
        const body = {
          posId: self.id,
          posShiftId: self.posShiftIdLocalStorage,
          fromPos: true,
        };
        const result: any = yield Pos.get(body, { name: self.id });
        self.setAllField(result.data);
        self.setPosShiftId(self.lastestPosShift.id);
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
        throw e;
      }
    }),
    getPosDetail: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          const result: any = yield Pos.getById(self.id);
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
    getPosDetailCashier: flow(function* (id: string) {
      try {
        const body = {
          posId: id,
          posShiftId: self.posShiftIdLocalStorage,
          fromPos: true,
        };
        self.setField({ fieldname: "loading", value: true });
        const result: any = yield Pos.get(body, { name: id });
        self.setAllField(result.data);
        if (self.lastestPosShift && self.lastestPosShift.id && self.isOnline) {
          if (hasPermission("POS.USAGE.SALE")) {
            self.setField({ fieldname: "defaultActiveMenu", value: 1 });
          } else {
            self.setField({ fieldname: "defaultActiveMenu", value: 3 });
          }
        } else {
          self.setField({ fieldname: "defaultActiveMenu", value: 3 });
        }
        self.setPosShiftId(self.lastestPosShift.id);
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    createPos: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          active: self.active,
          organizationId: self.organizationId,
          posCode: self.posCode,
          posName: self.posName,
          managerId: self.managerId,
          registedVAT: self.registedVAT,
          registedVATCode: self.registedVATCode,
        };
        const result: any = yield Pos.create(body);
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "จุดชำระใหม่ถูกสร้างเรียบร้อยแล้ว"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updatePos: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          active: self.active,
          organizationId: self.organizationId,
          posCode: self.posCode,
          posName: self.posName,
          managerId: self.managerId,
          registedVAT: self.registedVAT,
          registedVATCode: self.registedVATCode,
        };
        const result: any = yield Pos.update(body, parseInt(self.id));
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
    onPosCloseShift: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          fromPos: true,
          posShiftId: self.posShiftIdLocalStorage,
          pin: self.pin,
          onDutymanagerId: self.lastestPosShift.onDutymanagerId,
          drawerAmount: self.lastestPosShift.drawerAmount,
          endedShift: self.lastestPosShift.endedShift,
          action: "CLOSE",
        };
        const result: any = yield PosShifts.update(
          body,
          self.posShiftIdLocalStorage
        );
        self.lastestPosShift.setAllField(result.data);
        self.setPosShiftId("");
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage("บันทึกสำเร็จค่ะ", "");
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    onPosOpenShift: flow(function* (onDutymanagerId: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          fromPos: true,
          posPinCode: self.pin,
          onDutymanagerId,
          openingAmount: self.lastestPosShift.openingAmount,
          startedShift: self.lastestPosShift.startedShift,
        };
        const result: any = yield Pos.create(body, {
          name: `${self.id}/posshifts`,
        });
        self.lastestPosShift.setAllField(result.data);
        self.setPosShiftId(self.lastestPosShift.id);
        self.getPosDetailCashier(self.id);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "เปิดรอบการชำระเรียบร้อยแล้วค่ะ"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    onChangeDutymanager: flow(function* (userId: string, note: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          fromPos: true,
          pin: self.pin,
          onDutymanagerId: userId,
          action: "SWAPMNG",
          note,
          posShiftId: self.posShiftIdLocalStorage,
        };
        const result: any = yield PosShifts.update(
          body,
          self.posShiftIdLocalStorage
        );
        self.lastestPosShift.setAllField(result.data);
        self.setPosShiftId(self.lastestPosShift.id);
        self.getPosDetailCashier(self.id);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage(
          "บันทึกสำเร็จค่ะ",
          "เปลี่ยนผู้ดูแลเรียบร้อยแล้วค่ะ"
        );
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    posLogOut: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          fromPos: true,
          action: "LOGOUT",
          posShiftId: self.posShiftIdLocalStorage,
        };
        if (self.posShiftIdLocalStorage) {
          const result: any = yield PosShifts.update(
            body,
            self.posShiftIdLocalStorage
          );
          self.lastestPosShift.setAllField(result.data);
        }
        self.setPosShiftId("");
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.error.setErrorMessage(e);
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updatePosPrinterIP: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          printerIP: self.printerIP,
          printerPort: self.printerPort,
        };
        yield Pos.update(body, parseInt(self.id));
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
    updatePosReceiptSequence: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = { receiptSequenceId: self.receiptSequenceId };
        yield Pos.update(body, parseInt(self.id));
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
    posLogin: flow(function* (userId: string, pin: string, posId?: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          userId,
          pin,
        };
        const result: any = yield Pos.create(body, {
          name: `${posId}/login`,
        });
        self.setAllField(result.data);
        if (self.lastestPosShift && self.lastestPosShift.id) {
          self.setPosShiftId(self.lastestPosShift.id);
          self.setField({ fieldname: "defaultActiveMenu", value: 1 });
        } else {
          self.setField({ fieldname: "defaultActiveMenu", value: 3 });
        }
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.error.setErrorMessage(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    deletePos: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        yield Pos.delete(parseInt(self.id));
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
export type IPosModel = typeof PosModel.Type;
