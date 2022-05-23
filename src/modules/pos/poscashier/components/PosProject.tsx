import { inject, observer } from "mobx-react";
import { clone } from "mobx-state-tree";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Icon, Segment,TextArea } from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import { Link } from "../../../../components/common";
import { CurrencyInput } from "../../../../components/common/input";
import { calMainChar } from "../../../../utils";
import { IReceiptModel, ReceiptItem } from "../../../receipt/ReceiptModel";

interface IPosProject extends WithTranslation {
  receipt: IReceiptModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class PosProject extends React.Component<IPosProject> {
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
              calMainChar(this.receiptItem.ref1) === 30
                ? this.receiptItem.ref1.length
                : ""
            }
            label={t("module.pos.posProject.ref1")}
            placeholder={t("module.pos.posProject.ref1Placeholder")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("ref1", data.value)
            }
            value={this.receiptItem.ref1}
          />
          {/* <Form.Input
            fluid
            maxLength={
              calMainChar(this.receiptItem.ref2) === 35
                ? this.receiptItem.ref2.length
                : ""
            }
            label={t("ชื่อองค์กร")}
            placeholder={t("ระบุชื่อองค์กร")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("ref2", calMainChar(data.value)>35 ? data.value.substring(0, 35):data.value )
            }
            value={this.receiptItem.ref2}
          /> */}
          <Form.TextArea
            maxLength={255}
            label={t("ชื่อองค์กร")}
            placeholder={t("ระบุชื่อองค์กร (กรอกข้อมูลได้สูงสุด 255 ตัวอักษร)")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("ref2", data.value.length>254 ? data.value.substring(0, 255):data.value )
            }
            value={this.receiptItem.ref2}
          />
          {/* <Form.Input
            fluid
            maxLength={
              calMainChar(this.receiptItem.ref3) === 40
                ? this.receiptItem.ref3.length
                : ""
            }
            label={t("ชื่อโครงการ")}
            placeholder={t("module.pos.posProject.placeholderName")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("ref3", calMainChar(data.value)>40 ? data.value.substring(0, 40):data.value )
            }
            value={this.receiptItem.ref3}
          /> */}
          <Form.TextArea
            maxLength={255}
            label={t("ชื่อโครงการ")}
            placeholder={t("ระบุชื่อโครงการ (กรอกข้อมูลได้สูงสุด 255 ตัวอักษร)")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("ref3", data.value.length>254 ? data.value.substring(0, 255):data.value )
            }
            value={this.receiptItem.ref3}
          />
          <Form.TextArea
            maxLength={255}
            label={t("ชื่อโครงการ(ต่อ)")}
            placeholder={t("ระบุชื่อโครงการ (กรอกข้อมูลได้สูงสุด 255 ตัวอักษร)")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("ref4", data.value.length>254 ? data.value.substring(0, 255):data.value )
            }
            value={this.receiptItem.ref4}
          />
          <Form.Field
            required
            label={t("module.pos.posProject.price")}
            control={CurrencyInput}
            id={`input-pos-PosProject-price`}
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
              content={t("module.pos.posProject.content")}
              subheader={t("module.pos.posProject.subheader")}
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
    this.receiptItem.setField({ fieldname: "refType", value: "PR" });
    this.receiptItem.setField({
      fieldname: "name",
      value: appStore!.enumItemLabel("posRefType", "PR")
    });
    this.receiptItem.setField({
      fieldname: "description1",
      value: "เลขที่สัญญา"
    });
    this.receiptItem.setField({
      fieldname: "description2",
      value: "ชื่อองค์กร"
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
export default withTranslation()(PosProject);
