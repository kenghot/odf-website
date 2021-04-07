import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form, Grid } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { IErrorModel } from "../../../components/common/error/ErrorModel";
import { ReportCard } from "../components";
import { FiscalYearDDL } from "../../../components/project/year";
import ProvinceDDL from "../../../components/address/ProvinceDDL";
import { LocationModel } from "../../../components/address";
import { fetchNoService } from "../../../utils/request-noservice";
import { DonationDocUrl } from "../../donation/DonationService";
import { DateInput } from "../../../components/common";

interface IDonationDirectByProvinceReport
  extends WithTranslation,
    RouteComponentProps {
  errorObject: IErrorModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class DonationDirectByProvinceReport extends React.Component<IDonationDirectByProvinceReport> {
  public state = { fiscalYear: "", yearMonth: "" };
  public locationStore = LocationModel.create({});

  public render() {
    const { appStore, t } = this.props;
    return (
      <ReportCard
        title={t("page.DonationReportListPage.report03")}
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
            <Grid.Column>
              <Form.Field
                label={t("module.report.DateFilterDDL.month")}
                control={DateInput}
                type="month"
                formatdate="MMMM"
                value={this.state.yearMonth}
                fieldName={"yearMonth"}
                onChangeInputField={this.onSelectedMonth}
                // id={"paymentviaCounterServiceReportMonth"}
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
  private onSelectedYearMonth = (fieldName: string, value: any) => {
    this.setState({ yearMonth: value });
  };
  private onSelectedMonth = (fieldName: string, value: string) => {
    // const { onSelectedMonth } = this.props;
    // นำ Date string ที่ได้มาแปลงเป็น เดือน โดยข้อมูลที่ได้จะเป็นค่า 1-12
    const date = new Date(value);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    this.onSelectedYearMonth(fieldName, `${month}`);
  };

  private onGetReport = async () => {
    const { errorObject } = this.props;
    try {
      const result: any = await fetchNoService(
        `${DonationDocUrl}/report_03.php`,
        {
          the_month: this.state.yearMonth || "0",
          the_year: this.state.fiscalYear || "0",
          the_format: "excel",
        },
        "report_"
      );
    } catch (e) {
      errorObject.setField({ fieldname: "tigger", value: true });
      errorObject.setField({ fieldname: "code", value: e.code });
      errorObject.setField({ fieldname: "title", value: e.name });
      errorObject.setField({ fieldname: "message", value: e.message });
      errorObject.setField({
        fieldname: "technical_stack",
        value: e.technical_stack,
      });
    }
  };
}

export default withRouter(withTranslation()(DonationDirectByProvinceReport));
