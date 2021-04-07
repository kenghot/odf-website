import { ApiHelper } from "../../utils/api-helper";
const ReportUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/reports`;

class ReportService extends ApiHelper {}

export const Report = new ReportService(ReportUrl);
