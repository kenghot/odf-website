import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form, Grid } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { IErrorModel } from "../../../components/common/error/ErrorModel";
import { FiscalYearDDL } from "../../../components/project/year";
import { FILES_PATH } from "../../../constants";
import { OrganizationDDL } from "../../admin/organization/components";
import { OrgListModel } from "../../admin/organization/OrgListModel";
import { ReportCard } from "../components";
import { DateInput } from "../../../components/common";
import { fetchNoService } from "../../../utils/request-noservice";
import OrganizationCodeDDL from "../../admin/organization/components/OrganizationCodeDDL";
import { Receipt } from "../../receipt/ReceiptService";
const reportUrl = `${process.env.REACT_APP_ACC_ENDPOINT}`;

interface IOverallRepaymentReport extends WithTranslation, RouteComponentProps {
  appStore?: IAppModel;
  errorObject: IErrorModel;
}

@inject("appStore")
@observer
class OverallRepaymentReport extends React.Component<IOverallRepaymentReport> {
  private orgList = OrgListModel.create({});
  public state = {
    fiscalYear: "",
    region: "",
    organizationId: "",
    yearMonth: undefined,
  };
  public render() {
    const { appStore, t } = this.props;
    return (
      <ReportCard
        title={t("module.report.OverallRepaymentReport.title")}
        filter={
          <Grid columns={"equal"} doubling stackable>
            <Grid.Column>
              <Form.Select
                clearable
                options={appStore!.enumItems("region")}
                label={t("module.report.public.region")}
                placeholder={t("module.report.public.pleaseSpecifyRegion")}
                fluid
                value={this.state.region}
                onChange={this.onSelectedRegion}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Field
                label={t("module.report.public.organization")}
                control={OrganizationDDL}
                orgList={this.orgList}
                value={this.state.organizationId}
                onChange={this.onSelectedOrganizeDDL}
              />
            </Grid.Column>
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

  private onSelectedFiscalYear = (value: any) => {
    this.setState({ fiscalYear: value });
  };
  private onSelectedRegion = (event: any, data: any) => {
    this.setState({ region: data.value });
  };
  private onSelectedOrganizeDDL = (value: any) => {
    this.setState({ organizationId: value });
  };

  private onGetReport = async () => {
    const { errorObject } = this.props;
    try {
      await Receipt.get(
        {
          organizationId: this.state.organizationId,
          fiscalYear: this.state.fiscalYear,
          month: this.state.yearMonth,
          region: this.state.region,
        },
        { name: "printReport5" }
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

export default withRouter(withTranslation()(OverallRepaymentReport));
