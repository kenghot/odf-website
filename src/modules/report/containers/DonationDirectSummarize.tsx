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
import { OrganizationDDL } from "../../admin/organization/components";
import { OrgListModel } from "../../admin/organization/OrgListModel";
import { DateInput } from "../../../components/common";


interface IDonationDirectSummarize
  extends WithTranslation,
    RouteComponentProps {
  errorObject: IErrorModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class DonationDirectSummarize extends React.Component<IDonationDirectSummarize> {
  public state = { fiscalYear: "", yearMonth: "",id_card_no:"",org_id:"",firstname:"",lastname:"",organizationId: "" };
  public locationStore = LocationModel.create({});
  private orgList = OrgListModel.create({});
  public render() {
    const { appStore, t } = this.props;
    return (
      <ReportCard
        title={t("page.DonationReportListPage.report07")}
        filter={
          <Grid columns={"equal"} doubling stackable>
             <Grid.Column width={8}>
              <Form.Field
                required
                label={t("module.report.public.organization")}
                control={OrganizationDDL}
                orgList={this.orgList}
                value={this.state.organizationId}
                onChange={this.onSelectedOrganizeDDL}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Form.Field
                required
                label={t("module.report.public.fiscalYear")}
                control={FiscalYearDDL}
                placeholder={t("module.report.public.pleaseSelectFiscalYear")}
                value={this.state.fiscalYear}
                onChange={this.onSelectedFiscalYear}
              />
            </Grid.Column>
            <Grid.Column width={4}>
            <Form.Field
                required
                label={t("module.report.DateFilterDDL.month")}
                control={DateInput}
                type="month"
                formatdate="MMMM"
                value={this.state.yearMonth}
                fieldName={"yearMonth"}
                onChangeInputField={this.onSelectedMonth}
                id={"DonationDirectSummarizeReportMonth"}
              />
            </Grid.Column>
            <Grid.Column>
            <Form.Input
            fluid
            label={t("page.DonationReportListPage.idcard_noOptionsLabel")}
            placeholder={t("page.DonationReportListPage.idcard_noOptionsPlaceholder")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputFieldIdCardNo(data.value)
            }
            value={this.state.id_card_no}
          />
            </Grid.Column>
            <Grid.Column>
            <Form.Input
            fluid
            label={t("page.DonationReportListPage.firstnameOptionsLabel")}
            placeholder={t("page.DonationReportListPage.firstnameOptionsPlaceholder")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputFieldFirstname(data.value)
            }
            value={this.state.firstname}
          />
            </Grid.Column>
            <Grid.Column>
            <Form.Input
            fluid
            label={t("page.DonationReportListPage.lastnameOptionsLabel")}
            placeholder={t("page.DonationReportListPage.lastnameOptionsPlaceholder")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputFieldLastname(data.value)
            }
            value={this.state.lastname}
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
  private onSelectedOrganizeDDL = (value: any) => {
    this.setState({ organizationId: value });
  };
  private onChangeInputFieldIdCardNo = ( value: any) => {
    this.setState({ id_card_no: value });
  };
  private onChangeInputFieldFirstname = ( value: any) => {
    this.setState({ firstname: value });
  };
  private onChangeInputFieldLastname= ( value: any) => {
    this.setState({ lastname: value });
  };

  private onGetReport = async () => {
    const { errorObject } = this.props;
    try {
      const result: any = await fetchNoService(
        `${DonationDocUrl}/report_07.php`,
        {
          the_month: this.state.yearMonth || "0",
          the_year: this.state.fiscalYear || "0",
          id_card_no: this.state.id_card_no || "0",
          org_id: this.state.organizationId || "0",
          firstname: this.state.firstname || "",
          lastname: this.state.lastname || "",
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

export default withRouter(withTranslation()(DonationDirectSummarize));
