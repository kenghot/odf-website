import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { PageTabHeader } from "../../../components/project";
import { hasPermission } from "../../../utils/render-by-permission";

interface IReportTabHeader extends WithTranslation {
  //
}
@observer
class ReportTabHeader extends React.Component<IReportTabHeader> {
  public render() {
    const { t } = this.props;
    const panes = [];

    if (hasPermission("REPORT.AR.ACESS")) {
      panes.push({
        id: "report-request-accountreceivable",
        title: t("component.sidebar.accountReceiveable"),
        pathname: "/reports/accountReceiveable"
      });
    }
    if (hasPermission("REPORT.CS.ACCESS")) {
      panes.push({
        id: "report-counterservice",
        title: t("component.sidebar.counterService"),
        pathname: "/reports/counterService"
      });
    }
    if (hasPermission("REPORT.KTB.ACCESS")) {
      panes.push({
        id: "report-ktb",
        title: t("component.sidebar.ktbReport"),
        pathname: "/reports/ktb"
      });
    }
    if (hasPermission("REPORT.DEBTCOLLECTION.ACCESS")) {
      panes.push({
        id: "report-debtcollection",
        title: t("component.sidebar.debtCollectionReport"),
        pathname: "/reports/debt_collection"
      });
    }
    if (hasPermission("REPORT.POS.RECIEPT.ACCESS")) {
      panes.push({
        id: "report-debtcollection",
        title: t("component.sidebar.debtRepaymentReport"),
        pathname: "/reports/debtRepayment"
      });
    }
    if (hasPermission("REPORT.DONATE.ACCESS")) {
      panes.push({
        id: "report-donation",
        title: t("component.sidebar.donationReport"),
        pathname: "/reports/donation"
      });
    }
    return <PageTabHeader panes={panes} />;
  }
}

export default withTranslation()(ReportTabHeader);
