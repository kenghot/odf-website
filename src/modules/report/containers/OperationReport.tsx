import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form, Grid } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { IErrorModel } from "../../../components/common/error/ErrorModel";
import { FiscalYearDDL } from "../../../components/project/year";
import { SearchOverdueByDateRange } from "../../../components/search";
import { OrganizationDDL } from "../../admin/organization/components";
import { OrgListModel } from "../../admin/organization/OrgListModel";
import { Request } from "../../loan/request/RequestsService";
import { ReportCard } from "../components";

interface IOperationReport extends WithTranslation, RouteComponentProps {
  errorObject: IErrorModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class OperationReport extends React.Component<IOperationReport> {
  public state = {
    fiscalYear: "",
    organizationId: "",
    startDocumentDate: "",
    endDocumentDate: ""
  };
  private orgList = OrgListModel.create({});

  public render() {
    const { t } = this.props;
    return (
      <ReportCard
        title={t("module.report.OperationReport.title")}
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
                orgList={this.orgList}
                value={this.state.organizationId}
                onChange={this.onSelectedOrganizeDDL}
              />
            </Grid.Column>
            {/* <Grid.Column>
              <DateInput
                id={"OperationReportStartDocumentDate"}
                value={this.state.startDocumentDate}
                fieldName={"startDocumentDate"}
                onChangeInputField={this.onSelectedDocumentDate}
                clearable
                fluid
              />
            </Grid.Column>
            <Grid.Column>
              <DateInput
                id={"OperationReportEndDocumentDate"}
                value={this.state.endDocumentDate}
                fieldName={"endDocumentDate"}
                onChangeInputField={this.onSelectedDocumentDate}
                clearable
                fluid
              />
            </Grid.Column> */}
            <Grid.Column width={16}>
              <Form.Field
                label={t("module.report.public.chooseAccordingAgreementDate")}
                width={16}
                control={SearchOverdueByDateRange}
                onChangeInputField={this.onSelectedDocumentDate}
                idInputFieldNameStartDate={"OperationReportStartDocumentDate"}
                inputFieldNameStartDate="startDocumentDate"
                idInputFieldNameEndDate={"OperationReportEndDocumentDate"}
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

  private onSelectedFiscalYear = (value: any) => {
    this.setState({ fiscalYear: value });
  };

  private onSelectedOrganizeDDL = (value: any) => {
    this.setState({ organizationId: value });
  };

  private onSelectedDocumentDate = (fieldName: string, value: any) => {
    this.setState({ [fieldName]: value });
  };

  private onGetReport = async () => {
    const { errorObject } = this.props;
    try {
      await Request.get(
        {
          fiscalYear: this.state.fiscalYear,
          organizationId: this.state.organizationId,
          startDocumentDate: this.state.startDocumentDate,
          endDocumentDate: this.state.endDocumentDate
        },
        { name: "printOperationReport" }
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

export default withRouter(withTranslation()(OperationReport));
