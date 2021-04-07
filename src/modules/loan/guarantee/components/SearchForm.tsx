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
import { IGuaranteeListModel } from "../GuaranteeListModel";

interface ISearchForm extends WithTranslation {
  guaranteeListStore: IGuaranteeListModel;
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
              content={t("module.loan.searchFormGuarantee.title")}
              subheader={t("module.loan.searchFormGuarantee.description")}
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
    const { t, guaranteeListStore, appStore } = this.props;
    return (
      <Form.Group widths="equal">
        <Form.Input
          fluid
          label={t("module.loan.searchFormGuarantee.documentNumber")}
          placeholder={t(
            "module.loan.searchFormGuarantee.documentNumberPlaceholder"
          )}
          onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
            this.onChangeInputField("filterDocumentNumber", data.value)
          }
          value={guaranteeListStore.filterDocumentNumber}
        />
        <Form.Input
          fluid
          label={t("module.loan.searchFormGuarantee.cardNumberGuarantor")}
          placeholder={t("module.loan.searchForm.identifyIDCardNumber")}
          onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
            this.onChangeInputField("filterIdCardNo", data.value)
          }
          value={guaranteeListStore.filterIdCardNo}
        />
        <Form.Select
          search
          fluid
          clearable
          label={t("module.loan.searchFormGuarantee.status")}
          placeholder={t("module.loan.searchFormGuarantee.statusPlaceholder")}
          options={appStore!.enumItems("guaranteeStatus")}
          onChange={(event, data) =>
            this.onChangeInputField("filterStatus", data.value)
          }
          value={guaranteeListStore.filterStatus}
        />
      </Form.Group>
    );
  }
  private renderOpenHeader() {
    const { t, guaranteeListStore, appStore } = this.props;
    return (
      <React.Fragment>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label={t("module.loan.searchFormGuarantee.documentNumber")}
            placeholder={t(
              "module.loan.searchFormGuarantee.documentNumberPlaceholder"
            )}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("filterDocumentNumber", data.value)
            }
            value={guaranteeListStore.filterDocumentNumber}
          />
          <Form.Field
            label={t("module.loan.searchForm.organization")}
            placeholder={t("module.loan.searchForm.organizationPlaceholder")}
            control={OrganizationDDL}
            value={guaranteeListStore.filterOrganizationId}
            orgList={this.orgList}
            onChange={this.onChangeOrganizationDDL}
          />
          <Form.Select
            search
            fluid
            clearable
            label={t("module.loan.searchFormGuarantee.status")}
            placeholder={t("module.loan.searchFormGuarantee.statusPlaceholder")}
            options={appStore!.enumItems("guaranteeStatus")}
            onChange={(event, data) =>
              this.onChangeInputField("filterStatus", data.value)
            }
            value={guaranteeListStore.filterStatus}
          />
          <Form.Select
            search
            fluid
            clearable
            label={t("module.loan.searchForm.category")}
            placeholder={t("module.loan.searchForm.pleaseSelectCategory")}
            options={appStore!.enumItems("loanType")}
            onChange={(event, data) =>
              this.onChangeInputField("filterGuaranteeType", data.value)
            }
            value={guaranteeListStore.filterGuaranteeType}
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
          valueFieldNameStartDate={guaranteeListStore.filterStartDate}
          valueFieldNameEndDate={guaranteeListStore.filterEndDate}
          filterFiscalYear={guaranteeListStore.filterFiscalYear}
          onChangeFiscalYearDDL={this.onChangeFiscalYearDDL}
          size="mini"
        />
      </React.Fragment>
    );
  }

  private renderCheckType() {
    const { t, guaranteeListStore } = this.props;
    switch (guaranteeListStore.filterGuaranteeType) {
      case "G":
        guaranteeListStore.resetFilterBorrower();
        return (
          <Form.Input
            fluid
            label={t("module.loan.searchForm.groupName")}
            placeholder={t("module.loan.searchForm.specifyGroupName")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("filterName", data.value)
            }
            value={guaranteeListStore.filterName}
          />
        );
      default:
        guaranteeListStore.setField({
          fieldname: "filterName",
          value: ""
        });
        return (
          <Form.Field
            label={t("module.loan.searchForm.guarantorInfo")}
            width={16}
            control={SearchByTargetInfoForm}
            onChangeInputField={this.onChangeInputField}
            inputFieldNameIdCard="filterIdCardNo"
            inputFieldNameFirstname="filterFirstname"
            inputFieldNameLastname="filterLastname"
            valueFieldNameIdCard={guaranteeListStore.filterIdCardNo}
            valueFieldNameFirstname={guaranteeListStore.filterFirstname}
            valueFieldNameLastname={guaranteeListStore.filterLastname}
            size="mini"
          />
        );
    }
  }
  private onSearch = () => {
    const { guaranteeListStore } = this.props;
    guaranteeListStore.setField({
      fieldname: "currentPage",
      value: 1
    });
    guaranteeListStore.load_data();
    const elmnt = document.getElementById("searchTable");
    if (elmnt) elmnt.scrollIntoView();
  };
  private onChangeOrganizationDDL = (value: string) => {
    const { guaranteeListStore } = this.props;
    guaranteeListStore.setField({
      fieldname: "filterOrganizationId",
      value
    });
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { guaranteeListStore } = this.props;
    guaranteeListStore.setField({ fieldname, value });
  };
  private onChangeFiscalYearDDL = (value: string) => {
    const { guaranteeListStore } = this.props;
    guaranteeListStore.setField({ fieldname: "filterFiscalYear", value });
  };
  private resetFilter = async () => {
    const { guaranteeListStore } = this.props;
    await guaranteeListStore.resetFilter();
    await guaranteeListStore.load_data();
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
