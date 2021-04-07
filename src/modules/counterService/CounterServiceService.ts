import { ApiHelper } from "../../utils/api-helper";
const CounterServiceUrl = `${
    process.env.REACT_APP_API_ENDPOINT
}/api/v2/counterservices`;

class CounterServiceService extends ApiHelper {}

export const CounterService = new CounterServiceService(
    CounterServiceUrl,
);
