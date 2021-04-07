import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { ErrorMessage, ErrorModel } from "../components/common/error";
import {
  DonationDirectByMonthReport,
  DonationAllowanceByMonthReport,
  DonationDirectByProvinceReport,
  DonationByAgeReport,
  DonationByGenderReport,
} from "../modules/report/containers";

interface IDonationReportListPage extends WithTranslation, RouteComponentProps {
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class DonationReportListPage extends React.Component<IDonationReportListPage> {
  private errorObject = ErrorModel.create({});
  public componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "reports",
    });
  }

  public render() {
    this.props.appStore!.setHeaderHeight();
    return (
      <Form size={"mini"}>
        <DonationDirectByMonthReport errorObject={this.errorObject} />
        <DonationAllowanceByMonthReport errorObject={this.errorObject} />
        <DonationDirectByProvinceReport errorObject={this.errorObject} />
        <DonationByAgeReport errorObject={this.errorObject} />
        <DonationByGenderReport errorObject={this.errorObject} />
        <ErrorMessage errorobj={this.errorObject} float timeout={3000} />
      </Form>
    );
  }

}

export default withRouter(withTranslation()(DonationReportListPage));
