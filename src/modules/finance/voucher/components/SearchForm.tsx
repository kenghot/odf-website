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

import { IVoucherListModel } from "../VoucherListModel";

interface IPaymentVoucherForm extends WithTranslation {
  voucherListStore: IVoucherListModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class SearchForm extends React.Component<IPaymentVoucherForm> {
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
                {t("module.finance.PaymentVoucherForm.cancelAllFilters")}
              </Link>
              <Button
                icon
                labelPosition="left"
                color="blue"
                style={styles.button}
                onClick={this.onSearch}
              >
                {t("module.finance.PaymentVoucherForm.searching")}
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
              content={t("module.finance.PaymentVoucherForm.findingVoucher")}
              subheader={t(
                "module.finance.PaymentVoucherForm.findingVoucherDescription"
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
    const { t, voucherListStore, appStore } = this.props;
    return (
      <Form.Group widths="equal">
        <Form.Input
          fluid
          label={t("module.finance.PaymentVoucherForm.documentNumber")}
          placeholder={t(
            "module.finance.PaymentVoucherForm.documentNumberPlaceholder"
          )}
          onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
            this.onChangeInputField("filterDocumentNumber", data.value)
          }
          value={voucherListStore.filterDocumentNumber}
        />
        <Form.Field
          label={t("module.finance.PaymentVoucherForm.organization")}
          placeholder={t(
            "module.finance.PaymentVoucherForm.organizationPlaceholder"
          )}
          control={OrganizationDDL}
          value={voucherListStore.filterOrganizationId}
          orgList={this.orgList}
          onChange={this.onChangeOrganizationDDL}
        />
        <Form.Select
          search
          fluid
          label={t("module.finance.PaymentVoucherForm.status")}
          placeholder={t("module.finance.PaymentVoucherForm.statusPlaceholder")}
          options={appStore!.enumItems("voucherStatus")}
          onChange={(event, data) =>
            this.onChangeInputField("filterStatus", data.value)
          }
          value={voucherListStore.filterStatus}
        />
        <Form.Input
          fluid
          label={t("module.finance.PaymentVoucherForm.documentRef")}
          placeholder={t(
            "module.finance.PaymentVoucherForm.documentRefPlaceholder"
          )}
          options={appStore!.enumItems("loanType")}
          onChange={(event, data) =>
            this.onChangeInputField("filterRefDocumentNumber", data.value)
          }
          value={voucherListStore.filterRefDocumentNumber}
        />
      </Form.Group>
    );
  }
  private renderOpenHeader() {
    const { t, voucherListStore } = this.props;
    return (
      <React.Fragment>
        {this.renderHideHeader()}
        <Form.Field
          label={t("module.finance.PaymentVoucherForm.payeeInformation")}
          width={16}
          control={SearchByTargetInfoForm}
          onChangeInputField={this.onChangeInputField}
          inputFieldNameIdCard="filterIdCardNo"
          inputFieldNameFirstname="filterFirstname"
          inputFieldNameLastname="filterLastname"
          valueFieldNameIdCard={voucherListStore.filterIdCardNo}
          valueFieldNameFirstname={voucherListStore.filterFirstname}
          valueFieldNameLastname={voucherListStore.filterLastname}
          size="mini"
        />
        <Form.Field
          label={t("module.finance.PaymentVoucherForm.selectedDateRange")}
          width={16}
          control={SearchOverdueByDateRange}
          onChangeInputField={this.onChangeInputField}
          inputFieldNameStartDate="filterStartDate"
          inputFieldNameEndDate="filterEndDate"
          valueFieldNameStartDate={voucherListStore.filterStartDate}
          valueFieldNameEndDate={voucherListStore.filterEndDate}
          size="mini"
          filterFiscalYear={voucherListStore.filterFiscalYear}
          onChangeFiscalYearDDL={this.onChangeFiscalYearDDL}
        />
      </React.Fragment>
    );
  }

  private onSearch = async () => {
    const { voucherListStore } = this.props;
    await voucherListStore.setField({
      fieldname: "currentPage",
      value: 1
    });
    await voucherListStore.onSeachVoucherList();
    const elmnt = document.getElementById("voucherListTable");
    if (elmnt) elmnt.scrollIntoView();
  };

  private resetFilter = async () => {
    const { voucherListStore } = this.props;
    await voucherListStore.resetFilter();
    await voucherListStore.onSeachVoucherList();
    await this.orgList.setField({
      fieldname: "filterName",
      value: ""
    });
    await this.orgList.load_data();
  };

  private onChangeOrganizationDDL = (value: string) => {
    const { voucherListStore } = this.props;
    voucherListStore.setField({
      fieldname: "filterOrganizationId",
      value
    });
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { voucherListStore } = this.props;
    voucherListStore.setField({ fieldname, value });
  };
  private onChangeFiscalYearDDL = (value: string) => {
    const { voucherListStore } = this.props;
    voucherListStore.setField({ fieldname: "filterFiscalYear", value });
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
