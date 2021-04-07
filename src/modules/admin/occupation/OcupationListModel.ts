import { flow } from "mobx";
import { types } from "mobx-state-tree";
import { Ocupation } from ".";
import { ErrorModel } from "../../../components/common/error";
import { IInput } from "../../../utils/common-interface";
import { IOcupationModel, OcupationModel } from "./OcupationModel";

export const OcupationListModel = types
  .model("OcupationListModel", {
    list: types.optional(types.array(OcupationModel), []),
    total: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    perPage: types.optional(types.number, 999),
    totalPages: types.optional(types.number, 1),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false)
  })
  .views((self: any) => ({
    get occupation_list_0() {
      return self.list.filter(
        (item: IOcupationModel) => item.occupationType === 0
      );
    },
    get occupation_list_1() {
      return self.list.filter(
        (item: IOcupationModel) => item.occupationType === 1
      );
    },
    get occupation_list_2() {
      return self.list.filter(
        (item: IOcupationModel) => item.occupationType === 2
      );
    },
    get statusMenu() {
      return self.list.find(
        (ocupation: IOcupationModel) => ocupation.isSelected === true
      )
        ? false
        : true;
    },
    selected_checkbox(ocupationType: number) {
      const selectedList = self.list
        .filter(
          (item: IOcupationModel) => item.occupationType === ocupationType
        )
        .map((ocupation: IOcupationModel) => ocupation.isSelected);
      return selectedList.every((item: boolean) => item);
    }
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    load_data: flow(function*(active?:boolean) {
      try {
        self.setField({ fieldname: "loading", value: true });
        let body =  {
          perPage: self.perPage,
          currentPage: self.currentPage
        };
        if(active){
          body = { ...body, active: "1" } as any;
        }
        const result = yield Ocupation.get(body);
        self.setField({ fieldname: "list", value: result.data });
        self.setPerPage(result.perPage);
        self.setPagination(result.currentPage, result.totalPages);
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
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    update_data_selected: flow(function*(value: string, ocupationType: number) {
      try {
        self.setField({ fieldname: "loading", value: true });
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
          yield self.list
            .filter(
              (item: IOcupationModel) => item.occupationType === ocupationType
            )
            .forEach(
              flow(function*(item: IOcupationModel) {
                if (item.isSelected) {
                  const result = yield Ocupation.update(
                    { active: isActive },
                    item.id
                  );
                  item.setAllField(result.data);
                }
              })
            );
          self.selected_all(false);
        }
      } catch (e) {
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    selected_all: (selected: boolean, ocupationType: number) => {
      self.selectedAllCheckbox = selected;
      self.list
        .filter(
          (item: IOcupationModel) => item.occupationType === ocupationType
        )
        .forEach((sequence: IOcupationModel) => {
          sequence.setField({ fieldname: "isSelected", value: selected });
        });
    },
    deSelected_all: () => {
      self.list.forEach((sequence: IOcupationModel) => {
        sequence.setField({ fieldname: "isSelected", value: false });
      });
    },
    resetFilter: flow(function*() {
      try {
        const result = yield Ocupation.get({
          perPage: self.perPage
        });
        self.setField({ fieldname: "list", value: result.data });
        self.setPagination(result.currentPage, result.totalPages);
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
    setPagination: (currentPage: number, totalPages: number) => {
      self.currentPage = currentPage;
      self.totalPages = totalPages;
    }
  }));
export type IOcupationListModel = typeof OcupationListModel.Type;
