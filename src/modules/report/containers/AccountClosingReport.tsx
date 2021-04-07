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
import { fetchNoService } from "../../../utils/request-noservice";
import OrganizationCodeDDL from "../../admin/organization/components/OrganizationCodeDDL";
const reportUrl = `${process.env.REACT_APP_DEBT_ENDPOINT}`;

interface IAccountClosingReport extends WithTranslation, RouteComponentProps {
  appStore?: IAppModel;
  errorObject: IErrorModel;
}

@inject("appStore")
@observer
class AccountClosingReport extends React.Component<IAccountClosingReport> {
  private orgList = OrgListModel.create({});
  public state = { fiscalYear: "", organizationId: "", region: "" };
  public render() {
    const { appStore, t } = this.props;
    return (
      <ReportCard
        title={t("module.report.AccountClosingReport.title")}
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
            {/* <Grid.Column>
              <Form.Field
                label={t("module.report.public.organization")}
                control={OrganizationCodeDDL}
                orgList={this.orgList}
                value={this.state.organizationId}
                onChange={this.onSelectedOrganizeDDL}
              />
            </Grid.Column> */}
          </Grid>
        }
        onGetReport={this.onGetReport}
      />
    );
  }

  private onSelectedFiscalYear = (value: any) => {
    this.setState({ fiscalYear: value });
  };

  private onSelectedOrganizeDDL = (value: any) => {
    this.setState({ organizationId: value });
  };

  private onSelectedRegion = (event: any, data: any) => {
    this.setState({ region: data.value });
  };

  private onGetReport = async () => {
    const { errorObject } = this.props;
    try {
      // await DebtReport.get(
      //   {
      //     // the_year: this.state.fiscalYear,
      //     // the_month: this.state.status,
      //     the_year: this.state.fiscalYear,
      //     the_mode: "by_section",
      //     the_format: "excel",
      //   },
      //   { name: "report_03.php" }
      // );
      await fetchNoService(`${reportUrl}/report_03.php`, {
        // the_year: this.state.fiscalYear,
        // the_month: this.state.status,
        the_section: this.state.region,
        the_province: this.state.organizationId || "0",
        the_year: this.state.fiscalYear ? +this.state.fiscalYear - 543 : 0,
        the_mode: "by_section",
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

export default withRouter(withTranslation()(AccountClosingReport));
