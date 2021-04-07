import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Responsive, Segment, SemanticCOLORS } from "semantic-ui-react";
import {
  PosDetailSummary,
  PosPayer,
  PosPaymentListItem,
  PosPaymentSumTotal,
  PosPaymentType
} from ".";
import { IAppModel } from "../../../../AppModel";
import { COLORS } from "../../../../constants";
import { IReceiptModel } from "../../../receipt/ReceiptModel";
import { IPosModel } from "../../PosModel";

interface IPosPaymentSummary extends WithTranslation {
  receipt: IReceiptModel;
  pos: IPosModel;
  paymentMethod: string;
  receiptItemLength: number;
  color?: SemanticCOLORS;
  appStore?: IAppModel;
  loading: boolean;
  defaultActiveMenu?: number;
}

@inject("appStore")
@observer
class PosPaymentSummary extends React.Component<IPosPaymentSummary> {
  public state = { maxHeightSegmentGroup: 0 };
  public componentDidMount() {
    try {
      this.handleOnUpdate();
      setTimeout(() => {
        this.handleOnUpdate();
      }, 100);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  public async componentDidUpdate(prevProps: any) {
    if (this.props.receiptItemLength !== prevProps.receiptItemLength) {
      this.handleOnUpdate();
    } else if (this.props.paymentMethod !== prevProps.paymentMethod) {
      this.handleOnUpdate();
    } else if (this.props.appStore!.loading !== prevProps.appStore.loading) {
      this.handleOnUpdate();
    } else if (this.props.loading !== prevProps.loading) {
      this.handleOnUpdate();
    } else if (this.props.defaultActiveMenu !== prevProps.defaultActiveMenu) {
      this.handleOnUpdate();
    }
  }
  public render() {
    const { t, pos, color } = this.props;

    return (
      <Segment.Group style={styles.segmentGroup}>
        <Responsive onUpdate={this.handleOnUpdate} />
        <PosDetailSummary
          pos={pos}
          color={color}
          headerLabel1={t("module.pos.posPaymentSummary.header")}
          headerLabel2={t("module.pos.posPaymentSummary.subheader")}
          headerColor={COLORS.blue}
          children={this.renderChildren()}
        />
      </Segment.Group>
    );
  }
  private renderChildren() {
    const { receipt, pos, appStore } = this.props;
    return (
      <React.Fragment>
        <PosPaymentListItem
          style={{
            overflowY: appStore!.tabletMode ? "initial" : "auto",
            maxHeight: appStore!.tabletMode
              ? "initial"
              : this.state.maxHeightSegmentGroup || "initial",
            minHeight: appStore!.tabletMode
              ? "initial"
              : this.state.maxHeightSegmentGroup || "initial"
          }}
          editMode
          receipt={receipt}
        />
        <PosPaymentSumTotal editMode receipt={receipt} />
        <PosPaymentType receipt={receipt} />
        <PosPayer pos={pos} receipt={receipt} />
      </React.Fragment>
    );
  }

  private getHeightElement = (id: string) => {
    this.forceUpdate();
    const height = document.getElementById(id)
      ? document.getElementById(id)!.clientHeight
      : 0;
    return height;
  };

  private handleOnUpdate = async () => {
    const padding = 7;
    const posPaymentSumTotal = this.getHeightElement("PosPaymentSumTotal1");
    const posPaymentType = this.getHeightElement("PosPaymentType");
    const posPayer = this.getHeightElement("PosPayer");
    const body = this.getHeightElement("Pos-Detail-Summary-Segment-Group-Body");

    const cal = body - padding - posPaymentSumTotal - posPaymentType - posPayer;
    if (cal > 0) {
      await this.setState({
        maxHeightSegmentGroup: cal
      });
    } else {
      await this.setState({
        maxHeightSegmentGroup: 0
      });
    }
  };
}
const styles: any = {
  segmentGroup: {
    margin: 0,
    border: 0,
    boxShadow: "none"
  }
};
export default withTranslation()(PosPaymentSummary);
