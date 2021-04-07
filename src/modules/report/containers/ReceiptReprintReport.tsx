import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form, Grid } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { IErrorModel } from "../../../components/common/error/ErrorModel";
import { FILES_PATH } from "../../../constants";
import { OrganizationDDL } from "../../admin/organization/components";
import { OrgListModel } from "../../admin/organization/OrgListModel";
import { PosListModel } from "../../pos/PosListModel";
import { PosDDL } from "../../pos/posmanagement/components";
import { ReportCard } from "../components";
import { SearchOverdueByDateRange } from "../../../components/search";
import { fetchNoService } from "../../../utils/request-noservice";
import OrganizationCodeDDL from "../../admin/organization/components/OrganizationCodeDDL";
import { Receipt } from "../../receipt/ReceiptService";
const reportUrl = `${process.env.REACT_APP_ACC_ENDPOINT}`;

interface IReceiptReprintReport extends WithTranslation, RouteComponentProps {
  appStore?: IAppModel;
  errorObject: IErrorModel;
}

@inject("appStore")
@observer
class ReceiptReprintReport extends React.Component<IReceiptReprintReport> {
  private orgList = OrgListModel.create({});
  private posList = PosListModel.create({});
  public state = {
    pos: "",
    organizationId: "",
    agreementNumber: "",

    startDocumentDate: "",
    endDocumentDate: "",
  };
  public render() {
    const { appStore, t } = this.props;
    return (
      <ReportCard
        title={t("module.report.ReceiptReprintReport.title")}
        filter={
          <Grid columns={"equal"} doubling stackable>
            {/* <Grid.Column>
              <Form.Field
                label={t("module.report.public.pos")}
                control={PosDDL}
                placeholder={t("module.report.public.pleaseSelectPos")}
                value={this.state.pos}
                posList={this.posList}
                onChange={this.onSelectedPos}
              />
            </Grid.Column> */}
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
              <Form.Input
                id={`agreement`}
                label={"เลขที่สัญญา"}
                placeholder={"เลขที่สัญญา"}
                value={this.state.agreementNumber}
                onChange={(event: any, data: any) => {
                  this.setState({ ...this.state, agreementNumber: data.value });
                  // store.setField({
                  //   fieldname: "street",
                  //   value: data.value,
                  // });
                  // this.onChangeInputField(store);
                }}
              />
            </Grid.Column>
            <Grid.Column width={16}>
              <Form.Field
                label={t("module.report.public.chooseAccordingLoanPaidDate")}
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

  private onSelectedPos = (value: any) => {
    this.setState({ pos: value });
  };

  private onSelectedOrganizeDDL = (value: any) => {
    this.setState({ organizationId: value });
  };

  private onGetReport = async () => {
    const { errorObject } = this.props;
    try {
      await Receipt.get(
        {
          organizationId: this.state.organizationId,
          startPaidDate: this.state.startDocumentDate,
          endPaidDate: this.state.endDocumentDate,
          documentNumber: this.state.agreementNumber,
        },
        { name: "printReport4" }
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

export default withRouter(withTranslation()(ReceiptReprintReport));
