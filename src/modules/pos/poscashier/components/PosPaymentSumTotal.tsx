import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Grid, Item, Segment } from "semantic-ui-react";
import { Text } from "../../../../components/common";
import { currency } from "../../../../utils/format-helper";
import { IReceiptModel } from "../../../receipt/ReceiptModel";

interface IPosPaymentSumTotal extends WithTranslation {
  receipt: IReceiptModel;
  editMode?: boolean;
}

@observer
class PosPaymentSumTotal extends React.Component<IPosPaymentSumTotal> {
  public render() {
    return (
      <Segment id="PosPaymentSumTotal1">
        <Grid>
          <Grid.Row>
            <Grid.Column
              computer={4}
              tablet={undefined}
              mobile={undefined}
            ></Grid.Column>
            <Grid.Column computer={12} tablet={16} mobile={16}>
              <Item.Group>
                <Item>{this.renderSum()}</Item>
              </Item.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }

  private renderSum() {
    const { t, receipt, editMode } = this.props;
    return (
      <Item.Group style={styles.itemGroup}>
        <Item>
          <Item.Content>
            <Item.Meta style={styles.itemMeta}>
              <Text size="big" shade={2}>
                {receipt.receiptItems.length &&
                (receipt.receiptItems[0].refType === "DA" ||
                  receipt.receiptItems[0].refType === "D")
                  ? t("module.pos.posPaymentCalculate.sumTotalLabel2")
                  : t("module.pos.posPaymentCalculate.sumTotalLabel")}
              </Text>
            </Item.Meta>
          </Item.Content>
          <Item.Content>
            <Item.Meta style={styles.itemMetaRight}>
              <Text size="big" shade={2}>
                {currency(editMode ? receipt.sumTotalLabel : receipt.total, 2)}
              </Text>
            </Item.Meta>
          </Item.Content>
        </Item>
      </Item.Group>
    );
  }
}
const styles: any = {
  itemMeta: {
    marginTop: 0,
    marginBottom: 5,
  },
  itemMetaRight: {
    marginTop: 0,
    marginBottom: 5,
    textAlign: "right",
  },
  itemGroup: {
    width: "100%",
  },
};
export default withTranslation()(PosPaymentSumTotal);
