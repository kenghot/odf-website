import { flow } from "mobx";
import { types } from "mobx-state-tree";
import { Sequence, SequenceModel } from ".";
import { ErrorModel } from "../../../components/common/error";
import { IInput } from "../../../utils/common-interface";
import { ISequenceModel } from "./SequenceModel";

export const SequenceListModel = types
  .model("SequenceListModel", {
    list: types.optional(types.array(SequenceModel), []),
    filterSequenceType: types.optional(types.string, ""),
    filterPrefixYear: types.optional(types.string, ""),
    filterPrefixCode: types.optional(types.string, ""),
    error: types.optional(ErrorModel, {}),
    total: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    perPage: types.optional(types.number, 10),
    totalPages: types.optional(types.number, 1),
    loading: types.optional(types.boolean, false)
  })
  .views((self: any) => ({
    get statusMenu() {
      return self.list.find(
        (sequence: ISequenceModel) => sequence.isSelected === true
      )
        ? false
        : true;
    },
    get selected_checkbox() {
      const selectedList = self.list.map(
        (sequence: ISequenceModel) => sequence.isSelected
      );
      return selectedList.every((item: boolean) => item);
    }
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    load_data: flow(function*() {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          sequenceType: self.filterSequenceType || "request",
          prefixYear: self.filterPrefixYear,
          prefixCode: self.filterPrefixCode,
          perPage: self.perPage,
          currentPage: self.currentPage
        };
        const result: any = yield Sequence.get(body);
        self.setField({ fieldname: "list", value: result.data });
        self.list.forEach((item: ISequenceModel) => {
          item.setField({
            fieldname: "sequenceType",
            value: self.filterSequenceType
          });
        });
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
        // console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    selected_all: (selected: boolean) => {
      self.selectedAllCheckbox = selected;
      self.list.forEach((sequence: ISequenceModel) => {
        sequence.setField({ fieldname: "isSelected", value: selected });
      });
    },
    resetFilter: flow(function*() {
      try {
        self.filterPrefixYear = "";
        self.filterPrefixCode = "";
        const result: any = yield Sequence.get({
          perPage: self.perPage,
          sequenceType: self.filterSequenceType || "request"
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
    addSequenceToList: (item: ISequenceModel) => {
      self.list.push(item);
    }
  }));
export type ISequenceListModel = typeof SequenceListModel.Type;
