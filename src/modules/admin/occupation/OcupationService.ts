import { ApiHelper } from "../../../utils/api-helper";

const ocupationUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/occupations`;

class OcupationService extends ApiHelper {}

export const Ocupation = new OcupationService(ocupationUrl);
