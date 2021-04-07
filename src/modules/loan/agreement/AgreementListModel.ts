import { flow } from "mobx";
import { applySnapshot, types } from "mobx-state-tree";
import { ErrorModel } from "../../../components/common/error";
import { IInput } from "../../../utils/common-interface";
import { vouchersAPI } from "../../finance/voucher/VoucherService";
import { AgreementModel, IAgreementModel } from "./AgreementModel";
import { Agreement, IAgreementsGet } from "./AgreementService";

export const AgreementListModel = types
  .model("AgreementListModel", {
    list: types.optional(types.array(AgreementModel), []),
    failedAgreements: types.optional(types.array(AgreementModel), []),
    successAgreements: types.optional(types.array(AgreementModel), []),
    isShowMessageAgreementsList: types.optional(types.boolean, false),
    filterDocumentNumber: types.optional(types.string, ""),
    filterOrganizationId: types.optional(types.string, ""),
    filterAgreementType: types.optional(types.string, ""),
    filterFirstname: types.optional(types.string, ""),
    filterLastname: types.optional(types.string, ""),
    filterIdCardNo: types.optional(types.string, ""),
    filterName: types.optional(types.string, ""),
    filterGuarantorFirstname: types.optional(types.string, ""),
    filterGuarantorLastname: types.optional(types.string, ""),
    filterGuarantorIdCardNo: types.optional(types.string, ""),
    filterStartDate: types.optional(types.string, ""),
    filterEndDate: types.optional(types.string, ""),
    filterStatus: types.optional(types.string, ""),
    filterFiscalYear: types.optional(types.string, ""),
    documentDate: types.optional(types.string, ""),
    selectedAllCheckbox: types.optional(types.boolean, false),
    error: types.optional(ErrorModel, {}),
    total: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    perPage: types.optional(types.number, 10),
    totalPages: types.optional(types.number, 1),
    loading: types.optional(types.boolean, false)
  })
  .views((self: any) => ({
    get statusMenu() {
      return self.list.find((item: IAgreementModel) => item.isSelected === true)
        ? false
        : true;
    },
    get selected_checkbox() {
      if (self.list.length > 0) {
        const selectedList = self.list.map(
          (item: IAgreementModel) => item.isSelected
        );
        return selectedList.every((item: boolean) => item);
      } else {
        return false;
      }
    },
    get agreement_list_id_check() {
      return self.list
        .filter((item: IAgreementModel) => item.isSelected === true)
        .map((item: IAgreementModel) => item.id);
    },
    get agreement_list_check() {
      return self.list.filter(
        (item: IAgreementModel) => item.isSelected === true
      );
    }
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    load_data: flow(function*() {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body: IAgreementsGet = {
          documentNumber: self.filterDocumentNumber,
          organizationId: self.filterOrganizationId,
          agreementType: self.filterAgreementType,
          firstname: self.filterFirstname,
          lastname: self.filterLastname,
          idCardNo: self.filterIdCardNo.replace(/-/g, ""),
          name: self.filterName,
          guarantorFirstname: self.filterGuarantorFirstname,
          guarantorLastname: self.filterGuarantorLastname,
          guarantorIdCardNo: self.filterGuarantorIdCardNo.replace(/-/g, ""),
          startDate: self.filterStartDate,
          endDate: self.filterEndDate,
          status: self.filterStatus,
          fiscalYear: self.filterFiscalYear,
          perPage: self.perPage,
          currentPage: self.currentPage
        };
        const result: any = yield Agreement.get(body);
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
    update_data_selected: flow(function*() {
      try {
        yield self.list.forEach(
          flow(function*(agreementItem: IAgreementModel) {
            if (agreementItem.isSelected) {
              const result: any = yield Agreement.update(
                { active: true },
                parseInt(agreementItem.id)
              );
              agreementItem.setAllField(result.data);
            }
          })
        );
        self.selected_all(false);
      } catch (e) {
        console.log(e);
      }
    }),
    createVouchersByIds: flow(function*() {
      self.setField({ fieldname: "loading", value: true });
      try {
        self.setField({
          fieldname: "isShowMessageAgreementsList",
          value: true
        });
        const result: any = yield vouchersAPI.create(
          {
            // ids: self.selected_checkbox,
            ids: self.agreement_list_id_check,
            documentDate: self.documentDate
          },
          { name: "agreements" }
        );
        self.setField({
          fieldname: "failedAgreements",
          value: result.data.failedAgreements
        });
        self.setField({
          fieldname: "successAgreements",
          value: result.data.successAgreements
        });
        console.log("createVouchersByIds===>", result);
        self.selected_all(false);
        self.setField({ fieldname: "documentDate", value: "" });
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({ fieldname: "message", value: e.message });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack
        });
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    selected_all: (selected: boolean) => {
      self.selectedAllCheckbox = selected;
      self.list.forEach((item: IAgreementModel) => {
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
    resetFilterBorrowerAndVendorInfo: () => {
      self.filterFirstname = "";
      self.filterLastname = "";
      self.filterIdCardNo = "";
      self.filterGuarantorFirstname = "";
      self.filterGuarantorLastname = "";
      self.filterGuarantorIdCardNo = "";
    },
    resetFilter: flow(function*() {
      try {
        self.filterDocumentNumber = "";
        self.filterOrganizationId = "";
        self.filterAgreementType = "";
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
        const result: any = yield Agreement.get({ perPage: self.perPage });
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
      }
    }),
    resetAgreementListMessage: () => {
      self.setField({
        fieldname: "failedAgreements",
        value: []
      });
      self.setField({
        fieldname: "successAgreements",
        value: []
      });
    },
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));
export type IAgreementListModel = typeof AgreementListModel.Type;
