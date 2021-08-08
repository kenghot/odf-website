import { applySnapshot, flow, types } from "mobx-state-tree";
import moment from "moment";
import { AddressModel } from "../../../components/address";
import { ErrorModel } from "../../../components/common/error";
import { AttachedFileModel } from "../../../components/common/fileupload/AttachedFileModel";
import { MessageModel } from "../../../components/common/message";
import {
  date_YYYYMMDD_BE_TO_CE,
  dateFormatingYYYYMMDD,
  idcardFormatting,
  isInValidThaiIdCard,
  isValidDate
} from "../../../utils";
import { IInput } from "../../../utils/common-interface";
import customtypes from "../../../utils/mobx-types-helper";
import { OcupationModel } from "../../admin/occupation";
import {
  RequestsVerifyBorrower,
  RequestsVerifyGuarantor
} from "../../loan/request/RequestsService";

export const ProfileModel = types
  .model("ProfileModel", {
    idCardNo: types.optional(types.string, ""),
    idCardNoAgentId: types.optional(types.string, ""),
    title: types.optional(types.string, ""),
    firstname: types.optional(types.string, ""),
    lastname: types.optional(types.string, ""),
    birthDate: types.maybe(
      types.union(types.string, types.null, types.undefined)
    ),
    isOnlyBirthYear: types.optional(types.boolean, false),
    isCheckDeathData: types.optional(types.boolean, false),
    idCardIssuer: types.optional(types.string, ""),
    idCardIssuedDate: types.maybeNull(types.string),
    idCardExpireDate: types.optional(
      types.union(types.string, types.null, types.undefined),
      undefined
    ),
    idCardLifetime: types.optional(types.boolean, false),
    marriageStatus: types.optional(types.number, 0),
    telephone: types.optional(types.string, ""),
    mobilePhone: types.optional(types.string, ""),
    registeredAddressType: types.optional(types.number, 0),
    currentAddressType: types.optional(types.number, 0),
    currentAddress: types.optional(AddressModel, {}),
    residenceType: types.optional(types.number, 0),
    residenceTypeDescription: types.optional(types.string, ""),
    residenceStatusType: types.optional(types.number, 0),
    residenceStatusTypeDescription: types.optional(types.string, ""),
    isWorking: types.optional(types.boolean, false),
    age: customtypes.optional(types.number, 0),
    idCardAddress: types.optional(AddressModel, {}),
    registeredAddress: types.optional(AddressModel, {}),
    documentDeliveryAddress: types.optional(AddressModel, {}),
    occupation: types.optional(OcupationModel, {}),
    attachedFiles: customtypes.optional(types.array(AttachedFileModel), []),
    hasActiveAgreement: customtypes.optional(types.boolean, false),
    loading: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {}),
    error: types.optional(ErrorModel, {}),
    isVerify: types.optional(types.boolean, false)
  })
  .views((self: any) => ({
    get fullname() {
      return `${self.title}${self.firstname} ${self.lastname}`;
    },
    get idCardformated() {
      return self.idCardNo !== "" ? idcardFormatting(self.idCardNo) : "";
    },
    get idCardIsIncorrectFormat() {
      return isInValidThaiIdCard(self.idCardNo);
    },
    get idCardNoAgentIdformated() {
      return self.idCardNoAgentId !== "" ? idcardFormatting(self.idCardNoAgentId) : "";
    },
    get idCardNoAgentIdIncorrectFormat() {
      return isInValidThaiIdCard(self.idCardNoAgentId);
    },
    get idCardIssuedDateFormated() {
      return dateFormatingYYYYMMDD(self.idCardIssuedDate);
    },
    get idCardExpireDateFormated() {
      return dateFormatingYYYYMMDD(self.idCardExpireDate);
    },
    get birthdateFormated() {
      return dateFormatingYYYYMMDD(self.birthDate);
    },
    ageDisplay(until?: string) {
      const untilDate: any = until ? moment(until) : moment();
      const birthDate: any = moment(self.birthdateFormated, "YYYY-MM-DD");
      const yearDiff = moment.duration(untilDate - birthDate).as("years");
      const age =
        self.birthdateFormated.length === 10 && isValidDate(birthDate.toDate())
          ? Math.floor(yearDiff)
          : 0;
      return !isNaN(age) && age !== 0 ? age : "-";
    }
    //
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    setAllField: (data: any) => {
      Object.keys(data).forEach((key, index) => {
        try {
          self[key] = data[key];
        } catch (e) {
          console.log("exception on key", key, e);
          throw e;
        }
      });
    },
    resetAll: () => {
      applySnapshot(self, {});
    },
    getCardData: flow(function* () {
      try {
        self.loading = true;
        const res: any = yield fetch(`http://localhost:9999`);
        const response: any = yield res.json();
        //self.setAllField(response.data);
        self.setField({
          fieldname: "idCardNo",
          value: response.data.id
        });
        self.setField({
          fieldname: "firstname",
          value: response.data.firstname
        });
        self.setField({
          fieldname: "idCardIssuer",
          value: response.data.issuer
        });
        self.setField({
          fieldname: "lastname",
          value: response.data.lastname
        });
        self.setField({
          fieldname: "title",
          value: response.data.title
        });
        self.idCardIssuedDate = date_YYYYMMDD_BE_TO_CE(
          response.data.issued_date
        );
        if (response.data.expired_date === "99999999") {
          self.idCardExpireDate = undefined;
          self.idCardLifetime = true;
        } else {
          self.idCardLifetime = false;
          self.idCardExpireDate = date_YYYYMMDD_BE_TO_CE(
            response.data.expired_date
          );
        }
        self.birthDate = date_YYYYMMDD_BE_TO_CE(response.data.birthday);
        self.idCardAddress.setField({
          fieldname: "houseNo",
          value: response.data.house_no
        });
        self.idCardAddress.setField({
          fieldname: "hmoo",
          value: response.data.hmoo
        });
        self.idCardAddress.setField({
          fieldname: "street",
          value: response.data.street
        });
        self.idCardAddress.setField({
          fieldname: "subDistrict",
          value: response.data.sub_district.replace(/ตำบล|แขวง/g, "")
        });
        self.idCardAddress.setField({
          fieldname: "district",
          value: response.data.district.replace(/อำเภอ|เขต/g, "")
        });
        self.idCardAddress.setField({
          fieldname: "province",
          value: response.data.province.replace(/จังหวัด/g, "")
        });
        self.error.tigger = false;
      } catch (e) {
        self.error.tigger = true;
        self.error.title = "ไม่พบอุปกรณ์";
        self.error.message =
          "กรุณาติดต่อผู้ดูแลระบบเพื่อเชื่อมต่ออุปกรณ์และลงโปรแกรมสำหรับอ่านบัตรประชาชนค่ะ";
        console.log(e);
        throw e;
      } finally {
        self.loading = false;
      }
    }),
    getCardDataGdx: flow(function* () {
      if (self.idCardNo == '' || self.idCardNo.length != 13) {
        self.error.tigger = true;
        self.error.title = "ไม่สามารถดึงข้อมูลได้";
        self.error.message =
          "โปรดกรอกหมายเลขบัตรประชาชน ให้ถูกต้อง";
      } else if (self.idCardNoAgentId == '' || self.idCardNoAgentId.length != 13) {
        self.error.tigger = true;
        self.error.title = "ไม่สามารถดึงข้อมูลได้";
        self.error.message =
          "โปรดกรอกหมายเลขบัตรประชาชนผู้ดึงข้อมูล ให้ถูกต้อง";
      } else {
        try {
          self.loading = true;
          const gdxApiUrl = `${process.env.REACT_APP_GDX_ENDPOINT}/gdx_request_idcard.php`;
          const res: any = yield fetch(`${gdxApiUrl}?ServiceId=009&CitizenId=${self.idCardNo}&AgentId=${self.idCardNoAgentId}`);
          const response: any = yield res.json();
          // console.log(response);
          // self.setAllField(response.data);
          self.setField({
            fieldname: "idCardNo",
            value: self.idCardNo
          });
          self.setField({
            fieldname: "firstname",
            value: response.nameTHlastName
          });
          self.setField({
            fieldname: "lastname",
            value: response.nameTHfirstName
          });
          self.setField({
            fieldname: "title",
            value: response.nameTHtitle
          });
          self.idCardIssuedDate = date_YYYYMMDD_BE_TO_CE(
            response.issueDate
          );
          if (response.expireDate === "99999999") {
            self.idCardExpireDate = undefined;
            self.idCardLifetime = true;
          } else {
            self.idCardLifetime = false;
            self.idCardExpireDate = date_YYYYMMDD_BE_TO_CE(
              response.expireDate
            );
          }
          self.birthDate = date_YYYYMMDD_BE_TO_CE(response.birthDate);
          self.idCardAddress.setField({
            fieldname: "houseNo",
            value: response.address.houseNo.toString()
          });
          self.idCardAddress.setField({
            fieldname: "hmoo",
            value: response.address.villageNo.toString()
          });
          self.idCardAddress.setField({
            fieldname: "soi",
            value: response.address.alleyDesc.toString()
          });
          self.idCardAddress.setField({
            fieldname: "street",
            value: response.address.roadDesc.toString()
          });
          self.idCardAddress.setField({
            fieldname: "subDistrict",
            value: response.address.subdistrictDesc.toString().replace(/ตำบล|แขวง/g, "")
          });
          self.idCardAddress.setField({
            fieldname: "district",
            value: response.address.districtDesc.toString().replace(/อำเภอ|เขต/g, "")
          });
          self.idCardAddress.setField({
            fieldname: "province",
            value: response.address.provinceDesc.toString().replace(/จังหวัด/g, "")
          });
          self.setField({
            fieldname: "telephone",
            value: response.phoneNumber.toString()
          });
          self.error.tigger = false;
        } catch (e) {
          //---Beer05082021--
          self.error.tigger = true;
          self.error.title = "ไม่สามารถดึงข้อมูลได้";
          self.error.message =
            "ไม่สามารถดึงข้อมูลจากกรมการปกครองได้หรือเนื่องจากไม่ได้ Login โปรแกรม Government AMI";
          console.log(e);
          throw e;
        } finally {
          self.loading = false;
        }
      }

    }),
    requestsVerifyBorrower: flow(function* (requestType: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          firstname: self.firstname,
          lastname: self.lastname,
          idCardNo: self.idCardNo,
          requestType,
          birthday: self.birthDate
        };
        const result: any = yield RequestsVerifyBorrower.create(body);
        if (result.success) {
          self.setField({
            fieldname: "isVerify",
            value: true
          });
        }

        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "ตรวจสอบสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "ข้อมูลถูกตรวจสอบเรียบร้อยแล้ว"
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({ fieldname: "message", value: e.message });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack
        });
        self.setField({
          fieldname: "isVerify",
          value: false
        });
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    }),
    requestsVerifyGuarantor: flow(function* (requestType: string) {
      try {
        self.setField({ fieldname: "loading", value: true });
        const body = {
          firstname: self.firstname,
          lastname: self.lastname,
          idCardNo: self.idCardNo,
          requestType,
          birthday: self.birthDate
        };
        const result: any = yield RequestsVerifyGuarantor.create(body);
        if (result.success) {
          self.setField({
            fieldname: "isVerify",
            value: true
          });
        }

        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "ตรวจสอบสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "ข้อมูลถูกตรวจสอบเรียบร้อยแล้ว"
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({ fieldname: "message", value: e.message });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack
        });
        self.setField({
          fieldname: "isVerify",
          value: false
        });
        console.log(e);
        throw e;
      } finally {
        self.setField({ fieldname: "loading", value: false });
      }
    })
  }));
export type IProfileModel = typeof ProfileModel.Type;
