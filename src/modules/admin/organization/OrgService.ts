import { ApiHelper } from "../../../utils/api-helper";

const orgUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/organizations`;
class OrgService extends ApiHelper {}

export const Org = new OrgService(orgUrl);
