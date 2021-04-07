import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { IAuthModel } from "../modules/auth/AuthModel";
import { PosVerifyPincode } from "../modules/pos/poscashier/components";
import PosDetailBody from "../modules/pos/poscashier/components/PosDetailBody";
import { PosModel } from "../modules/pos/PosModel";
import { PosShiftListModel } from "../modules/pos/PosShiftListModel";
import { ReceiptListModel } from "../modules/receipt/ReceiptListModel";
import { ReceiptModel } from "../modules/receipt/ReceiptModel";
import FullScreenPageLayout from "./layouts/FullScreenPageLayout";

interface IPosCashierPage extends WithTranslation, RouteComponentProps<any> {
  authStore?: IAuthModel;
}

@inject("authStore")
@observer
class PosCashierPage extends React.Component<IPosCashierPage> {
  public state = { loading: false };

  private pos = PosModel.create({});
  private receipt = ReceiptModel.create({ paymentMethod: "CASH" });
  private posShiftList = PosShiftListModel.create({});
  private previousReceipt = ReceiptModel.create({});
  private receiptList = ReceiptListModel.create({});
  public async componentDidMount() {
    const id = this.props.match.params.id;
    try {
      await this.setState({ loading: true });
      if (id && this.pos.posShiftIdLocalStorage) {
        await this.pos.getPosDetailCashier(id);
        await this.receiptList.load_data(this.pos.id, true);
        await this.posShiftList.load_data(this.pos.id);

      }
      await this.setState({ loading: false });
    } catch (e) {
      console.log(e);
    }
  }
  public componentWillUnmount() {
    this.pos.resetAll();
    this.receipt.resetAll();
  }
  public render() {
    const color =
      this.props.location.state && this.props.location.state.color
        ? this.props.location.state.color
        : undefined;
    const id = this.props.match.params.id;
    const posCode =
      this.props.location.state && this.props.location.state.posCode
        ? this.props.location.state.posCode
        : undefined;
    return (
      <FullScreenPageLayout>
        {this.pos.id ? (
          <PosDetailBody
            loading={this.state.loading}
            previousReceipt={this.previousReceipt}
            receiptList={this.receiptList}
            receipt={this.receipt}
            pos={this.pos}
            posShiftList={this.posShiftList}
            color={color}
          />
        ) : (
            <PosVerifyPincode
              posId={id}
              pos={this.pos}
              color={color}
              posCode={posCode}
            />
          )}
      </FullScreenPageLayout>
    );
  }
}

export default withRouter(withTranslation()(PosCashierPage));
