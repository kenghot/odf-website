import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form, Grid } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { LocationModel } from "../../../components/address";
import ProvinceDDL from "../../../components/address/ProvinceDDL";
import { IErrorModel } from "../../../components/common/error/ErrorModel";
import { FiscalYearDDL } from "../../../components/project/year";
import { Request } from "../../loan/request/RequestsService";
import { ReportCard } from "../components";

interface IPersonalRequestSummaryReport
  extends WithTranslation,
    RouteComponentProps {
  errorObject: IErrorModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class PersonalRequestSummaryReport extends React.Component<
  IPersonalRequestSummaryReport
> {
  public state = { fiscalYear: "", region: "", province: "" };
  public locationStore = LocationModel.create({});

  public render() {
    const { appStore, t } = this.props;
    return (
      <ReportCard
        title={t("module.report.PersonalRequestSummaryReport.title")}
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
          </Grid>
        }
        onGetReport={this.onGetReport}
      />
    );
  }

  private onSelectedFiscalYear = (value: any) => {
    this.setState({ fiscalYear: value });
  };

  private onSelectedRegion = (event: any, data: any) => {
    this.setState({ region: data.value });
  };

  private onSelectedProvince = (value: any) => {
    this.setState({ province: value });
  };

  private onGetReport = async () => {
    const { errorObject } = this.props;
    try {
      await Request.get(
        {
          fiscalYear: this.state.fiscalYear,
          region: this.state.region,
          province: this.state.province
        },
        { name: "printPersonalRequestSummaryReport" }
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

export default withRouter(withTranslation()(PersonalRequestSummaryReport));
