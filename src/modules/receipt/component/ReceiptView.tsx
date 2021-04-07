import { inject, observer } from "mobx-react";
import { clone } from "mobx-state-tree";
import moment from "moment";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Grid, Responsive, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { ErrorMessage } from "../../../components/common";
import { Loading } from "../../../components/common/loading";
import {
  PosPaymentListItem,
  PosPaymentSumTotal,
  PosReceiptPayerSection,
  PosReceiptPaymentType,
} from "../../../modules/pos/poscashier/components";
import {
  ReceiptHeaderSummary,
  ReceiptInfoView,
} from "../../../modules/receipt/receiptcashier";
import { ReceiptPrintLogTable } from "../../../modules/receipt/receiptmanagement/components";
import { IReceiptModel } from "../../../modules/receipt/ReceiptModel";
import { IAuthModel } from "../../auth/AuthModel";
import { IPosModel } from "../../pos/PosModel";
import { connectPrinter, printReceipt } from "../../pos/Receipt";

interface IReceiptView extends WithTranslation {
  receipt: IReceiptModel;
  appStore?: IAppModel;
  authStore?: IAuthModel;
  maxHeightSegmentGroup: number;
  pos: IPosModel;
}

@inject("appStore", "authStore")
@observer
class ReceiptView extends React.Component<IReceiptView> {
  public state = {
    confirm: false,
    confirmModalPrinter: false,
    confirmPrinter: false,
  };

  public render() {
    const { receipt } = this.props;
    return (
      <>
        <Responsive onUpdate={this.handleOnUpdate} />
        <Loading active={receipt.loading} />
        <ErrorMessage errorobj={receipt.error} float timeout={5000} />
        <Grid>
          <Grid.Row>
            {this.renderColumnL()}
            {this.renderColumnR()}
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <ReceiptPrintLogTable
                notPaddedVery
                receipt={receipt}
                onReceiptPrint={this.onSubmit}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }

  private renderColumnL() {
    const { receipt, appStore, maxHeightSegmentGroup } = this.props;
    return (
      <Grid.Column id="columnL" width={8}>
        <Segment.Group>
          <ReceiptHeaderSummary receipt={receipt} />
          <PosPaymentListItem
            style={{
              overflowY: appStore!.tabletMode ? "initial" : "auto",
              maxHeight: appStore!.tabletMode
                ? "initial"
                : maxHeightSegmentGroup,
              minHeight: appStore!.tabletMode
                ? "initial"
                : maxHeightSegmentGroup,
            }}
            receipt={receipt}
          />
          <PosPaymentSumTotal receipt={receipt} />
          <PosReceiptPaymentType previousReceipt={receipt} />
          <Segment id="PosReceiptPayerSection">
            <Form>
              <PosReceiptPayerSection previousReceipt={receipt} />
            </Form>
          </Segment>
        </Segment.Group>
      </Grid.Column>
    );
  }
  private renderColumnR() {
    const { receipt } = this.props;
    return (
      <Grid.Column id="columnR" width={8}>
        <ReceiptInfoView receipt={receipt} />
      </Grid.Column>
    );
  }

  private getHeightElement = (id: string) => {
    this.forceUpdate();
    const height = document.getElementById(id)
      ? document.getElementById(id)!.clientHeight
      : 0;
    return height;
  };

  private handleOnUpdate = async () => {
    const padding = 31;
    const receiptHeaderSummary = this.getHeightElement("receiptHeaderSummary");
    const posPaymentSumTotal = this.getHeightElement("PosPaymentSumTotal1");
    const posReceiptPaymentType = this.getHeightElement(
      "PosReceiptPaymentType"
    );
    const posReceiptPayerSection = this.getHeightElement(
      "PosReceiptPayerSection"
    );
    const body = this.getHeightElement("ReceiptModal-Content");

    const cal =
      body -
      padding -
      receiptHeaderSummary -
      posPaymentSumTotal -
      posReceiptPaymentType -
      posReceiptPayerSection;
    if (cal > 0) {
      await this.setState({
        maxHeightSegmentGroup: cal,
      });
    } else {
      await this.setState({
        maxHeightSegmentGroup: 0,
      });
    }
  };

  private onSubmit = async () => {
    const { receipt, pos, appStore, authStore, t } = this.props;

    await receipt.setField({ fieldname: "loading", value: true });
    try {
      if (!pos.lastestPosShift.currentCashier.id) {
        await pos.lastestPosShift.setField({
          fieldname: "currentCashier",
          value: clone(authStore!.userProfile),
        });
      }
      await connectPrinter(pos, receipt);
      await printReceipt(receipt, pos, appStore, t);
      await receipt.getReceiptDetail();
    } catch (error) {
      console.log(error);
    } finally {
      await receipt.setField({ fieldname: "loading", value: false });
    }
  };
}

const styles: any = {
  view: {},
};
export default withTranslation()(ReceiptView);
