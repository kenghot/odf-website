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
import { DebtCollection, DebtReport } from "../../debtCollection/DebtCollectionsService";
import { fetchNoService } from "../../../utils/request-noservice";
import OrganizationCodeDDL from "../../admin/organization/components/OrganizationCodeDDL";
const reportUrl = `${process.env.REACT_APP_DEBT_ENDPOINT}`;

interface IOutstandingAccountReceivableReport extends WithTranslation, RouteComponentProps {
  appStore?: IAppModel;
  errorObject: IErrorModel;
}

@inject("appStore")
@observer
class OutstandingAccountReceivableReport extends React.Component<IOutstandingAccountReceivableReport> {
  private orgList = OrgListModel.create({});
  public state = { fiscalYear: "", organizationId: "", agreementYear: "" };
  public render() {
    const { appStore, t } = this.props;
    return (
      <ReportCard
        title={t("module.report.OutstandingAccountReceivableReport.title")}
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
                label={"ปีที่ทำสัญญา"}
                control={FiscalYearDDL}
                placeholder={"กรุณาเลือกปีที่ทำสัญญา"}
                value={this.state.fiscalYear}
                onChange={this.onSelectedAgreementYear}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Field
                label={t("module.report.public.organization")}
                // control={OrganizationDDL}
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

  private onSelectedFiscalYear = (value: any) => {
    this.setState({ fiscalYear: value });
  };
  private onSelectedAgreementYear = (value: any) => {
    this.setState({ agreementYear: value });
  };

  private onSelectedOrganizeDDL = (value: any) => {
    this.setState({ organizationId: value });
  };

  private onGetReport = async () => {
    const { errorObject } = this.props;
    try {
      // await DebtReport.get(
      //   {
      //     // the_year: this.state.fiscalYear,
      //     // the_month: this.state.status,
      //     the_province: this.state.organizationId || "0",
      //     the_agreement_year: this.state.agreementYear || "0",
      //     the_year: this.state.fiscalYear || "0",
      //     the_format: "excel",
      //   },
      //   { name: "report_05.php" }
      // );
      // await DebtCollection.get(
      //   {
      //     fiscalYear: this.state.fiscalYear,
      //     organizationId: this.state.organizationId,
      //   },
      //   { name: "printVisitReport" }
      // );
      await fetchNoService(`${reportUrl}/report_05.php`, {
        // the_year: this.state.fiscalYear,
        // the_month: this.state.status,
        the_province: this.state.organizationId || "0",
        // the_agreement_year: this.state.agreementYear || "0",
        the_agreement_year: this.state.agreementYear ? +this.state.agreementYear - 543 : 0,
        the_year: this.state.fiscalYear ? +this.state.fiscalYear - 543 : 0,
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

export default withRouter(withTranslation()(OutstandingAccountReceivableReport));
