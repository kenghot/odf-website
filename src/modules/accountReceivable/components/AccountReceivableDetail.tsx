import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Segment } from "semantic-ui-react";
import {
  AccountReceivableBorrowerGuarantorInfo,
  AccountReceivableControlTable,
  AccountReceivableHeader,
  AccountReceivableReferenceDocument,
  AccountReceivableTransactionTable
} from ".";
import { ListBlock } from "../../../components/common/block";
import { PermissionControl } from "../../../components/permission";
import { date_display_CE_TO_BE } from "../../../utils";
import { IAccountReceivableModel } from "../AccountReceivableModel";
import ARSummaryInfo from "./ARSummaryInfo";

interface IAccountReceivableDetail extends WithTranslation {
  accountReceivable: IAccountReceivableModel;
  editMode?: boolean;
}
@observer
class AccountReceivableDetail extends React.Component<
  IAccountReceivableDetail
> {
  public render() {
    const { accountReceivable, editMode } = this.props;
    return (
      <Segment padded="very">
        <AccountReceivableHeader
          accountReceivableStatus={accountReceivable.status}
          accountReceivable={accountReceivable}
          disableEditBtn={editMode}
        />
        <ARSummaryInfo accountReceivable={accountReceivable} />
        {this.renderDocumentTrackDate()}
        <AccountReceivableReferenceDocument
          accountReceivable={accountReceivable}
        />
        <AccountReceivableBorrowerGuarantorInfo
          accountReceivable={accountReceivable}
          editMode={editMode}
        />
        <PermissionControl codes={["AR.TRANSACTION.VIEW"]}>
          <AccountReceivableTransactionTable
            accountReceivable={accountReceivable}
          />
        </PermissionControl>
        <AccountReceivableControlTable accountReceivable={accountReceivable} />
      </Segment>
    );
  }
  private renderDocumentTrackDate() {
    const { accountReceivable, t } = this.props;
    const list = [];
    if (accountReceivable.documentDate) {
      list.push({
        title: t(
          "module.accountReceivable.accountReceivableDetail.accountOpeningDate"
        ),
        description:
          date_display_CE_TO_BE(accountReceivable.documentDate) || "-",
        url: ""
      });
    }
    if (accountReceivable.startDate) {
      list.push({
        title: t(
          "module.accountReceivable.accountReceivableDetail.accountStartDate"
        ),
        description: date_display_CE_TO_BE(accountReceivable.startDate) || "-",
        url: ""
      });
    }
    if (accountReceivable.endDate) {
      list.push({
        title: t(
          "module.accountReceivable.accountReceivableDetail.accountDueDate"
        ),
        description: date_display_CE_TO_BE(accountReceivable.endDate) || "-",
        url: ""
      });
    }
    if (accountReceivable.closeDate) {
      list.push({
        title: t(
          "module.accountReceivable.accountReceivableDetail.accountClosingDate"
        ),
        description: date_display_CE_TO_BE(accountReceivable.closeDate),
        url: ""
      });
    }
    if (accountReceivable.debtAcknowledgement.acknowledgeDate) {
      list.push({
        title: t(
          "module.accountReceivable.accountReceivableDetail.acknowledgeDate"
        ),
        description: date_display_CE_TO_BE(
          accountReceivable.debtAcknowledgement.acknowledgeDate
        ),
        url: ""
      });
    }

    return list.length > 0 ? <ListBlock list={list} /> : null;
  }
}

export default withTranslation()(AccountReceivableDetail);
