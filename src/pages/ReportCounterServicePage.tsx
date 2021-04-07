import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { ErrorMessage, ErrorModel } from "../components/common/error";
import {
  CancelPaymentReport,
  PaymentReport,
  TransactionLogReport
} from "../modules/report/counterservice";
interface IReportCounterServicePage
  extends WithTranslation,
    RouteComponentProps {
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class ReportCounterServicePage extends React.Component<
  IReportCounterServicePage
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
        {/* Payment report via Counter Service*/}
        <PaymentReport errorObject={this.errorObject} />

        {/* Cancel Payment via Counter Service Report */}
        <CancelPaymentReport errorObject={this.errorObject} />

        {/* Counter Service Transaction Log Report */}
        <TransactionLogReport errorObject={this.errorObject} />

        <ErrorMessage errorobj={this.errorObject} float timeout={3000} />
      </Form>
    );
  }
}

export default withRouter(withTranslation()(ReportCounterServicePage));
