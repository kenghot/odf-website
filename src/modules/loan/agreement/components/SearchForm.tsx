import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Icon, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import { Link } from "../../../../components/common";
import {
  SearchByTargetInfoForm,
  SearchOverdueByDateRange
} from "../../../../components/search";
import { OrganizationDDL } from "../../../admin/organization/components";
import { OrgListModel } from "../../../admin/organization/OrgListModel";
import { IAgreementListModel } from "../AgreementListModel";

interface ISearchForm extends WithTranslation {
  agreementListStore: IAgreementListModel;
  appStore?: IAppModel;
  onSearchPage?: (isReset?: boolean) => void;
}

@inject("appStore")
@observer
class SearchForm extends React.Component<ISearchForm> {
  public state = { openheader: false };
  private orgList = OrgListModel.create({});
  public render() {
    const { t } = this.props;
    return (
      <Segment padded>
        {this.renderHeader()}
        <Form size="mini">
          {this.state.openheader
            ? this.renderOpenHeader()
            : this.renderHideHeader()}
        </Form>
        <Grid columns="equal" style={styles.gridButtom}>
          <Grid.Row verticalAlign="middle">
            <Grid.Column textAlign="right">
              <Link shade={5} onClick={() => this.resetFilter()}>
                {t("module.loan.searchForm.cancelAllFilters")}
              </Link>
              <Button
                icon
                labelPosition="left"
                color="blue"
                style={styles.button}
                onClick={() => this.onSearch()}
              >
                {t("module.loan.searchForm.searching")}
                <Icon name="search" />
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
  private renderHeader() {
    const { t } = this.props;
    return (
      <Grid columns={2}>
        <Grid.Row verticalAlign="top">
          <Grid.Column width={10}>
            <Header
              size="medium"
              content={t("module.loan.searchFormAgreement.title")}
              subheader={t("module.loan.searchFormAgreement.description")}
              style={styles.header}
            />
          </Grid.Column>
          <Grid.Column floated="right" textAlign="right" width={6}>
            <Link
              size="tiny"
              shade={5}
              onClick={() =>
                this.setState({ openheader: !this.state.openheader })
              }
            >
              {this.state.openheader
                ? t("hideAdvancedSearch")
                : t("advancedSearch")}
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  private renderHideHeader() {
    const { t, agreementListStore, appStore } = this.props;
    return (
      <Form.Group widths="equal">
        <Form.Input
          fluid
          label={t("module.loan.searchFormAgreement.documentNumber")}
          placeholder={t(
            "module.loan.searchFormAgreement.documentNumberPlaceholder"
          )}
          onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
            this.onChangeInputField("filterDocumentNumber", data.value)
          }
          value={agreementListStore.filterDocumentNumber}
        />
        <Form.Input
          fluid
          label={t("module.loan.searchFormAgreement.cardNumberBorrower")}
          placeholder={t("module.loan.searchForm.identifyIDCardNumber")}
          onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
            this.onChangeInputField("filterIdCardNo", data.value)
          }
          value={agreementListStore.filterIdCardNo}
        />
        <Form.Select
          search
          fluid
          clearable
          label={t("module.loan.searchFormAgreement.status")}
          placeholder={t("module.loan.searchFormAgreement.statusPlaceholder")}
          options={appStore!.enumItems("agreementStatus")}
          onChange={(event, data) =>
            this.onChangeInputField("filterStatus", data.value)
          }
          value={agreementListStore.filterStatus}
        />
      </Form.Group>
    );
  }
  private renderOpenHeader() {
    const { t, agreementListStore, appStore } = this.props;
    return (
      <React.Fragment>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label={t("module.loan.searchFormAgreement.documentNumber")}
            placeholder={t(
              "module.loan.searchFormAgreement.documentNumberPlaceholder"
            )}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("filterDocumentNumber", data.value)
            }
            value={agreementListStore.filterDocumentNumber}
          />
          <Form.Field
            label={t("module.loan.searchForm.organization")}
            placeholder={t("module.loan.searchForm.organizationPlaceholder")}
            control={OrganizationDDL}
            value={agreementListStore.filterOrganizationId}
            orgList={this.orgList}
            onChange={this.onChangeOrganizationDDL}
          />
          <Form.Select
            search
            fluid
            clearable
            label={t("module.loan.searchFormAgreement.status")}
            placeholder={t("module.loan.searchFormAgreement.statusPlaceholder")}
            options={appStore!.enumItems("agreementStatus")}
            onChange={(event, data) =>
              this.onChangeInputField("filterStatus", data.value)
            }
            value={agreementListStore.filterStatus}
          />
          <Form.Select
            search
            fluid
            clearable
            label={t("module.loan.searchForm.category")}
            placeholder={t("module.loan.searchForm.pleaseSelectCategory")}
            options={appStore!.enumItems("loanType")}
            onChange={(event, data) =>
              this.onChangeInputField("filterAgreementType", data.value)
            }
            value={agreementListStore.filterAgreementType}
          />
        </Form.Group>
        {this.renderCheckType()}
        <Form.Field
          label={t(
            "module.loan.searchForm.chooseAccordingPetitionSubmissionDateFiscalYear"
          )}
          width={16}
          control={SearchOverdueByDateRange}
          onChangeInputField={this.onChangeInputField}
          inputFieldNameStartDate="filterStartDate"
          inputFieldNameEndDate="filterEndDate"
          valueFieldNameStartDate={agreementListStore.filterStartDate}
          valueFieldNameEndDate={agreementListStore.filterEndDate}
          filterFiscalYear={agreementListStore.filterFiscalYear}
          onChangeFiscalYearDDL={this.onChangeFiscalYearDDL}
          size="mini"
        />
      </React.Fragment>
    );
  }
  private renderCheckType() {
    const { t, agreementListStore } = this.props;
    switch (agreementListStore.filterAgreementType) {
      case "G":
        agreementListStore.resetFilterBorrowerAndVendorInfo();
        return (
          <Form.Input
            fluid
            label={t("module.loan.searchForm.groupName")}
            placeholder={t("module.loan.searchForm.specifyGroupName")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("filterName", data.value)
            }
            value={agreementListStore.filterName}
          />
        );
      default:
        agreementListStore.setField({
          fieldname: "filterName",
          value: ""
        });
        return (
          <React.Fragment>
            <Form.Field
              label={t("module.loan.searchForm.borrowerInfo")}
              width={16}
              control={SearchByTargetInfoForm}
              onChangeInputField={this.onChangeInputField}
              inputFieldNameIdCard="filterIdCardNo"
              inputFieldNameFirstname="filterFirstname"
              inputFieldNameLastname="filterLastname"
              valueFieldNameIdCard={agreementListStore.filterIdCardNo}
              valueFieldNameFirstname={agreementListStore.filterFirstname}
              valueFieldNameLastname={agreementListStore.filterLastname}
              size="mini"
            />
            <Form.Field
              label={t("module.loan.searchForm.vendorInfo")}
              width={16}
              control={SearchByTargetInfoForm}
              onChangeInputField={this.onChangeInputField}
              inputFieldNameIdCard="filterGuarantorIdCardNo"
              inputFieldNameFirstname="filterGuarantorFirstname"
              inputFieldNameLastname="filterGuarantorLastname"
              valueFieldNameIdCard={agreementListStore.filterGuarantorIdCardNo}
              valueFieldNameFirstname={
                agreementListStore.filterGuarantorFirstname
              }
              valueFieldNameLastname={
                agreementListStore.filterGuarantorLastname
              }
              size="mini"
            />
          </React.Fragment>
        );
    }
  }

  private resetFilter = async () => {
    const { agreementListStore, onSearchPage } = this.props;
    await agreementListStore.resetFilter();
    await agreementListStore.load_data();
    await this.orgList.setField({
      fieldname: "filterName",
      value: ""
    });
    await this.orgList.load_data();
    onSearchPage!(true);
  };
  private onSearch = () => {
    const { agreementListStore, onSearchPage } = this.props;
    agreementListStore.setField({
      fieldname: "currentPage",
      value: 1
    });
    agreementListStore.load_data();
    onSearchPage!();
    const elmnt = document.getElementById("searchTable");
    if (elmnt) elmnt.scrollIntoView();
  };
  private onChangeOrganizationDDL = (value: string) => {
    const { agreementListStore } = this.props;
    agreementListStore.setField({
      fieldname: "filterOrganizationId",
      value
    });
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { agreementListStore } = this.props;
    agreementListStore.setField({ fieldname, value });
  };
  private onChangeFiscalYearDDL = (value: string) => {
    const { agreementListStore } = this.props;
    agreementListStore.setField({ fieldname: "filterFiscalYear", value });
  };
}

const styles: any = {
  button: {
    marginRight: 0,
    marginLeft: 14
  },
  header: {
    marginBottom: 28
  },
  gridButtom: {
    paddingTop: 28
  }
};

export default withTranslation()(SearchForm);
