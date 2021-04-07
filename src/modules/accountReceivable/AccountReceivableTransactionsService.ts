import { ApiHelper } from "../../utils/api-helper";
const AccountReceivableTransactionsUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/account_receivable_transactions`;

class AccountReceivableTransactionsService extends ApiHelper {}

export const AccountReceivableTransactions = new AccountReceivableTransactionsService(
  AccountReceivableTransactionsUrl
);
