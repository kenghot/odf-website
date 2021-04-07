import { ApiHelper } from "../../../utils/api-helper";
const agreementUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/agreements`;
const agreementRequestsUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/agreements/requests`;


export interface IAgreementsGet {
  documentNumber?: string;
  organizationId?: number;
  agreementType?: string;
  firstname?: string;
  lastname?: string;
  idCardNo?: string;
  name?: string;
  guarantorFirstname?: string;
  guarantorLastname?: string;
  guarantorIdCardNo?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  fiscalYear?: string;
  currentPage?: string;
  perPage?: string;
}

class AgreementService extends ApiHelper {}

export const Agreement = new AgreementService(agreementUrl);
export const AgreementRequests = new AgreementService(agreementRequestsUrl);

