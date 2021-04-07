import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form, Grid } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { IErrorModel } from "../../../components/common/error/ErrorModel";
import { FiscalYearDDL } from "../../../components/project/year";
import { SearchOverdueByDateRange } from "../../../components/search";
import { AccountReceivable } from "../../accountReceivable/AccountReceivablesService";
import { ReportCard } from "../components";

interface IPaymentReport extends WithTranslation, RouteComponentProps {
  appStore?: IAppModel;
  errorObject: IErrorModel;
}

@inject("appStore")
@observer
class PaymentReport extends React.Component<IPaymentReport> {
  public state = { fiscalYear: "", startPaidDate: "", endPaidDate: "" };
  public render() {
    const { appStore, t } = this.props;
    return (
      <ReportCard
        title={t("module.report.PaymentReport.title")}
        filter={
          <Grid columns={"equal"} doubling stackable>
            <Grid.Column>
              <Form.Field
                label={t("module.report.public.fiscalYear")}
                control={FiscalYearDDL}
                placeholder={t("module.report.public.pleaseSelectFiscalYear")}
                value={this.state.fiscalYear}
                onChange={this.onSelectedFiscalYear}
              />
            </Grid.Column>
            <Grid.Column width={16}>
              <Form.Field
                label={t("module.report.public.chooseAccordingPaidDate")}
                width={16}
                control={SearchOverdueByDateRange}
                onChangeInputField={this.onSelectedDocumentDate}
                idInputFieldNameStartDate={"paymentReportStartDocumentDate"}
                inputFieldNameStartDate="startPaidDate"
                idInputFieldNameEndDate={"paymentReportEndDocumentDate"}
                inputFieldNameEndDate="endPaidDate"
                valueFieldNameStartDate={this.state.startPaidDate}
                valueFieldNameEndDate={this.state.endPaidDate}
                size="mini"
                clearable
              />
            </Grid.Column>
          </Grid>
        }
        onGetReport={this.onGetReport}
      />
    );
  }

  private onSelectedFiscalYear = (value: any) => {
    this.setState({ fiscalYear: value });
  };

  private onSelectedDocumentDate = (fieldName: string, value: any) => {
    this.setState({ [fieldName]: value });
  };

  private onGetReport = async () => {
    const { errorObject } = this.props;
    try {
      await AccountReceivable.get(
        {
          fiscalYear: this.state.fiscalYear,
          startPaidDate: this.state.startPaidDate,
          endPaidDate: this.state.endPaidDate
        },
        { name: "printPaymentReport" }
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
