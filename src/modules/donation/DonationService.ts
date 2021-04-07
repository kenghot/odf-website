import { ApiHelper } from "../../utils/api-helper";
const DonationAllowancesUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/donation_allowances`;
const DonationDirectsUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/donation_directs`;
const DonationAllowancesFileuploadUrl = `${process.env.REACT_APP_API_ENDPOINT}/api/v2/donation_allowances/fileupload`;

export const DonationDocUrl = `${process.env.REACT_APP_DOP_DOCS_ENDPOINT}`;

class DonationService extends ApiHelper {}
export const DonationAllowances = new DonationService(DonationAllowancesUrl);
export const DonationAllowancesFileupload = new DonationService(
  DonationAllowancesFileuploadUrl
);
export const DonationDirects = new DonationService(DonationDirectsUrl);
export const DonationDoc = new DonationService(DonationDocUrl);
