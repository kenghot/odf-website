import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Responsive,
  Segment
} from "semantic-ui-react";
import { PosReceiptPayerSection } from ".";
import { IAppModel } from "../../../../AppModel";
import { Link } from "../../../../components/common";
import { COLORS } from "../../../../constants";
import {
  M35301ReprintEditModal,
  M35302CancelPaymentModal,
  M372ReceiptEditModal,
  ReceiptPrintLogTableModal
} from "../../../../modals";
import { IReceiptListModel } from "../../../receipt/ReceiptListModel";
import { IReceiptModel, ReceiptModel } from "../../../receipt/ReceiptModel";
import { IPosModel } from "../../PosModel";
import { connectPrinter, printFromTemplate } from "../../Receipt";
import moment from "moment";

interface IPosReceiptPayer extends WithTranslation {
  appStore?: IAppModel;
  pos: IPosModel;
  receiptList: IReceiptListModel;
  previousReceipt: IReceiptModel;
  style?: any;
}
@inject("appStore")
@observer
class PosReceiptPayer extends React.Component<IPosReceiptPayer> {
  public state = { stateOpen: false };
  public onClickStateClose = async () => {
    await this.setState({ stateOpen: false });
  };
  public onClickStateOpen = async () => {
    await this.setState({ stateOpen: true });
  };
  private receiptModal = ReceiptModel.create({});
  public render() {
    const { t, previousReceipt, pos, receiptList } = this.props;
    return (
      <React.Fragment>
        <Segment
          id="PosReceiptPayer1"
          style={{ ...styles.segment, ...this.props.style }}
        >
          <Form>
            <Grid stackable>
              <Grid.Row divided>
                <Grid.Column computer={12} tablet={16}>
                  <PosReceiptPayerSection previousReceipt={previousReceipt} />
                </Grid.Column>
                <Grid.Column
                  computer={4}
                  tablet={16}
                  textAlign="center"
                  verticalAlign="middle"
                  style={styles.column}
                >
                  {this.renderComputerView()}
                  {this.renderMobileView()}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Segment>
        {previousReceipt.status === "CL" ? null : (
          <Segment id="PosReceiptPayer2" style={styles.segmentButton}>
            <Grid columns="equal">
              <Grid.Row verticalAlign="middle">
                <Grid.Column textAlign="right">
                  <M35302CancelPaymentModal
                    receiptList={receiptList}
                    pos={pos}
                    receipt={previousReceipt}
                    trigger={
                      <Button basic floated="left" color="red">
                        {t("module.pos.posReceiptPayer.cancelPaymentButton")}
                      </Button>
                    }
                  />
                  <M372ReceiptEditModal
                    pos={pos}
                    receiptList={receiptList}
                    receipt={previousReceipt}
                    receiptId={previousReceipt.id || ""}
                    stateOnly
                    stateOpen={this.state.stateOpen}
                    receiptModal={this.receiptModal}
                    onClickStateOpen={() => this.onClickStateOpen()}
                    onClickStateClose={() => this.onClickStateClose()}
                  />
                  <M35301ReprintEditModal
                    title={t("module.pos.posReceiptPayer.editReceiptTitle")}
                    pos={pos}
                    receipt={previousReceipt}
                    trigger={
                      <Button floated="right" color="blue">
                        {t("module.pos.posReceiptPayer.editReceiptButton")}
                      </Button>
                    }
                    onClick={() => this.onClickEditReceipt()}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        )}
      </React.Fragment>
    );
  }

  private renderComputerView() {
    const { t, pos, previousReceipt } = this.props;
    return (
      <Responsive minWidth={767}>
        <Segment style={styles.buttonSegmentComputerView}>
          <M35301ReprintEditModal
            title={t("module.pos.posReceiptPayer.printReceiptTitle")}
            pos={pos}
            receipt={previousReceipt}
            trigger={
              <Header icon size="small" style={styles.computerView}>
                <Icon circular inverted color="blue" name="print" />
                {t("module.pos.posReceiptPayer.printButton")}
              </Header>
            }
            onClick={() => this.onClickPrintReceipt()}
          />
          <ReceiptPrintLogTableModal
            receipt={previousReceipt}
            trigger={
              <Link shade={5}>
                {t("module.pos.posReceiptPayer.printHistory")}
              </Link>
            }
          />
        </Segment>
      </Responsive>
    );
  }

