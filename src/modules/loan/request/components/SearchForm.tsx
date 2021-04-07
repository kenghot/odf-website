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
import { IRequestListModel } from "../RequestListModel";

interface ISearchForm extends WithTranslation {
  requestlistStore: IRequestListModel;
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
              content={t("module.loan.searchFormRequest.title")}
              subheader={t("module.loan.searchFormRequest.description")}
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
  private renderOpenHeader() {
    const { t, requestlistStore, appStore } = this.props;
    return (
      <React.Fragment>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label={t("module.loan.searchFormRequest.documentNumber")}
            placeholder={t(
              "module.loan.searchFormRequest.documentNumberPlaceholder"
            )}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("filterDocumentNumber", data.value)
            }
            value={requestlistStore.filterDocumentNumber}
          />
          <Form.Field
            label={t("module.loan.searchForm.organization")}
            placeholder={t("module.loan.searchForm.organizationPlaceholder")}
            control={OrganizationDDL}
            value={requestlistStore.filterOrganizationId}
            orgList={this.orgList}
            onChange={this.onChangeOrganizationDDL}
          />
          <Form.Select
            search
            fluid
            label={t("module.loan.searchFormRequest.status")}
            placeholder={t("module.loan.searchFormRequest.statusPlaceholder")}
            clearable
            options={appStore!.enumItems("requestStatus")}
            onChange={(event, data) =>
              this.onChangeInputField("filterStatus", data.value)
            }
            value={requestlistStore.filterStatus}
          />
          <Form.Select
            search
            fluid
            clearable
            label={t("module.loan.searchForm.category")}
            placeholder={t("module.loan.searchForm.pleaseSelectCategory")}
            options={appStore!.enumItems("loanType")}
            onChange={(event, data) =>
              this.onChangeInputField("filterRequestType", data.value)
            }
            value={requestlistStore.filterRequestType}
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
          valueFieldNameStartDate={requestlistStore.filterStartDate}
          valueFieldNameEndDate={requestlistStore.filterEndDate}
          filterFiscalYear={requestlistStore.filterFiscalYear}
          onChangeFiscalYearDDL={this.onChangeFiscalYearDDL}
          size="mini"
        />
      </React.Fragment>
    );
  }
  private renderHideHeader() {
    const { t, requestlistStore, appStore } = this.props;
    return (
      <Form.Group widths="equal">
        <Form.Input
          fluid
          label={t("module.loan.searchFormRequest.documentNumber")}
          placeholder={t(
            "module.loan.searchFormRequest.documentNumberPlaceholder"
          )}
          onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
            this.onChangeInputField("filterDocumentNumber", data.value)
          }
          value={requestlistStore.filterDocumentNumber}
        />
        <Form.Input
          fluid
          label={t("module.loan.searchFormRequest.cardNumberBorrower")}
          placeholder={t("module.loan.searchForm.identifyIDCardNumber")}
          onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
            this.onChangeInputField("filterIdCardNo", data.value)
          }
          value={requestlistStore.filterIdCardNo}
        />
        <Form.Select
          search
          fluid
          label={t("module.loan.searchFormRequest.status")}
          placeholder={t("module.loan.searchFormRequest.statusPlaceholder")}
          clearable
          options={appStore!.enumItems("requestStatus")}
          onChange={(event, data) =>
            this.onChangeInputField("filterStatus", data.value)
          }
          value={requestlistStore.filterStatus}
        />
      </Form.Group>
    );
  }
  private renderCheckType() {
    const { t, requestlistStore } = this.props;
    switch (requestlistStore.filterRequestType) {
      case "G":
        requestlistStore.resetFilterBorrower();
        return (
          <Form.Input
            fluid
            label={t("module.loan.searchForm.groupName")}
            placeholder={t("module.loan.searchForm.specifyGroupName")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("filterName", data.value)
            }
            value={requestlistStore.filterName}
          />
        );
      default:
        requestlistStore.setField({
          fieldname: "filterName",
          value: ""
        });
        return (
          <Form.Field
            label={t("module.loan.searchForm.borrowerInfo")}
            width={16}
            control={SearchByTargetInfoForm}
            onChangeInputField={this.onChangeInputField}
            inputFieldNameIdCard="filterIdCardNo"
            inputFieldNameFirstname="filterFirstname"
            inputFieldNameLastname="filterLastname"
            valueFieldNameIdCard={requestlistStore.filterIdCardNo}
            valueFieldNameFirstname={requestlistStore.filterFirstname}
            valueFieldNameLastname={requestlistStore.filterLastname}
            size="mini"
          />
        );
    }
  }
  private onSearch = () => {
    const { requestlistStore, onSearchPage } = this.props;
    requestlistStore.setField({
      fieldname: "currentPage",
      value: 1
    });
    requestlistStore.load_data();
    onSearchPage!();
    const elmnt = document.getElementById("searchTable");
    if (elmnt) elmnt.scrollIntoView();
  };
  private resetFilter = async () => {
    const { requestlistStore, onSearchPage } = this.props;
    await requestlistStore.resetFilter();
    await requestlistStore.load_data();
    await this.orgList.setField({
      fieldname: "filterName",
      value: ""
    });
    await this.orgList.load_data();
    onSearchPage!(true);
  };
  private onChangeOrganizationDDL = (value: string) => {
    const { requestlistStore } = this.props;
    requestlistStore.setField({
      fieldname: "filterOrganizationId",
      value
    });
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { requestlistStore } = this.props;
    requestlistStore.setField({ fieldname, value });
  };
  private onChangeFiscalYearDDL = (value: string) => {
    const { requestlistStore } = this.props;
    requestlistStore.setField({ fieldname: "filterFiscalYear", value });
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
