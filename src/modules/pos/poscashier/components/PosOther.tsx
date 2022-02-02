import { observer } from "mobx-react";
import { clone } from "mobx-state-tree";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Icon, Segment } from "semantic-ui-react";
import { Link } from "../../../../components/common";
import { CurrencyInput } from "../../../../components/common/input";
import { calMainChar } from "../../../../utils";
import { IReceiptModel, ReceiptItem } from "../../../receipt/ReceiptModel";

interface IPosOther extends WithTranslation {
  receipt: IReceiptModel;
  name: string;
  content: string;
  subheader: string;
  posRefType: "O";
}

@observer
class PosOther extends React.Component<IPosOther> {
  private receiptItem = ReceiptItem.create();
  public componentWillUnmount() {
    this.receiptItem.resetAll();
  }
  public render() {
    const { t, posRefType } = this.props;
    return (
      <Segment padded>
        {this.renderHeader()}
        <Form onSubmit={() => this.onAdd()}>
          <Form.Input
            maxLength={
              calMainChar(this.receiptItem.description1) === 40
                ? this.receiptItem.description1.length
                : ""
            }
            fluid
            label={t("module.pos.posDonation.line1")}
            placeholder={t("module.pos.posDonation.placeholder")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("description1", calMainChar(data.value)>30 ? data.value.substring(0, 35):data.value)
            }
            value={this.receiptItem.description1}
          />
          <Form.Input
            maxLength={
              calMainChar(this.receiptItem.description2) === 40
                ? this.receiptItem.description2.length
                : ""
            }
            fluid
            label={t("module.pos.posDonation.line2")}
            placeholder={t("module.pos.posDonation.placeholder")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("description2", calMainChar(data.value)>40 ? data.value.substring(0, 45):data.value)
            }
            value={this.receiptItem.description2}
          />
          <Form.Input
            maxLength={
              calMainChar(this.receiptItem.description3) === 40
                ? this.receiptItem.description3.length
                : ""
            }
            fluid
            label={t("module.pos.posDonation.line3")}
            placeholder={t("module.pos.posDonation.placeholder")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("description3", calMainChar(data.value)>40 ? data.value.substring(0, 45):data.value)
            }
            value={this.receiptItem.description3}
          />
          <Form.Input
            maxLength={
              calMainChar(this.receiptItem.description4) === 40
                ? this.receiptItem.description4.length
                : ""
            }
            fluid
            label={t("module.pos.posDonation.line4")}
            placeholder={t("module.pos.posDonation.placeholder")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("description4", calMainChar(data.value)>40 ? data.value.substring(0, 45):data.value)
            }
            value={this.receiptItem.description4}
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
    const { receipt, name, posRefType } = this.props;
    this.receiptItem.setField({ fieldname: "refType", value: posRefType });
    this.receiptItem.setField({ fieldname: "name", value: name });
    receipt.addReceiptItems(clone(this.receiptItem));
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
export default withTranslation()(PosOther);
