import { ApiHelper } from "../../../utils/api-helper";

const orgUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v1/sequencies`;

class SequenceService extends ApiHelper {}

export const Sequence = new SequenceService(orgUrl);
