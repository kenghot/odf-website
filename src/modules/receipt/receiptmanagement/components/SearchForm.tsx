import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Icon, Segment } from "semantic-ui-react";
import { SearchDateRange } from ".";
import { IAppModel } from "../../../../AppModel";
import { Link } from "../../../../components/common";
import { OrganizationDDL } from "../../../admin/organization/components";
import { OrgListModel } from "../../../admin/organization/OrgListModel";
import { PosListModel } from "../../../pos/PosListModel";
import { PosDDL } from "../../../pos/posmanagement/components";
import { IReceiptListModel } from "../../ReceiptListModel";

interface ISearchForm extends WithTranslation {
  receiptListStore: IReceiptListModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class SearchForm extends React.Component<ISearchForm> {
  public state = { openheader: false };
  private orgList = OrgListModel.create({});
  private posList = PosListModel.create({});
  public render() {
    const { t } = this.props;
    return (
      <Segment padded="very">
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
              content={t("module.receipt.searchForm.content")}
              subheader={t("module.receipt.searchForm.subheader")}
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
    const { t, receiptListStore, appStore } = this.props;
    return (
      <Form.Group widths="equal">
        <Form.Input
          fluid
          label={t("module.receipt.searchForm.filterDocumentNumber")}
          placeholder={t(
            "module.receipt.searchForm.placeholderFilterDocumentNumber"
          )}
          onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
            this.onChangeInputField("filterDocumentNumber", data.value)
          }
          value={receiptListStore.filterDocumentNumber}
        />
        <Form.Field
          label={t("module.receipt.searchForm.filterPosName")}
          placeholder={t("module.receipt.searchForm.placeholderFilterPosName")}
          control={PosDDL}
          value={receiptListStore.filterPosId}
          posList={this.posList}
          onChange={this.onChangePosDDL}
        />
        <Form.Field
          label={t("module.receipt.searchForm.filterOrganizationId")}
          placeholder={t(
            "module.receipt.searchForm.placeholderFilterOrganizationId"
          )}
          control={OrganizationDDL}
          value={receiptListStore.filterOrganizationId}
          orgList={this.orgList}
          onChange={this.onChangeOrganizationDDL}
        />
        <Form.Select
          search
          fluid
          clearable
          label={t("module.receipt.searchForm.filterStatus")}
          placeholder={t("module.receipt.searchForm.placeholderFilterStatus")}
          options={appStore!.enumItems("receiptStatus")}
          onChange={(event, data) =>
            this.onChangeInputField("filterStatus", data.value)
          }
          value={receiptListStore.filterStatus}
        />
      </Form.Group>
    );
  }

  private renderOpenHeader() {
    const { t, receiptListStore, appStore } = this.props;
    return (
      <React.Fragment>
        {this.renderHideHeader()}
        <Form.Field
          label={t("module.receipt.searchForm.filterDate")}
          width={16}
          control={SearchDateRange}
          onChangeInputField={this.onChangeInputField}
          inputFieldNameStartDate="filterStartDate"
          inputFieldNameEndDate="filterEndDate"
          valueFieldNameStartDate={receiptListStore.filterStartDate}
          valueFieldNameEndDate={receiptListStore.filterEndDate}
          size="mini"
        />
        <Form.Group widths="equal">
          <Form.Select
            search
            fluid
            clearable
            label={t("module.receipt.searchForm.filterClientType")}
            placeholder={t(
              "module.receipt.searchForm.placeholderFilterClientType"
            )}
            options={appStore!.enumItems("clientType")}
            onChange={(event, data) =>
              this.onChangeInputField("filterClientType", data.value)
            }
            value={receiptListStore.filterClientType}
          />
          <Form.Input
            fluid
            label={t("module.receipt.searchForm.filterClientTaxNumber")}
            placeholder={t(
              "module.receipt.searchForm.placeholderFilterClientTaxNumber"
            )}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("filterClientTaxNumber", data.value)
            }
            value={receiptListStore.filterClientTaxNumber}
          />
          <Form.Input
            fluid
            label={t("module.receipt.searchForm.filterClientName")}
            placeholder={t(
              "module.receipt.searchForm.placeholderFilterClientName"
            )}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("filterClientName", data.value)
            }
            value={receiptListStore.filterClientName}
          />
        </Form.Group>
      </React.Fragment>
    );
  }
  private onSearch = () => {
    const { receiptListStore } = this.props;
    receiptListStore.setField({
      fieldname: "currentPage",
      value: 1
    });
    receiptListStore.load_data();
    const elmnt = document.getElementById("searchTable");
    if (elmnt) elmnt.scrollIntoView();
  };

  private onChangeOrganizationDDL = (value: string) => {
    const { receiptListStore } = this.props;
    receiptListStore.setField({
      fieldname: "filterOrganizationId",
      value
    });
  };
  private onChangePosDDL = (value: string) => {
    const { receiptListStore } = this.props;
    receiptListStore.setField({
      fieldname: "filterPosId",
      value
    });
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { receiptListStore } = this.props;
    receiptListStore.setField({ fieldname, value });
  };
  private resetFilter = async () => {
    const { receiptListStore } = this.props;
    await receiptListStore.resetFilter();
    await receiptListStore.load_data();
    await this.orgList.setField({
      fieldname: "filterName",
      value: ""
    });
    await this.posList.setField({
      fieldname: "filterPosName",
      value: ""
    });
    await this.posList.load_data();
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
