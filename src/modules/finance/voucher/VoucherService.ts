import { ApiHelper } from "../../../utils/api-helper";
const vouchersUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/vouchers`;

export interface IVoucherFilterBody {
  documentNumber: string;
  organizationId: string;
  refDocumentNumber: string;
  refType: string;
  firstname: string;
  lastname: string;
  idCardNo: string;
  startDate: string;
  endDate: string;
  fiscalYear: string;
  status: string;
  perPage: number;
  currentPage: number;
}

export interface IKTBCreate {
  ids: string[];
  effectiveDate: string;
}
export interface IKTBUpdate {
  ktb: File;
}

class VoucherService extends ApiHelper { }

export const vouchersAPI = new VoucherService(vouchersUrl);
