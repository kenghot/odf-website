import { ApiHelper } from "../../utils/api-helper";
const DebtCollectionsUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/debtcollections`;
const DebtCollectionListUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/account_receivables/debtcollections`;
const DebtCollectionLetterUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/debtcollections/letters`;
const LetterUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/letters`;
const MemoUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/memos`;
const VisitUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/visits`;
const reportUrl = `${process.env.REACT_APP_DEBT_ENDPOINT}`;

class DebtCollectionsService extends ApiHelper {}
export const DebtCollection = new DebtCollectionsService(DebtCollectionsUrl);
export const DebtCollectionList = new DebtCollectionsService(
  DebtCollectionListUrl
);
export const DebtCollectionLetter = new DebtCollectionsService(
  DebtCollectionLetterUrl
);
export const Letter = new DebtCollectionsService(LetterUrl);
export const Visit = new DebtCollectionsService(VisitUrl);
export const Memo = new DebtCollectionsService(MemoUrl);
export const DebtReport = new DebtCollectionsService(reportUrl);
