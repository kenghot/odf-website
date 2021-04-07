import { getRoot, types } from "mobx-state-tree";
import { IInput } from "../../../utils/common-interface";
import { getValueFromRequestObject } from "../../../utils/get-value-from-request-object";
import customtypes from "../../../utils/mobx-types-helper";

export const ValidationItemModel = types
    .model("ValidationItemModel", {
        key: customtypes.optional(types.string, ""),
        label: customtypes.optional(types.string, ""),
        value: customtypes.optional(types.boolean, true),
        supported_label: types.maybe(types.string),
        supported_value_type: types.maybe(types.string),
        supported_suffix: types.maybe(types.string),
        supported_value: types.maybe(types.string),
        precondition: types.maybe(types.string),
    })
    .views((self: any) => ({
        //
    }))
    .actions((self: any) => ({
        getSupportedValue: (requestItemsIndex?: number, preconditionCheck?: boolean) => {
            if (self.supported_label !== undefined && self.supported_value !== undefined) {
                const rootStore: any = getRoot(self);
                let supportedValue = getValueFromRequestObject(
                    rootStore.toJSON(),
                    self.supported_value,
                    requestItemsIndex
                );
                if (preconditionCheck) {
                    if (self.precondition !== undefined && supportedValue !== undefined) {
                        try {
                            const condition = self.precondition.replace(/{value}/g, supportedValue);
                            self.setField({
                                fieldname: "value",
                                // tslint:disable-next-line:no-eval
                                value: eval(condition)
                            });
                        } catch (e) {
                            self.setField({
                                fieldname: "value",
                                value: true
                            });
                        }
                    }
                }

                if ((typeof supportedValue === "object" && self.supported_value_type !== "MAP") ||
                    supportedValue === undefined) {
                    supportedValue = "-";
                } else if (typeof supportedValue === "boolean") {
                    supportedValue = supportedValue ? "มี" : "ไม่มี";
                }
                return supportedValue;
            } else {
                return null;
            }
        },
        setField: ({ fieldname, value }: IInput) => {
            self[fieldname] = value;
        },
    }));
export type IValidationItemModel = typeof ValidationItemModel.Type;

export const ValidationModel = types
    .model("ValidationModel", {
        id: types.maybe(types.number),
        label: customtypes.optional(types.string, ""),
        checklist: types.optional(types.array(ValidationItemModel), []),
    })
    .views((self: any) => ({
        //
    }))
    .actions((self: any) => ({
        setField: ({ fieldname, value }: IInput) => {
            self[fieldname] = value;
        },
    }));
export type IValidationModel = typeof ValidationModel.Type;
