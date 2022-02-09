import { flow } from "mobx";
import { applySnapshot, types } from "mobx-state-tree";
import { ErrorModel } from "../../components/common/error";
import { IInput } from "../../utils/common-interface";
import { AccountReceivableModel,IAccountReceivableModel } from "../accountReceivable/AccountReceivableModel";
import { DebtCollectionList } from "./DebtCollectionsService";
import { fetchNoService } from "../../utils/request-noservice";

export const DebtCollectionListModel = types
  .model("DebtCollectionListModel", {
    list: types.optional(types.array(AccountReceivableModel), []),
    filterArDocumentNumber: types.optional(types.string, ""),
    filterOrganizationId: types.optional(types.string, ""),
    filterAgreementType: types.optional(types.string, ""),
    filterCreditStatus: types.optional(types.string, ""),
    filterDeathNotification: types.optional(types.string, ""),
    filterStatus: types.optional(types.string, ""),
    filterAsOfYearMonth: types.optional(types.string, ""),
    filterStep: types.optional(types.string, ""),
    filterFirstname: types.optional(types.string, ""),
    filterLastname: types.optional(types.string, ""),
    filterIdCardNo: types.optional(types.string, ""),
    filterNoPaymentStart: types.optional(types.string, ""),
    filterNoPaymentEnd: types.optional(types.string, ""),
    filterPrescriptionRemainingStartDate: types.optional(types.string, ""),
    filterPrescriptionRemainingEndDate: types.optional(types.string, ""),
    filterName: types.optional(types.string, ""),
    selectedAllCheckbox: types.optional(types.boolean, false),
    error: types.optional(ErrorModel, {}),
    total: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    perPage: types.optional(types.number, 10),
    totalPages: types.optional(types.number, 1),
    loading: types.optional(types.boolean, false)
  })
  .views((self: any) => ({
    get selected_checkbox() {
      if (self.list.length > 0) {
        const selectedList = self.list.map(
          (item: IAccountReceivableModel) => item.isSelected
        );
        return selectedList.every((item: boolean) => item);
      } else {
        return false;
      }
    },
    get debtcollection_list_id_check() {
      return self.list
        .filter((item: IAccountReceivableModel) => item.isSelected === true)
        .map((item: IAccountReceivableModel) => item.id);
    },
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    selected_all: (selected: boolean) => {
      self.selectedAllCheckbox = selected;
      self.list.forEach((item: IAccountReceivableModel) => {
        item.setField({ fieldname: "isSelected", value: selected });
      });
    },
    load_data: flow(function*() {
      try {
        self.setField({ fieldname: "loading", value: true });
        let deathNotification;
        if (self.filterDeathNotification === "true") {
          deathNotification = true;
        } else if (self.filterDeathNotification === "false") {
          deathNotification = false;
        } else {
          deathNotification = "";
        }
        const body = {
          arDocumentNumber: self.filterArDocumentNumber,
          organizationId: self.filterOrganizationId,
          agreementType: self.filterAgreementType,
          deathNotification,
          prescriptionRemainingStartDate:
            self.filterPrescriptionRemainingStartDate,
          prescriptionRemainingEndDate: self.filterPrescriptionRemainingEndDate,
          asOfYearMonth: self.filterAsOfYearMonth
            ? self.filterAsOfYearMonth.substring(0, 7)
            : "",
          creditStatus: self.filterCreditStatus,
          status: self.filterStatus,
          step: self.filterStep ? +self.filterStep : "",
          firstname: self.filterFirstname,
          lastname: self.filterLastname,
          idCardNo: self.filterIdCardNo,
          noPaymentStart: self.filterNoPaymentStart,
          noPaymentEnd: self.filterNoPaymentEnd,
          name: self.filterName,
          perPage: self.perPage,
          currentPage: self.currentPage
        };
        const result: any = yield DebtCollectionList.get(body);
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
          value: e.technical_stack
        });
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    printReportDebtcollection: flow(function* () {
      console.log('printReportDebtcollection',self.debtcollection_list_id_check.join);
      try {
        self.setField({ fieldname: "loading", value: true });
        const result: any = yield fetchNoService(
          `${process.env.REACT_APP_DOP_DOCS_ENDPOINT}/opentbs/tbs/template_report_debtcollection.php`,
          {
            ids: self.debtcollection_list_id_check.join(","),
          },
          "template_report_debtcollection",
          "xls"
        );
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.error.setErrorMessage(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    resetFilterBorrower: () => {
      self.filterFirstname = "";
      self.filterLastname = "";
      self.filterIdCardNo = "";
    },
    resetFilter: flow(function*() {
      try {
        self.filterArDocumentNumber = "";
        self.filterOrganizationId = "";
        self.filterAgreementType = "";
        self.filterPrescriptionRemainingStartDate = "";
        self.filterPrescriptionRemainingEndDate = "";
        self.filterAsOfYearMonth = "";
        self.filterCreditStatus = "";
        self.filterDeathNotification = "";
        self.filterStatus = "";
        self.filterStep = undefined;
        self.filterFirstname = "";
        self.filterLastname = "";
        self.filterIdCardNo = "";
        self.filterNoPaymentStart = "";
        self.filterNoPaymentEnd = "";
        self.filterName = "";
        const result: any = yield DebtCollectionList.get({
          perPage: self.perPage
        });
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
    }
  }));
export type IDebtCollectionListModel = typeof DebtCollectionListModel.Type;
