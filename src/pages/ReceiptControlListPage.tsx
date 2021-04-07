import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { IAppModel } from "../AppModel";
import { IPosListModel } from "../modules/pos/PosListModel";
import {
  RemainingReceiptControlTable,
  RequestReceiptControlTable
} from "../modules/receiptcontrol";
import { IReceiptControlLogListModel } from "../modules/receiptcontrol/ReceiptControlLogListModel";
import { logTypeEnum } from "../modules/receiptcontrol/ReceiptControlLogModel";
import { PermissionControl } from "../components/permission";

interface IReceiptControlListPage extends WithTranslation, RouteComponentProps {
  receiptControlLogListStore?: IReceiptControlLogListModel;
  posesReceiptControlListStore?: IPosListModel;
  appStore?: IAppModel;
}

@inject(
  "receiptControlLogListStore",
  "posesReceiptControlListStore",
  "appStore"
)
@observer
class ReceiptControlListPage extends React.Component<IReceiptControlListPage> {
  public async componentDidMount() {
    const {
      appStore,
      receiptControlLogListStore,
      posesReceiptControlListStore
    } = this.props;
    try {
      appStore!.setField({
        fieldname: "pageHeader",
        value: "pos"
      });

      receiptControlLogListStore!.setFilter(logTypeEnum.request);

      await Promise.all([
        receiptControlLogListStore!.load_data(),
        posesReceiptControlListStore!.load_poses_receipt_control_data()
      ]);
    } catch (e) {
      console.log(e);
    }
  }

  public componentWillUnmount() {
    this.props.receiptControlLogListStore!.resetAll();
  }

  public render() {
    const {
      receiptControlLogListStore,
      posesReceiptControlListStore,
      appStore
    } = this.props;
    appStore!.setHeaderHeight();

    return (
      <React.Fragment>
        <PermissionControl codes={["POS.RECEIPTCONTROLS.APPROVE"]}>
          <RequestReceiptControlTable
            receiptControlLogListStore={receiptControlLogListStore!}
            posesReceiptControlListStore={posesReceiptControlListStore!}
          />
        </PermissionControl>
        <RemainingReceiptControlTable
          posesReceiptControlListStore={posesReceiptControlListStore!}
          style={styles.remainingReceiptControlTable}
        />
      </React.Fragment>
    );
  }
}

const styles = {
  remainingReceiptControlTable: {
    marginTop: 24
  }
};

export default withRouter(withTranslation()(ReceiptControlListPage));
