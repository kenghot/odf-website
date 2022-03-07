import { inject, observer } from "mobx-react";
import { clone } from "mobx-state-tree";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Icon, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import { Link } from "../../../../components/common";
import { CurrencyInput } from "../../../../components/common/input";
import { calMainChar } from "../../../../utils";
import { IReceiptModel, ReceiptItem } from "../../../receipt/ReceiptModel";

interface IPosFeesRefund extends WithTranslation {
  receipt: IReceiptModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class PosFeesRefund extends React.Component<IPosFeesRefund> {
  private receiptItem = ReceiptItem.create();
  public componentWillUnmount() {
    this.receiptItem.resetAll();
  }

  public render() {
    const { t } = this.props;
    return (
      <Segment padded>
        {this.renderHeader()}
        {/* <Form>
          <Form.Input
            fluid
            label={t("module.pos.posProject.name")}
            placeholder={t("module.pos.posProject.placeholderName")}
            // onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
            //   this.onChangeInputField("", data.value)
            // }
            // value={}
          />
        </Form>
        <br />
        {this.renderButtonSearch()}
        <br /> */}
        <Form onSubmit={() => this.onAdd()}>
          <Form.Input
            required
            fluid
            maxLength={
              calMainChar(this.receiptItem.ref3) === 40
                ? this.receiptItem.ref3.length
                : ""
            }
            label={t("ชื่อสำนักงานที่รับคืนเงิน บรรทัดที่ 1")}
            placeholder={t("กรุณากรอกชื่อสำนักงานที่รับคืนเงิน")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("ref3", calMainChar(data.value)>40 ? data.value.substring(0, 40):data.value )
            }
            value={this.receiptItem.ref3}
          />
           <Form.Input
            fluid
            maxLength={
              calMainChar(this.receiptItem.ref4) === 40
                ? this.receiptItem.ref4.length
                : ""
            }
            label={t("ชื่อสำนักงานที่รับคืนเงิน บรรทัดที่ 2")}
            placeholder={t("กรุณากรอกชื่อสำนักงานที่รับคืนเงิน")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("ref4", calMainChar(data.value)>40 ? data.value.substring(0, 40):data.value )
            }
            value={this.receiptItem.ref4}
          />
          <Form.Input
            required
            fluid
            maxLength={
              calMainChar(this.receiptItem.ref1) === 40
                ? this.receiptItem.ref1.length
                : ""
            }
            label={t("module.pos.posFeesRefund.ref1")}
            placeholder={t("module.pos.posFeesRefund.ref1Placeholder")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("ref1", data.value)
            }
            value={this.receiptItem.ref1}
          />
          <Form.Input
            required
            fluid
            maxLength={
              calMainChar(this.receiptItem.ref2) === 40
                ? this.receiptItem.ref2.length
                : ""
            }
            label={t("module.pos.posFeesRefund.name")}
            placeholder={t("module.pos.posFeesRefund.placeholderName")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("ref2", data.value)
            }
            value={this.receiptItem.ref2}
          />
          <Form.Field
            required
            label={t("module.pos.posFeesRefund.price")}
            control={CurrencyInput}
            id={`input-pos-posFeesRefund-price`}
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
    const { t } = this.props;
    return (
      <Grid>
        <Grid.Row verticalAlign="top">
          <Grid.Column width={16}>
            <Header
              size="medium"
              content={t("module.pos.posFeesRefund.content")}
              subheader={t("module.pos.posFeesRefund.subheader")}
              style={styles.header}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  // private renderButtonSearch() {
  //   const { t } = this.props;
  //   return (
  //     <Grid columns="equal">
  //       <Grid.Row>
  //         <Grid.Column>
  //           <Button
  //             width={7}
  //             floated="right"
  //             color="blue"
  //             // onClick={this.}
  //           >
  //             <Icon name="search" />
  //             {t("module.pos.posProject.searchButton")}
  //           </Button>
  //         </Grid.Column>
  //       </Grid.Row>
  //     </Grid>
  //   );
  // }

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
                this.receiptItem.ref1 &&
                  this.receiptItem.price &&
                  +this.receiptItem.price !== 0
                  ? false
                  : true
              }
              icon
              type="submit"
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
    const { receipt, appStore } = this.props;
    this.receiptItem.setField({ fieldname: "refType", value: "FR" });
    this.receiptItem.setField({
      fieldname: "name",
      value: appStore!.enumItemLabel("posRefType", "FR")
    });
    this.receiptItem.setField({
      fieldname: "description1",
      value: "หมายเลขคดีแดงที่"
    });
    this.receiptItem.setField({
      fieldname: "description2",
      value: "หมายเลขคดีดำที่"
    });
    receipt.addReceiptItems(clone(this.receiptItem));
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
export default withTranslation()(PosFeesRefund);
