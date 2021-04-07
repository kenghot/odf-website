import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { ErrorMessage, ErrorModel } from "../components/common/error";
import {
  AccountRecievableReport,
  AgeingReport,
  CloseAccountReport,
  CommitteeResultReport,
  DisqualifyPersonalRequestReport,
  IncompletePersonalRequestReport,
  OperationReport,
  OverdueReport,
  PaymentReport,
  PersonalRequestByProvinceReport,
  PersonalRequestReport,
  PersonalRequestSummaryReport,
  RequestResultReport,
  ResultSummaryReport
} from "../modules/report/containers";
interface IAccountReceiveableReportListPage
  extends WithTranslation,
    RouteComponentProps {
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class AccountReceiveableReportListPage extends React.Component<
  IAccountReceiveableReportListPage
> {
  private errorObject = ErrorModel.create({});
  public componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "reports"
    });
  }

  public render() {
    const { history } = this.props;
    this.props.appStore!.setHeaderHeight();
    return (
      <Form size={"mini"}>
        {/* PersonalRequestReport = Report 1 */}
        <PersonalRequestReport errorObject={this.errorObject} />

        {/* AccountRecievableReport = Report 2 */}
        <AccountRecievableReport errorObject={this.errorObject} />

        {/* RequestResultReport = Report 3 */}
        <RequestResultReport errorObject={this.errorObject} />

        {/* OverdueReport = Report 4 */}
        <OverdueReport errorObject={this.errorObject} />

        {/* CloseAccountReport = Report 5 */}
        <CloseAccountReport errorObject={this.errorObject} />

        {/* CommitteeResultReport = Report 6 */}
        <CommitteeResultReport errorObject={this.errorObject} />

        {/* OperationReport = Report 7 */}
        <OperationReport errorObject={this.errorObject} />

        {/* AgeingReport = Report 8 */}
        <AgeingReport errorObject={this.errorObject} />

        {/* PersonalRequestByProvinceReport = Report 9 */}
        <PersonalRequestByProvinceReport errorObject={this.errorObject} />

        {/* PersonalRequestSummaryReport = Report 10 */}
        <PersonalRequestSummaryReport errorObject={this.errorObject} />

        {/* ResultSummaryReport = Report 11 */}
        <ResultSummaryReport errorObject={this.errorObject} />

        {/* IncompletePersonalRequestReport = Report 12 */}
        <IncompletePersonalRequestReport errorObject={this.errorObject} />

        {/* DisqualifyPersonalRequestReport = Report 13 */}
        <DisqualifyPersonalRequestReport errorObject={this.errorObject} />

        {/* PaymentReport = Report 14*/}
        <PaymentReport errorObject={this.errorObject} />
        <ErrorMessage errorobj={this.errorObject} float timeout={3000} />
      </Form>
    );
  }
}

export default withRouter(withTranslation()(AccountReceiveableReportListPage));
