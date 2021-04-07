import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import { ErrorMessage, FormDisplay } from "../components/common";
import { Loading } from "../components/common/loading";
import { IPosModel } from "../modules/pos/PosModel";
import { IReceiptModel } from "../modules/receipt/ReceiptModel";

interface IM35301ReprintEditModal extends WithTranslation {
  trigger: any;
  pos: IPosModel;
  receipt: IReceiptModel;
  title?: string;
  style?: any;
  onClick: () => void;
}
@observer
class M35301ReprintEditModal extends React.Component<IM35301ReprintEditModal> {
  public state = { open: false };
  public close = () => {
    this.setState({ open: false });
    this.props.receipt.setField({ fieldname: "pin", value: "" });
  };
  public open = () => {
    this.setState({ open: true });
  };
  public render() {
    const { t, trigger, pos, title, style } = this.props;
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
          <Loading active={this.props.receipt.loading} />
          <ErrorMessage
            errorobj={this.props.receipt.error}
            float
            timeout={5000}
          />
          <Form>
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
              value={this.props.receipt.pin}
              onChange={(event: any, data: any) =>
                this.onChangeInputField("pin", data.value)
              }
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="blue"
            fluid
            disabled={this.props.receipt.pin ? false : true}
            onClick={this.onClick}
            style={styles.button}
          >
            {t("modal.M35302CancelPaymentModal.submitButtonLabel")}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
  private onChangeInputField = (fieldname: string, value: any) => {
    this.props.receipt.setField({ fieldname, value });
  };
  private onClick = async () => {
    const { onClick } = this.props;
    try {
      await onClick();
      this.close();
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
}
const styles: any = {
  button: {
    marginLeft: 0,
    marginRight: 0
  }
};
export default withTranslation()(M35301ReprintEditModal);
