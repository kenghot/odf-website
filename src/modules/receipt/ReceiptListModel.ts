import { flow } from "mobx";
import { applySnapshot, types } from "mobx-state-tree";
import { ErrorModel } from "../../components/common/error";
import { IInput } from "../../utils/common-interface";
import { ReceiptModel } from "./ReceiptModel";
import { Receipt } from "./ReceiptService";

export const ReceiptListModel = types
  .model("ReceiptListModel", {
    list: types.optional(types.array(ReceiptModel), []),
    filterDocumentNumber: types.optional(types.string, ""),
    filterOrganizationId: types.optional(types.string, ""),
    filterPosId: types.optional(types.string, ""),
    filterStatus: types.optional(types.string, ""),
    filterStartDate: types.optional(types.string, ""),
    filterEndDate: types.optional(types.string, ""),
    filterClientType: types.optional(types.string, ""),
    filterClientName: types.optional(types.string, ""),
    filterClientTaxNumber: types.optional(types.string, ""),
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
    load_data: flow(function*(posId?: string, fromPosCashier?: boolean) {
      try {
        self.setField({ fieldname: "loading", value: true });
        let body = {
          documentNumber: self.filterDocumentNumber,
          posId: self.filterPosId,
          organizationId: self.filterOrganizationId,
          startDate: self.filterStartDate
            ? `${self.filterStartDate}T00:00:00+07:00`
            : "",
          endDate: self.filterEndDate
            ? `${self.filterEndDate}T23:59:59+07:00`
            : "",
          status: self.filterStatus,
          clientType: self.filterClientType,
          clientName: self.filterClientName,
          clientTaxNumber: self.filterClientTaxNumber,
          perPage: self.perPage,
          currentPage: self.currentPage
        };
        if (fromPosCashier) {
          body = {
            ...body,
            posId
          } as any;
        }
        const result: any = yield Receipt.get(body);
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
    resetFilter: flow(function*(posId?: string, formPosCashier?: boolean) {
      try {
        self.filterDocumentNumber = "";
        self.filterOrganizationId = "";
        self.filterPosId = "";
        self.filterStartDate = "";
        self.filterEndDate = "";
        self.filterStatus = "";
        self.filterClientType = "";
        self.filterClientName = "";
        self.filterClientTaxNumber = "";
        let body = {
          perPage: self.perPage
        };
        if (formPosCashier) {
          body = {
            ...body,
            fromPos: true,
            posShiftId: window.localStorage.getItem("posShiftId") || "",
            posId
          } as any;
        }
        const result: any = yield Receipt.get(body);
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
export type IReceiptListModel = typeof ReceiptListModel.Type;
