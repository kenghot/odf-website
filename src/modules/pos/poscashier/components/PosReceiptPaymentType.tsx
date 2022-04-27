import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Grid, Item, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import { Text } from "../../../../components/common";
import {
  currency,
  date_display_CE_TO_BE,
} from "../../../../utils/format-helper";
import { IReceiptModel } from "../../../receipt/ReceiptModel";

interface IPosReceiptPaymentType extends WithTranslation {
  appStore?: IAppModel;
  previousReceipt: IReceiptModel;
}

@inject("appStore")
@observer
class PosReceiptPaymentType extends React.Component<IPosReceiptPaymentType> {
  public render() {
    const { appStore, previousReceipt, t } = this.props;
    return (
      <Segment id="PosReceiptPaymentType">
        <Grid>
          <Grid.Row columns="equal">
            <Grid.Column>
              <Item.Group style={styles.itemGroup}>
                <Item>
                  <Item.Content>
                    <Item.Meta style={styles.itemMeta}>
                      <Text shade={2}>
                        {`${t(
                          "module.pos.posReceiptPaymentType.paymentMethod"
                        )}: ${appStore!.enumItemLabel(
                          "officePaymentMethod",
                          previousReceipt.paymentMethod
                        )}`}
                      </Text>
                    </Item.Meta>
                    {previousReceipt.paymentMethod === "CASH"
                      ? this.renderByCash()
                      : null}
                    {previousReceipt.paymentMethod === "MONEYORDER"
                      ? this.renderByMoneyOrder()
                      : null}
                    {previousReceipt.paymentMethod === "CHECK"
                      ? this.renderByCheck()
                      : null}
                    {previousReceipt.paymentMethod === "TRANSFER"
                      ? this.renderByTransfer()
                      : null}
                  </Item.Content>
                </Item>
              </Item.Group>
            </Grid.Column>
            <Grid.Column>
              <Item.Group style={styles.itemGroup}>
                <Item>
                  <Item.Content>
                    <Item.Meta style={styles.itemMeta}>
                      <Text shade={2}>
                        {t("module.pos.posReceiptPaymentType.recieveByName")}
                      </Text>
                    </Item.Meta>
                    <Item.Meta style={styles.itemMeta}>
                      <Text size="small">
                        {`${t("module.pos.posReceiptPaymentType.name")} ${
                          previousReceipt.createdByName || "-"
                        }`}
                      </Text>
                    </Item.Meta>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
  private renderByTransfer() {
    const { previousReceipt, t } = this.props;
    return (
      <Item.Meta style={styles.itemMeta}>
        <Text size="small">
          {`${t("module.pos.posReceiptPaymentType.paidAmountT")}: ${currency(
            previousReceipt.paidAmount,
            2
          )}`}
        </Text>
      </Item.Meta>
    );
  }
  private renderByCash() {
    const { previousReceipt, t } = this.props;
    return (
      <Item.Meta style={styles.itemMeta}>
        <Text size="small">
          {`${t("module.pos.posReceiptPaymentType.paidAmount")}: ${currency(
            previousReceipt.paidAmount,
            2
          )} / ${currency(previousReceipt.changeAmount, 2)}`}
        </Text>
      </Item.Meta>
    );
  }
  private renderByMoneyOrder() {
    const { previousReceipt, t } = this.props;
    return (
      <React.Fragment>
        <Item.Meta style={styles.itemMeta}>
          <Text size="small">
            {`${t("module.pos.posReceiptPaymentType.paymentRefNo")}: ${
              previousReceipt.paymentRefNo || "-"
            }`}
          </Text>
        </Item.Meta>
        <Item.Meta style={styles.itemMeta}>
          <Text size="small">
            {`${t("module.pos.posReceiptPaymentType.paidDate")}: ${
              date_display_CE_TO_BE(previousReceipt.paidDate, true) || "-"
            } / ${currency(previousReceipt.paidAmount, 2)}`}
          </Text>
        </Item.Meta>
      </React.Fragment>
    );
  }
  private renderByCheck() {
    const { appStore, previousReceipt, t } = this.props;
    return (
      <React.Fragment>
        <Item.Meta style={styles.itemMeta}>
          <Text size="small">
            {`${t(
              "module.pos.posReceiptPaymentType.paymentBank"
            )}: ${appStore!.enumItemLabel(
              "bank",
              previousReceipt.paymentBank
            )} / ${previousReceipt.paymentBankBranch || "-"}`}
          </Text>
        </Item.Meta>
        <Item.Meta style={styles.itemMeta}>
          <Text size="small">
            {`${t("module.pos.posReceiptPaymentType.paymentRefNo")}:  ${
              previousReceipt.paymentRefNo || "-"
            }`}
          </Text>
        </Item.Meta>
        <Item.Meta style={styles.itemMeta}>
          <Text size="small">
            {`${t("module.pos.posReceiptPaymentType.paidDate")}: ${
              date_display_CE_TO_BE(previousReceipt.paidDate, true) || "-"
            } / ${currency(previousReceipt.paidAmount, 2)}`}
          </Text>
        </Item.Meta>
      </React.Fragment>
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
export default withTranslation()(PosReceiptPaymentType);
