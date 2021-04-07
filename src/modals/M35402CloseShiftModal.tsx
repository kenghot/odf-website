import { observer } from "mobx-react";
import moment from "moment";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Button, Form, Header, Item, Modal } from "semantic-ui-react";
import { FormDisplay, Text } from "../components/common";
import { CurrencyInput } from "../components/common/input";
import { COLORS } from "../constants";
import { IPosModel } from "../modules/pos/PosModel";
import { currency } from "../utils/format-helper";

interface IM35402CloseShiftModal extends WithTranslation, RouteComponentProps {
  trigger: any;
  pos: IPosModel;
  style?: any;
}
@observer
class M35402CloseShiftModal extends React.Component<IM35402CloseShiftModal> {
  public state = { open: false };
  public close = () => {
    const { pos } = this.props;
    pos.setField({ fieldname: "pin", value: "" });
    this.setState({ open: false });
  };
  public open = async () => {
    await this.props.pos.getPosDetailCashierReload();
    await this.setState({ open: true });
  };
  public render() {
    const { t, trigger, pos, style } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={trigger}
        onOpen={this.open}
        open={open}
        closeIcon
        onClose={this.close}
        size="small"
        style={style}
      >
        <Modal.Header>
          <Header textAlign="center">
            {t("modal.M35402CloseShiftModal.header")}
          </Header>
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Item.Group divided>
              <Item>{this.renderOpeningAmount()}</Item>
              <Item>{this.renderExpectedDrawerAmount()}</Item>
            </Item.Group>
            <Form.Field>
              <Header size="small">
                {t("modal.M35302CancelPaymentModal.header")}
              </Header>
            </Form.Field>
            <FormDisplay
              title={t("modal.M35302CancelPaymentModal.title")}
              value={
                pos.lastestPosShift &&
                pos.lastestPosShift.onDutymanager &&
                pos.lastestPosShift.onDutymanager.id
                  ? pos.lastestPosShift.onDutymanager.fullname
                  : pos.manager.fullname
              }
            />
            <Form.Input
              fluid
              label={t("modal.M35302CancelPaymentModal.pin")}
              placeholder={t("modal.M35302CancelPaymentModal.pin")}
              type="password"
              value={pos.pin || ""}
              onChange={(event: any, data: any) =>
                this.onChangeInputField("pin", data.value)
              }
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="blue"
            fluid
            type="button"
            onClick={this.onClick}
            style={styles.button}
          >
            {t("modal.M35402CloseShiftModal.button")}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
  private renderOpeningAmount() {
    const { t, pos } = this.props;
    return (
      <Item.Group style={styles.itemGroup}>
        <Item>
          <Item.Content>
            <Item.Meta style={styles.itemMeta}>
              <Text>{t("modal.M35402CloseShiftModal.openingAmount")}</Text>
            </Item.Meta>
          </Item.Content>
          <Item.Content>
            <Item.Meta style={styles.itemMetaRight}>
              <Text>
                {currency(pos.lastestPosShift.openingAmount, 2)}
                <span style={styles.unit}>
                  {t("modal.M35402CloseShiftModal.baht")}
                </span>
              </Text>
            </Item.Meta>
          </Item.Content>
        </Item>

        <Item>
          <Item.Content>
            <Item.Meta style={styles.itemMeta}>
              <Text>
                {t("modal.M35402CloseShiftModal.transactionAmount")}
                {` : ${pos.lastestPosShift.transactionCount || 0} ${t("list")}`}
              </Text>
            </Item.Meta>
          </Item.Content>
          <Item.Content>
            <Item.Meta style={styles.itemMetaRight}>
              <Text>
                {currency(pos.lastestPosShift.transactionAmount, 2)}
                <span style={styles.unit}>
                  {t("modal.M35402CloseShiftModal.baht")}
                </span>
              </Text>
            </Item.Meta>
          </Item.Content>
        </Item>
        <Item>
          <Item.Content>
            <Item.Meta style={styles.subItemMeta}>
              <Text>
                {t("modal.M35402CloseShiftModal.transactionCashAmount")}
                {` : ${pos.lastestPosShift.transactionCashCount || 0} ${t(
                  "list"
                )}`}
              </Text>
            </Item.Meta>
          </Item.Content>
          <Item.Content>
            <Item.Meta style={styles.itemMetaRight}>
              <Text>
                {currency(pos.lastestPosShift.transactionCashAmount, 2)}
                <span style={styles.unit}>
                  {t("modal.M35402CloseShiftModal.baht")}
                </span>
              </Text>
            </Item.Meta>
          </Item.Content>
        </Item>
        <Item>
          <Item.Content>
            <Item.Meta style={styles.subItemMeta}>
              <Text>
                {t("modal.M35402CloseShiftModal.transactionMoneyOrderAmount")}
                {` : ${pos.lastestPosShift.transactionMoneyOrderCount || 0} ${t(
                  "list"
                )}`}
              </Text>
            </Item.Meta>
          </Item.Content>
          <Item.Content>
            <Item.Meta style={styles.itemMetaRight}>
              <Text>
                {currency(pos.lastestPosShift.transactionMoneyOrderAmount, 2)}
                <span style={styles.unit}>
                  {t("modal.M35402CloseShiftModal.baht")}
                </span>
              </Text>
            </Item.Meta>
          </Item.Content>
        </Item>
        <Item>
          <Item.Content>
            <Item.Meta style={styles.subItemMeta}>
              <Text>
                {t("modal.M35402CloseShiftModal.transactionCheckAmount")}
                {` : ${pos.lastestPosShift.transactionCheckCount || 0} ${t(
                  "list"
                )}`}
              </Text>
            </Item.Meta>
          </Item.Content>
          <Item.Content>
            <Item.Meta style={styles.itemMetaRight}>
              <Text>
                {currency(pos.lastestPosShift.transactionCheckAmount, 2)}
                <span style={styles.unit}>
                  {t("modal.M35402CloseShiftModal.baht")}
                </span>
              </Text>
            </Item.Meta>
          </Item.Content>
        </Item>
      </Item.Group>
    );
  }

  private renderExpectedDrawerAmount() {
    const { t, pos } = this.props;
    return (
      <Item.Group style={styles.itemGroup}>
        <Item>
          <Item.Content>
            <Item.Meta style={styles.itemMeta}>
              <Text>
                {t("modal.M35402CloseShiftModal.expectedDrawerAmount")}
              </Text>
            </Item.Meta>
          </Item.Content>
          <Item.Content>
            <Item.Meta style={styles.itemMetaRight}>
              <Text>
                {currency(pos.lastestPosShift.expectedDrawerAmount, 2)}
                <span style={styles.unit}>
                  {t("modal.M35402CloseShiftModal.baht")}
                </span>
              </Text>
            </Item.Meta>
          </Item.Content>
        </Item>

        <Item>
          <Item.Content>
            <Item.Meta style={styles.textInput}>
              <Text>{t("modal.M35402CloseShiftModal.drawerAmount")}</Text>
            </Item.Meta>
          </Item.Content>
          <Item.Content>
            <Item.Meta style={styles.currencyInput}>
              <CurrencyInput
                id={"input-pos-lastestPosShift-drawerAmount"}
                float="right"
                value={pos.lastestPosShift.drawerAmount}
                onChangeInputField={this.onChangeInputFieldDrawerAmount}
                fieldName={"drawerAmount"}
              />
            </Item.Meta>
          </Item.Content>
        </Item>

        <Item>
          <Item.Content>
            <Item.Meta style={styles.itemMeta}>
              <Text>{t("modal.M35402CloseShiftModal.overShortAmount")}</Text>
            </Item.Meta>
          </Item.Content>
          <Item.Content>
            <Item.Meta style={styles.itemMetaRight}>
              <Text
                style={
                  pos.lastestPosShift.overShortAmountLabelView < 0
                    ? styles.textColorRed
                    : styles.textColorDefault
                }
              >
                {currency(pos.lastestPosShift.overShortAmountLabelView, 2)}
                <span style={styles.unit}>
                  {t("modal.M35402CloseShiftModal.baht")}
                </span>
              </Text>
            </Item.Meta>
          </Item.Content>
        </Item>
      </Item.Group>
    );
  }

  private onChangeInputFieldDrawerAmount = (fieldname: string, value: any) => {
    const { pos } = this.props;
    if (pos.lastestPosShift) {
      pos.lastestPosShift.setField({ fieldname, value });
    }
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { pos } = this.props;
    pos.setField({ fieldname, value });
  };
  private navigationToPosCashierListPage = async () => {
    const { history } = this.props;
    history.push(`/pos/cashier`);
  };
  private onClick = async () => {
    const { pos } = this.props;
    try {
      await pos.lastestPosShift.setField({
        fieldname: "endedShift",
        value: moment().format()
      });
      await pos.onPosCloseShift();
      this.close();
      await this.navigationToPosCashierListPage();
    } catch (e) {
      console.log(e);
    }
  };
}
const styles: any = {
  button: {
    marginLeft: 0,
    marginRight: 0
  },
  itemMeta: {
    marginTop: 0,
    marginBottom: 5
  },
  subItemMeta: {
    marginLeft: 14,
    marginTop: 0,
    marginBottom: 5
  },
  itemMetaRight: {
    marginTop: 0,
    marginBottom: 5,
    textAlign: "right"
  },
  itemGroup: {
    width: "100%"
  },
  currencyInput: {
    marginRight: 40,
    textAlign: "right"
  },
  unit: {
    paddingLeft: 19
  },
  textInput: {
    marginTop: 17
  },
  textColorDefault: {
    color: COLORS.lightGrey
  },
  textColorRed: {
    color: COLORS.red
  }
};
export default withRouter(withTranslation()(M35402CloseShiftModal));
