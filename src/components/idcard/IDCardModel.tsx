import { flow, getRoot, types } from "mobx-state-tree";
import {
  date_YYYYMMDD_TO_DDMMYYYY,
  dateFormating,
  idcardFormatting,
  isInValidThaiIdCard,
} from "../../utils";
import { IInput } from "../../utils/common-interface";
import { AddressModel } from "../address/AddressModel";
import { ErrorModel } from "../common/error";

export const IDCardModel = types
  .model("IDCardModel", {
    id: types.optional(types.string, ""),
    title: types.optional(types.string, ""),
    firstname: types.optional(types.string, ""),
    lastname: types.optional(types.string, ""),
    birthday: types.optional(types.string, ""),
    gender: types.optional(types.string, ""),
    issued_date: types.optional(types.string, ""),
    expired_date: types.optional(types.string, ""),
    issuer: types.optional(types.string, ""),
    address: types.optional(AddressModel, {}),
    age: types.optional(types.number, 0),
    idCardLifetime: types.optional(types.boolean, false),
    loading: types.optional(types.boolean, false),
    error: types.optional(ErrorModel, {}),
  })
  .views((self: any) => ({
    get id_formated() {
      return idcardFormatting(self.id);
    },
    get is_incorrect_format() {
      return isInValidThaiIdCard(self.idCardNo);
    },
    get issued_date_formated() {
      return dateFormating(self.issued_date);
    },
    get expired_date_formated() {
      return dateFormating(self.expired_date);
    },
    get birthday_formated() {
      return dateFormating(self.birthday);
    },
    age(until?: string) {
      return "";
    },
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
    onRemove: () => {
      const root: any = getRoot(self);
      root.onRemoveItem(self);
    },
    getCardData: flow(function* () {
      try {
        self.loading = true;
        const res = yield fetch(`http://localhost:9999`);
        const response = yield res.json();
        self.setAllField(response.data);
        self.issued_date = date_YYYYMMDD_TO_DDMMYYYY(self.issued_date);
        self.expired_date = date_YYYYMMDD_TO_DDMMYYYY(self.expired_date);
        self.birthday = date_YYYYMMDD_TO_DDMMYYYY(self.birthday);
        self.address.setField({
          fieldname: "houseNo",
          value: response.data.house_no,
        });
        self.address.setField({
          fieldname: "hmoo",
          value: response.data.hmoo,
        });
        self.address.setField({
          fieldname: "street",
          value: response.data.street,
        });
        self.address.setField({
          fieldname: "subDistrict",
          value: response.data.sub_district.replace(/ตำบล|แขวง/g, ""),
        });
        self.address.setField({
          fieldname: "district",
          value: response.data.district.replace(/อำเภอ|เขต/g, ""),
        });
        self.address.setField({
          fieldname: "province",
          value: response.data.province.replace(/จังหวัด/g, ""),
        });
        self.error.tigger = false;
      } catch (e) {
        self.error.tigger = true;
        self.error.title = "ไม่พบอุปกรณ์";
        self.error.message =
          "กรุณาติดต่อผู้ดูแลระบบเพื่อเชื่อมต่ออุปกรณ์และลงโปรแกรมสำหรับอ่านบัตรประชาชนค่ะ";
        console.log(e);
      } finally {
        self.loading = false;
      }
    }),
  }));
export type IIDCardModel = typeof IDCardModel.Type;
