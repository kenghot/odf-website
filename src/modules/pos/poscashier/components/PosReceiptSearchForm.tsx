import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Icon, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import { Link } from "../../../../components/common";
import { OrgListModel } from "../../../admin/organization/OrgListModel";
import { IReceiptListModel } from "../../../receipt/ReceiptListModel";
import { SearchDateRange } from "../../../receipt/receiptmanagement/components";
import { IPosModel } from "../../PosModel";

interface IPosReceiptSearchForm extends WithTranslation {
  receiptList: IReceiptListModel;
  pos: IPosModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class PosReceiptSearchForm extends React.Component<IPosReceiptSearchForm> {
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
              content={t("module.pos.posReceiptSearchForm.content")}
              subheader={t("module.pos.posReceiptSearchForm.subheader")}
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
    const { t, receiptList, appStore } = this.props;
    return (
      <React.Fragment>
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
            value={receiptList.filterDocumentNumber}
          />
          <Form.Select
            search
            width={8}
            fluid
            clearable
            label={t("module.receipt.searchForm.filterStatus")}
            placeholder={t("module.receipt.searchForm.placeholderFilterStatus")}
            options={appStore!.enumItems("receiptStatus")}
            onChange={(event, data) =>
              this.onChangeInputField("filterStatus", data.value)
            }
            value={receiptList.filterStatus}
          />
        </Form.Group>
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
            value={receiptList.filterClientType}
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
            value={receiptList.filterClientTaxNumber}
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
            value={receiptList.filterClientName}
          />
        </Form.Group>
      </React.Fragment>
    );
  }

  private renderOpenHeader() {
    const { t, receiptList, appStore } = this.props;
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
          valueFieldNameStartDate={receiptList.filterStartDate}
          valueFieldNameEndDate={receiptList.filterEndDate}
          size="mini"
        />
      </React.Fragment>
    );
  }
  private onSearch = async () => {
    const { receiptList, pos } = this.props;
    try {
      await receiptList.setField({ fieldname: "currentPage", value: 1 });
      await receiptList.load_data(pos.id, true);
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    } catch (e) {
      console.log(e);
    }
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { receiptList } = this.props;
    receiptList.setField({ fieldname, value });
  };
  private resetFilter = async () => {
    const { receiptList, pos } = this.props;
    try {
      await receiptList.resetFilter(pos.id, true);
      await receiptList.load_data(pos.id, true);
      await this.orgList.setField({
        fieldname: "filterName",
        value: ""
      });
      await this.orgList.load_data();
    } catch (e) {
      console.log(e);
    }
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

export default withTranslation()(PosReceiptSearchForm);
