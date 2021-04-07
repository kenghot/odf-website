import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Header, Modal } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { PosModel } from "../modules/pos/PosModel";
import ReceiptEdit from "../modules/receipt/component/ReceiptEdit";
import ReceiptView from "../modules/receipt/component/ReceiptView";
import { IReceiptModel, ReceiptModel } from "../modules/receipt/ReceiptModel";

interface IReceiptModal extends WithTranslation {
  trigger: any;
  receipt: IReceiptModel;
  receiptId: string;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class ReceiptModal extends React.Component<IReceiptModal> {
  public state = { open: false, maxHeightSegmentGroup: 0, editMode: false };
  private receiptTemp = ReceiptModel.create({});
  private pos = PosModel.create({});

  public close = () => {
    if (this.state.editMode) {
      this.setState({ editMode: false });
      this.receiptTemp.resetAll();
    } else {
      this.setState({ open: false });
    }
  };
  public open = async () => {
    await this.setState({ open: true });
    await this.handleOnUpdate();
    if (this.props.receipt && this.props.receipt.id) {
      await this.props.receipt.getReceiptDetail();
      await this.pos.setField({
        fieldname: "id",
        value: this.props.receipt.posId,
      });
      await this.pos.getPosDetail();
      await this.handleOnUpdate();
    }
  };

  public onChangeEditMode = async () => {
    await this.receiptTemp.setAllField(this.props.receipt.receiptJSON);
    await this.setState({ open: true });
    await this.setState({ editMode: true });
    await this.handleOnUpdate();
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
        className={
          this.props.receipt.receiptPrintLogs.length ? "no-action" : undefined
        }
      >
        <Modal.Header>
          <Header textAlign="center">
            {t("modal.M371ReceiptModal.header")}
          </Header>
        </Modal.Header>
        <Modal.Content scrolling id="ReceiptModal-Content">
          {this.state.editMode ? (
            <ReceiptEdit
              receipt={this.receiptTemp}
              maxHeightSegmentGroup={this.state.maxHeightSegmentGroup}
            />
          ) : (
            <ReceiptView
              pos={this.pos}
              receipt={receipt}
              maxHeightSegmentGroup={this.state.maxHeightSegmentGroup}
            />
          )}
        </Modal.Content>
        {this.state.editMode ? (
          <Modal.Actions>
            <Button
              color="grey"
              type="button"
              floated="left"
              basic
              onClick={this.close}
              style={styles.button}
            >
              {t("canceled")}
            </Button>
            <Button
              color="blue"
              type="button"
              onClick={this.onClick}
              style={styles.button}
            >
              {t("save")}
            </Button>
          </Modal.Actions>
        ) : (
          <>
            {this.props.receipt.receiptPrintLogs.length ? null : (
              <Modal.Actions>
                <Button
                  color="blue"
                  type="button"
                  onClick={this.onChangeEditMode}
                  style={styles.button}
                >
                  {t("edit")}
                </Button>
              </Modal.Actions>
            )}
          </>
        )}
      </Modal>
    );
  }

  private onClick = async () => {
    const { receipt } = this.props;
    try {
      await this.receiptTemp.updateReceipt();
      await receipt.setAllField(this.receiptTemp.receiptJSON);
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
        maxHeightSegmentGroup: cal,
      });
    } else {
      await this.setState({
        maxHeightSegmentGroup: 0,
      });
    }
  };
}

const styles: any = {
  view: {},
  button: {
    marginLeft: 0,
    marginRight: 0,
  },
};
export default withTranslation()(ReceiptModal);
