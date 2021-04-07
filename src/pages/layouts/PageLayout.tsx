import { inject, observer } from "mobx-react";
import React from "react";
import { IAppModel } from "../../AppModel";
import { PageContainer } from "../../components/common/container";
import { PageHeader } from "../../components/project";
import FallBack from "./partials/FallBack";

const LoanPageHeader = React.lazy(
  () => import("../../modules/loan/containers/LoanPageHeader")
);
const AdminPageHeader = React.lazy(
  () => import("../../modules/admin/containers/AdminPageHeader")
);
const AccountReceivablePageHeader = React.lazy(
  () =>
    import(
      "../../modules/accountReceivable/containers/AccountReceivablePageHeader"
    )
);
const FinancialPageHeader = React.lazy(
  () => import("../../modules/finance/containers/FinancialPageHeader")
);
const DebtCollectionPageHeader = React.lazy(
  () =>
    import("../../modules/debtCollection/containers/DebtCollectionPageHeader")
);

const ReportsPageHeader = React.lazy(
  () => import("../../modules/report/containers/ReportsPageHeader")
);
const PosPageHeader = React.lazy(
  () => import("../../modules/pos/component/PosPageHeader")
);
const DonationPageHeader = React.lazy(
  () => import("../../modules/donation/containers/DonationPageHeader")
);

interface IPageLayout {
  children?: any;
  appStore?: IAppModel;
  paddingLeft?: string;
}

@inject("appStore")
@observer
class PageLayout extends React.Component<IPageLayout> {
  public render() {
    const { paddingLeft } = this.props;
    return (
      <React.Fragment>
        <FallBack inverted>
          <div
            id={"MainLayoutHeader"}
            style={{ ...styles.top, left: paddingLeft }}
          >
            {this.renderHeader()}
          </div>
        </FallBack>
        <PageContainer>
          <FallBack>{this.props.children}</FallBack>
        </PageContainer>
      </React.Fragment>
    );
  }
  private renderHeader() {
    switch (this.props.appStore!.pageHeader) {
      case "admin":
        return <AdminPageHeader />;
      case "loan":
        return <LoanPageHeader />;
      case "loanNoneTabHeader":
        return <LoanPageHeader noneTabHeader />;
      case "accountReceivable":
        return <AccountReceivablePageHeader />;
      case "finance":
        return <FinancialPageHeader />;
      case "debtCollection":
        return <DebtCollectionPageHeader />;
      case "reports":
        return <ReportsPageHeader />;
      case "pos":
        return <PosPageHeader />;
      case "donation":
        return <DonationPageHeader />;
      case "donationNoneTabHeader":
        return <DonationPageHeader noneTabHeader />;
      default:
        return <PageHeader />;
    }
  }
}
const styles: any = {
  top: {
    position: "fixed",
    top: 0,
    right: 0,
    zIndex: 1000,
  },
};
export default PageLayout;
