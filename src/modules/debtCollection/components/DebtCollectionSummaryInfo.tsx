import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { ListBlock } from "../../../components/common/block";
import { COLORS } from "../../../constants";
import { currency } from "../../../utils/format-helper";
import { IDebtCollectionModel } from "../DebtCollectionModel";

interface IDebtCollectionSummaryInfo extends WithTranslation {
  debtCollection: IDebtCollectionModel;
}

@observer
class DebtCollectionSummaryInfo extends React.Component<
  IDebtCollectionSummaryInfo
> {
  public render() {
    const { t, debtCollection } = this.props;
    const list = [
      {
        title: t(
          "module.debtCollection.debtCollectionSummaryInfo.repaymentRate"
        ),
        description: debtCollection.accountReceivable.paidRatio
          ? `${debtCollection.accountReceivable.paidRatio} %`
          : "-",
        url: ""
      },
      {
        title: t(
          "module.debtCollection.debtCollectionSummaryInfo.numberOverdueInstallments"
        ),
        description:
          debtCollection.accountReceivable.overDueInstallmentCount || "-",
        url: ""
      },
      {
        title: t(
          "module.debtCollection.debtCollectionSummaryInfo.outstandingAmount"
        ),
        description: currency(
          debtCollection.accountReceivable.overDueBalance,
          2
        ),
        url: ""
      },
      {
        title: t(
          "module.debtCollection.debtCollectionSummaryInfo.remainingContractPeriodMonth"
        ),
        description: debtCollection.diffMonths
          ? debtCollection.diffMonths
          : "-",
        url: ""
      },
      {
        title: t(
          "module.debtCollection.debtCollectionSummaryInfo.numberConsecutiveMonthsOutstanding"
        ),
        description:
          debtCollection.accountReceivable.unpaidMonthCountsInArow || "-",
        url: ""
      }
    ];

    return <ListBlock list={list} bgColor={COLORS.teal} textColor="white" />;
  }
}

export default withTranslation()(DebtCollectionSummaryInfo);
