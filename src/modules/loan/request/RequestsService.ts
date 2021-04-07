import { ApiHelper } from "../../../utils/api-helper";
const RequestsUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/requests`;
const RequestsVerifyBorrowerUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/requests/verify_borrower`;
const RequestsVerifyGuarantorUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/requests/verify_guarantor`;

export interface IRequestGet {
  documentNumber?: string;
  organizationId?: number;
  requestType?: string;
  firstname?: string;
  lastname?: string;
  idCardNo?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  fiscalYear?: string;
  status?: string;
  currentPage?: string;
  perPage?: string;
}

class RequestsService extends ApiHelper {}

export const Request = new RequestsService(RequestsUrl);
export const RequestsVerifyBorrower = new RequestsService(
  RequestsVerifyBorrowerUrl
);
export const RequestsVerifyGuarantor = new RequestsService(
  RequestsVerifyGuarantorUrl
);
