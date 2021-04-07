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

interface IDonationByAgeReport extends WithTranslation, RouteComponentProps {
  errorObject: IErrorModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class DonationByAgeReport extends React.Component<IDonationByAgeReport> {
  public state = { fiscalYear: "", province: "", ageRange: "" };
  public locationStore = LocationModel.create({});
  public ageOptions = [
    { key: "1", text: "60-69 ปี", value: "1" },
    { key: "2", text: "70-79 ปี", value: "2" },
    { key: "3", text: "80-89 ปี", value: "3" },
    { key: "4", text: "90 ปีขึ้นไป", value: "4" },
  ];
  public render() {
    const { appStore, t } = this.props;
    return (
      <ReportCard
        title={t("page.DonationReportListPage.report04")}
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
              <Form.Input
                label={t("module.report.public.province")}
                placeholder={t("module.report.public.pleaseSpecifyProvince")}
                control={ProvinceDDL}
                selectedValue={this.state.province}
                locationStore={this.locationStore}
                onChange={this.onSelectedProvince}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Select
                label={t("page.DonationReportListPage.ageOptionsLabel")}
                clearable
                placeholder={t(
                  "page.DonationReportListPage.ageOptionsPlaceholder"
                )}
                options={this.ageOptions}
                onChange={(event: any, data: any) => {
                  this.setState({ ageRange: data.value });
                }}
                value={this.state.ageRange}
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

  private onSelectedProvince = (value: any) => {
    this.setState({ province: value });
  };

  private onGetReport = async () => {
    const { errorObject } = this.props;
    try {
      const result: any = await fetchNoService(
        `${DonationDocUrl}/report_04.php`,
        {
          the_province: this.state.province || "0",
          the_year: this.state.fiscalYear || "0",
          the_age_range: this.state.ageRange || "0",
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

export default withRouter(withTranslation()(DonationByAgeReport));
