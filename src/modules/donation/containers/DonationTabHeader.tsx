import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { PageTabHeader } from "../../../components/project";
import { hasPermission } from "../../../utils/render-by-permission";

interface IDonationTabHeader extends WithTranslation {
  //
}
@observer
class DonationTabHeader extends React.Component<IDonationTabHeader> {
  public render() {
    const { t } = this.props;
    const panes = [];

    if (hasPermission("DONATE.ALLOWANCE.ACCESS")) {
      panes.push({
        id: "1",
        title: t("component.sidebar.elderlyLivingAllowanceDonation"),
        pathname: "/donation/allowances",
      });
    }
    if (hasPermission("DONATE.DIRECT.ACCESS")) {
      panes.push({
        id: "2",
        title: t("component.sidebar.donateMoneyToFund"),
        pathname: "/donation/directs",
      });
    }
    if (hasPermission("DONATE.ANALYSIS.ACCESS")) {
      panes.push({
        id: "3",
        title: t("component.sidebar.dataAnalysis"),
        pathname: "/donation/analysis",
      });
    }
    return <PageTabHeader panes={panes} />;
  }
}

export default withTranslation()(DonationTabHeader);
