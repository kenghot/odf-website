import { request } from "../../utils";
import { ApiHelper, IApiResponse } from "../../utils/api-helper";
const factsheetUrl = `${process.env.REACT_APP_API_ENDPOINT}/config/fact_sheet`;
const configUrl = `${process.env.REACT_APP_API_ENDPOINT}/config`;

class ConfigService extends ApiHelper {}
export const Factsheet = new ConfigService(factsheetUrl);
export const Config = new ConfigService(configUrl);
