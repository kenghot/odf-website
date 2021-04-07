import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { PageTabHeader } from "../../../components/project";
import { hasPermission } from "../../../utils/render-by-permission";

interface IFinancialTabHeader extends WithTranslation {
  //
}
@observer
class FinancialTabHeader extends React.Component<IFinancialTabHeader> {
  public render() {
    const { t } = this.props;
    const panes = [];

    if (hasPermission("VOUCHER.ACCESS")) { // เข้าถึงระบบงานจ่ายเงินกู้ยืมฯ
      panes.push(
        {
          id: "1",
          title: t("module.finance.FinancialTabHeader.loanPaymentSystem"),
          pathname: "/finance/loan_payment"
        },
      );
    }

    // panes.push(
    //   {
    //     id: "2",
    //     title: t("module.finance.FinancialTabHeader.payLoanSystem"),
    //     pathname: "/finance/installment_payment"
    //   },
    // );
    return <PageTabHeader panes={panes} />;
  }
}

export default withTranslation()(FinancialTabHeader);
