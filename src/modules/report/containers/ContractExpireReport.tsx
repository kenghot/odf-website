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
import { DebtReport } from "../../debtCollection/DebtCollectionsService";
import { DateInput } from "../../../components/common";
import { fetchNoService } from "../../../utils/request-noservice";
import OrganizationCodeDDL from "../../admin/organization/components/OrganizationCodeDDL";
const reportUrl = `${process.env.REACT_APP_DEBT_ENDPOINT}`;

interface IContractExpireReport extends WithTranslation, RouteComponentProps {
  appStore?: IAppModel;
  errorObject: IErrorModel;
}

@inject("appStore")
@observer
class ContractExpireReport extends React.Component<IContractExpireReport> {
  private orgList = OrgListModel.create({});
  public state = {
    fiscalYear: "",
    organizationId: "",

    yearMonth: undefined,
  };
  public render() {
    const { appStore, t } = this.props;
    return (
      <ReportCard
        title={t("module.report.ContractExpireReport.title")}
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
            <Grid.Column>
              <Form.Field
                label={t("module.report.public.organization")}
                control={OrganizationCodeDDL}
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

  private onSelectedOrganizeDDL = (value: any) => {
    this.setState({ organizationId: value });
  };

  private onGetReport = async () => {
    const { errorObject } = this.props;
    try {
      // await DebtReport.get(
      //   {
      //     the_year: this.state.fiscalYear || "0",
      //     the_month: this.state.yearMonth || "0",
      //     // the_province: this.state.organizationId || "0",
      //     // the_command_no: "0",
      //     // the_command_date: "0",
      //     // the_section: "0",
      //     the_format: "excel",
      //   },
      //   { name: "report_10.php" }
      // );
      await fetchNoService(`${reportUrl}/report_10.php`, {
        the_year: this.state.fiscalYear ? +this.state.fiscalYear - 543 : 0,
        the_month: this.state.yearMonth || "0",
        the_province: this.state.organizationId || "0",
        // the_command_no: "0",
        // the_command_date: "0",
        // the_section: "0",
        the_format: "excel",
      });
      return;
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

export default withRouter(withTranslation()(ContractExpireReport));
