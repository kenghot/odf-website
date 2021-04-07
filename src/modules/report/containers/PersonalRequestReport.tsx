import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form, Grid } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { IErrorModel } from "../../../components/common/error/ErrorModel";
import { FiscalYearDDL } from "../../../components/project/year";
import { OrganizationDDL } from "../../admin/organization/components";
import { OrgListModel } from "../../admin/organization/OrgListModel";
import { Request } from "../../loan/request/RequestsService";
import { ReportCard } from "../components";

interface IPersonalRequestReport extends WithTranslation, RouteComponentProps {
  appStore?: IAppModel;
  errorObject: IErrorModel;
}

@inject("appStore")
@observer
class PersonalRequestReport extends React.Component<IPersonalRequestReport> {
  private orgList = OrgListModel.create({});
  public state = { fiscalYear: "", organizationId: "", status: "" };
  public render() {
    const { appStore, t } = this.props;
    return (
      <ReportCard
        title={t("module.report.PersonalRequestReport.title")}
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
            <Grid.Column>
              <Form.Select
                search
                fluid
                label={t("module.report.public.status")}
                placeholder={t("module.report.public.pleaseSelectStatus")}
                clearable
                options={appStore!.enumItems("requestStatus")}
                onChange={this.onSelectedStatus}
                value={this.state.status}
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

  private onSelectedStatus = (event: any, data: any) => {
    this.setState({ status: data.value });
  };

  private onGetReport = async () => {
    const { errorObject } = this.props;
    try {
      await Request.get(
        {
          organizationId: this.state.organizationId,
          status: this.state.status,
          fiscalYear: this.state.fiscalYear
        },
        { name: "printPersonalRequestReport" }
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

export default withRouter(withTranslation()(PersonalRequestReport));
