import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Button,
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
  PosPayerSection,
  PosPaymentListItem,
  PosPaymentSumTotal,
  PosReceiptPaymentType
} from "../modules/pos/poscashier/components";
import { IPosModel } from "../modules/pos/PosModel";
import {
  ReceiptHeaderSummary,
  ReceiptInfoEdit
} from "../modules/receipt/receiptcashier";
import { IReceiptListModel } from "../modules/receipt/ReceiptListModel";
import { IReceiptModel, ReceiptModel } from "../modules/receipt/ReceiptModel";

interface IM372ReceiptEditModal extends WithTranslation {
  trigger?: any;
  receipt: IReceiptModel;
  receiptId: string;
  receiptList?: IReceiptListModel;
  pos?: IPosModel;
  receiptModal?: IReceiptModel;
  stateOnly?: boolean;
  stateOpen?: boolean;
  onClickStateOpen?: () => void;
  onClickStateClose?: () => void;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class M372ReceiptEditModal extends React.Component<IM372ReceiptEditModal> {
  private receiptTemp = ReceiptModel.create({});
  public state = { open: false, maxHeightSegmentGroup: 0 };
  public close = async () => {
    const { stateOnly, onClickStateClose, receiptModal } = this.props;
    if (stateOnly && onClickStateClose && receiptModal) {
      await onClickStateClose();
      await receiptModal.resetAll();
    } else {
      await this.setState({ open: false });
      await this.receiptTemp.resetAll();
    }
  };
  public open = async () => {
    await this.receiptTemp.setAllField(this.props.receipt.receiptJSON);
    await this.setState({ open: true });
    await this.handleOnUpdate();
  };
  public componentDidUpdate(prevProps: any) {
    if (this.props.receiptId !== prevProps.receiptId) {
      this.handleOnUpdate();
    } else if (this.props.stateOpen !== prevProps.stateOpen) {
      this.handleOnUpdate();
    }
  }
  public render() {
    const { t, trigger, stateOnly, stateOpen, receiptModal } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={trigger}
        onOpen={this.open}
        open={stateOnly ? stateOpen : open}
        closeIcon
        onClose={this.close}
        size="fullscreen"
      >
        <Modal.Header>
          <Header textAlign="center">
            {t("modal.M372ReceiptEditModal.header")}
          </Header>
        </Modal.Header>
        <Modal.Content scrolling id="ReceiptModal-Content">
          <Responsive onUpdate={this.handleOnUpdate} />
          <Loading
            active={
              receiptModal ? receiptModal.loading : this.receiptTemp.loading
            }
          />
          <ErrorMessage
            errorobj={
              receiptModal ? receiptModal.error : this.receiptTemp.error
            }
            float
            timeout={5000}
          />
          <Grid>
            <Grid.Row>
              {this.renderColumnL()}
              {this.renderColumnR()}
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="blue"
            fluid
            type="button"
            onClick={this.onClick}
            style={styles.button}
          >
            {t("modal.M372ReceiptEditModal.button")}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private renderColumnL() {
    const { receiptModal, appStore } = this.props;
    return (
      <Grid.Column width={8}>
        <Segment.Group>
          <ReceiptHeaderSummary
            receipt={receiptModal ? receiptModal : this.receiptTemp}
          />
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
            receipt={receiptModal ? receiptModal : this.receiptTemp}
          />
          <PosPaymentSumTotal
            receipt={receiptModal ? receiptModal : this.receiptTemp}
          />
          <PosReceiptPaymentType
            previousReceipt={receiptModal ? receiptModal : this.receiptTemp}
          />
          <Segment id="PosReceiptPayerSection">
            <Form>
              <PosPayerSection
                receipt={receiptModal ? receiptModal : this.receiptTemp}
              />
            </Form>
          </Segment>
        </Segment.Group>
      </Grid.Column>
    );
  }

  private renderColumnR() {
    const { receiptModal } = this.props;
    return (
      <Grid.Column width={8}>
        <ReceiptInfoEdit
          receipt={receiptModal ? receiptModal : this.receiptTemp}
        />
      </Grid.Column>
    );
  }

  private onClick = async () => {
    const { receipt, receiptModal, receiptList, pos } = this.props;
    try {
      if (receiptModal && receiptList && pos) {
        await receiptModal.updateReceipt();
        await receipt.setAllField(receiptModal.receiptJSON);
        await receiptList.load_data(pos.id, true);
      } else {
        await this.receiptTemp.updateReceipt();
        await receipt.setAllField(this.receiptTemp.receiptJSON);
      }
      await receipt.alert.setAlertMessage(
        "บันทึกสำเร็จค่ะ",
        "เอกสารถูกปรับปรุงเรียบร้อยแล้ว"
      );
      await receipt.error.setField({ fieldname: "tigger", value: false });
      await this.close();
    } catch (e) {
      await receipt.error.setErrorMessage(e);
      console.log(e);
    }
  };

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
  }
};
export default withTranslation()(M372ReceiptEditModal);
