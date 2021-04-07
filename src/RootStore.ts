import appStore from "./AppModel";
import { AccountReceivableListModel } from "./modules/accountReceivable/AccountReceivableListModel";
import { OrgListModel } from "./modules/admin/organization/OrgListModel";
import { SequenceListModel } from "./modules/admin/sequence/SequenceListModel";
import { UserListModel } from "./modules/admin/user/UserListModel";
import authStore from "./modules/auth/AuthModel";
import { DebtCollectionListModel } from "./modules/debtCollection/DebtCollectionListModel";
import { DonationAllowanceListModel } from "./modules/donation/DonationAllowanceListModel";
import { DonationDirectListModel } from "./modules/donation/DonationDirectListModel";
import { VoucherListModel } from "./modules/finance/voucher/VoucherListModel";
import { AgreementListModel } from "./modules/loan/agreement/AgreementListModel";
import { GuaranteeListModel } from "./modules/loan/guarantee/GuaranteeListModel";
import { RequestListModel } from "./modules/loan/request/RequestListModel";
import { RequestModel } from "./modules/loan/request/RequestModel";
import { PosListModel } from "./modules/pos/PosListModel";
import { PosShiftModel } from "./modules/pos/PosModel";
import { PosShiftLogListModel } from "./modules/pos/PosShiftLogListModel";
import { ReceiptListModel } from "./modules/receipt/ReceiptListModel";
import { ReceiptControlLogListModel } from "./modules/receiptcontrol";

const searchUserListStore = UserListModel.create({});
const searchOrgListStore = OrgListModel.create({});
const searchSequenceListStore = SequenceListModel.create({});
const searchAgreementListStore = AgreementListModel.create({});
const searchRequestListStore = RequestListModel.create({});
const searchGuaranteeListStore = GuaranteeListModel.create({});
const searchAccountReceivableListStore = AccountReceivableListModel.create({});
const searchVoucherListStore = VoucherListModel.create({});
const searchDebtCollectionListPageStore = DebtCollectionListModel.create({});
const searchDonationAllowanceListStore = DonationAllowanceListModel.create({});
const searchDonationDirectListStore = DonationDirectListModel.create({});
const requestCreate = RequestModel.create({});
const posListStore = PosListModel.create({});
const receiptListStore = ReceiptListModel.create({});
const receiptControlLogListStore = ReceiptControlLogListModel.create({});
const posesReceiptControlListStore = PosListModel.create({});
const targetPosShift = PosShiftModel.create({});
const targetPosShiftLogList = PosShiftLogListModel.create({});

const RootStore = {
  appStore,
  authStore,
  searchUserListStore,
  searchOrgListStore,
  searchSequenceListStore,
  searchRequestListStore,
  searchAgreementListStore,
  searchGuaranteeListStore,
  searchAccountReceivableListStore,
  searchVoucherListStore,
  searchDebtCollectionListPageStore,
  searchDonationAllowanceListStore,
  searchDonationDirectListStore,
  requestCreate,
  posListStore,
  receiptListStore,
  receiptControlLogListStore,
  posesReceiptControlListStore,
  targetPosShift,
  targetPosShiftLogList,
};

export default RootStore;
