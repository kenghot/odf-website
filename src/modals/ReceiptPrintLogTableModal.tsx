import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Header, Modal } from "semantic-ui-react";
import { ReceiptPrintLogTable } from "../modules/receipt/receiptmanagement/components";
import { IReceiptModel } from "../modules/receipt/ReceiptModel";

interface IReceiptPrintLogTableModal extends WithTranslation {
  trigger: any;
  receipt: IReceiptModel;
}
@observer
class ReceiptPrintLogTableModal extends React.Component<
  IReceiptPrintLogTableModal
> {
  public state = { open: false };
  public close = () => {
    this.setState({ open: false });
  };
  public open = () => {
    this.setState({ open: true });
  };
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
        size="large"
      >
        <Modal.Header>
          <Header textAlign="center">
            {t("module.receipt.receiptPrintLogTable.content")}
          </Header>
        </Modal.Header>
        <Modal.Content scrolling>
          <ReceiptPrintLogTable notPaddedVery receipt={receipt} />
        </Modal.Content>
      </Modal>
    );
  }
}

export default withTranslation()(ReceiptPrintLogTableModal);
