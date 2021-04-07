import { flow } from "mobx";
import { applySnapshot, types } from "mobx-state-tree";
import { ErrorModel } from "../../components/common/error";
import { MessageModel } from "../../components/common/message";
import { IInput } from "../../utils/common-interface";
import customtypes from "../../utils/mobx-types-helper";
import { fetchNoService } from "../../utils/request-noservice";
import { IOrgModel } from "../admin/organization/OrgModel";
import {
  DonationAllowanceModel,
  IDonationAllowanceModel,
} from "./DonationAllowanceModel";
import {
  DonationAllowances,
  DonationAllowancesFileupload,
  DonationDoc,
  DonationDocUrl,
} from "./DonationService";

export const DonationAllowanceListModel = types
  .model("DonationAllowanceListModel", {
    list: types.optional(types.array(DonationAllowanceModel), []),
    filterDocumentNumber: types.optional(types.string, ""),
    filterOrgName: types.optional(types.string, ""),
    filterOrganizationId: types.optional(types.string, ""),
    filterSponsorFirstname: types.optional(types.string, ""),
    filterSponsorLastname: types.optional(types.string, ""),
    filterSponsorIdCardNo: types.optional(types.string, ""),
    filterStartDate: types.optional(types.string, ""),
    filterEndDate: types.optional(types.string, ""),
    donation_allowance: types.maybe(customtypes.FilePrimitive),
    selectedAllCheckbox: types.optional(types.boolean, false),
    error: types.optional(ErrorModel, {}),
    alert: types.optional(MessageModel, {}),
    total: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    perPage: types.optional(types.number, 10),
    totalPages: types.optional(types.number, 1),
    loading: types.optional(types.boolean, false),
  })
  .views((self: any) => ({
    get statusMenu() {
      return self.list.find(
        (item: IDonationAllowanceModel) => item.isSelected === true
      )
        ? false
        : true;
    },
    get selected_checkbox() {
      if (self.list.length > 0) {
        const selectedList = self.list.map(
          (item: IDonationAllowanceModel) => item.isSelected
        );
        return selectedList.every((item: boolean) => item);
      } else {
        return false;
      }
    },
    get donation_file() {
      if (self.donation_allowance) {
        return [self.donation_allowance];
      } else {
        return [];
      }
    },
    get donation_list_id_check() {
      return self.list
        .filter((item: IDonationAllowanceModel) => item.isSelected === true)
        .map((item: IDonationAllowanceModel) => item.id);
    },
    get donation_list_is_selected() {
      return self.list.filter(
        (item: IDonationAllowanceModel) => item.isSelected === true
      );
    },
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    selected_all: (selected: boolean) => {
      self.selectedAllCheckbox = selected;
      self.list.forEach((item: IDonationAllowanceModel) => {
        item.setField({ fieldname: "isSelected", value: selected });
      });
    },
    load_data: flow(function* () {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          filterDocumentNumber: self.filterDocumentNumber,
          organizationId: self.filterOrganizationId,
          filterOrgName: self.filterOrgName,
          filterSponsorFirstname: self.filterSponsorFirstname,
          filterSponsorLastname: self.filterSponsorLastname,
          filterSponsorIdCardNo: self.filterSponsorIdCardNo,
          filterStartDate: self.filterStartDate,
          filterEndDate: self.filterEndDate,
          perPage: self.perPage,
          currentPage: self.currentPage,
        };
        const result: any = yield DonationAllowances.get(body);
        self.setField({ fieldname: "list", value: result.data });
        self.setPerPage(result.perPage);
        self.setPagination(result.currentPage, result.totalPages, result.total);
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.setField({ fieldname: "list", value: [] });
        self.setPagination(1, 0, 0);
        self.error.setErrorMessage(e);
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    resetFilter: flow(function* () {
      try {
        self.filterDocumentNumber = "";
        self.filterOrganizationId = "";
        self.filterOrgName = "";
        self.filterSponsorFirstname = "";
        self.filterSponsorLastname = "";
        self.filterSponsorIdCardNo = "";
        self.filterStartDate = "";
        self.filterEndDate = "";
        self.selectedAllCheckbox = false;
        const result: any = yield DonationAllowances.get({
          perPage: self.perPage,
        });
        self.setField({ fieldname: "list", value: result.data });
        self.setPagination(result.currentPage, result.totalPages, result.total);
      } catch (e) {
        console.log(e);
      }
    }),
    uploadDonationFile: flow(function* (organization: IOrgModel) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body: any = {
          donation_allowance: self.donation_allowance,
          organizationId: organization.id,
          posId: organization.posDonateAllowaceId || "",
        };
        yield DonationAllowancesFileupload.formCreate(body);
        self.resetFilter();
        self.load_data();
        self.selected_all(false);
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ",
        });
        self.alert.setField({
          fieldname: "message",
          value: "อัพโหลดไฟล์นำเข้าข้อมูล เรียบร้อยแล้ว",
        });
        self.setField({ fieldname: "donation_allowance", value: undefined });
        self.error.setField({ fieldname: "tigger", value: false });
      } catch (e) {
        self.error.setErrorMessage(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    printThankyouLetters: flow(function* (
      eSignature: boolean,
      fileType: string
    ) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const result: any = yield fetchNoService(
          `${DonationDocUrl}/opentbs/tbs/template_thankyou.php`,
          {
            show_debug: "0",
            ids: self.donation_list_id_check.join(","),
            fileType,
            eSignature,
          },
          "template_thankyou",
          fileType
        );
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage("", "");
      } catch (e) {
        self.error.setErrorMessage(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    printEnvelops: flow(function* (
      addressType: string,
      fileType: string,
      isReport: boolean,
      envelopSize: string
    ) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const result: any = yield fetchNoService(
          `${DonationDocUrl}/opentbs/tbs/template_envelop.php`,
          {
            show_debug: "0",
            ids: self.donation_list_id_check.join(","),
            isReport,
            fileType: isReport ? undefined : fileType,
            envelopSize: envelopSize ? envelopSize : undefined,
            addressType,
          },
          "template_envelop",
          isReport ? undefined : fileType
        );
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage("", "");
      } catch (e) {
        self.error.setErrorMessage(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    printOwner: flow(function* (fileType: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const result: any = yield fetchNoService(
          `${DonationDocUrl}/opentbs/tbs/template_medal.php`,
          {
            show_debug: "0",
            ids: self.donation_list_id_check.join(","),
            fileType,
          },
          "template_medal",
          fileType
        );
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setAlertMessage("", "");
      } catch (e) {
        self.error.setErrorMessage(e);
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
    setPagination: (currentPage: number, totalPages: number, total: number) => {
      self.currentPage = currentPage;
      self.totalPages = totalPages;
      self.total = total;
    },
    resetAll: () => {
      applySnapshot(self, {});
    },
  }));
export type IDonationAllowanceListModel = typeof DonationAllowanceListModel.Type;