  private renderMobileView() {
    const { t, pos, previousReceipt } = this.props;
    return (
      <Responsive maxWidth={766}>
        <M35301ReprintEditModal
          title={t("module.pos.posReceiptPayer.printReceiptTitle")}
          pos={pos}
          receipt={previousReceipt}
          trigger={
            <Button
              style={styles.mobileView}
              fluid
              color="blue"
              size="large"
              icon
            >
              {t("module.pos.posReceiptPayer.printButton")}
              <Icon name="print" />
            </Button>
          }
          onClick={() => this.onClickPrintReceipt()}
        />
        <ReceiptPrintLogTableModal
          receipt={previousReceipt}
          trigger={
            <Link shade={5}>
              {t("module.pos.posReceiptPayer.printHistory")}
            </Link>
          }
        />
      </Responsive>
    );
  }
  private onClickPrintReceipt = async () => {
    const { previousReceipt, pos, appStore } = this.props;
    try {
      if (pos.lastestPosShift && pos.lastestPosShift.onDutymanagerId) {
        await previousReceipt.setField({
          fieldname: "managerId",
          value: pos.lastestPosShift.onDutymanagerId
        });
      } else {
        await previousReceipt.setField({
          fieldname: "managerId",
          value: pos.managerId
        });
      }
      await connectPrinter(pos, previousReceipt);
      const printedTime = moment().format();
      if (previousReceipt.status === "CL") {
        await previousReceipt.reprintReceiptPrintLog(printedTime, "CRP");
        await printFromTemplate(
          pos,
          previousReceipt,
          "CL",
          appStore!,
          printedTime
        );
        //printออก2ใบใน1รายการ
        await printFromTemplate(
          pos,
          previousReceipt,
          "CL",
          appStore!,
          printedTime
        );
      } else {
        await previousReceipt.reprintReceiptPrintLog(printedTime, "RP");
        await printFromTemplate(
          pos,
          previousReceipt,
          "PD",
          appStore!,
          printedTime
        );
        //printออก2ใบใน1รายการ
        await printFromTemplate(
          pos,
          previousReceipt,
          "PD",
          appStore!,
          printedTime
        );
      }
      await previousReceipt.getReceiptCashierDetail(pos.id);
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  private onClickEditReceipt = async () => {
    const { previousReceipt, pos } = this.props;
    try {
      if (pos.lastestPosShift && pos.lastestPosShift.onDutymanagerId) {
        await previousReceipt.setField({
          fieldname: "managerId",
          value: pos.lastestPosShift.onDutymanagerId
        });
      } else {
        await previousReceipt.setField({
          fieldname: "managerId",
          value: pos.managerId
        });
      }
      await previousReceipt.onApproveReceipt(pos.id);
      await this.receiptModal.setAllField(previousReceipt.receiptJSON);
      await this.onClickStateOpen();
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
}
const styles: any = {
  segment: {
    background: COLORS.contentGrey,
    marginBottom: 0,
    marginTop: 0
  },
  segmentButton: {
    marginBottom: 0,
    marginTop: 0
  },
  column: {
    padding: 0
  },
  button: {
    padding: 0
  },
  buttonSegment: {
    borderWidth: 0
  },
  buttonSegmentComputerView: {
    borderWidth: 0,
    background: COLORS.contentGrey,
    boxShadow: "none",
    border: "none"
  },
  mobileView: {
    marginBottom: 14
  },
  computerView: {
    cursor: "pointer"
  }
};
export default withTranslation()(PosReceiptPayer);
