import i18n from "i18next";
import { applySnapshot, flow, IAnyModelType, types } from "mobx-state-tree";
import { Sequence } from ".";
import { ErrorModel } from "../../../components/common/error";
import { MessageModel } from "../../../components/common/message";
import { SEQUENCE_TYPE } from "../../../constants/SELECTOR";
import { IInput } from "../../../utils/common-interface";
import customtypes from "../../../utils/mobx-types-helper";
import { OrgModel } from "../organization";

export const SequenceModel = types
  .model("SequenceModel", {
    isSelected: types.optional(types.boolean, false),
    id: types.optional(types.string, ""),
    sequenceType: types.optional(types.string, ""),
    sequenceNumber: types.optional(types.number, 0),
    paddingSize: types.optional(types.number, 4),
    paddingChar: types.optional(types.string, "0"),
    prefixCode: types.optional(types.string, ""),
    prefixYear: types.optional(types.string, ""),
    runningNumber: types.optional(types.string, ""),
    organizations: customtypes.optional(types.array(types.late((): IAnyModelType => OrgModel)), []),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {})
  })
  .views((self: any) => ({
    get listitem() {
      return {
        key: self.id,
        value: self.id,
        text: self.runningNumber,
        description: self.prefixCode
      };
    },
    get status() {
      return self.active
        ? i18n.t("module.admin.orgModel.enable")
        : i18n.t("module.admin.orgModel.disable");
    },
    get sequenceTypeName() {
      const type = SEQUENCE_TYPE.find(function(element) {
        return element.value === self.sequenceType;
      });
      if (type) {
        return type.text;
      } else {
        return "";
      }
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
          throw e;
        }
      });
    },
    resetAll: () => {
      applySnapshot(self, {});
    },
    getSequenceDetail: flow(function*() {
      if (self.id) {
        self.setField({ fieldname: "loading", value: true });
        try {
          const result: any = yield Sequence.getById(
            `${self.id}?sequenceType=${self.sequenceType}`
          );
          self.setAllField(result.data);
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
    createSequence: flow(function*() {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          sequenceType: self.sequenceType,
          sequenceNumber: self.sequenceNumber,
          paddingSize: self.paddingSize,
          paddingChar: self.paddingChar,
          prefixCode: self.prefixCode,
          prefixYear: self.prefixYear,
          runningNumber: self.runningNumber
        };
        const result: any = yield Sequence.create(body);
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "เอกสารใหม่ถูกสร้างเรียบร้อยแล้ว"
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
    updateSequence: flow(function*() {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          sequenceType: self.sequenceType,
          sequenceNumber: self.sequenceNumber,
          paddingSize: self.paddingSize,
          paddingChar: self.paddingChar,
          prefixCode: self.prefixCode,
          prefixYear: self.prefixYear
        };
        const result: any = yield Sequence.update(body, parseInt(self.id));
        self.setAllField(result.data);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "เอกสารถูกอััพเดทเรียบร้อยแล้ว"
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
    deleteSequence: flow(function*() {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          sequenceType: self.sequenceType
        };
        yield Sequence.delete(parseInt(self.id), body);
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
    })
  }));
export type ISequenceModel = typeof SequenceModel.Type;
