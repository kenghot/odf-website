import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { IAppModel } from "../../../AppModel";
import { ListBlock } from "../../../components/common/block";
import { COLORS } from "../../../constants";
import { currency } from "../../../utils/format-helper";
import { IAccountReceivableModel } from "../AccountReceivableModel";

interface IARSummaryInfo extends WithTranslation {
  accountReceivable: IAccountReceivableModel;
  appStore?: IAppModel;
}
@inject("appStore")
@observer
class ARSummaryInfo extends React.Component<IARSummaryInfo> {
  public render() {
    const { accountReceivable, t, appStore } = this.props;
    const list = [
      {
        title: t("module.accountReceivable.arSummaryInfo.loan"),
        description: t("module.accountReceivable.arSummaryInfo.balance", {
          balance: currency(accountReceivable.loanAmount, 2)
        }),
        url: ""
      },
      {
        title: t("module.accountReceivable.arSummaryInfo.paymentAmount"),
        description: t("module.accountReceivable.arSummaryInfo.balance", {
          balance: currency(accountReceivable.totalPayment, 2)
        }),
        url: ""
      },
      {
        title: t("module.accountReceivable.arSummaryInfo.outstandingDebt"),
        description: t("module.accountReceivable.arSummaryInfo.balance", {
          balance: currency(accountReceivable.outstandingDebtBalance, 2)
        }),
        url: ""
      },
      {
        title: t(
          "module.accountReceivable.arSummaryInfo.accruedBalancePastDue"
        ),
        description: t("module.accountReceivable.arSummaryInfo.balance", {
          balance: currency(accountReceivable.control.overDueBalance, 2)
        }),
        url: ""
      },
      {
        title: t("module.accountReceivable.arSummaryInfo.repaymentStatus"),
        description:
          appStore!.enumItemLabel(
            "creditStatus",
            accountReceivable.control.status
          ) === "-"
            ? t("module.accountReceivable.arStatusIcon.waitingProcess")
            : appStore!.enumItemLabel(
                "creditStatus",
                accountReceivable.control.status
              ),
        url: ""
      }
    ];

    return <ListBlock list={list} bgColor={COLORS.teal} textColor="white" />;
  }
}

export default withTranslation()(ARSummaryInfo);
