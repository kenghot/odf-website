import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form } from "semantic-ui-react";
import { CurrencyInput, DateInput } from "../../../../components/common/input";
import { IReceiptModel } from "../../../receipt/ReceiptModel";

interface IPosPaymentByMoneyOrder extends WithTranslation {
  receipt: IReceiptModel;
}

@observer
class PosPaymentByMoneyOrder extends React.Component<IPosPaymentByMoneyOrder> {
  public render() {
    const { t, receipt } = this.props;
    return (
      <React.Fragment>
        <Form.Group widths="equal" className="ui mini form">
          <Form.Input
            fluid
            placeholder={t("module.pos.posPaymentByMoneyOrder.paymentRefNo")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("paymentRefNo", data.value)
            }
            value={receipt.paymentRefNo}
          />
        </Form.Group>
        <Form.Group widths="equal" className="ui mini form">
          <Form.Field
            width={6}
            control={DateInput}
            value={receipt.paidDate}
            fieldName="paidDate"
            id={`input_paid_date`}
            type="date"
            onChangeInputField={this.onChangeInputField}
          />
          <Form.Field
            width={10}
            control={CurrencyInput}
            id={`input-pos-posPaymentByMoneyOrder-paidAmount`}
            placeholder={t("module.pos.posPaymentByMoneyOrder.paidAmount")}
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
export default withTranslation()(PosPaymentByMoneyOrder);
