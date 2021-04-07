import { flow } from "mobx";
import { applySnapshot, types } from "mobx-state-tree";
import { ErrorModel } from "../../components/common/error";
import { IInput } from "../../utils/common-interface";
import { CounterServiceModel } from "./CounterServiceModel";
import { CounterService } from "./CounterServiceService";

export const CounterServiceListModel = types
  .model("CounterServiceListModel", {
    list: types.optional(types.array(CounterServiceModel), []),
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
    load_data: flow(function*(status: string, refNo: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body: any = {
          status,
          TX_ID: refNo
        };
        const result: any = yield CounterService.get(body);
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
export type ICounterServiceListModel = typeof CounterServiceListModel.Type;
