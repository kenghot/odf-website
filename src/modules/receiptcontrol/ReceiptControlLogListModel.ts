import { flow } from "mobx";
import { applySnapshot, types } from "mobx-state-tree";
import { ErrorModel } from "../../components/common/error";
import { MessageModel } from "../../components/common/message";
import { IInput } from "../../utils/common-interface";
import { logTypeEnum, ReceiptControlLogModel } from "./ReceiptControlLogModel";
import { ReceiptControlLogAPI } from "./ReceiptControlLogService";

export const ReceiptControlLogListModel = types
  .model("ReceiptControlLogListModel", {
    list: types.optional(types.array(ReceiptControlLogModel), []),
    filterStartDate: types.optional(types.string, ""),
    filterEndDate: types.optional(types.string, ""),
    filterOrganizationId: types.optional(types.string, ""),
    filterStatus: types.optional(types.string, ""),
    filterLogType: types.optional(types.string, ""),
    total: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    perPage: types.optional(types.number, 10),
    totalPages: types.optional(types.number, 1),
    alert: types.optional(MessageModel, {}),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false)
  })
  .views((self: any) => ({
    get sort_by_createdDate() {
      return self.list.sort((a: any, b: any) => {
        const c: any = new Date(a.createdDate);
        const d: any = new Date(b.createdDate);
        return d - c;
      });
    }
  }))
  .actions((self: any) => ({
    load_data: flow(function*() {
      try {
        self.setField({ fieldname: "loading", value: true });
        const result: any = yield ReceiptControlLogAPI.get({
          perPage: self.perPage,
          currentPage: self.currentPage,
          startDate: self.filterStartDate,
          endDate: self.filterEndDate,
          organizationId: self.filterOrganizationId,
          status: self.filterStatus,
          logType: self.filterLogType
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
    setFilter: (logType: logTypeEnum) => {
      self.filterLogType = logType;
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
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    resetFilter: () => {
      try {
        self.filterStartDate = "";
        self.filterEndDate = "";
        self.filterOrganizationId = "";
        self.filterStatus = "";
      } catch (e) {
        console.log(e);
      }
    },
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));
export type IReceiptControlLogListModel = typeof ReceiptControlLogListModel.Type;
