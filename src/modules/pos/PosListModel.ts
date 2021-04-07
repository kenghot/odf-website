import { flow } from "mobx";
import { applySnapshot, types } from "mobx-state-tree";
import { ErrorModel } from "../../components/common/error";
import { IInput } from "../../utils/common-interface";
import { PosModel } from "./PosModel";
import { Pos, PosesReceiptControl } from "./PosService";

export const PosListModel = types
  .model("PosListModel", {
    list: types.optional(types.array(PosModel), []),
    filterPosCode: types.optional(types.string, ""),
    filterPosName: types.optional(types.string, ""),
    filterOrganizationId: types.optional(types.string, ""),
    filterActive: types.optional(types.string, ""),
    filterIsOnline: types.optional(types.string, ""),
    total: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    perPage: types.optional(types.number, 10),
    totalPages: types.optional(types.number, 1),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false),
  })
  .views((self: any) => ({
    get groupByOrgID() {
      const key = "organizationId";
      const temp = self.list.reduce((rv: any, x: any) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
      const result = Object.keys(temp).map((keyItem: any) => {
        return temp[keyItem];
      });
      return result;
    },
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    load_data: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        let body = {
          posName: self.filterPosName,
          posCode: self.filterPosCode,
          organizationId: self.filterOrganizationId,
          perPage: self.perPage,
          currentPage: self.currentPage,
        };
        if (self.filterActive === "true") {
          body = { ...body, active: true } as any;
        } else if (self.filterActive === "false") {
          body = { ...body, active: false } as any;
        }
        if (self.filterIsOnline === "true") {
          body = { ...body, isOnline: true } as any;
        } else if (self.filterIsOnline === "false") {
          body = { ...body, isOnline: false } as any;
        }
        const result: any = yield Pos.get(body);
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
    load_data_by_org: flow(function* (organizationId: string) {
      try {
        const  body = {
          posName: self.filterPosName,
          organizationId,
        };
        self.setField({ fieldname: "loading", value: true });
        const result: any = yield Pos.get(body);
        self.setField({ fieldname: "list", value: result.data });
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.error.setErrorMessage(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    load_poses_receipt_control_data: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });

        const result: any = yield PosesReceiptControl.get({
          perPage: self.perPage,
          currentPage: self.currentPage,
        });
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

        throw e;
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
    resetFilter: flow(function* () {
      try {
        self.filterPosCode = "";
        self.filterPosName = "";
        self.filterOrganizationId = "";
        self.filterActive = "";
        self.filterIsOnline = "";
        const result: any = yield Pos.get({ perPage: self.perPage });
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
    },
  }));
export type IPosListModel = typeof PosListModel.Type;
