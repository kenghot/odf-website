import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Icon, Segment } from "semantic-ui-react";
import { PosPaymentByCash, PosPaymentByCheck, PosPaymentByMoneyOrder, PosPaymentByTransfer } from ".";
import { IAppModel } from "../../../../AppModel";
import { COLORS } from "../../../../constants";
import { IReceiptModel } from "../../../receipt/ReceiptModel";

interface IPosPaymentType extends WithTranslation {
  appStore?: IAppModel;
  receipt: IReceiptModel;
  style?: any;
}

@inject("appStore")
@observer
class PosPaymentType extends React.Component<IPosPaymentType> {
  public state = { value: 1, open: true };
  public render() {
    const { appStore, receipt, t } = this.props;
    return (
      <Segment
        id="PosPaymentType"
        style={{ ...styles.segmentFont, ...this.props.style }}
      >
        <Form>
          <Form.Group widths="equal" style={styles.formGroup}>
            <Form.Field width={14}>
              <div className="inline fields" style={styles.inlineFields}>
                <label style={styles.label}>
                  {t("module.pos.posReceiptPaymentType.label")}
                </label>
                {appStore!
                  .enumItems("officePaymentMethod")
                  .map((item: any, index: number) => (
                    <React.Fragment key={index}>
                      <div className="ui radio checkbox">
                        <input
                          type="radio"
                          value={item.value}
                          onChange={(e: any) => {
                            this.onChangeInputField(
                              "paymentMethod",
                              e.target.value
                            );
                          }}
                          checked={receipt.paymentMethod === item.value}
                        />
                        <label style={styles.labelInput}>{item.text}</label>
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            </Form.Field>
            <Form.Field width={2} style={{ textAlign: "right" }}>
              <Icon
                name={this.state.open ? "angle down" : "angle right"}
                link
                onClick={() => this.setState({ open: !this.state.open })}
              />
            </Form.Field>
          </Form.Group>
          {this.state.open ? (
            <React.Fragment>
              {receipt.paymentMethod === "CASH" ? (
                <PosPaymentByCash receipt={receipt} />
              ) : null}
              {receipt.paymentMethod === "MONEYORDER" ? (
                <PosPaymentByMoneyOrder receipt={receipt} />
              ) : null}
              {receipt.paymentMethod === "CHECK" ? (
                <PosPaymentByCheck receipt={receipt} />
              ) : null}
              {receipt.paymentMethod === "TRANSFER" ? (
                <PosPaymentByTransfer receipt={receipt} />
              ) : null}
            </React.Fragment>
          ) : null}
        </Form>
      </Segment>
    );
  }
  private onChangeInputField = (fieldname: string, value: any) => {
    const { receipt } = this.props;
    receipt.setField({ fieldname, value });
  };
}
const styles: any = {
  segmentFont: {
    background: COLORS.blue,
    color: COLORS.white,
    paddingTop: 7,
    paddingBottom: 7,
  },
  inlineFields: {
    marginBottom: 0,
    flexWrap: "wrap",
    flexDirection: "initial",
  },
  label: {
    color: "white",
  },
  labelInput: {
    color: "white",
    marginRight: 4,
  },
  formGroup: {
    marginBottom: 7,
  },
};
export default withTranslation()(PosPaymentType);
