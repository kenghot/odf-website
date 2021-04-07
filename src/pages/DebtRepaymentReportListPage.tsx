import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { ErrorMessage, ErrorModel } from "../components/common/error";
import {
  CancelRepaymentReport,
  DebtRepaymentByOrganizeReport,
  DebtRepaymentByTypeReport,
  OverallRepaymentReport,
  ReceiptReprintReport,
} from "../modules/report/containers";

interface IDebtRepaymentReportListPage extends WithTranslation, RouteComponentProps {
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class DebtRepaymentReportListPage extends React.Component<IDebtRepaymentReportListPage> {
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
        <DebtRepaymentByTypeReport errorObject={this.errorObject} />
        <DebtRepaymentByOrganizeReport errorObject={this.errorObject} />
        <CancelRepaymentReport errorObject={this.errorObject} />
        <ReceiptReprintReport errorObject={this.errorObject} />
        <OverallRepaymentReport errorObject={this.errorObject} />

        <ErrorMessage errorobj={this.errorObject} float timeout={3000} />
      </Form>
    );
  }

  private onSetLoading = (loading: boolean) => {
    this.setState({ loading });
  };
}

export default withRouter(withTranslation()(DebtRepaymentReportListPage));
