import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { PosReceiptSearchForm, PosReceiptTable } from ".";
import { IAppModel } from "../../../../AppModel";
import { IReceiptListModel } from "../../../receipt/ReceiptListModel";
import { IReceiptModel } from "../../../receipt/ReceiptModel";
import { IPosModel } from "../../PosModel";

interface IPosReceipt extends WithTranslation {
  receipt: IReceiptModel;
  pos: IPosModel;
  previousReceipt: IReceiptModel;
  receiptList: IReceiptListModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class PosReceipt extends React.Component<IPosReceipt> {
  public async componentDidMount() {
    const { receiptList, pos } = this.props;
    try {
      await receiptList.load_data(pos.id, true);
    } catch (e) {
      console.log(e);
    }
  }
  public render() {
    const { receiptList, previousReceipt, pos } = this.props;
    return (
      <React.Fragment>
        <PosReceiptSearchForm pos={pos} receiptList={receiptList} />
        <PosReceiptTable
          pos={pos}
          previousReceipt={previousReceipt}
          receiptList={receiptList}
        />
      </React.Fragment>
    );
  }
}

export default withTranslation()(PosReceipt);
