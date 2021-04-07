import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { PageHeader } from "../../../components/project";
import DonationTabHeader from "./DonationTabHeader";

interface IDonationPageHeader extends WithTranslation {
  noneTabHeader?: boolean;
}
@observer
class DonationPageHeader extends React.Component<IDonationPageHeader> {
  public render() {
    const { t, noneTabHeader } = this.props;
    return (
      <React.Fragment>
        <PageHeader
          icon="money bill alternate"
          title={t("component.sidebar.donationSystem")}
          color="teal"
        />
        {noneTabHeader ? null : <DonationTabHeader />}
      </React.Fragment>
    );
  }
}
export default withTranslation()(DonationPageHeader);
