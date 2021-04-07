import { inject, observer } from "mobx-react";
import { clone } from "mobx-state-tree";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Modal,
  Segment
} from "semantic-ui-react";
import { PosLoanPayBackSearchTable } from ".";
import { IAppModel } from "../../../../AppModel";
import { Link } from "../../../../components/common";
import { CurrencyInput } from "../../../../components/common/input";
import { Loading } from "../../../../components/common/loading";
import { AccountReceivableListModel } from "../../../accountReceivable/AccountReceivableListModel";
import { AccountReceivableModel } from "../../../accountReceivable/AccountReceivableModel";
import { IReceiptModel, ReceiptItem } from "../../../receipt/ReceiptModel";

interface IPosLoanPayback extends WithTranslation {
  receipt: IReceiptModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class PosLoanPayback extends React.Component<IPosLoanPayback> {
  public state = {
    openheader: false,
    open: false
  };
  private accountReceivable = AccountReceivableModel.create({});
  private receiptItem = ReceiptItem.create({});
  private accountReceivableList = AccountReceivableListModel.create({});
  public close = () => this.setState({ open: false });
  public componentWillUnmount() {
    this.receiptItem.resetAll();
    this.accountReceivableList.resetAll();
    this.accountReceivable.resetAll();
  }
  public render() {
    const { t } = this.props;
    return (
      <Segment padded>
        {this.renderHeader()}
        <Form>
          <Loading active={this.accountReceivableList.loading} />
          {this.state.openheader
            ? this.renderOpenHeader()
            : this.renderHideHeader()}
          {this.renderButtonSearch()}
        </Form>
        <br />
        <Form onSubmit={() => this.onAdd()}>
          <Form.Input
            required
            readOnly
            fluid
            label={t("module.pos.posLoanPayBack.ref1")}
            placeholder={t("module.pos.posLoanPayBack.ref1Placeholder")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("ref1", data.value)
            }
            value={this.receiptItem.ref1}
          />
          <Form.Input
            required
            readOnly
            fluid
            label={t("module.pos.posLoanPayBack.ref2")}
            placeholder={t("module.pos.posLoanPayBack.ref2Placeholder")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("ref2", data.value)
            }
            value={this.receiptItem.ref2}
          />
          <Form.Field
            label={t("module.pos.posLoanPayBack.price")}
            control={CurrencyInput}
            id={`input-pos-posLoanPayBack-price`}
            value={this.receiptItem.price}
            onChangeInputField={this.onChangeInputFieldPrice}
            fieldName={"price"}
          />
          {this.renderButtonAdd()}
        </Form>
        {this.renderModal()}
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
              content={t("module.pos.posLoanPayBack.contentHeader")}
              subheader={t("module.pos.posLoanPayBack.subHeader")}
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
    const { t } = this.props;
    return (
      <Form.Group widths="equal">
        <Form.Input
          fluid
          label={t("module.pos.posLoanPayBack.filterIdCardNo")}
          placeholder={t("module.pos.posLoanPayBack.placeholderFilterIdCardNo")}
          onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
            this.onChangeInputSearchField("filterIdCardNo", data.value)
          }
          value={this.accountReceivableList.filterIdCardNo}
        />
        <Form.Input
          fluid
          label={t("module.pos.posLoanPayBack.filterFirstname")}
          placeholder={t(
            "module.pos.posLoanPayBack.placeholderFilterFirstname"
          )}
          onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
            this.onChangeInputSearchField("filterFirstname", data.value)
          }
          value={this.accountReceivableList.filterFirstname}
        />
        <Form.Input
          fluid
          label={t("module.pos.posLoanPayBack.filterLastname")}
          placeholder={t("module.pos.posLoanPayBack.placeholderFilterLastname")}
          onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
            this.onChangeInputSearchField("filterLastname", data.value)
          }
          value={this.accountReceivableList.filterLastname}
        />
      </Form.Group>
    );
  }
  private renderOpenHeader() {
    const { t, appStore } = this.props;
    return (
      <React.Fragment>
        {this.renderHideHeader()}
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label={t("module.accountReceivable.searchForm.contractNumber")}
            placeholder={t(
              "module.accountReceivable.searchForm.specifyContractNumber"
            )}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputSearchField("filterDocumentNumber", data.value)
            }
            value={this.accountReceivableList.filterDocumentNumber}
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
              this.onChangeInputSearchField("filterStatus", data.value)
            }
            value={this.accountReceivableList.filterStatus}
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
              this.onChangeInputSearchField("filterARType", data.value)
            }
            value={this.accountReceivableList.filterARType}
          />
        </Form.Group>
      </React.Fragment>
    );
  }
  private renderButtonSearch() {
    const { t } = this.props;
    return (
      <Grid columns="equal">
        <Grid.Row>
          <Grid.Column>
            <Button
              width={7}
              floated="right"
              color="blue"
              type="button"
              onClick={this.onSearch}
            >
              <Icon name="search" />
              {t("module.pos.posLoanPayBack.searchButtonAr")}
            </Button>
            {/* <Button
              width={7}
              floated="right"
              color="pink"
              onClick={}
            >
              <Icon name="barcode" />
              {t("module.pos.posLoanPayBack.searchButtonQrCode")}
            </Button> */}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  private renderButtonAdd() {
    const { t } = this.props;
    return (
      <Grid columns="equal" style={styles.gridButtom}>
        <Grid.Row verticalAlign="middle">
          <Grid.Column textAlign="right">
            <Link shade={5} onClick={() => this.resetFilter()}>
              {t("module.pos.posLoanPayBack.linkButton")}
            </Link>
            <Button
              disabled={this.receiptItem.checkValueAddItem}
              icon
              labelPosition="right"
              color="blue"
              type="submit"
              style={styles.button}
              // onClick={() => this.onAdd()}
            >
              {t("module.pos.posLoanPayBack.searchButton")}
              <Icon name="play" />
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  private renderModal() {
    const { open } = this.state;
    const { t } = this.props;
    return (
      <Modal open={open} onClose={this.close} size="large">
        <Modal.Header>
          <Header textAlign="center">
            {t("module.pos.posLoanPayBack.modalHeader")}
          </Header>
        </Modal.Header>
        <Modal.Content scrolling>
          <Loading active={this.accountReceivable.loading} />
          <Loading active={this.accountReceivableList.loading} />
          <PosLoanPayBackSearchTable
            accountReceivable={this.accountReceivable}
            onCloseModal={this.close}
            receiptItem={this.receiptItem}
            accountReceivableList={this.accountReceivableList}
          />
        </Modal.Content>
      </Modal>
    );
  }

  private onChangeInputSearchField = (fieldname: string, value: any) => {
    this.accountReceivableList.setField({ fieldname, value });
  };

  private onChangeInputField = (fieldname: string, value: any) => {
    this.receiptItem.setField({ fieldname, value });
  };
  private onChangeInputFieldPrice = (fieldname: string, value: any) => {
    this.receiptItem.setField({ fieldname, value });
    this.receiptItem.setField({
      fieldname: "subtotal",
      value: `${+this.receiptItem.price * +this.receiptItem.quantity}`
    });
  };

  private resetFilter = async () => {
    await this.accountReceivableList.resetAll();
    await this.receiptItem.resetAll();
    await this.accountReceivable.resetAll();
  };
  private onAdd = async () => {
    const { receipt } = this.props;
    await this.receiptItem.setField({ fieldname: "refType", value: "AR" });
    await receipt.addReceiptItems(clone(this.receiptItem));
    await this.receiptItem.resetAll();
  };
  private onSearch = async () => {
    const { appStore } = this.props;
    await this.accountReceivableList.setField({
      fieldname: "currentPage",
      value: 1
    });
    await this.accountReceivableList.load_data();
    if (this.accountReceivableList.list.length === 1) {
      await this.accountReceivable.setField({
        fieldname: "id",
        value: this.accountReceivableList.list[0].id
      });
      if (this.accountReceivable.id) {
        await this.accountReceivable.getAccountReceivableDetail();
      }
      await this.receiptItem.setReceiptItemByAr(
        appStore!.enumItemLabel("posRefType", "AR"),
        this.accountReceivable
      );
    } else {
      await this.setState({ open: true });
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
export default withTranslation()(PosLoanPayback);
