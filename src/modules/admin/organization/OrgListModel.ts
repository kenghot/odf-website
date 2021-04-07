import { flow } from "mobx";
import { applySnapshot, types } from "mobx-state-tree";
import { Org, OrgModel } from ".";
import { ErrorModel } from "../../../components/common/error";
import { IInput } from "../../../utils/common-interface";

export const OrgListModel = types
  .model("OrgListModel", {
    list: types.optional(types.array(OrgModel), []),
    filterName: types.optional(types.string, ""),
    filterProvinceCode: types.optional(types.string, ""),
    filterParentId: types.optional(types.string, ""),
    filterOrgCode: types.optional(types.string, ""),
    filterStatus: types.optional(types.string, ""),
    error: types.optional(ErrorModel, {}),
    total: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    perPage: types.optional(types.number, 10),
    totalPages: types.optional(types.number, 1),
    loading: types.optional(types.boolean, false),
  })
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    load_data_list: flow(function* () {
      try {
        let body = {
          orgName: self.filterName,
          provinceCode: self.filterProvinceCode,
          parentId: self.filterParentId,
          orgCode: self.filterOrgCode,
          perPage: self.perPage,
          currentPage: self.currentPage,
        };
        if (self.filterStatus === "1") {
          body = {
            ...body,
            active: "1",
          } as any;
        }
        if (self.filterStatus === "0") {
          body = {
            ...body,
            active: "0",
          } as any;
        }
        const result: any = yield Org.get(body);
        self.setField({ fieldname: "list", value: result.data });
        self.setPerPage(result.perPage);
        self.setPagination(result.currentPage, result.totalPages, result.total);
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.setField({ fieldname: "list", value: [] });
        self.setPagination(1, 0, 0);
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({ fieldname: "message", value: e.message });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack,
        });
        // console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    load_data: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          orgName: self.filterName,
          provinceCode: self.filterProvinceCode,
          parentId: self.filterParentId,
          perPage: self.perPage,
          currentPage: self.currentPage,
          active: "1",
        };
        const result: any = yield Org.get(body);
        self.setField({ fieldname: "list", value: result.data });
        self.setPerPage(result.perPage);
        self.setPagination(result.currentPage, result.totalPages, result.total);
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({ fieldname: "message", value: e.message });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack,
        });
        // console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    resetFilter: flow(function* () {
      try {
        self.filterName = "";
        self.filterParentId = "";
        self.filterProvinceCode = "";
        self.filterStatus = "";
        self.filterOrgCode = "";
        const result: any = yield Org.get({ perPage: self.perPage });
        self.setField({ fieldname: "list", value: result.data });
        self.setPagination(result.currentPage, result.totalPages, result.total);
      } catch (e) {
        console.log(e);
      }
    }),
    setPerPage: (perPage: number) => {
      self.perPage = perPage;
    },
    setCurrentPage: (currentPage: number) => {
      self.currentPage = currentPage;
    },
    setPagination: (currentPage: number, totalPages: number, total: number) => {
      self.currentPage = currentPage;
      self.totalPages = totalPages;
      self.total = total;
    },
    resetAll: () => {
      applySnapshot(self, {});
    },
  }));
export type IOrgListModel = typeof OrgListModel.Type;
