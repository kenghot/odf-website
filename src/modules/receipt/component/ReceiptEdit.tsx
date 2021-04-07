import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Grid, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { ErrorMessage } from "../../../components/common";
import {
  PosPayerSection,
  PosPaymentListItem,
  PosPaymentSumTotal,
  PosReceiptPaymentType,
} from "../../pos/poscashier/components";
import { ReceiptHeaderSummary, ReceiptInfoEdit } from "../receiptcashier";
import { IReceiptModel } from "../ReceiptModel";

interface IReceiptEdit extends WithTranslation {
  receipt: IReceiptModel;
  appStore?: IAppModel;
  maxHeightSegmentGroup: number;
}

@inject("appStore")
@observer
class ReceiptEdit extends React.Component<IReceiptEdit> {
  public render() {
    const { t, receipt } = this.props;
    return (
      <>
        <ErrorMessage errorobj={receipt.error} float timeout={5000} />
        <Grid>
          <Grid.Row>
            {this.renderColumnL()}
            {this.renderColumnR()}
          </Grid.Row>
        </Grid>
      </>
    );
  }

  private renderColumnL() {
    const { receipt, appStore, maxHeightSegmentGroup } = this.props;
    return (
      <Grid.Column width={8}>
        <Segment.Group>
          <ReceiptHeaderSummary receipt={receipt} />
          <PosPaymentListItem
            style={{
              overflowY: appStore!.tabletMode ? "initial" : "auto",
              maxHeight: appStore!.tabletMode
                ? "initial"
                : maxHeightSegmentGroup,
              minHeight: appStore!.tabletMode
                ? "initial"
                : maxHeightSegmentGroup,
            }}
            receipt={receipt}
          />
          <PosPaymentSumTotal receipt={receipt} />
          <PosReceiptPaymentType previousReceipt={receipt} />
          <Segment id="PosReceiptPayerSection">
            <Form>
              <PosPayerSection receipt={receipt} />
            </Form>
          </Segment>
        </Segment.Group>
      </Grid.Column>
    );
  }

  private renderColumnR() {
    const { receipt } = this.props;
    return (
      <Grid.Column width={8}>
        <ReceiptInfoEdit receipt={receipt} />
      </Grid.Column>
    );
  }
}

const styles: any = {
  segmentGrey: {},
};
export default withTranslation()(ReceiptEdit);
