import { flow, types } from "mobx-state-tree";
import { ApiHelper } from "./utils/api-helper";
import { IInput } from "./utils/common-interface";

export enum pageSizeSet {
  small = "70%",
  regular = "100%",
  big = "130%"
}
export enum pageHeader {
  admin = "admin",
  undefied = ""
}
export const EnumItemModel = types.model("EnumItemModel", {
  key: types.optional(types.string, ""),
  text: types.optional(types.string, ""),
  value: types.maybe(types.union(types.string, types.number))
});
export const EnumModel = types.model("EnumModel", {
  type: types.optional(types.string, ""),
  items: types.optional(types.array(EnumItemModel), [])
});

const HEADER_HEIGHT_INITIAL = 120;

export const AppModel = types
  .model("AppModel", {
    pageSize: types.optional(types.string, pageSizeSet.regular),
    pageHeader: types.optional(types.string, pageHeader.undefied),
    loading: types.optional(types.boolean, false),
    tabletMode: types.optional(types.boolean, false),
    mobileMode: types.optional(types.boolean, false),
    screenHeight: types.optional(types.number, 0),
    enumSet: types.optional(types.array(EnumModel), []),
    headerHeight: types.optional(types.number, HEADER_HEIGHT_INITIAL)
  })
  .views((self: any) => ({
    enumItems(type: string) {
      const selected = self.enumSet.find((_enum: any) => _enum.type === type);

      return selected ? selected.items : [];
    },
    enumItemsDescription(type: string) {
      const selected = self.enumSet.find((_enum: any) => _enum.type === type);
      if (selected) {
        return selected.items.map((a: any) => {
          return {
            key: a.key,
            value: a.value,
            text: a.text,
            description: a.value
          };
        });
      } else {
        return [];
      }
    },
    enumItemLabel(type: string, value: any) {
      const selected = self.enumItems(type);
      const selectedItem = selected
        ? selected.find((item: any) => item.value === value)
        : undefined;
      return selectedItem ? selectedItem.text : "-";
    }
  }))
  .actions((self: any) => ({
    setPageSize: (pageSize: pageSizeSet) => {
      self.pageSize = pageSize;
      document.body.style.zoom = self.pageSize;
    },
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    setHeaderHeight: () => {
      const mainLayoutHeaderElement = document.getElementById(
        "MainLayoutHeader"
      );
      const headerHeight =
        mainLayoutHeaderElement && mainLayoutHeaderElement.clientHeight
          ? mainLayoutHeaderElement.clientHeight
          : HEADER_HEIGHT_INITIAL;
      // console.log("setHeaderHeight", headerHeight);
      if (headerHeight !== self.headerHeight) {
        self.headerHeight = headerHeight;
      }
    },
    getEnumset: flow(function*() {
      try {
        self.setField({ fieldname: "loading", value: true });
        const api = new ApiHelper(
          `${process.env.REACT_APP_API_ENDPOINT}/config/enum_set`
        );
        const result: any = yield api.get();
        self.enumSet = result.data;
      } catch (e) {
        console.log(e);
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    setScreenHeight: () => {
      self.setField({ fieldname: "screenHeight", value: window.innerHeight });
    },
    setScreenMode: () => {
      self.setField({
        fieldname: "mobile",
        value: window.innerWidth < 767
      });
      self.setField({
        fieldname: "tabletMode",
        value: window.innerWidth < 991
      });
    }
  }));
export type IAppModel = typeof AppModel.Type;
export type IEnumItemModel = typeof EnumItemModel.Type;
export default AppModel.create({});
