import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Form,
  Grid,
  Header,
  Modal,
  Responsive,
  Segment
} from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { ErrorMessage } from "../components/common";
import { Loading } from "../components/common/loading";
import { COLORS } from "../constants";
import {
  PosPaymentListItem,
  PosPaymentSumTotal,
  PosReceiptPayerSection,
  PosReceiptPaymentType
} from "../modules/pos/poscashier/components";
import {
  ReceiptHeaderSummary,
  ReceiptInfoView
} from "../modules/receipt/receiptcashier";
import { ReceiptPrintLogTable } from "../modules/receipt/receiptmanagement/components";
import { IReceiptModel } from "../modules/receipt/ReceiptModel";

interface IM371ReceiptModal extends WithTranslation {
  trigger: any;
  receipt: IReceiptModel;
  receiptId: string;
  onGetDetail?: boolean;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class M371ReceiptModal extends React.Component<IM371ReceiptModal> {
  public state = { open: false, maxHeightSegmentGroup: 0 };

  public close = () => {
    this.setState({ open: false });
  };
  public open = async () => {
    await this.setState({ open: true });
    await this.handleOnUpdate();
    if (this.props.receipt && this.props.receipt.id && this.props.onGetDetail) {
      await this.props.receipt.getReceiptDetail();
      await this.handleOnUpdate();
    }
  };
  public componentDidUpdate(prevProps: any) {
    if (this.props.receiptId !== prevProps.receiptId) {
      this.handleOnUpdate();
    }
  }

  public render() {
    const { t, trigger, receipt } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={trigger}
        onOpen={this.open}
        open={open}
        closeIcon
        onClose={this.close}
        size="fullscreen"
        className={"no-action"}
      >
        <Modal.Header>
          <Header textAlign="center">
            {t("modal.M371ReceiptModal.header")}
          </Header>
        </Modal.Header>
        <Modal.Content scrolling id="ReceiptModal-Content">
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
                <ReceiptPrintLogTable notPaddedVery receipt={receipt} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }

  private renderColumnL() {
    const { receipt, appStore } = this.props;
    return (
      <Grid.Column id="columnL" width={8}>
        <Segment.Group>
          <ReceiptHeaderSummary receipt={receipt} />
          <PosPaymentListItem
            style={{
              overflowY: appStore!.tabletMode ? "initial" : "auto",
              maxHeight: appStore!.tabletMode
                ? "initial"
                : this.state.maxHeightSegmentGroup,
              minHeight: appStore!.tabletMode
                ? "initial"
                : this.state.maxHeightSegmentGroup
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
        maxHeightSegmentGroup: cal
      });
    } else {
      await this.setState({
        maxHeightSegmentGroup: 0
      });
    }
  };
}

const styles: any = {
  segmentGrey: {
    background: COLORS.contentGrey
  },
  button: {
    marginLeft: 0,
    marginRight: 0
  },
  gridRow: {
    padding: 0
  },
  full: {
    height: "100%"
  },
  fullBg: {
    height: "100%",
    background: COLORS.contentGrey
  }
};
export default withTranslation()(M371ReceiptModal);
