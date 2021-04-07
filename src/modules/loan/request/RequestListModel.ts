import { flow } from "mobx";
import { applySnapshot, types } from "mobx-state-tree";
import moment from "moment";
import { ErrorModel } from "../../../components/common/error";
import { MessageModel } from "../../../components/common/message";
import { IInput } from "../../../utils/common-interface";
import customtypes from "../../../utils/mobx-types-helper";
import { AgreementRequests } from "../agreement/AgreementService";
import { IRequestModel, RequestModel } from "./RequestModel";
import { IRequestGet, Request } from "./RequestsService";

export const RequestListModel = types
  .model("RequestListModel", {
    list: types.optional(types.array(RequestModel), []),
    failedRequests: types.optional(types.array(RequestModel), []),
    successRequests: types.optional(types.array(RequestModel), []),
    isShowMessageRequestsList: types.optional(types.boolean, false),
    filterDocumentNumber: types.optional(types.string, ""),
    filterOrganizationId: types.optional(types.string, ""),
    filterRequestType: types.optional(types.string, ""),
    filterFirstname: types.optional(types.string, ""),
    filterLastname: types.optional(types.string, ""),
    filterIdCardNo: types.optional(types.string, ""),
    filterName: types.optional(types.string, ""),
    filterStartDate: types.optional(types.string, ""),
    filterEndDate: types.optional(types.string, ""),
    filterStatus: types.optional(types.string, ""),
    filterFiscalYear: types.optional(types.string, ""),
    documentDate: types.optional(types.string, ""),
    committeeName: types.optional(types.string, ""),
    meetingDate: customtypes.optional(
      types.string,
      moment().format("YYYY-MM-DD")
    ),
    committeeNumber: types.optional(types.string, ""),
    selectedAllCheckbox: types.optional(types.boolean, false),
    error: types.optional(ErrorModel, {}),
    total: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    perPage: types.optional(types.number, 10),
    totalPages: types.optional(types.number, 1),
    loading: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {})
  })
  .views((self: any) => ({
    get statusMenu() {
      return self.list.find((item: IRequestModel) => item.isSelected === true)
        ? false
        : true;
    },
    get selected_checkbox() {
      if (self.list.length > 0) {
        const selectedList = self.list.map(
          (item: IRequestModel) => item.isSelected
        );
        return selectedList.every((item: boolean) => item);
      } else {
        return false;
      }
    },
    get request_list_id_check() {
      return self.list
        .filter((item: IRequestModel) => item.isSelected === true)
        .map((item: IRequestModel) => item.id);
    },
    get request_list_check() {
      return self.list.filter(
        (item: IRequestModel) => item.isSelected === true
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
        const body: IRequestGet = {
          documentNumber: self.filterDocumentNumber,
          organizationId: self.filterOrganizationId,
          requestType: self.filterRequestType,
          firstname: self.filterFirstname,
          lastname: self.filterLastname,
          idCardNo: self.filterIdCardNo.replace(/-/g, ""),
          name: self.filterName,
          startDate: self.filterStartDate,
          endDate: self.filterEndDate,
          fiscalYear: self.filterFiscalYear,
          status: self.filterStatus,
          perPage: self.perPage,
          currentPage: self.currentPage
        };
        const result: any = yield Request.get(body);
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
    getRequestCommitteeReport: flow(function*() {
      try {
        self.setField({ fieldname: "loading", value: true });
        yield Request.create(
          {
            ids: self.request_list_id_check,
            committeeName: self.committeeName,
            meetingDate: self.meetingDate
          },
          { name: "print_request_committee" }
        );
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "เอกสารถูกสร้างเรียบร้อยแล้ว"
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({
          fieldname: "message",
          value: e.message
        });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack
        });
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    createContract: flow(function*() {
      try {
        self.setField({ fieldname: "loading", value: true });
        self.setField({ fieldname: "isShowMessageRequestsList", value: true });
        const result: any = yield AgreementRequests.create({
          ids: self.request_list_id_check,
          documentDate: self.documentDate
        });
        self.setField({
          fieldname: "failedRequests",
          value: result.data.failedRequests
        });
        self.setField({
          fieldname: "successRequests",
          value: result.data.successRequests
        });
        self.selected_all(false);
        self.setField({ fieldname: "documentDate", value: "" });
        self.setPerPage(result.perPage);
        self.setPagination(
          result.perPage,
          result.currentPage,
          result.totalPages,
          result.total
        );
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
      self.list.forEach((item: IRequestModel) => {
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
    resetFilter: flow(function*() {
      try {
        self.filterDocumentNumber = "";
        self.filterOrganizationId = "";
        self.filterRequestType = "";
        self.filterFirstname = "";
        self.filterLastname = "";
        self.filterIdCardNo = "";
        self.filterName = "";
        self.filterStartDate = "";
        self.filterEndDate = "";
        self.filterStatus = "";
        self.filterFiscalYear = "";
        const result: any = yield Request.get({ perPage: self.perPage });
        self.setField({ fieldname: "list", value: result.data });
        self.setPagination(
          result.perPage,
          result.currentPage,
          result.totalPages,
          result.total
        );
      } catch (e) {
        console.log(e);
      }
    }),
    resetRequestsListMessage: () => {
      self.setField({
        fieldname: "failedRequests",
        value: []
      });
      self.setField({
        fieldname: "successRequests",
        value: []
      });
    },
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));
export type IRequestListModel = typeof RequestListModel.Type;
