import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form, Grid } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { IErrorModel } from "../../../components/common/error/ErrorModel";
import { SearchOverdueByDateRange } from "../../../components/search";
import { FILES_PATH } from "../../../constants";
import { OrganizationDDL } from "../../admin/organization/components";
import { OrgListModel } from "../../admin/organization/OrgListModel";
import { ReportCard } from "../components";
import POSRefTypeDDL from "../../../components/payment/POSRefTypeDDL";
import { Receipt } from "../../receipt/ReceiptService";

interface ICancelRepaymentReport extends WithTranslation, RouteComponentProps {
  errorObject: IErrorModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class CancelRepaymentReport extends React.Component<ICancelRepaymentReport> {
  public state = {
    organizationId: "",
    startDocumentDate: "",
    endDocumentDate: "",
    officePaymentMethod: "",
  };
  private orgList = OrgListModel.create({});

  public render() {
    const { appStore, t } = this.props;
    return (
      <ReportCard
        title={t("module.report.CancelRepaymentReport.title")}
        filter={
          <Grid columns={"equal"} doubling stackable>
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
              <Form.Field
                label={t("module.report.public.officePaymentMethod")}
                // control={OfficePaymentMethodDDL}
                control={POSRefTypeDDL}
                placeholder={t("module.report.public.pleaseSelectPosRefType")}
                value={this.state.officePaymentMethod}
                onChange={this.onSelectedOfficePaymentMethod}
              />
            </Grid.Column> */}
            <Grid.Column width={16}>
              <Form.Field
                label={t("module.report.public.chooseAccordingReceiptPaidDate")}
                width={16}
                control={SearchOverdueByDateRange}
                onChangeInputField={this.onSelectedDocumentDate}
                idInputFieldNameStartDate={"CancelRepaymentReportStartDocumentDate"}
                inputFieldNameStartDate="startDocumentDate"
                idInputFieldNameEndDate={"CancelRepaymentReportEndDocumentDate"}
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
  private onSelectedOfficePaymentMethod = (value: any) => {
    this.setState({ officePaymentMethod: value });
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
      // await new Promise((resolve) => setTimeout(resolve, 1500));
      // window.open(FILES_PATH.cancelRepaymentReport);
      await Receipt.get(
        {
          // posRefType: this.state.officePaymentMethod,
          organizationId: this.state.organizationId,
          startPaidDate: this.state.startDocumentDate,
          endPaidDate: this.state.endDocumentDate,
        },
        { name: "printReport3" }
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

export default withRouter(withTranslation()(CancelRepaymentReport));
