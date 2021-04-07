import { ApiHelper } from "../../../utils/api-helper";
const RequestValidationUrl = `${process.env.REACT_APP_API_ENDPOINT}/config/request_validation_checklist`;

interface IRequestValidationGet {
    //
}

class RequestValidationService extends ApiHelper { }

export const RequestValidationAPI = new RequestValidationService(RequestValidationUrl);
