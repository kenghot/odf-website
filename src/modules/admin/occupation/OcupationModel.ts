import i18n from "i18next";
import { applySnapshot, flow, types } from "mobx-state-tree";
import { Ocupation } from ".";
import { ErrorModel } from "../../../components/common/error";
import { IInput } from "../../../utils/common-interface";

export const OcupationModel = types
  .model("OcupationModel", {
    isSelected: types.optional(types.boolean, false),
    id: types.maybeNull(types.string),
    name: types.optional(types.string, ""),
    description: types.optional(types.string, ""),
    occupationType: types.optional(types.number, 0),
    salary: types.optional(types.string, "0"),
    active: types.optional(types.boolean, false),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false)
  })
  .views((self: any) => ({
    get status() {
      return self.active
        ? i18n.t("module.admin.orgModel.enable")
        : i18n.t("module.admin.orgModel.disable");
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
    getOcupationDetail: flow(function* () {
      if (self.id) {
        try {
          self.setField({ fieldname: "loading", value: true });
          const result = yield Ocupation.getById(self.id);
          self.setAllField(result.data);
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
    createOcupation: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          name: self.name,
          occupationType: self.occupationType,
          active: self.active
        };
        const result = yield Ocupation.create(body);
        self.setAllField(result.data);
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
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateOcupation: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          name: self.name,
          occupationType: self.occupationType,
          active: self.active
        };

        yield Ocupation.update(body, self.id);
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
    }),
    deleteOcupation: flow(function* (id: any) {
      self.setField({ fieldname: "loading", value: true });
      try {
        yield Ocupation.delete(parseInt(id));
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
    })
  }));
export type IOcupationModel = typeof OcupationModel.Type;
