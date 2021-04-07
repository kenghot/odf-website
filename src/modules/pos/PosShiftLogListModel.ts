import { flow } from "mobx";
import { applySnapshot, types } from "mobx-state-tree";
import { ErrorModel } from "../../components/common/error";
import { IInput } from "../../utils/common-interface";
import { colorSetUser } from "../../utils/get-color";
import customtypes from "../../utils/mobx-types-helper";
import {
  IPosShiftLogsModel,
  IPosShiftLogUserColorModel,
  PosShiftLogsModel,
  PosShiftLogUserColorModel
} from "./PosModel";
import { PosShifts } from "./PosService";

export const PosShiftLogListModel = types
  .model("PosShiftLogListModel", {
    list: types.optional(types.array(PosShiftLogsModel), []),
    listUserColor: types.optional(types.array(PosShiftLogUserColorModel), []),
    posShiftId: customtypes.optional(types.string, ""),
    total: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    perPage: types.optional(types.number, 10),
    totalPages: types.optional(types.number, 1),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false)
  })
  .views((self: any) => ({
    //
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    load_data: flow(function*() {
      try {
        self.setField({ fieldname: "loading", value: true });
        let body = {
          perPage: self.perPage,
          currentPage: self.currentPage
        };
        // if (fromPos) {
        //   body = { ...body, fromPos: true, posShiftId: self.posShiftId } as any;
        // }
        const result: any = yield PosShifts.get(body, {
          name: `${self.posShiftId}/posshiftlogs`
        });
        self.setField({ fieldname: "list", value: result.data });
        self.setUserColorList();
        self.setPagination(
          result.perPage,
          result.currentPage,
          result.totalPages,
          result.total
        );
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.setField({ fieldname: "list", value: [] });
        self.setPagination(self.perPage, 1, 0, 0);
        self.error.setErrorMessage(e);
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    load_data_more: flow(function*() {
      try {
        self.setField({ fieldname: "loading", value: true });

        let body = {
          perPage: self.perPage + 10
        };
        // if (fromPos) {
        //   body = { ...body, fromPos: true, posShiftId: self.posShiftId } as any;
        // }
        const result: any = yield PosShifts.get(body, {
          name: `${self.posShiftId}/posshiftlogs`
        });
        self.setField({ fieldname: "list", value: result.data });
        self.setUserColorList();
        self.setPagination(
          result.perPage,
          result.currentPage,
          result.totalPages,
          result.total
        );
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.setField({ fieldname: "list", value: [] });
        self.setPagination(self.perPage, 1, 0, 0);
        self.error.setErrorMessage(e);
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    setUserColorList: () => {
      self.setField({ fieldname: "listUserColor", value: [] });
      const key = "createdBy";
      const keyGet = "createdByName";
      const temp = self.list.reduce((rv: any, x: any) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
      const result = Object.keys(temp).map((keyItem: any) => {
        return {
          id: temp[keyItem][0][key],
          username: temp[keyItem][0][keyGet],
          userColor: colorSetUser(Math.floor(Math.random() * 11))
        };
      });
      self.setField({ fieldname: "listUserColor", value: result });
      self.list.forEach((item: IPosShiftLogsModel) => {
        const selectedItem = self.listUserColor.find(
          (user: IPosShiftLogUserColorModel) => user.id === item.createdBy
        );
        if (selectedItem) {
          item.setField({
            fieldname: "userColor",
            value: selectedItem.userColor
          });
        }
      });
    },
    setPerPage: (perPage: number) => {
      self.perPage = perPage;
    },
    setCurrentPage: (currentPage: number) => {
      self.currentPage = currentPage;
    },
    setPagination: (
      perPage: number,
      currentPage: number,
      totalPages: number,
      total: number
    ) => {
      self.perPage = perPage;
      self.currentPage = currentPage;
      self.totalPages = totalPages;
      self.total = total;
    },
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));
export type IPosShiftLogListModel = typeof PosShiftLogListModel.Type;
