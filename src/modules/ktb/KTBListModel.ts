import { flow } from "mobx";
import { applySnapshot, types } from "mobx-state-tree";
import moment from "moment";
import { ErrorModel } from "../../components/common/error";
import { IInput } from "../../utils/common-interface";
import { IKTBModel, KTBModel } from "./KTBModel";
import { KTB } from "./KTBService";

export const KTBListModel = types
  .model("KTBListModel", {
    list: types.optional(types.array(KTBModel), []),
    error: types.optional(ErrorModel, {}),
    total: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    perPage: types.optional(types.number, 10),
    totalPages: types.optional(types.number, 1),
    loading: types.optional(types.boolean, false)
  })
  .views((self: any) => ({
    get counterServiceJSON() {
      return self.toJSON();
    }
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    load_data: flow(function*(status: string, paymentReferenceNo: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body: any = {
          transactionType: status,
          bankRef: paymentReferenceNo
        };
        const result: any = yield KTB.get(body);
        self.setField({ fieldname: "list", value: result.data });
        self.setPerPage(result.perPage);
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
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));
export type IKTBListModel = typeof KTBListModel.Type;
