import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import { AttachedFile, ErrorMessage, FormDisplay } from "../components/common";
import { InputLabel } from "../components/common/input";
import { AlertMessage } from "../components/common/message";
import { IPosModel, PosModel } from "../modules/pos/PosModel";
import { ReceiptControlLogModel } from "../modules/receiptcontrol";
import { logTypeEnum } from "../modules/receiptcontrol/ReceiptControlLogModel";

interface IM381RequestReceiptModal extends WithTranslation {
  trigger: any;
  pos: IPosModel;
  title?: string;
  style?: any;
  logType: logTypeEnum;
  fromPos?: boolean;
}

@observer
class M381RequestReceiptModal extends React.Component<
  IM381RequestReceiptModal
> {
  public receiptControlLogStore = ReceiptControlLogModel.create({});
  public posItem = PosModel.create({});
  private alertMessageTimeout = 2500;

  public state = { open: false, roll: 0, errorValue: false };

  public close = () => {
    this.setState({ open: false });
    this.posItem.resetAll();
    this.receiptControlLogStore.resetAll();
  };

  public open = () => {
    this.setState({ open: true });
    if (this.props.pos && this.props.pos.id) {
      this.posItem.setAllField(this.props.pos.posJSON);
    }
  };

  public render() {
    const { t, trigger, pos, title, logType, fromPos, style } = this.props;
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
          <Header textAlign="center">{title}</Header>
        </Modal.Header>
        <Modal.Content>
          <Form loading={this.receiptControlLogStore.loading}>
            {this.renderInputQuantity()}
            {logType === logTypeEnum.request ? (
              <Form.Field
                label={t("modal.M381RequestReceiptModal.attachPetition")}
                mode={"edit"}
                control={AttachedFile}
                multiple={true}
                fieldName="posItem.attachedFiles"
                files={this.receiptControlLogStore.requestAttachedFilesList}
                addFiles={(files: any) =>
                  this.receiptControlLogStore.addAttachedFiles(
                    "requestAttachedFiles",
                    files
                  )
                }
                removeFile={(index?: number) =>
                  this.receiptControlLogStore.removeAttachedFile(
                    "requestAttachedFiles",
                    index
                  )
                }
              />
            ) : null}
            <Form.Field>
              <Header size="small">
                {t("modal.M35302CancelPaymentModal.header")}
              </Header>
            </Form.Field>
            <FormDisplay
              title={t("modal.M35302CancelPaymentModal.title")}
              value={
                fromPos &&
                pos.lastestPosShift &&
                pos.lastestPosShift.onDutymanager &&
                pos.lastestPosShift.onDutymanager.fullname
                  ? pos.lastestPosShift.onDutymanager.fullname
                  : pos.manager.fullname
              }
            />
            <Form.Input
              fluid
              label={t("modal.M35302CancelPaymentModal.pin")}
              placeholder={t("modal.M35302CancelPaymentModal.pin")}
              type="password"
              value={this.posItem.pin || ""}
              onChange={(event: any, data: any) =>
                this.onChangeInputField("pin", data.value)
              }
            />
            <ErrorMessage errorobj={this.receiptControlLogStore.error} />
          </Form>
          <AlertMessage
            messageobj={this.receiptControlLogStore.alert}
            float
            timeout={this.alertMessageTimeout}
          />
          <ErrorMessage
            errorobj={this.receiptControlLogStore.error}
            float
            timeout={5000}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="blue"
            fluid
            disabled={this.posItem.pin && !this.state.errorValue ? false : true}
            onClick={this.onSubmit}
            style={styles.button}
          >
            {t("modal.M381RequestReceiptModal.submitButtonLabel")}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private renderInputQuantity = () => {
    const { logType, t } = this.props;
    return (
      <React.Fragment>
        <Form.Field
          error={this.state.errorValue}
          label={t("modal.M381RequestReceiptModal.number")}
          control={InputLabel}
          labelText={t("roll")}
          fieldName={
            logType === logTypeEnum.request
              ? "requestQuantity"
              : "approveQuantity"
          }
          placeholder={0}
          value={
            (logType === logTypeEnum.request
              ? this.receiptControlLogStore.requestQuantity
              : this.receiptControlLogStore.approveQuantity) || ""
          }
          onChangeInputField={this.onChangeInputFieldReceipt}
        />
        {this.state.errorValue ? (
          <React.Fragment>
            <Form.Field
              label={t("modal.M381RequestReceiptModal.errorRoll")}
              error={this.state.errorValue}
            />
            <br />
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  };

  private onChangeInputFieldReceipt = async (fieldname: string, value: any) => {
    const { logType, pos } = this.props;
    this.receiptControlLogStore.setField({ fieldname, value: +value });
    if (
      logType === logTypeEnum.used &&
      this.receiptControlLogStore.approveQuantity
    ) {
      await this.setState({
        errorValue:
          this.receiptControlLogStore.approveQuantity > pos.onhandReceipt
      });
    } else {
      await this.setState({ errorValue: false });
    }
  };

  private onChangeInputField = (fieldname: string, value: any) => {
    this.posItem.setField({ fieldname, value });
  };

  private onSubmit = async () => {
    const { pos, logType, fromPos } = this.props;
    try {
      const managerId =
        fromPos &&
        pos.lastestPosShift &&
        pos.lastestPosShift.onDutymanager &&
        pos.lastestPosShift.onDutymanager.id
          ? pos.lastestPosShift.onDutymanager.id
          : pos.manager.id;
      await this.receiptControlLogStore.create_data(
        this.posItem.id,
        this.posItem.pin!,
        managerId,
        logType === logTypeEnum.request ? logTypeEnum.request : logTypeEnum.used
      );

      // Set ค่าจาก response กลับไปให้ pos ที่ส่งมา
      pos.setField({
        fieldname: "onhandReceipt",
        value: this.receiptControlLogStore.pos.onhandReceipt
      });
      pos.setField({
        fieldname: "requestReceipt",
        value: this.receiptControlLogStore.pos.requestReceipt
      });

      await new Promise((resolve) =>
        setTimeout(resolve, this.alertMessageTimeout)
      );
      this.close();
    } catch (e) {
      console.log(e);
    }
  };
}
const styles: any = {
  button: {
    marginLeft: 0,
    marginRight: 0
  }
};
export default withTranslation()(M381RequestReceiptModal);
