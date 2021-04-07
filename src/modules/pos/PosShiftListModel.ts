import { flow } from "mobx";
import { applySnapshot, types } from "mobx-state-tree";
import { ErrorModel } from "../../components/common/error";
import { IInput } from "../../utils/common-interface";
import { PosShiftModel } from "./PosModel";
import { Pos } from "./PosService";

export const PosShiftListModel = types
  .model("PosShiftListModel", {
    list: types.optional(types.array(PosShiftModel), []),
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
    load_data: flow(function*(posId: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          perPage: self.perPage,
          currentPage: self.currentPage
        };
        const result: any = yield Pos.get(body, { name: `${posId}/posshifts` });
        self.setField({ fieldname: "list", value: result.data });
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
    resetFilter: flow(function*(posId: string) {
      try {
        self.filterPosCode = "";
        self.filterOrganizationId = "";
        self.filterActive = "";
        self.filterIsOnline = "";
        const result: any = yield Pos.get(
          { perPage: self.perPage },
          { name: `${posId}/posshifts` }
        );
        self.setField({ fieldname: "list", value: result.data });
        self.setPagination(
          result.perPage,
          result.currentPage,
          result.totalPages,
          result.total
        );
      } catch (e) {
        self.setField({ fieldname: "list", value: [] });
        self.error.setErrorMessage(e);
        console.log(e);
      }
    }),
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));
export type IPosShiftListModel = typeof PosShiftListModel.Type;
