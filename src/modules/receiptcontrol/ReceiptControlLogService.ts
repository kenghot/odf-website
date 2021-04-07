import { ApiHelper } from "../../utils/api-helper";
const ReceiptControlLogUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/receipts_control_log`;

class ReceiptControlLogService extends ApiHelper {}

export const ReceiptControlLogAPI = new ReceiptControlLogService(
  ReceiptControlLogUrl
);
