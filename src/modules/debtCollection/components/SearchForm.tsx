import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Icon, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { DateInput, Link } from "../../../components/common";
import {
  SearchByTargetInfoForm,
  SearchOverdueByDateRange
} from "../../../components/search";
import {
  DEATHNOTIFICATION,
  STEP_STATUS,
  STEP_STATUS_DIES
} from "../../../constants";
import { OrganizationDDL } from "../../admin/organization/components";
import { OrgListModel } from "../../admin/organization/OrgListModel";
import { IDebtCollectionListModel } from "../DebtCollectionListModel";

interface ISearchForm extends WithTranslation {
  searchDebtCollectionListPageStore: IDebtCollectionListModel;
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
                "module.debtCollection.searchForm.searchForOutstandingReceivables"
              )}
              subheader={t(
                "module.debtCollection.searchForm.AbleRetrieveOverdueAccountsWithinScopeResponsibilityOnly"
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
    const { t, searchDebtCollectionListPageStore, appStore } = this.props;
    return (
      <Form.Group widths="equal">
        <Form.Input
          fluid
          label={t("module.debtCollection.searchForm.agreementNumber")}
          placeholder={t("module.debtCollection.searchForm.agreementNumber")}
          onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
            this.onChangeInputField("filterArDocumentNumber", data.value)
          }
          value={searchDebtCollectionListPageStore.filterArDocumentNumber}
        />
        <Form.Field
          label={t("module.debtCollection.searchForm.agreementingOrganization")}
          placeholder={t(
            "module.debtCollection.searchForm.pleaseSelectOrganization"
          )}
          control={OrganizationDDL}
          value={searchDebtCollectionListPageStore.filterOrganizationId}
          orgList={this.orgList}
          onChange={this.onChangeOrganizationDDL}
        />
        <Form.Field
          label={t("module.debtCollection.searchForm.filterAsOfYearMonth")}
          control={DateInput}
          type="month"
          formatdate="MMMM"
          value={searchDebtCollectionListPageStore.filterAsOfYearMonth}
          fieldName={"filterAsOfYearMonth"}
          onChangeInputField={this.onChangeInputField}
          id={"input-search-filter-as-of-year-month"}
        />
        <Form.Select
          search
          fluid
          clearable
          label={t("module.debtCollection.searchForm.creditStatus")}
          placeholder={t(
            "module.debtCollection.searchForm.placeholderCreditStatus"
          )}
          options={appStore!.enumItemsDescription("creditStatus")}
          onChange={(event, data) =>
            this.onChangeInputField("filterCreditStatus", data.value)
          }
          value={searchDebtCollectionListPageStore.filterCreditStatus}
        />
      </Form.Group>
    );
  }

  private renderOpenHeader() {
    const { t, searchDebtCollectionListPageStore, appStore } = this.props;
    return (
      <React.Fragment>
        {this.renderHideHeader()}
        <Form.Group widths="equal">
          <Form.Select
            search
            fluid
            clearable
            label={t("module.debtCollection.searchForm.category")}
            placeholder={t(
              "module.debtCollection.searchForm.pleaseSelectCategory"
            )}
            options={appStore!.enumItems("loanType")}
            onChange={(event, data) =>
              this.onChangeInputField("filterAgreementType", data.value)
            }
            value={searchDebtCollectionListPageStore.filterAgreementType}
          />
          <Form.Select
            search
            fluid
            clearable
            label={t(
              "module.debtCollection.searchForm.filterDeathNotification"
            )}
            placeholder={t(
              "module.debtCollection.searchForm.placeholderFilterDeathNotification"
            )}
            options={DEATHNOTIFICATION}
            onChange={(event, data) =>
              this.onChangeInputField("filterDeathNotification", data.value)
            }
            value={
              searchDebtCollectionListPageStore.filterDeathNotification || ""
            }
          />
          <Form.Select
            search
            fluid
            clearable
            label={t("module.debtCollection.searchForm.dunningPhase")}
            placeholder={t(
              "module.debtCollection.searchForm.pleaseSelectDunningPhase"
            )}
            options={
              searchDebtCollectionListPageStore.filterDeathNotification ===
              "true"
                ? STEP_STATUS_DIES
                : STEP_STATUS
            }
            onChange={(event, data) =>
              this.onChangeInputField("filterStep", data.value)
            }
            value={searchDebtCollectionListPageStore.filterStep || ""}
          />
          <Form.Select
            search
            fluid
            clearable
            label={t("module.debtCollection.searchForm.filterStatus")}
            placeholder={t(
              "module.debtCollection.searchForm.placeholderFilterStatus"
            )}
            options={appStore!.enumItemsDescription("accountReceivableStatus")}
            onChange={(event, data) =>
              this.onChangeInputField("filterStatus", data.value)
            }
            value={searchDebtCollectionListPageStore.filterStatus}
          />
        </Form.Group>
        {this.renderCheckType()}
        <Form.Field
          label={t(
            "module.debtCollection.searchForm.chooseAccordingDateDelivery"
          )}
          width={16}
          control={SearchOverdueByDateRange}
          onChangeInputField={this.onChangeInputField}
          inputFieldNameStartDate="filterNoPaymentStart"
          inputFieldNameEndDate="filterNoPaymentEnd"
          valueFieldNameStartDate={
            searchDebtCollectionListPageStore.filterNoPaymentStart
          }
          valueFieldNameEndDate={
            searchDebtCollectionListPageStore.filterNoPaymentEnd
          }
          size="mini"
        />
        <Form.Field
          label={t("module.debtCollection.searchForm.chooseEndDateAge")}
          width={16}
          control={SearchOverdueByDateRange}
          onChangeInputField={this.onChangeInputField}
          inputFieldNameStartDate="filterPrescriptionRemainingStartDate"
          inputFieldNameEndDate="filterPrescriptionRemainingEndDate"
          valueFieldNameStartDate={
            searchDebtCollectionListPageStore.filterPrescriptionRemainingStartDate
          }
          valueFieldNameEndDate={
            searchDebtCollectionListPageStore.filterPrescriptionRemainingEndDate
          }
          size="mini"
        />
      </React.Fragment>
    );
  }

  private renderCheckType() {
    const { t, searchDebtCollectionListPageStore } = this.props;
    switch (searchDebtCollectionListPageStore.filterAgreementType) {
      case "G":
        searchDebtCollectionListPageStore.resetFilterBorrower();
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
            value={searchDebtCollectionListPageStore.filterName}
          />
        );
      default:
        searchDebtCollectionListPageStore.setField({
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
              valueFieldNameIdCard={
                searchDebtCollectionListPageStore.filterIdCardNo
              }
              valueFieldNameFirstname={
                searchDebtCollectionListPageStore.filterFirstname
              }
              valueFieldNameLastname={
                searchDebtCollectionListPageStore.filterLastname
              }
              size="mini"
            />
            {/* <Form.Field
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
            /> */}
          </React.Fragment>
        );
    }
  }
  private onSearch = () => {
    const { searchDebtCollectionListPageStore } = this.props;
    searchDebtCollectionListPageStore.setField({
      fieldname: "currentPage",
      value: 1
    });
    searchDebtCollectionListPageStore.load_data();
    const elmnt = document.getElementById("searchTable");
    if (elmnt) elmnt.scrollIntoView();
  };
  private onChangeOrganizationDDL = (value: string) => {
    const { searchDebtCollectionListPageStore } = this.props;
    searchDebtCollectionListPageStore.setField({
      fieldname: "filterOrganizationId",
      value
    });
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { searchDebtCollectionListPageStore } = this.props;
    searchDebtCollectionListPageStore.setField({ fieldname, value });
  };
  private resetFilter = async () => {
    const { searchDebtCollectionListPageStore } = this.props;
    await searchDebtCollectionListPageStore.resetFilter();
    await searchDebtCollectionListPageStore.load_data();
    await this.orgList.setField({
      fieldname: "filterName",
      value: ""
    });
    await this.orgList.load_data();
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
