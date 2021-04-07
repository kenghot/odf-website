import { ApiHelper } from "../../utils/api-helper";
const receiptsUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/receipts`;
const reportUrl = `${process.env.REACT_APP_ACC_ENDPOINT}`;

class ReceiptService extends ApiHelper {}

export const Receipt = new ReceiptService(receiptsUrl);
export const accReport = new ReceiptService(reportUrl);
