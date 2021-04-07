import { ApiHelper } from "../../utils/api-helper";
const posUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/poses`;
const posShiftsUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/posshifts`;
const posesReceiptControlUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/poses/pos_receipt_control`;

class PosService extends ApiHelper {}

export const Pos = new PosService(posUrl);
export const PosShifts = new PosService(posShiftsUrl);
export const PosesReceiptControl = new PosService(posesReceiptControlUrl);
