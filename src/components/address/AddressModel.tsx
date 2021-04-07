import { applySnapshot, types } from "mobx-state-tree";
import { IInput } from "../../utils/common-interface";

export const AddressModel = types
  .model("AddressModel", {
    houseNo: types.optional(types.string, ""),
    buildingName: types.optional(types.string, ""),
    roomNo: types.optional(types.string, ""),
    floor: types.optional(types.string, ""),
    hmoo: types.optional(types.string, ""),
    soi: types.optional(types.string, ""),
    street: types.optional(types.string, ""),
    subDistrictCode: types.optional(types.string, ""),
    subDistrict: types.optional(types.string, ""),
    districtCode: types.optional(types.string, ""),
    district: types.optional(types.string, ""),
    provinceCode: types.optional(types.string, ""),
    province: types.optional(types.string, ""),
    zipcode: types.optional(types.string, ""),
    latitude: types.optional(types.string, ""),
    longitude: types.optional(types.string, "")
  })
  .views((self: any) => ({
    get shortaddress() {
      return `อ.${self.district || ""}, จ.${" "}${self.province || ""}`;
    },
    get line1() {
      return `${self.houseNo || ""}${
        self.buildingName
          ? `${" "}หมู่บ้าน/อาคาร${" "}${self.buildingName}`
          : ""
      }${self.roomNo ? `${" "}เลขที่ห้อง${" "}${self.roomNo}` : ""}`;
    },
    get line2() {
      return `${self.floor ? `ชั้น${" "}${self.floor}` : ""}${
        self.hmoo ? `${" "}หมู่ที่${" "}${self.hmoo}` : ""
      }${self.soi ? `${" "}ซอย${self.soi}` : ""}`;
    },
    get line3() {
      return `${self.street ? `ถนน${self.street}` : ""}${
        self.subDistrict
          ? `${" "}${self.provinceCode === "10" ? `แขวง` : `ตำบล `}${
              self.subDistrict
            }`
          : ""
      }`;
    },
    get line4() {
      return `${
        self.district
          ? `${self.provinceCode === "10" ? `เขต` : `อำเภอ `}${self.district}`
          : ""
      }${self.province ? `${" "}${self.province}` : ""}${
        self.zipcode ? `${" "}${self.zipcode}` : ""
      }`;
    }
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    setAllField: (data: any) => {
      Object.keys(data).forEach((key) => {
        try {
          self[key] = data[key];
        } catch (e) {
          console.log(e);
        }
      });
    },
    resetAll: () => {
      applySnapshot(self, {});
    }
  }));
