import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import {
  AlertMessage,
  DateInput,
  ErrorMessage,
  FormDisplay,
} from "../components/common";
import { CurrencyInput } from "../components/common/input";
import { Loading } from "../components/common/loading";
import {
  AccountReceivableTransactionsModel,
  IAccountReceivableModel,
  IAccountReceivableTransactionsModel,
} from "../modules/accountReceivable/AccountReceivableModel";
import moment from "moment";

interface IAccountReceivableTransactionModal extends WithTranslation {
  trigger?: any;
  arTransactionsItem?: IAccountReceivableTransactionsModel;
  accountReceivable: IAccountReceivableModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class AccountReceivableTransactionModal extends React.Component<IAccountReceivableTransactionModal> {
  public state = {
    open: false,
  };
  public arTransactionsItem = AccountReceivableTransactionsModel.create({});
  public close = () => {
    this.setState({ open: false });
    this.arTransactionsItem.resetAll();
  };
  public open = () => {
    this.setState({ open: true });
    this.arTransactionsItem.setField({
      fieldname: "paymentType",
      value: "OFFICE-M",
    });
    if (this.props.arTransactionsItem && this.props.arTransactionsItem.id) {
      this.arTransactionsItem.setAllField(
        this.props.arTransactionsItem.arTransactionsJSON
      );
      this.arTransactionsItem.setField({
        fieldname: "oldPaidAmount"
        , value: this.arTransactionsItem.paidAmount
      });
    }
  };
  public render() {
    const { trigger, t } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={trigger}
        onOpen={this.open}
        open={open}
        closeIcon
        onClose={this.close}
        size="small"
      >
        <Modal.Header>
          <Header textAlign="center">
            {t("modal.AccountReceivableTransactionModal.header")}
          </Header>
        </Modal.Header>
        <Modal.Content scrolling>
          <AlertMessage
            messageobj={this.arTransactionsItem.alert}
            float={true}
            timeout={3000}
          />
          <Loading active={this.arTransactionsItem.loading} />
          <ErrorMessage
            errorobj={this.arTransactionsItem.error}
            float={true}
            timeout={10000}
          />
          {this.renderContent()}
        </Modal.Content>
        <Modal.Actions>{this.renderActions()}</Modal.Actions>
      </Modal>
    );
  }

