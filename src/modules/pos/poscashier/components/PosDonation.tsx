import { inject, observer } from "mobx-react";
import { clone } from "mobx-state-tree";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Icon, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import { Link } from "../../../../components/common";
import { CurrencyInput, DateInput } from "../../../../components/common/input";
import { calMainChar } from "../../../../utils";
import { IReceiptModel, ReceiptItem } from "../../../receipt/ReceiptModel";

interface IPosDonation extends WithTranslation {
  receipt: IReceiptModel;
  name: string;
  content: string;
  subheader: string;
  posRefType: "D";
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class PosDonation extends React.Component<IPosDonation> {
  private receiptItem = ReceiptItem.create({ ref1: "D01" });
  public componentWillUnmount() {
    this.receiptItem.resetAll();
  }
  public render() {
    const { t, posRefType, appStore } = this.props;
    return (
      <Segment padded>
        {this.renderHeader()}
        <Form onSubmit={() => this.onAdd()}>
          <Form.Select
            fluid
            clearable
            label={"ชื่อโครงการที่บริจาค"}
            placeholder={"กรุณาระบุชื่อโครงการที่บริจาค"}
            options={appStore!.enumItems("donationType")}
            onChange={(event, data) =>
              this.onChangeInputField("ref1", data.value)
            }
            value={this.receiptItem.ref1 || ""}
          />
          <Form.Input
            maxLength={
              calMainChar(this.receiptItem.ref2) === 40
                ? this.receiptItem.ref2.length
                : ""
            }
            fluid
            label={"วัตถุประสงค์"}
            placeholder={"วัตถุประสงค์ในการรับบริจาค"}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("ref2", data.value)
            }
            value={this.receiptItem.ref2}
          />
          <Form.Field
            label={"วันที่แจ้งความประสงค์บริจาค"}
            control={DateInput}
            value={this.receiptItem.ref3}
            fieldName={"ref3"}
            onChangeInputField={this.onChangeInputField}
            id={"ref3"}
          />
          <Form.Input
            maxLength={
              calMainChar(this.receiptItem.description2) === 40
                ? this.receiptItem.description2.length
                : ""
            }
            fluid
            label={"หมายเหตุ"}
            placeholder={t("module.pos.posDonation.line3placeholder")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("description2", data.value)
            }
            value={this.receiptItem.description2}
          />
          <Form.Field
            required
            id={`input-pos-posDonation-${posRefType}-price`}
            label={t("module.pos.posDonation.amount")}
            control={CurrencyInput}
            value={this.receiptItem.price}
            onChangeInputField={this.onChangeInputFieldPrice}
            fieldName={"price"}
          />
          {this.renderButtonAdd()}
        </Form>
      </Segment>
    );
  }
  private renderHeader() {
    const { content, subheader } = this.props;
    return (
      <Grid>
        <Grid.Row verticalAlign="top">
          <Grid.Column width={16}>
            <Header
              size="medium"
              content={content}
              subheader={subheader}
              style={styles.header}
            />
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
              {t("module.pos.posDonation.resetButton")}
            </Link>
            <Button
              disabled={
                this.receiptItem.price && +this.receiptItem.price !== 0
                  ? false
                  : true
              }
              type="submit"
              icon
              labelPosition="right"
              color="blue"
              style={styles.button}
              // onClick={() => this.onAdd()}
            >
              {t("module.pos.posDonation.submitButton")}
              <Icon name="play" />
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  private resetFilter = async () => {
    await this.receiptItem.resetAll();
  };
  private onAdd = () => {
    const { receipt, name, posRefType, appStore } = this.props;
    this.receiptItem.setField({ fieldname: "refType", value: posRefType });
    this.receiptItem.setField({
      fieldname: "name",
      value:
        appStore!.enumItemLabel("donationType", this.receiptItem.ref1) || "-",
    });

    const tempReceiptItem = clone(this.receiptItem);
    // tempReceiptItem.setField({
    //   fieldname: "ref3",
    //   value: date_display_CE_TO_BE(this.receiptItem.ref3),
    // });
    receipt.addReceiptItems(tempReceiptItem);
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    this.receiptItem.setField({ fieldname, value });
  };
  private onChangeInputFieldPrice = (fieldname: string, value: any) => {
    this.receiptItem.setField({ fieldname, value });
    this.receiptItem.setField({
      fieldname: "subtotal",
      value: `${+this.receiptItem.price * +this.receiptItem.quantity}`,
    });
  };
}

const styles: any = {
  button: {
    marginRight: 0,
    marginLeft: 14,
  },
  header: {
    marginBottom: 28,
  },
  gridButtom: {
    paddingTop: 28,
  },
};
export default withTranslation()(PosDonation);
