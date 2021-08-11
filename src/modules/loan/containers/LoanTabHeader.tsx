import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { PageTabHeader } from "../../../components/project";
import { hasPermission } from "../../../utils/render-by-permission";

interface ILoanTabHeader extends WithTranslation {
  //
}
@observer
class LoanTabHeader extends React.Component<ILoanTabHeader> {
  public render() {
    const { t } = this.props;
    const panes = [];

    if (hasPermission("REQUEST.ACCESS") || hasPermission("REQUEST.ONLINE.ACCESS")) {
      // เข้าถึงระบบงานคำร้องขอกู้ยืมฯ
      panes.push({
        id: "1",
        title: t("module.loan.loanTabHeader.loanRequest"),
        pathname: "/loan/request"
      });
    }

    if (hasPermission("AGREEMENT.ACCESS")) {
      // เข้าถึงระบบงานสัญญากู้ยืมฯ
      panes.push({
        id: "2",
        title: t("module.loan.loanTabHeader.loanContractWork"),
        pathname: "/loan/agreement"
      });
    }

    if (hasPermission("GUANRANTEE.ACCESS")) {
      // เข้าถึงระบบงานหนังสือสัญญาค้ำประกันการกู้ยืมฯ
      panes.push({
        id: "3",
        title: t("module.loan.loanTabHeader.loanGuaranteeContractWork"),
        pathname: "/loan/guarantee"
      });
    }

    return <PageTabHeader panes={panes} />;
  }
}

export default withTranslation()(LoanTabHeader);
