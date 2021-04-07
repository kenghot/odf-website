import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form, Grid } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { IErrorModel } from "../../../components/common/error/ErrorModel";
import { FiscalYearDDL } from "../../../components/project/year";
import { Request } from "../../loan/request/RequestsService";
import { ReportCard } from "../components";

interface ICommitteeResultReport extends WithTranslation, RouteComponentProps {
  errorObject: IErrorModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class CommitteeResultReport extends React.Component<ICommitteeResultReport> {
  public state = { fiscalYear: "", committee: "", meetingNumber: "" };
  public render() {
    const { appStore, t } = this.props;
    return (
      <ReportCard
        title={t("module.report.CommitteeResultReport.title")}
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
                options={appStore!.enumItems("committee")}
                label={t("module.report.public.committee")}
                placeholder={t("module.report.public.pleaseSpecifyCommittee")}
                fluid
                value={this.state.committee}
                onChange={this.onSelectedCommittee}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Input
                value={this.state.meetingNumber}
                onChange={this.onSetFieldMeetingNumber}
                label={t("module.report.public.meetingNumber")}
                type="number"
                placeholder={t(
                  "module.report.public.pleaseSpecifyMeetingNumber"
                )}
                fluid
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

  private onSelectedCommittee = (event: any, data: any) => {
    this.setState({ committee: data.value });
  };

  private onSetFieldMeetingNumber = (event: any, data: any) => {
    this.setState({ meetingNumber: data.value });
  };

  private onGetReport = async () => {
    const { errorObject } = this.props;
    try {
      await Request.get(
        {
          fiscalYear: this.state.fiscalYear,
          committee: this.state.committee,
          meetingNumber: this.state.meetingNumber,
        },
        { name: "printCommitteeResultReport" }
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

export default withRouter(withTranslation()(CommitteeResultReport));
