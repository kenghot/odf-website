import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form } from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import { CurrencyInput, DateInput } from "../../../../components/common/input";
import { IReceiptModel } from "../../../receipt/ReceiptModel";

interface IPosPaymentByCheck extends WithTranslation {
  receipt: IReceiptModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class PosPaymentByCheck extends React.Component<IPosPaymentByCheck> {
  public render() {
    const { t, appStore, receipt } = this.props;
    return (
      <React.Fragment>
        <Form.Group widths="equal" className="ui mini form">
          <Form.Select
            fluid
            width={6}
            placeholder={t("module.pos.posPaymentByCheck.specifyBankName")}
            options={appStore!.enumItems("bank")}
            onChange={(event: any, data: any) => {
              this.onChangeInputField("paymentBank", data.value);
            }}
            value={receipt.paymentBank}
          />
          <Form.Input
            fluid
            width={10}
            placeholder={t("module.pos.posPaymentByCheck.paymentBankBranch")}
            value={receipt.paymentBankBranch}
            onChange={(event: any, data: any) => {
              this.onChangeInputField("paymentBankBranch", data.value);
            }}
          />
        </Form.Group>
        <Form.Group widths="equal" className="ui mini form">
          <Form.Input
            placeholder={t("module.pos.posPaymentByCheck.paymentRefNo")}
            value={receipt.paymentRefNo}
            onChange={(event: any, data: any) => {
              this.onChangeInputField("paymentRefNo", data.value);
            }}
          />
        </Form.Group>
        <Form.Group widths="equal" className="ui mini form">
          <Form.Field
            width={6}
            control={DateInput}
            value={receipt.paidDate}
            fieldName="paidDate"
            id={`input_paid_date_by_check`}
            type="date"
            onChangeInputField={this.onChangeInputField}
          />
          <Form.Field
            width={10}
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

export default withTranslation()(PosPaymentByCheck);
