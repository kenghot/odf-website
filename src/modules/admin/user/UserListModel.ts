import { flow } from "mobx";
import { applySnapshot, types } from "mobx-state-tree";
import { User, UserModel } from ".";
import { ErrorModel } from "../../../components/common/error";
import { IInput } from "../../../utils/common-interface";
import { IUserModel } from "./UserModel";
import { IUserGet } from "./UserService";

export const UserListModel = types
  .model("UserListModel", {
    list: types.optional(types.array(UserModel), []),
    filterUsername: types.optional(types.string, ""),
    filterFirstname: types.optional(types.string, ""),
    filterLastname: types.optional(types.string, ""),
    filterOrgId: types.optional(types.string, ""),
    filterRoleId: types.optional(types.string, ""),
    filterStatus: types.optional(types.string, ""),
    selectedAllCheckbox: types.optional(types.boolean, false),
    error: types.optional(ErrorModel, {}),
    total: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    perPage: types.optional(types.number, 10),
    totalPages: types.optional(types.number, 1)
  })
  .views((self: any) => ({
    get statusMenu() {
      return self.list.find((user: IUserModel) => user.isSelected === true)
        ? false
        : true;
    },
    get selected_checkbox() {
      const selectedList = self.list.map((user: IUserModel) => user.isSelected);
      return selectedList.every((item: boolean) => item);
    }
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    setFieldFilterOrg: (filterOrgId?: string, filterFirstname?: string) => {
      self.setField({ fieldname: "filterOrgId", value: filterOrgId || "" });
      self.setField({
        fieldname: "filterFirstname",
        value: filterFirstname || ""
      });
    },
    load_data: flow(function*() {
      try {
        const body: IUserGet = {
          username: self.filterUsername,
          firstname: self.filterFirstname,
          lastname: self.filterLastname,
          organizationId: self.filterOrgId,
          roleId: self.filterRoleId,
          active: self.filterStatus,
          perPage: self.perPage,
          currentPage: self.currentPage
        };
        const result: any = yield User.get(body);
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
        // console.log(e);
      }
    }),
    load_data_pos: flow(function*() {
      try {
        const body: IUserGet = {
          firstname: self.filterFirstname,
          organizationId: self.filterOrgId,
          perPage: self.perPage,
          currentPage: self.currentPage
        };
        const result: any = yield User.get(body, { name: "pos_users" });
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
        // console.log(e);
      }
    }),
    update_data_selected: flow(function*(value: string) {
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
            flow(function*(user: IUserModel) {
              if (user.isSelected) {
                const result: any = yield User.user_status_update(
                  { active: isActive },
                  parseInt(user.id)
                );
                user.setAllField(result.data);
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
      self.list.forEach((user: IUserModel) => {
        user.setField({ fieldname: "isSelected", value: selected });
      });
    },
    resetFilter: flow(function*() {
      try {
        self.filterFirstname = "";
        self.filterLastname = "";
        self.filter_id = "";
        self.filterOrgId = "";
        self.filterRoleId = "";
        self.filterStatus = "";
        self.filterUsername = "";
        const result: any = yield User.get({ perPage: self.perPage });
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
export type IUserListModel = typeof UserListModel.Type;
