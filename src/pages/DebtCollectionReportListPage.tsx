import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { ErrorMessage, ErrorModel } from "../components/common/error";
import {
  AccountClosingReport,
  ContractExpireReport,
  DebtAdjustmentReport,
  DebtorLitigationReport,
  DebtRepaymentReport,
  DefaultStatisticsReport,
  OutstandingAccountReceivableReport,
  OutstandingByProvinceAndRegionReport,
  SummaryReportForLoansByOccupation,
  VisitReport,
} from "../modules/report/containers";

interface IDebtCollectionReportListPage
  extends WithTranslation,
    RouteComponentProps {
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class DebtCollectionReportListPage extends React.Component<
  IDebtCollectionReportListPage
> {
  private errorObject = ErrorModel.create({});
  public componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "reports",
    });
  }

  public render() {
    const { history } = this.props;
    this.props.appStore!.setHeaderHeight();
    return (
      <Form size={"mini"}>
        <DebtorLitigationReport errorObject={this.errorObject} />
        <DebtRepaymentReport errorObject={this.errorObject} />
        <DebtAdjustmentReport errorObject={this.errorObject} />
        <AccountClosingReport errorObject={this.errorObject} />
        <OutstandingAccountReceivableReport errorObject={this.errorObject} />
        <OutstandingByProvinceAndRegionReport errorObject={this.errorObject} />
        <VisitReport errorObject={this.errorObject} />
        <DefaultStatisticsReport errorObject={this.errorObject} />
        <SummaryReportForLoansByOccupation errorObject={this.errorObject} />
        <ContractExpireReport errorObject={this.errorObject} />

        <ErrorMessage errorobj={this.errorObject} float timeout={3000} />
      </Form>
    );
  }

  private onSetLoading = (loading: boolean) => {
    this.setState({ loading });
  };
}

export default withRouter(withTranslation()(DebtCollectionReportListPage));
