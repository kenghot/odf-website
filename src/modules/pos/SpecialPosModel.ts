import { applySnapshot, types } from "mobx-state-tree";
import { IInput } from "../../utils/common-interface";
import customtypes from "../../utils/mobx-types-helper";

export const SpecialPosModel = types
  .model("SpecialPosModel", {
    type: customtypes.optional(types.string, ""),
    posId: customtypes.optional(types.string, ""),
    posName: customtypes.optional(types.string, ""),
  })
  .views((self: any) => ({
    get listitem() {
      return {
        key: self.id,
        value: self.id,
        text: self.runningNumber,
        description: self.prefixCode,
      };
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
          throw e;
        }
      });
    },
    resetAll: () => {
      applySnapshot(self, {});
    },
  }));
export type ISpecialPosModel = typeof SpecialPosModel.Type;
