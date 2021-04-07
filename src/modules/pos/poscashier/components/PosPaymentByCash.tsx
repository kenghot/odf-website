import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form } from "semantic-ui-react";
import { CurrencyInput } from "../../../../components/common/input";
import { currency } from "../../../../utils/format-helper";
import { IReceiptModel } from "../../../receipt/ReceiptModel";

interface IPosPaymentByCash extends WithTranslation {
  receipt: IReceiptModel;
}

@observer
class PosPaymentByCash extends React.Component<IPosPaymentByCash> {
  public render() {
    const { t, receipt } = this.props;
    return (
      <React.Fragment>
        <Form.Group widths="equal" className="ui mini form">
          <Form.Field>
            <p style={styles.p}>
              {t("module.pos.posPaymentByCash.paidAmount")}
            </p>
          </Form.Field>
          <Form.Field
            control={CurrencyInput}
            id={`input-pos-posPaymentByCash-paidAmount`}
            value={receipt.paidAmount}
            onChangeInputField={this.onChangeInputField}
            fieldName={"paidAmount"}
          />
        </Form.Group>
        <Form.Group widths="equal" className="ui mini form">
          <Form.Field>
            <p style={styles.p}>
              {t("module.pos.posPaymentByCash.changeAmountLabel")}
            </p>
          </Form.Field>
          <Form.Field>
            <p style={styles.pBaht}>
              {currency(receipt.changeAmountLabel, 2)}
              <span style={styles.span}>
                {t("module.pos.posPaymentByCash.baht")}
              </span>
            </p>
          </Form.Field>
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
  span: {
    paddingLeft: 19
  },
  pBaht: {
    textAlign: "right",
    marginTop: 14,
    marginRight: 11
  },
  p: {
    marginTop: 14
  }
};
export default withTranslation()(PosPaymentByCash);
