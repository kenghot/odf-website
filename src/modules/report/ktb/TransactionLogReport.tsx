import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { IErrorModel } from "../../../components/common/error/ErrorModel";
import { CSZoneDDL } from "../../../components/counterservice";
import { DateFilterDDL, ReportCard } from "../components";
import { Report } from "../ReportService";

interface ITransactionLogReport extends WithTranslation, RouteComponentProps {
  appStore?: IAppModel;
  errorObject: IErrorModel;
}

@inject("appStore")
@observer
class TransactionLogReport extends React.Component<ITransactionLogReport> {
  public state = {
    paidDate: "",
    yearMonth: undefined,
    startDocumentDate: "",
    endDocumentDate: "",
    zone: ""
  };
  public render() {
    const { appStore, t } = this.props;
    return (
      <ReportCard
        title={t("module.report.KTBLogReport.title")}
        filter={
          <Grid doubling stackable>
            <Grid.Column width={"10"}>
              <DateFilterDDL
                paidDateId={"counterServiceTransactionLogReportPaidDate"}
                paidDateValue={this.state.paidDate}
                paidDateFieldName={"paidDate"}
                monthId={"counterServiceTransactionLogReportMonth"}
                monthValue={this.state.yearMonth}
                monthFieldName={"yearMonth"}
                onSelectedMonth={this.onSelectedYearMonth}
                startDocumentDateId={
                  "counterServiceTransactionLogReportStartDocumentDate"
                }
                startDocumentDateValue={this.state.startDocumentDate}
                startDocumentDateFieldName={"startDocumentDate"}
                endDocumentDateId={
                  "counterServiceTransactionLogReportEndDocumentDate"
                }
                endDocumentDateValue={this.state.endDocumentDate}
                endDocumentDateFieldName={"endDocumentDate"}
                onSelectedDocumentDate={this.onSelectedDocumentDate}
              />
            </Grid.Column>
            <Grid.Column width={"6"}>
              <CSZoneDDL
                value={this.state.zone}
                label={t("module.report.public.csZone")}
                placeholder={t("module.report.public.pleaseSelectCSZone")}
                onChange={this.onSelectedZone}
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

  private onSelectedZone = (value: any) => {
    this.setState({ zone: value });
  };

  private onGetReport = async () => {
    const { errorObject } = this.props;
    try {
      await Report.get(
        {
          paidDate: this.state.paidDate,
          yearMonth: this.state.yearMonth,
          startDocumentDate: this.state.startDocumentDate,
          endDocumentDate: this.state.endDocumentDate,
          zone: this.state.zone
        },
        { name: "printKTBTransactionLogReport" }
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

export default withRouter(withTranslation()(TransactionLogReport));
