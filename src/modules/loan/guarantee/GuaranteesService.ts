import { ApiHelper } from "../../../utils/api-helper";
const guaranteesUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/guarantees`;

export interface IGuaranteeGet {
    documentNumber?: string;
    organizationId?: number;
    guaranteeType?: string;
    firstname?: string;
    lastname?: string;
    idCardNo?: string;
    name?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    fiscalYear?: string;
    currentPage?: string;
    perPage?: string;
}

class GuaranteesService extends ApiHelper {}

export const Guarantee = new GuaranteesService(guaranteesUrl);
