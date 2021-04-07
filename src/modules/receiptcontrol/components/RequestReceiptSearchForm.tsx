import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Icon, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { Link } from "../../../components/common";
import { SearchOverdueByDateRange } from "../../../components/search";
import { OrganizationDDL } from "../../admin/organization/components";
import { OrgListModel } from "../../admin/organization/OrgListModel";
import { IReceiptControlLogListModel } from "../ReceiptControlLogListModel";
import ReceiptControlLogStatusDDL from "./ReceiptControlLogStatusDDL";

interface IRequestReceiptSearchForm extends WithTranslation {
  searchReceiptControlLogListStore: IReceiptControlLogListModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class RequestReceiptSearchForm extends React.Component<
  IRequestReceiptSearchForm
> {
  public state = { openheader: false };
  private orgList = OrgListModel.create({});
  public render() {
    const { t } = this.props;
    return (
      <Segment basic style={styles.contanier}>
        {this.renderHeader()}
        <Form size="mini">{this.renderHideHeader()}</Form>
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
                "module.receiptcontrol.requestReceiptSearchForm.searchForRequestReceiptControl"
              )}
              subheader={t(
                "module.receiptcontrol.requestReceiptSearchForm.searchForRequestReceiptControlDescription"
              )}
              style={styles.header}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  private renderHideHeader() {
    const { t, searchReceiptControlLogListStore } = this.props;
    return (
      <React.Fragment>
        <Form.Group widths="equal">
          <Form.Field
            label={t(
              "module.receiptcontrol.requestReceiptSearchForm.organization"
            )}
            placeholder={t(
              "module.receiptcontrol.requestReceiptSearchForm.pleaseSelectOrganization"
            )}
            control={OrganizationDDL}
            value={searchReceiptControlLogListStore.filterOrganizationId}
            orgList={this.orgList}
            onChange={this.onChangeOrganizationDDL}
            size="mini"
            width={8}
          />
          <Form.Field
            label={t("module.receiptcontrol.requestReceiptSearchForm.status")}
            placeholder={t(
              "module.receiptcontrol.requestReceiptSearchForm.pleaseSelectStatus"
            )}
            control={ReceiptControlLogStatusDDL}
            value={searchReceiptControlLogListStore.filterStatus}
            onChange={this.onChangeReceiptControlLogStatusDDL}
            size="mini"
            width={8}
          />
        </Form.Group>
        <Form.Field
          label={t(
            "module.receiptcontrol.requestReceiptSearchForm.chooseStartDateAndEndDate"
          )}
          width={16}
          control={SearchOverdueByDateRange}
          onChangeInputField={this.onChangeInputField}
          inputFieldNameStartDate="filterStartDate"
          inputFieldNameEndDate="filterEndDate"
          valueFieldNameStartDate={
            searchReceiptControlLogListStore.filterStartDate
          }
          valueFieldNameEndDate={searchReceiptControlLogListStore.filterEndDate}
          size="mini"
        />
      </React.Fragment>
    );
  }

  private onSearch = () => {
    const { searchReceiptControlLogListStore } = this.props;
    searchReceiptControlLogListStore.setField({
      fieldname: "currentPage",
      value: 1
    });
    searchReceiptControlLogListStore.load_data();
    const elmnt = document.getElementById("searchTable");
    if (elmnt) elmnt.scrollIntoView();
  };

  private onChangeOrganizationDDL = (value: string) => {
    const { searchReceiptControlLogListStore } = this.props;
    searchReceiptControlLogListStore.setField({
      fieldname: "filterOrganizationId",
      value
    });
  };

  private onChangeReceiptControlLogStatusDDL = (value: string) => {
    const { searchReceiptControlLogListStore } = this.props;
    searchReceiptControlLogListStore.setField({
      fieldname: "filterStatus",
      value
    });
  };

  private onChangeInputField = (fieldname: string, value: any) => {
    const { searchReceiptControlLogListStore } = this.props;
    searchReceiptControlLogListStore.setField({ fieldname, value });
  };

  private resetFilter = async () => {
    const { searchReceiptControlLogListStore } = this.props;
    await searchReceiptControlLogListStore.resetFilter();
    await searchReceiptControlLogListStore.load_data();
    await this.orgList.setField({
      fieldname: "filterName",
      value: ""
    });
    await this.orgList.load_data();
  };
}

const styles: any = {
  contanier: {
    padding: 0
  },
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

export default withTranslation()(RequestReceiptSearchForm);
