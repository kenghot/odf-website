import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Grid, SemanticCOLORS } from "semantic-ui-react";
import {
  PosMenuBar,
  PosPayment,
  PosPaymentSummary,
  PosReceipt,
  PosReceiptSummary,
  PosShift,
  PosShiftSummary
} from ".";
import { IAppModel } from "../../../../AppModel";
import { ErrorMessage } from "../../../../components/common";
import { Loading } from "../../../../components/common/loading";
import { COLORS } from "../../../../constants";
import { hasPermission } from "../../../../utils/render-by-permission";
import { IReceiptListModel } from "../../../receipt/ReceiptListModel";
import { IReceiptModel } from "../../../receipt/ReceiptModel";
import { IPosModel, IPosShiftModel } from "../../PosModel";
import { IPosShiftListModel } from "../../PosShiftListModel";
import { IPosShiftLogListModel } from "../../PosShiftLogListModel";

interface IPosDetailBody extends WithTranslation, RouteComponentProps<any> {
  pos: IPosModel;
  posShiftList: IPosShiftListModel;
  receipt: IReceiptModel;
  previousReceipt: IReceiptModel;
  receiptList: IReceiptListModel;
  color?: SemanticCOLORS;
  appStore?: IAppModel;
  loading: boolean;
}

@inject("appStore")
@observer
class PosDetailBody extends React.Component<IPosDetailBody> {
  public render() {
    const { pos, receipt, appStore } = this.props;
    return (
      <React.Fragment>
        <Loading active={pos.loading} />
        <ErrorMessage errorobj={pos.error} float timeout={5000} />
        <Loading active={receipt.loading} />
        <ErrorMessage errorobj={receipt.error} float timeout={5000} />
        <Grid stackable>
          <Grid.Row style={styles.row}>
            <Grid.Column
              computer={10}
              tablet={16}
              style={{
                ...styles.colLeft,
                overflowY: appStore!.tabletMode ? "initial" : "auto",
                maxHeight: appStore!.tabletMode
                  ? "initial"
                  : appStore!.screenHeight
              }}
            >
              {this.renderLeft()}
            </Grid.Column>
            <Grid.Column
              computer={6}
              tablet={16}
              style={{
                ...styles.colRight,
                // overflowY: appStore!.tabletMode ? "initial" : "auto",
                maxHeight: appStore!.tabletMode
                  ? "initial"
                  : appStore!.screenHeight,
                minHeight: appStore!.tabletMode
                  ? "initial"
                  : appStore!.screenHeight
              }}
            >
              {this.renderRight()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
  private renderLeft() {
    const {
      pos,
      posShiftList,
      receipt,
      receiptList,
      previousReceipt
    } = this.props;
    return (
      <React.Fragment>
        <PosMenuBar pos={pos} />
        {hasPermission("POS.USAGE.SALE") && pos.defaultActiveMenu === 1 ? (
          <PosPayment receipt={receipt} />
        ) : null}
        {hasPermission("POS.USAGE.RECEIPTS") && pos.defaultActiveMenu === 2 ? (
          <PosReceipt
            pos={pos}
            previousReceipt={previousReceipt}
            receiptList={receiptList}
            receipt={receipt}
          />
        ) : null}
        {hasPermission("POS.USAGE.CONTROL") && pos.defaultActiveMenu === 3 ? (
          <PosShift
            posShiftList={posShiftList}
            pos={pos}
          />
        ) : null}
      </React.Fragment>
    );
  }

  private renderRight() {
    const {
      pos,
      receipt,
      receiptList,
      previousReceipt,
      color,
      loading
    } = this.props;
    const receiptItemLength = receipt.receiptItems.length;
    const paymentMethod = receipt.paymentMethod;

    return (
      <React.Fragment>
        {hasPermission("POS.USAGE.SALE") && pos.defaultActiveMenu === 1 ? (
          <PosPaymentSummary
            defaultActiveMenu={pos.defaultActiveMenu}
            pos={pos}
            color={color}
            receipt={receipt}
            receiptItemLength={receiptItemLength}
            paymentMethod={paymentMethod}
            loading={loading}
          />
        ) : null}
        {hasPermission("POS.USAGE.RECEIPTS") && pos.defaultActiveMenu === 2 ? (
          <PosReceiptSummary
            color={color}
            pos={pos}
            receiptList={receiptList}
            previousReceipt={previousReceipt}
          />
        ) : null}
        {hasPermission("POS.USAGE.CONTROL") && pos.defaultActiveMenu === 3 ? (
          <PosShiftSummary
            color={color}
            pos={pos}
          />
        ) : null}
      </React.Fragment>
    );
  }
  private getHeightElement = (id: string) => {
    // this.forceUpdate();
    const height = document.getElementById(id)
      ? document.getElementById(id)!.clientHeight ||
      document.getElementById(id)!.scrollHeight
      : 0;
    return height;
  };
}
const styles: any = {
  colLeft: {
    padding: 25,
    overflowX: "hidden"
  },
  colRight: {
    marginBottom: 0,
    background: COLORS.white,
    padding: 0,
    boxShadow: "0 1px 2px 0 rgba(34,36,38,.15)"
  },
  row: {
    padding: 0
  }
};
export default withRouter(withTranslation()(PosDetailBody));
