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
import { DateInput } from "../../../components/common";
import POSRefTypeDDL from "../../../components/payment/POSRefTypeDDL";
import { Receipt } from "../../receipt/ReceiptService";

interface IDebtRepaymentByOrganizeReport
  extends WithTranslation,
    RouteComponentProps {
  appStore?: IAppModel;
  errorObject: IErrorModel;
}

@inject("appStore")
@observer
class DebtRepaymentByOrganizeReport extends React.Component<
  IDebtRepaymentByOrganizeReport
> {
  private orgList = OrgListModel.create({});
  public state = {
    fiscalYear: "",
    organizationId: "",
    yearMonth: undefined,
    officePaymentMethod: "",
  };
  public render() {
    const { appStore, t } = this.props;
    return (
      <ReportCard
        title={t("module.report.DebtRepaymentByOrganizeReport.title")}
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
            <Grid.Column>
              {/* <Form.Field
                label={t("module.report.public.fiscalYear")}
                control={FiscalYearDDL}
                placeholder={t("module.report.public.pleaseSelectFiscalYear")}
                value={this.state.fiscalYear}
                onChange={this.onSelectedFiscalYear}
              /> */}
              <Form.Field
                label={t("module.report.public.officePaymentMethod")}
                // control={OfficePaymentMethodDDL}
                control={POSRefTypeDDL}
                placeholder={t("module.report.public.pleaseSelectPosRefType")}
                value={this.state.officePaymentMethod}
                onChange={this.onSelectedOfficePaymentMethod}
              />
            </Grid.Column>
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
                label={t("module.report.DateFilterDDL.month")}
                control={DateInput}
                type="month"
                formatdate="MMMM"
                value={this.state.yearMonth}
                fieldName={"yearMonth"}
                onChangeInputField={this.onSelectedMonth}
                id={"Report2Acc"}
              />
            </Grid.Column>
          </Grid>
        }
        onGetReport={this.onGetReport}
      />
    );
  }

  private onSelectedYearMonth = (fieldName: string, value: any) => {
    this.setState({ yearMonth: value });
  };

  private onSelectedMonth = (fieldName: string, value: string) => {
    // const { onSelectedMonth } = this.props;
    // นำ Date string ที่ได้มาแปลงเป็น เดือน โดยข้อมูลที่ได้จะเป็นค่า 1-12
    const date = new Date(value);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    this.onSelectedYearMonth(fieldName, `${month}`);
  };

  private onSelectedFiscalYear = (value: any) => {
    this.setState({ fiscalYear: value });
  };

  private onSelectedOrganizeDDL = (value: any) => {
    this.setState({ organizationId: value });
  };
  private onSelectedOfficePaymentMethod = (value: any) => {
    this.setState({ officePaymentMethod: value });
  };

  private onGetReport = async () => {
    const { errorObject } = this.props;
    try {
      // await new Promise((resolve) => setTimeout(resolve, 1500));
      // window.open(FILES_PATH.debtRepaymentByOrganizeReport);
      await Receipt.get(
        {
          posRefType: this.state.officePaymentMethod,
          organizationId: this.state.organizationId,
          fiscalYear: this.state.fiscalYear,
          month: this.state.yearMonth,
        },
        { name: "printReport2" }
      );
      // await Request.get(
      //   {
      //     organizationId: this.state.organizationId,
      //     fiscalYear: this.state.fiscalYear
      //   },
      //   { name: "printPersonalRequestReport" }
      // );
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

export default withRouter(withTranslation()(DebtRepaymentByOrganizeReport));
