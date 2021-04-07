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
import { SearchOverdueByDateRange } from "../../../components/search";
import { fetchNoService } from "../../../utils/request-noservice";
import OrganizationCodeDDL from "../../admin/organization/components/OrganizationCodeDDL";
const reportUrl = `${process.env.REACT_APP_DEBT_ENDPOINT}`;

interface IOutstandingByProvinceAndRegionReport extends WithTranslation, RouteComponentProps {
  appStore?: IAppModel;
  errorObject: IErrorModel;
}

@inject("appStore")
@observer
class OutstandingByProvinceAndRegionReport extends React.Component<IOutstandingByProvinceAndRegionReport> {
  private orgList = OrgListModel.create({});
  public state = {
    fiscalYear: "",
    organizationId: "",

    startDocumentDate: "",
    endDocumentDate: "",
  };
  public render() {
    const { appStore, t } = this.props;
    return (
      <ReportCard
        title={t("module.report.OutstandingByProvinceAndRegionReport.title")}
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
                label={t("module.report.public.organization")}
                control={OrganizationDDL}
                // control={OrganizationCodeDDL}
                orgList={this.orgList}
                value={this.state.organizationId}
                onChange={this.onSelectedOrganizeDDL}
              />
            </Grid.Column>
            <Grid.Column width={16}>
              <Form.Field
                label={t("module.report.public.chooseAccordingAgreementDate")}
                width={16}
                control={SearchOverdueByDateRange}
                onChangeInputField={this.onSelectedDocumentDate}
                idInputFieldNameStartDate={"RequestResultReportStartDocumentDate"}
                inputFieldNameStartDate="startDocumentDate"
                idInputFieldNameEndDate={"RequestResultReportEndDocumentDate"}
                inputFieldNameEndDate="endDocumentDate"
                valueFieldNameStartDate={this.state.startDocumentDate}
                valueFieldNameEndDate={this.state.endDocumentDate}
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

  private onSelectedDocumentDate = (fieldName: string, value: any) => {
    this.setState({ [fieldName]: value });
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
      await DebtCollection.get(
        {
          fiscalYear: this.state.fiscalYear,
          organizationId: this.state.organizationId,
          startDocumentDate: this.state.startDocumentDate,
          endDocumentDate: this.state.endDocumentDate,
        },
        { name: "printDebtAcknowledgementReport" }
      );
      // await fetchNoService(`${reportUrl}/report_06.php`, {
      //   the_year: this.state.fiscalYear ? +this.state.fiscalYear - 543 : 0,
      //   the_province: this.state.organizationId || "0",
      //   the_date_from: this.state.startDocumentDate || "0",
      //   the_date_to: this.state.endDocumentDate || "0",
      //   the_format: "excel",
      // });
      // return;
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

export default withRouter(withTranslation()(OutstandingByProvinceAndRegionReport));
