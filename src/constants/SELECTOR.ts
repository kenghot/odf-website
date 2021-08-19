export const STATUS_USER = [
  { key: "1", text: "เปิดใช้งาน", value: "1" },
  { key: "0", text: "ปิดใช้งาน", value: "0" }
];

export const SEQUENCE_TYPE = [
  { key: "0", text: "เอกสารคำร้อง", value: "request" },
  { key: "1", text: "เอกสารคำร้องออนไลน์", value: "requestOnline" },
  { key: "2", text: "เอกสารสัญญาเงินกู้", value: "agreement" },
  { key: "3", text: "เอกสารใบสำคัญรับ/จ่าย", value: "voucher" },
  { key: "4", text: "ใบเสร็จรับเงิน", value: "receipt" }
];

export const STEP_STATUS = [
  { key: "0", text: "รอดำเนินงาน", value: "0", description: "0" },
  { key: "1", text: "ทำหนังสือทวงถาม", value: "1", description: "1" },
  { key: "2", text: "ติดตาม ณ ภูมิลำเนา", value: "2", description: "2" },
  { key: "3", text: "ฟ้องร้องดำเนินคดี", value: "3", description: "3" }
];

export const STEP_STATUS_DIES = [
  { key: "0", text: "รอดำเนินงาน", value: "0", description: "0" },
  {
    key: "1",
    text: "สืบหาทายาท / ผู้จัดการมรดกของผู้กู้ยืม",
    value: "1",
    description: "1"
  },
  {
    key: "2",
    text: "แจ้งทายาทโดยธรรมที่มีสิทธิฯ / ผู้จัดการมรดกของผู้กู้",
    value: "2",
    description: "2"
  },
  { key: "3", text: "ฟ้องร้องดำเนินคดี", value: "3", description: "3" }
];

export const POS_ACTIVE = [
  { key: "0", text: "ปิดใช้งาน", value: "false" },
  { key: "1", text: "เปิดใช้งาน", value: "true" }
];
export const POS_ONLINE = [
  { key: "0", text: "ปิดบริการ", value: "false" },
  { key: "1", text: "เปิดบริการ", value: "true" }
];

export const DEATHNOTIFICATION = [
  { key: "0", text: "กรณีปกติ", value: "false" },
  { key: "1", text: "กรณีผู้กู้เสียชีวิต", value: "true" }
];
