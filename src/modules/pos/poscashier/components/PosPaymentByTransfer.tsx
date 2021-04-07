import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form } from "semantic-ui-react";
import { CurrencyInput, DateInput } from "../../../../components/common/input";
import { IReceiptModel } from "../../../receipt/ReceiptModel";

interface IPosPaymentByTransfer extends WithTranslation {
  receipt: IReceiptModel;
}

@observer
class PosPaymentByTransfer extends React.Component<IPosPaymentByTransfer> {
  public render() {
    const { t, receipt } = this.props;
    return (
      <React.Fragment>
        <Form.Group widths="equal" className="ui mini form">
          <Form.Field
            control={DateInput}
            value={receipt.tempTransferDate}
            fieldName="tempTransferDate"
            id={`input_tempTransferDate`}
            type="date"
            onChangeInputField={this.onChangeInputField}
          />
          <Form.Input
            placeholder={"เลขที่เอกสารอ้างอิง"}
            value={receipt.tempPaymentRefNo}
            onChange={(event: any, data: any) => {
              this.onChangeInputField("tempPaymentRefNo", data.value);
            }}
          />
        </Form.Group>
        <Form.Group widths="equal" className="ui mini form">
          <Form.Field
            control={CurrencyInput}
            id={`input-pos-losPaymentByCheck-paidAmount`}
            placeholder={t("module.pos.posPaymentByCheck.paidAmount")}
            value={receipt.paidAmount}
            onChangeInputField={this.onChangeInputField}
            fieldName={"paidAmount"}
          />
        </Form.Group>
      </React.Fragment>
    );
  }
  private onChangeInputField = (fieldname: string, value: any) => {
    const { receipt } = this.props;
    receipt.setField({ fieldname, value });
  };
}
const styles: any = {
  p: {
    marginTop: 14,
  },
};
export default withTranslation()(PosPaymentByTransfer);
