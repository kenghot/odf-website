import { flow } from "mobx";
import { applySnapshot, types } from "mobx-state-tree";
import { ErrorModel } from "../../../components/common/error";
import { MessageModel } from "../../../components/common/message";
import { IInput } from "../../../utils/common-interface";
import customtypes from "../../../utils/mobx-types-helper";
import { IVoucherModel, VoucherModel } from "./VoucherModel";
import {
  IKTBCreate,
  IKTBUpdate,
  IVoucherFilterBody,
  vouchersAPI
} from "./VoucherService";

export const VoucherListModel = types
  .model("VoucherListModel", {
    list: types.optional(types.array(VoucherModel), []),
    filterDocumentNumber: types.optional(types.string, ""),
    filterOrganizationId: types.optional(types.string, ""),
    filterRefDocumentNumber: types.optional(types.string, ""),
    filterFirstname: types.optional(types.string, ""),
    filterLastname: types.optional(types.string, ""),
    filterIdCardNo: types.optional(types.string, ""),
    filterName: types.optional(types.string, ""),
    filterStartDate: types.optional(types.string, ""),
    filterEndDate: types.optional(types.string, ""),
    filterStatus: types.optional(types.string, ""),
    filterFiscalYear: types.optional(types.string, ""),
    selectedAllCheckbox: types.optional(types.boolean, false),
    filterRefType: types.optional(types.string, "AGREEMENT"),
    documentDate: types.optional(types.string, ""),
    ktbFile: types.maybe(customtypes.FilePrimitive),
    error: types.optional(ErrorModel, {}),
    total: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    perPage: types.optional(types.number, 10),
    totalPages: types.optional(types.number, 1),
    loading: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {})
  })
  .views((self: any) => ({
    get selected_checkbox() {
      if (self.list.length > 0) {
        const selectedList = self.list.map(
          (item: IVoucherModel) => item.isSelected
        );
        return selectedList.every((item: boolean) => item);
      } else {
        return false;
      }
    },
    get voucher_item_list_check() {
      return self.list
        .filter((item: IVoucherModel) => item.isSelected === true)
        .map((item: IVoucherModel) => item.id);
    },
    get ktb_file() {
      if (self.ktbFile) {
        return [self.ktbFile];
      } else {
        return [];
      }
    }
  }))
  .actions((self: any) => ({
    onSeachVoucherList: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body: IVoucherFilterBody = {
          documentNumber: self.filterDocumentNumber,
          organizationId: self.filterOrganizationId,
          refDocumentNumber: self.filterRefDocumentNumber,
          refType: self.filterRefType,
          firstname: self.filterFirstname,
          lastname: self.filterLastname,
          idCardNo: self.filterIdCardNo,
          startDate: self.filterStartDate,
          endDate: self.filterEndDate,
          fiscalYear: self.filterFiscalYear,
          status: self.filterStatus,
          perPage: self.perPage,
          currentPage: self.currentPage
        };
        // const result = yield vouchersAPI.getVoucherList(body);
        const result: any = yield vouchersAPI.get(body);
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
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    createKTBFile: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body: IKTBCreate = {
          ids: self.voucher_item_list_check,
          effectiveDate: self.documentDate
        };
        yield vouchersAPI.create(body, { name: "ktb" });

        self.selected_all(false);
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
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    updateVoucherByKTBFile: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        console.log("updateVoucherByKTBFile", {
          ktb: self.ktbFile
        });
        const body: IKTBUpdate = {
          ktb: self.ktbFile
        };
        const result: any = yield vouchersAPI.formUpdateNoId(body, { name: "ktb" });
        // console.log(result.data)
        self.resetFilter();
        self.onSeachVoucherList();
        self.selected_all(false);
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "อัพโหลดใบแทนใบรับเงินจากระบบ KTB Online เรียบร้อยแล้ว"
        });
        //Beer14082021 post api odoo
        console.log(result.data.successAgreement.length)
        // console.log(result.data.successAgreement.length)
        if (result.data.successAgreement.length > 0) {
          for (const item of result.data.successAgreement) {
            const odooApiUrl = `${process.env.REACT_APP_API_ODOO_ENDPOINT}/rest_sync_contract.php`;
            const requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contract_no: item.documentNumber })
            };
            const res: any = yield fetch(odooApiUrl, requestOptions);
            const response: any = yield res.json();
            console.log(response);
          }
        }
        if (result.data.successAgreement.length == 0) {
          console.log("ไม่สามารถสร้างบัญชีลูกหนี้ได้")
          self.error.setField({ fieldname: "tigger", value: true });
          self.error.setField({ fieldname: "title", value: "ไม่สามารถสร้างบัญชีลูกหนี้ได้" });
          self.error.setField({ fieldname: "message", value: "ไม่สามารถสร้างบัญชีลูกหนี้ได้ กรุณาลองใหม่อีกครั้ง" });
        }
        self.setField({ fieldname: "ktbFile", value: undefined });
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
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    selected_all: (selected: boolean) => {
      self.selectedAllCheckbox = selected;
      self.list.forEach((item: IVoucherModel) => {
        item.setField({ fieldname: "isSelected", value: selected });
      });
    },
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
    resetFilterBorrower: () => {
      self.filterFirstname = "";
      self.filterLastname = "";
      self.filterIdCardNo = "";
    },
    resetFilter: () => {
      try {
        self.filterDocumentNumber = "";
        self.filterOrganizationId = "";
        self.filterRefDocumentNumber = "";
        self.filterFirstname = "";
        self.filterLastname = "";
        self.filterIdCardNo = "";
        self.filterName = "";
        self.filterStartDate = "";
        self.filterEndDate = "";
        self.filterStatus = "";
        self.filterFiscalYear = "";
        // const result = yield finanVoucherApi.get({ perPage: self.perPage });
        // self.setField({ fieldname: "list", value: result.data });
        // self.setPagination(result.currentPage, result.totalPages, result.total);
      } catch (e) {
        console.log(e);
      }
    },
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));
export type IVoucherListModel = typeof VoucherListModel.Type;
