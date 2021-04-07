import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { PosDonation, PosLoanPayback, PosOther, PosProject } from ".";
import { IAppModel } from "../../../../AppModel";
import { IReceiptModel } from "../../../receipt/ReceiptModel";

interface IPosPayment extends WithTranslation {
  receipt: IReceiptModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class PosPayment extends React.Component<IPosPayment> {
  public state = {
    posRefType: "AR",
  };
  public render() {
    const { t, appStore } = this.props;
    return (
      <React.Fragment>
        <Segment>
          <Form>
            <Form.Select
              fluid
              placeholder={t("module.pos.posPayment.posPaymentType")}
              label={t("module.pos.posPayment.posPaymentTypePlaceholder")}
              options={appStore!.enumItems("posRefType")}
              onChange={(event, data) =>
                this.setState({ posRefType: data.value })
              }
              value={this.state.posRefType}
            />
          </Form>
        </Segment>
        {this.state.posRefType === "AR" ? (
          <PosLoanPayback receipt={this.props.receipt} />
        ) : null}
        {/*  */}
        {this.state.posRefType === "D" ? (
          <PosDonation
            posRefType="D"
            receipt={this.props.receipt}
            name={appStore!.enumItemLabel("posRefType", "D")}
            content={t("module.pos.posDonation.headerContent")}
            subheader={t("module.pos.posDonation.subHeader")}
          />
        ) : null}
        {/*  */}
        {this.state.posRefType === "PR" ? (
          <PosProject receipt={this.props.receipt} />
        ) : null}
        {this.state.posRefType === "O" ? (
          <PosOther
            posRefType="O"
            receipt={this.props.receipt}
            name={appStore!.enumItemLabel("posRefType", "O")}
            content={t("module.pos.posDonation.specifyItemPaid")}
            subheader={t("module.pos.posDonation.subHeaderOther")}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default withTranslation()(PosPayment);
