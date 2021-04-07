import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form, Grid } from "semantic-ui-react";
import { IErrorModel } from "../../../components/common/error/ErrorModel";
import { FiscalYearDDL } from "../../../components/project/year";
import { OrganizationDDL } from "../../admin/organization/components";
import { OrgListModel } from "../../admin/organization/OrgListModel";
import { Request } from "../../loan/request/RequestsService";
import { ReportCard } from "../components";

interface IDisqualifyPersonalRequestReport
  extends WithTranslation,
    RouteComponentProps {
  errorObject: IErrorModel;
}

@observer
class DisqualifyPersonalRequestReport extends React.Component<
  IDisqualifyPersonalRequestReport
> {
  private orgList = OrgListModel.create({});
  public state = { fiscalYear: "", organizationId: "" };
  public render() {
    const { t } = this.props;
    return (
      <ReportCard
        title={t("module.report.DisqualifyPersonalRequestReport.title")}
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

  private onGetReport = async () => {
    const { errorObject } = this.props;
    try {
      await Request.get(
        {
          organizationId: this.state.organizationId,
          fiscalYear: this.state.fiscalYear
        },
        { name: "printDisqualifyPersonalRequestReport" }
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

export default withRouter(withTranslation()(DisqualifyPersonalRequestReport));
