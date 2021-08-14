import { flow } from "mobx";
import { applySnapshot, types } from "mobx-state-tree";
import { ErrorModel } from "../../components/common/error";
import { IInput } from "../../utils/common-interface";
import {
  AccountReceivableModel,
  IAccountReceivableModel
} from "./AccountReceivableModel";
import {
  AccountReceivable,
  IAccountReceivableGet
  // IAccountReceivableGet
} from "./AccountReceivablesService";

export const AccountReceivableListModel = types
  .model("AccountReceivableListModel", {
    list: types.optional(types.array(AccountReceivableModel), []),
    filterDocumentNumber: types.optional(types.string, ""),
    filterOrganizationId: types.optional(types.string, ""),
    filterARType: types.optional(types.string, ""),
    filterFirstname: types.optional(types.string, ""),
    filterLastname: types.optional(types.string, ""),
    filterIdCardNo: types.optional(types.string, ""),
    filterGuarantorFirstname: types.optional(types.string, ""),
    filterGuarantorLastname: types.optional(types.string, ""),
    filterGuarantorIdCardNo: types.optional(types.string, ""),
    filterName: types.optional(types.string, ""),
    filterStartDate: types.optional(types.string, ""),
    filterEndDate: types.optional(types.string, ""),
    filterStatus: types.optional(types.string, ""),
    filterFiscalYear: types.optional(types.string, ""),
    selectedAllCheckbox: types.optional(types.boolean, false),
    error: types.optional(ErrorModel, {}),
    total: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    perPage: types.optional(types.number, 10),
    totalPages: types.optional(types.number, 1),
    loading: types.optional(types.boolean, false),
    idcardRequestOnline: types.optional(types.string, "")
  })
  .views((self: any) => ({
    get statusMenu() {
      return self.list.find(
        (item: IAccountReceivableModel) => item.isSelected === true
      )
        ? false
        : true;
    },
    get selected_checkbox() {
      if (self.list.length > 0) {
        const selectedList = self.list.map(
          (item: IAccountReceivableModel) => item.isSelected
        );
        return selectedList.every((item: boolean) => item);
      } else {
        return false;
      }
    }
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    load_data: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });

        const body: IAccountReceivableGet = {
          documentNumber: self.filterDocumentNumber,
          organizationId: self.filterOrganizationId,
          agreementType: self.filterARType,
          firstname: self.filterFirstname,
          lastname: self.filterLastname,
          idCardNo: self.idcardRequestOnline ? self.idcardRequestOnline : self.filterIdCardNo,
          name: self.filterName,
          guarantorFirstname: self.filterGuarantorFirstname,
          guarantorLastname: self.filterGuarantorLastname,
          guarantorIdCardNo: self.filterGuarantorIdCardNo,
          startDate: self.filterStartDate,
          endDate: self.filterEndDate,
          status: self.filterStatus,
          fiscalYear: self.filterFiscalYear,
          perPage: self.perPage,
          currentPage: self.currentPage
        };
        const result: any = yield AccountReceivable.get(body);
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
    update_data_selected: flow(function* (value: string) {
      try {
        let isActive = false;
        switch (value) {
          case "setActive":
            isActive = true;
            break;
          case "setInactive":
            isActive = false;
            break;
          default:
            value = "";
        }
        if (value) {
          yield self.list.forEach(
            flow(function* (item: IAccountReceivableModel) {
              if (item.isSelected) {
                const result: any = yield AccountReceivable.update(
                  { active: isActive },
                  parseInt(item.id)
                );
                item.setAllField(result.data);
              }
            })
          );
          self.selected_all(false);
        }
      } catch (e) {
        console.log(e);
      }
    }),
    selected_all: (selected: boolean) => {
      self.selectedAllCheckbox = selected;
      self.list.forEach((item: IAccountReceivableModel) => {
        item.setField({ fieldname: "isSelected", value: selected });
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
    resetFilterBorrower: () => {
      self.filterFirstname = "";
      self.filterLastname = "";
      self.filterIdCardNo = "";
    },
    resetFilter: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        self.filterDocumentNumber = "";
        self.filterOrganizationId = "";
        self.filterARType = "";
        self.filterFirstname = "";
        self.filterLastname = "";
        self.filterIdCardNo = "";
        self.filterName = "";
        self.filterGuarantorFirstname = "";
        self.filterGuarantorLastname = "";
        self.filterGuarantorIdCardNo = "";
        self.filterStartDate = "";
        self.filterEndDate = "";
        self.filterStatus = "";
        self.filterFiscalYear = "";
        const result: any = yield AccountReceivable.get({
          perPage: self.perPage
        });
        self.setField({ fieldname: "list", value: result.data });
        self.setPagination(
          result.perPage,
          result.currentPage,
          result.totalPages,
          result.total
        );
      } catch (e) {
        self.setField({ fieldname: "list", value: [] });
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
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));
export type IAccountReceivableListModel = typeof AccountReceivableListModel.Type;
