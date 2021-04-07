import { ApiHelper } from "../../../utils/api-helper";
const AttachedfilesUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v1/attachedfiles`;
class RequestsService extends ApiHelper {}
export const Attachedfile = new RequestsService(AttachedfilesUrl);

