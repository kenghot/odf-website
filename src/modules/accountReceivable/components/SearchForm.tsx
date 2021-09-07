import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Icon, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { Link } from "../../../components/common";
import {
  SearchByTargetInfoForm,
  SearchOverdueByDateRange
} from "../../../components/search";
import { OrganizationDDL } from "../../admin/organization/components";
import { OrgListModel } from "../../admin/organization/OrgListModel";
import { IAccountReceivableListModel } from "../AccountReceivableListModel";

interface ISearchForm extends WithTranslation {
  accountReceivableListStore: IAccountReceivableListModel;
  appStore?: IAppModel;
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
                {t("module.accountReceivable.searchForm.cancelAllFilters")}
              </Link>
              <Button
                icon
                labelPosition="left"
                color="teal"
                style={styles.button}
                onClick={this.onClickLink}
              >
                {t("ทะเบียนรับสมุดปีงบปรมาณ")}
                <Icon name="search" />
              </Button>
              <Button
                icon
                labelPosition="left"
                color="blue"
                style={styles.button}
                onClick={() => this.onSearch()}
              >
                {t("module.accountReceivable.searchForm.searching")}
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
              content={t(
                "module.accountReceivable.searchForm.findAccountsReceivable"
              )}
              subheader={t(
                "module.accountReceivable.searchForm.canOnlyViewAccountsReceivableInfo"
              )}
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
    const { t, accountReceivableListStore, appStore } = this.props;
    return (
      <Form.Group widths="equal">
        <Form.Input
          fluid
          label={t("module.accountReceivable.searchForm.contractNumber")}
          placeholder={t(
            "module.accountReceivable.searchForm.specifyContractNumber"
          )}
          onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
            this.onChangeInputField("filterDocumentNumber", data.value)
          }
          value={accountReceivableListStore.filterDocumentNumber}
        />
        <Form.Field
          label={t("module.loan.searchForm.organization")}
          placeholder={t("module.loan.searchForm.organizationPlaceholder")}
          control={OrganizationDDL}
          value={accountReceivableListStore.filterOrganizationId}
          orgList={this.orgList}
          onChange={this.onChangeOrganizationDDL}
        />
        <Form.Select
          search
          fluid
          clearable
          label={t("module.accountReceivable.searchForm.accountStatus")}
          placeholder={t(
            "module.accountReceivable.searchForm.pleaseSelectStatus"
          )}
          options={appStore!.enumItemsDescription("accountReceivableStatus")}
          onChange={(event, data) =>
            this.onChangeInputField("filterStatus", data.value)
          }
          value={accountReceivableListStore.filterStatus}
        />
        <Form.Select
          search
          fluid
          clearable
          label={t("module.accountReceivable.searchForm.category")}
          placeholder={t(
            "module.accountReceivable.searchForm.pleaseSelectCategory"
          )}
          options={appStore!.enumItems("loanType")}
          onChange={(event, data) =>
            this.onChangeInputField("filterARType", data.value)
          }
          value={accountReceivableListStore.filterARType}
        />
      </Form.Group>
    );
  }
  private renderOpenHeader() {
    const { t, accountReceivableListStore } = this.props;
    return (
      <React.Fragment>
        {this.renderHideHeader()}
        {this.renderCheckType()}
        <Form.Field
          label={t(
            "module.accountReceivable.searchForm.chooseAccordingDateFiscalYear"
          )}
          width={16}
          control={SearchOverdueByDateRange}
          onChangeInputField={this.onChangeInputField}
          inputFieldNameStartDate="filterStartDate"
          inputFieldNameEndDate="filterEndDate"
          valueFieldNameStartDate={accountReceivableListStore.filterStartDate}
          valueFieldNameEndDate={accountReceivableListStore.filterEndDate}
          filterFiscalYear={accountReceivableListStore.filterFiscalYear}
          onChangeFiscalYearDDL={this.onChangeFiscalYearDDL}
          size="mini"
        />
      </React.Fragment>
    );
  }
  private renderCheckType() {
    const { t, accountReceivableListStore } = this.props;
    switch (accountReceivableListStore.filterARType) {
      case "G":
        accountReceivableListStore.resetFilterBorrower();
        return (
          <Form.Input
            fluid
            label={t("module.accountReceivable.searchForm.groupName")}
            placeholder={t(
              "module.accountReceivable.searchForm.specifyGroupName"
            )}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("filterName", data.value)
            }
            value={accountReceivableListStore.filterName}
          />
        );
      default:
        accountReceivableListStore.setField({
          fieldname: "filterName",
          value: ""
        });
        return (
          <React.Fragment>
            <Form.Field
              label={t(
                "module.accountReceivable.searchForm.informationBorrowers"
              )}
              width={16}
              control={SearchByTargetInfoForm}
              onChangeInputField={this.onChangeInputField}
              inputFieldNameIdCard="filterIdCardNo"
              inputFieldNameFirstname="filterFirstname"
              inputFieldNameLastname="filterLastname"
              valueFieldNameIdCard={accountReceivableListStore.filterIdCardNo}
              valueFieldNameFirstname={
                accountReceivableListStore.filterFirstname
              }
              valueFieldNameLastname={accountReceivableListStore.filterLastname}
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
              valueFieldNameIdCard={
                accountReceivableListStore.filterGuarantorIdCardNo
              }
              valueFieldNameFirstname={
                accountReceivableListStore.filterGuarantorFirstname
              }
              valueFieldNameLastname={
                accountReceivableListStore.filterGuarantorLastname
              }
              size="mini"
            />
          </React.Fragment>
        );
    }
  }
  private onSearch = () => {
    const { accountReceivableListStore } = this.props;
    accountReceivableListStore.setField({ fieldname: "currentPage", value: 1 });
    accountReceivableListStore.load_data();
    const elmnt = document.getElementById("searchTable");
    if (elmnt) elmnt.scrollIntoView();
  };
  private onChangeFiscalYearDDL = (value: string) => {
    const { accountReceivableListStore } = this.props;
    accountReceivableListStore!.setField({
      fieldname: "filterFiscalYear",
      value
    });
  };
  private onChangeOrganizationDDL = (value: string) => {
    const { accountReceivableListStore } = this.props;
    accountReceivableListStore!.setField({
      fieldname: "filterOrganizationId",
      value
    });
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { accountReceivableListStore } = this.props;
    accountReceivableListStore!.setField({ fieldname, value });
  };
  private resetFilter = async () => {
    const { accountReceivableListStore } = this.props;
    await accountReceivableListStore.resetFilter();
    await accountReceivableListStore.load_data();
    await this.orgList.setField({
      fieldname: "filterName",
      value: ""
    });
    await this.orgList.load_data();
  };
  private onClickLink = () => {
    const { accountReceivableListStore } = this.props;
    let url = process.env.REACT_APP_API_ODOO_ENDPOINT;
    window.open(url + "/odf_debt_book.php?" + "OrganizationId=" + accountReceivableListStore!.filterOrganizationId + "&FiscalYear=" + accountReceivableListStore!.filterFiscalYear, '_blank');
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
