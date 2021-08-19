import { ApiHelper } from "../../utils/api-helper";
const AccountReceivablesUrl = `${process.env.REACT_APP_API_ENDPOINT
    }/api/v2/account_receivables`;

export interface IAccountReceivableGet {
    documentNumber?: string;
    organizationId?: number;
    agreementType?: "P" | "G";
    firstname?: string;
    lastname?: string;
    idCardNo?: string;
    name?: string;
    guarantorFirstname?: string;
    guarantorLastname?: string;
    guarantorIdCardNo?: string;
    startDate?: string;
    endDate?: string;
    status?: "NW" | "WT" | "DN" | "CL";
    currentPage?: string;
    perPage?: string;
    fiscalYear?: string;
}

class AccountReceivablesService extends ApiHelper { }

export const AccountReceivable = new AccountReceivablesService(
    AccountReceivablesUrl,
);
