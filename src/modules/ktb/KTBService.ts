import { ApiHelper } from "../../utils/api-helper";
const KTBUrl = `${process.env.REACT_APP_KTB_ENDPOINT}/logs`;

class KTBService extends ApiHelper {}

export const KTB = new KTBService(KTBUrl);
