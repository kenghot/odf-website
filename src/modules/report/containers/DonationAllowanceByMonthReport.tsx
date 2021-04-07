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

interface IDonationAllowanceByMonthReport
  extends WithTranslation,
    RouteComponentProps {
  errorObject: IErrorModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class DonationAllowanceByMonthReport extends React.Component<IDonationAllowanceByMonthReport> {
  public state = { fiscalYear: "" };
  public locationStore = LocationModel.create({});

  public render() {
    const { t } = this.props;
    return (
      <ReportCard
        title={t("page.DonationReportListPage.report02")}
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
          </Grid>
        }
        onGetReport={this.onGetReport}
      />
    );
  }

  private onSelectedFiscalYear = (value: any) => {
    this.setState({ fiscalYear: value });
  };

  private onGetReport = async () => {
    const { errorObject } = this.props;
    try {
      const result: any = await fetchNoService(
        `${DonationDocUrl}/report_02.php`,
        {
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

export default withRouter(withTranslation()(DonationAllowanceByMonthReport));
