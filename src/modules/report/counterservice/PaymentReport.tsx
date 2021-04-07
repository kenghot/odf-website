import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form, Grid } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { IErrorModel } from "../../../components/common/error/ErrorModel";
import { OrganizationDDL } from "../../admin/organization/components";
import { OrgListModel } from "../../admin/organization/OrgListModel";
import { CounterService } from "../../counterService/CounterServiceService";
import { DateFilterDDL, ReportCard } from "../components";

interface IPaymentReport
  extends WithTranslation,
    RouteComponentProps {
  appStore?: IAppModel;
  errorObject: IErrorModel;
}

@inject("appStore")
@observer
class PaymentReport extends React.Component<
  IPaymentReport
> {
  private orgList = OrgListModel.create({});

  public state = {
    paidDate: "",
    yearMonth: undefined,
    startDocumentDate: "",
    endDocumentDate: "",
    organizationId: ""
  };
  public render() {
    const { appStore, t } = this.props;
    return (
      <ReportCard
        title={t("module.report.PaymentviaCounterServiceReport.title")}
        filter={
          <Grid doubling stackable>
            <Grid.Column width={"10"}>
              <DateFilterDDL
                paidDateId={"paymentviaCounterServiceReportPaidDate"}
                paidDateValue={this.state.paidDate}
                paidDateFieldName={"paidDate"}
                monthId={"paymentviaCounterServiceReportMonth"}
                monthValue={this.state.yearMonth}
                monthFieldName={"yearMonth"}
                onSelectedMonth={this.onSelectedYearMonth}
                startDocumentDateId={
                  "paymentviaCounterServiceReportStartDocumentDate"
                }
                startDocumentDateValue={this.state.startDocumentDate}
                startDocumentDateFieldName={"startDocumentDate"}
                endDocumentDateId={
                  "paymentviaCounterServiceReportEndDocumentDate"
                }
                endDocumentDateValue={this.state.endDocumentDate}
                endDocumentDateFieldName={"endDocumentDate"}
                onSelectedDocumentDate={this.onSelectedDocumentDate}
              />
            </Grid.Column>
            <Grid.Column width={"6"}>
              <Form.Field
                label={t("module.report.public.organization")}
                control={OrganizationDDL}
                orgList={this.orgList}
                value={this.state.organizationId}
                onChange={this.onSelectedOrganizeDDL}
              />
            </Grid.Column>
          </Grid>
        }
        onGetReport={this.onGetReport}
      />
    );
  }

  private onSelectedDocumentDate = (fieldName: string, value: any) => {
    this.setState({ [fieldName]: value });
  };

  private onSelectedYearMonth = (fieldName: string, value: any) => {
    this.setState({ yearMonth: value });
  };

  private onSelectedOrganizeDDL = (value: any) => {
    this.setState({ organizationId: value });
  };

  private onGetReport = async () => {
    const { errorObject } = this.props;
    try {
      await CounterService.get(
        {
          paidDate: this.state.paidDate,
          yearMonth: this.state.yearMonth,
          startDocumentDate: this.state.startDocumentDate,
          endDocumentDate: this.state.endDocumentDate,
          organizationId: this.state.organizationId
        },
        { name: "printPaymentviaCounterServiceReport" }
      );
    } catch (e) {
      errorObject.setField({ fieldname: "tigger", value: true });
      errorObject.setField({ fieldname: "code", value: e.code });
      errorObject.setField({ fieldname: "title", value: e.name });
      errorObject.setField({ fieldname: "message", value: e.message });
      errorObject.setField({
        fieldname: "technical_stack",
        value: e.technical_stack
      });
    }
  };
}

export default withRouter(withTranslation()(PaymentReport));
