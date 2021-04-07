import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { PageTabHeader } from "../../../components/project";
import { hasPermission } from "../../../utils/render-by-permission";

interface IPosTabHeader extends WithTranslation {
  //
}
@observer
class PosTabHeader extends React.Component<IPosTabHeader> {
  public render() {
    const { t } = this.props;
    const panes = [];

    if (hasPermission("POS.USAGE.ACCESS")) {
      panes.push({
        id: "1",
        title: t("component.sidebar.accessPointOfPayment"),
        pathname: "/pos/cashier"
      });
    }
    if (hasPermission("POS.ACCESS")) {
      panes.push({
        id: "2",
        title: t("component.sidebar.paymentPoint"),
        pathname: "/pos/management"
      });
    }
    if (hasPermission("POS.RECEIPTS.ACCESS")) {
      panes.push({
        id: "3",
        title: t("component.sidebar.paymentTransaction"),
        pathname: "/pos/receipt_payment"
      });
    }
    if (hasPermission("POS.RECEIPTCONTROLS.ACCESS")) {
      panes.push({
        id: "4",
        title: t("component.sidebar.receiptControl"),
        pathname: "/pos/receipt_control"
      });
    }
    return <PageTabHeader panes={panes} />;
  }
}

export default withTranslation()(PosTabHeader);