  private renderContent() {
    const { t, appStore } = this.props;
    return (
      <Form>
        {/* <Form.Field
          label={t(
            "module.accountReceivable.accountReceivableTransactionTable.paymentDate"
          )}
          control={DateInput}
          value={this.arTransactionsItem.createdDate}
          fieldName={"createdDate"}
          onChangeInputField={this.onChangeInputField}
          id={`arTransactionItem-createdDate`}
        /> */}
        <Form.Field
          label={t(
            "module.accountReceivable.accountReceivableTransactionTable.paidDate"
          )}
          control={DateInput}
          fieldName={"paidDate"}
          value={this.arTransactionsItem.paidDate}
          onChangeInputField={this.onChangeInputField}
          id={`arTransactionItem-paidDate`}
        />
        <FormDisplay
          title={t(
            "module.accountReceivable.accountReceivableTransactionTable.paymentType"
          )}
          value={this.arTransactionsItem.paymentType}
        />
        <Form.Select
          fluid
          label={t(
            "module.accountReceivable.accountReceivableTransactionTable.paymentMethods"
          )}
          placeholder={t(
            "modal.AccountReceivableTransactionModal.paymentMethodPlaceholder"
          )}
          options={appStore!.enumItems("paymentMethod")}
          onChange={(event, data) =>
            this.onChangeInputField("paymentMethod", data.value)
          }
          value={this.arTransactionsItem.paymentMethod || ""}
        />
        <Form.Field
          id={"input-ar-paidAmount"}
          label={t(
            "module.accountReceivable.accountReceivableTransactionTable.payments"
          )}
          control={CurrencyInput}
          labelText={t("modal.AccountReceivableTransactionModal.baht")}
          value={this.arTransactionsItem.paidAmount || ""}
          onChangeInputField={this.onChangeInputField}
          fieldName={"paidAmount"}
        />
        <Form.Input
          fluid
          label={t(
            "module.accountReceivable.accountReceivableTransactionTable.referencePaymentNumber"
          )}
          placeholder={t(
            "modal.AccountReceivableTransactionModal.referenceNoPlaceholder"
          )}
          onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
            this.onChangeInputField("paymentReferenceNo", data.value)
          }
          value={this.arTransactionsItem.paymentReferenceNo || ""}
        />
      </Form>
    );
  }

  private renderActions() {
    const { t } = this.props;
    return (
      <React.Fragment>
        {this.arTransactionsItem.id ? (
          <Button
            color="teal"
            fluid
            type="button"
            onClick={this.onUpdate}
            style={styles.button}
            content={t("save")}
          />
        ) : (
          <Button
            color="teal"
            fluid
            type="button"
            onClick={this.onCreate}
            style={styles.button}
            content={t("modal.AccountReceivableTransactionModal.created")}
          />
        )}
      </React.Fragment>
    );
  }

  private onChangeInputField = (fieldname: string, value: any) => {
    this.arTransactionsItem.setField({ fieldname, value });
  };

  private onUpdate = async () => {
    const { accountReceivable, arTransactionsItem } = this.props;
    try {
      const outstandingDebtBalance = parseFloat(accountReceivable.outstandingDebtBalance);
      const paidAmount = parseFloat(this.arTransactionsItem.paidAmount);
      const oldPaidAmount = parseFloat(this.arTransactionsItem.oldPaidAmount);
      const totaloutstandingDebtBalance = (outstandingDebtBalance + oldPaidAmount) - paidAmount;
      this.arTransactionsItem.setField({
        fieldname: "outstandingDebtBalance"
        , value: totaloutstandingDebtBalance.toString()
      });
      //AR beer27092021
      accountReceivable.setField({
        fieldname: "installmentLastAmount"
        , value: paidAmount.toString()
      });
      accountReceivable.setField({
        fieldname: "outstandingDebtBalance"
        , value: totaloutstandingDebtBalance.toString()
      });
      accountReceivable.setField({
        fieldname: "lastPaymentDate"
        , value: moment(this.arTransactionsItem.paidDate).format("YYYY-MM-DD")
      });
      await this.arTransactionsItem.updateArTransaction();
      if (arTransactionsItem) {
        await arTransactionsItem.setAllField(
          this.arTransactionsItem.arTransactionsJSON
        );
      }
      await accountReceivable.updateAccountReceivable();
      await accountReceivable.getAccountReceivableDetail();
      this.close();
    } catch (e) {
      console.log(e);
    }
  };
  private onCreate = async () => {
    const { accountReceivable } = this.props;
    try {
      const outstandingDebtBalance = parseFloat(accountReceivable.outstandingDebtBalance);
      const paidAmount = parseFloat(this.arTransactionsItem.paidAmount);
      const totaloutstandingDebtBalance = outstandingDebtBalance - paidAmount;
      this.arTransactionsItem.setField({
        fieldname: "outstandingDebtBalance"
        , value: totaloutstandingDebtBalance.toString()
      });
      //AR beer27092021
      accountReceivable.setField({
        fieldname: "installmentLastAmount"
        , value: paidAmount.toString()
      });
      accountReceivable.setField({
        fieldname: "outstandingDebtBalance"
        , value: totaloutstandingDebtBalance.toString()
      });
      accountReceivable.setField({
        fieldname: "lastPaymentDate"
        , value: moment(this.arTransactionsItem.paidDate).format("YYYY-MM-DD")
      });
      await this.arTransactionsItem.createArTransaction(accountReceivable.id);
      await accountReceivable.updateAccountReceivable();
      await accountReceivable.getAccountReceivableDetail();
      await this.close();
    } catch (e) {
      console.log(e);
    }
  };
}
const styles: any = {
  button: {
    marginLeft: 0,
    marginRight: 0,
  },
};
export default withTranslation()(AccountReceivableTransactionModal);
