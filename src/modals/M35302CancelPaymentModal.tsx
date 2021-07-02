import { inject, observer } from "mobx-react";
import moment from "moment";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Button,
  Confirm,
  Form,
  Header,
  Modal,
  TextArea
} from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { ErrorMessage, FormDisplay } from "../components/common";
import { Loading } from "../components/common/loading";
import { IPosModel } from "../modules/pos/PosModel";
import { connectPrinter, printFromTemplate } from "../modules/pos/Receipt";
import { IReceiptListModel } from "../modules/receipt/ReceiptListModel";
import { IReceiptModel, ReceiptModel } from "../modules/receipt/ReceiptModel";

interface IM35302CancelPaymentModal extends WithTranslation {
  trigger: any;
  pos: IPosModel;
  receipt: IReceiptModel;
  receiptList: IReceiptListModel;
  style?: any;
  appStore?: IAppModel;
}
@inject("appStore")
@observer
class M35302CancelPaymentModal extends React.Component<
IM35302CancelPaymentModal
> {
  private receiptTemp = ReceiptModel.create({});
  public state = {
    open: false,
    confirmModalPrinter: false,
    confirmPrinter: false
  };
  public openConfirmModalPrinter = () =>
    this.setState({ confirmModalPrinter: true });
  public closeConfirmModalPrinter = () =>
    this.setState({ confirmModalPrinter: false });
  public close = () => {
    this.setState({ open: false });
    this.receiptTemp.resetAll();
  };
  public open = () => {
    this.setState({ open: true });
    if (this.props.receipt && this.props.receipt.id) {
      this.receiptTemp.setAllField(this.props.receipt.receiptJSON);
    }
  };
  public render() {
    const { t, trigger, pos, style } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={trigger}
        onOpen={this.open}
        open={open}
        closeIcon
        onClose={this.close}
        size="small"
        style={style}
      >
        <Modal.Header>
          <Header textAlign="center">
            {t("modal.M35302CancelPaymentModal.modalHeader")}
          </Header>
        </Modal.Header>
        <Modal.Content>
          <Loading active={this.receiptTemp.loading} />
          <ErrorMessage
            errorobj={this.receiptTemp.error}
            float
            timeout={5000}
          />
          <Form>
            <Form.Field
              control={TextArea}
              label={t("modal.M35302CancelPaymentModal.label")}
              value={this.receiptTemp.documentNote}
              placeholder={t("modal.M35302CancelPaymentModal.label")}
              onChange={(event: any, data: any) =>
                this.onChangeInputField("documentNote", data.value)
              }
            />
            <Form.Field>
              <Header size="small">
                {t("modal.M35302CancelPaymentModal.header")}
              </Header>
            </Form.Field>
            <FormDisplay
              title={t("modal.M35302CancelPaymentModal.title")}
              value={
                pos.lastestPosShift && pos.lastestPosShift.onDutymanager
                  ? pos.lastestPosShift.onDutymanager.fullname
                  : pos.manager.fullname
              }
            />
            <Form.Input
              fluid
              label={t("modal.M35302CancelPaymentModal.pin")}
              placeholder={t("modal.M35302CancelPaymentModal.pin")}
              type="password"
              value={this.receiptTemp.pin}
              onChange={(event: any, data: any) =>
                this.onChangeInputField("pin", data.value)
              }
            />
          </Form>
          <Confirm
            closeOnDimmerClick={false}
            content={
              <div className="content">
                {t("module.pos.posPayer.confirmPrinter")}
                <Loading active={this.receiptTemp.loading} />
              </div>
            }
            size="mini"
            open={this.state.confirmModalPrinter}
            onCancel={this.closeConfirmModalPrinter}
            onConfirm={this.onSubmitNoCheck}
            cancelButton={t("module.pos.posPayer.cancelButton")}
            confirmButton={t("module.pos.posPayer.confirmButton")}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="blue"
            fluid
            disabled={this.receiptTemp.pin ? false : true}
            type="button"
            onClick={this.onClick}
            style={styles.button}
          >
            {t("modal.M35302CancelPaymentModal.submitButton")}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  public onSubmitNoCheck = async () => {
    await this.setState({ confirmPrinter: true });
    await this.onClick();
  };

  private onChangeInputField = (fieldname: string, value: any) => {
    this.receiptTemp.setField({ fieldname, value });
  };
  private onClick = async () => {
    const { receipt, pos, receiptList, appStore } = this.props;
    try {
      if (pos.lastestPosShift && pos.lastestPosShift.onDutymanagerId) {
        await this.receiptTemp.setField({
          fieldname: "managerId",
          value: pos.lastestPosShift.onDutymanagerId
        });
      } else {
        await this.receiptTemp.setField({
          fieldname: "managerId",
          value: pos.managerId
        });
      }
      if (!this.state.confirmPrinter) {
        await connectPrinter(pos, this.receiptTemp);
      }
      await this.receiptTemp.cancelReceiptPayment(pos.id);

      let printedDatetime = moment().format();
      if (!this.state.confirmPrinter) {
        printedDatetime = await printFromTemplate(
          pos,
          this.receiptTemp,
          "CL",
          appStore!
        );
        //printออก2ใบใน1รายการ
        printedDatetime = await printFromTemplate(
          pos,
          this.receiptTemp,
          "CL",
          appStore!
        );
      }
      await this.receiptTemp.reprintReceiptPrintLog(printedDatetime, "CL");
      await receipt.setAllField(this.receiptTemp.receiptJSON);
      await receipt.setField({ fieldname: "pin", value: "" });
      await receipt.error.setField({ fieldname: "tigger", value: false });
      this.close();
      await receipt.getReceiptCashierDetail(pos.id);
      await receiptList.load_data(pos.id, true);
      await receipt.alert.setAlertMessage(
        "บันทึกสำเร็จค่ะ",
        "เอกสารถูกปรับปรุงเรียบร้อยแล้ว"
      );
      await this.setState({ confirmPrinter: false });
      await this.setState({ confirmModalPrinter: false });
    } catch (e) {
      if (!this.state.confirmPrinter) {
        this.openConfirmModalPrinter();
      } else {
        await this.setState({ confirmPrinter: false });
        if (receipt.status !== "CL") {
          this.closeConfirmModalPrinter();

        }
      }

    }
  };
}
const styles: any = {
  button: {
    marginLeft: 0,
    marginRight: 0
  }
};
export default withTranslation()(M35302CancelPaymentModal);
