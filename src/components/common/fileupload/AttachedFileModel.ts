import { applySnapshot, flow, types } from "mobx-state-tree";
import { IInput } from "../../../utils/common-interface";
import customtypes from "../../../utils/mobx-types-helper";
import { Attachedfile } from "./AttachedfilesService";

export const AttachedFileModel = types
  .model("AttachedFileModel", {
    id: types.maybe(types.string),
    refId: types.maybeNull(types.string),
    refType: types.optional(types.string, ""),
    documentCode: customtypes.optional(types.string, ""),
    documentName: customtypes.optional(types.string, ""),
    isVerified: types.maybeNull(types.string),
    verfiedBy: customtypes.optional(types.string, ""),
    isSend: types.maybeNull(types.string),
    documentDescription: customtypes.optional(types.string, ""),
    file: types.optional(customtypes.FilePrimitive, {})
  })
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    deleteDataFile: flow(function*() {
      try {
        if (self.id && self.file.path) {
          yield Attachedfile.update({}, parseInt(self.id));
          self.resetFile();
        } else {
          self.resetFile();
        }
      } catch (e) {
        console.log(e);
        throw e;
      }
    }),
    deleteFile: flow(function*() {
      try {
        if (self.id) {
          yield Attachedfile.delete(parseInt(self.id));
        }
      } catch (e) {
        console.log(e);
        throw e;
      }
    }),
    resetFile: () => {
      self.setField({ fieldname: "file", value: {} });
      self.setField({ fieldname: "refId", value: null });
    },
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));

export type IAttachedFileModel = typeof AttachedFileModel.Type;
