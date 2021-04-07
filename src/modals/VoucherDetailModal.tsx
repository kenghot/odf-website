import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Grid, Header, Modal } from "semantic-ui-react";
import { ConfirmModal } from ".";
import { AlertMessage, ErrorMessage, FormDisplay } from "../components/common";
import { CurrencyInput } from "../components/common/input";
import { Loading } from "../components/common/loading";
import { PermissionControl } from "../components/permission";
import { BankAccount } from "../components/project";
import { VoucherHeader } from "../modules/finance/voucher/components";
import {
  IVoucherModel,
  VoucherModel,
} from "../modules/finance/voucher/VoucherModel";
import { currency } from "../utils/format-helper";
import { hasPermission } from "../utils/render-by-permission";

interface IVoucherDetailModal extends WithTranslation {
  trigger?: any;
  voucher: IVoucherModel;
  viewMode?: boolean;
}
@observer
class VoucherDetailModal extends React.Component<IVoucherDetailModal> {
  private voucherTemp = VoucherModel.create({});
  public state = { open: false };
  public close = async (delayBeforeClose?: "delayBeforeClose") => {
    if (delayBeforeClose) {
      setTimeout(() => {
        this.setState({ open: false });
      }, 2500);
    } else {
      this.setState({ open: false });
    }
  };
  public open = () => {
    const { voucher } = this.props;
    this.voucherTemp.setAllField(voucher.voucherJSON);
    this.setState({ open: true });
  };

  public render() {
    const { viewMode, trigger, t } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={trigger}
        onOpen={this.open}
        open={open}
        closeIcon
        onClose={() => this.close()}
        size="large"
        className={viewMode ? "no-action" : undefined}
        as={Form}
        onSubmit={this.onApproved}
      >
        <Modal.Header>
          <Header textAlign="center">
            {t("modal.VoucherDetailModal.header", {
              documentNumber: this.voucherTemp.documentNumber,
            })}
          </Header>
        </Modal.Header>
        <Modal.Content scrolling style={styles.modalContent}>
          <Loading active={this.voucherTemp.loading} />
          <VoucherHeader voucher={this.voucherTemp} />
          {viewMode ? this.renderViewMode() : this.renderEditMode()}
          <AlertMessage
            messageobj={this.voucherTemp.alert}
            float
            timeout={2500}
          />
          <ErrorMessage
            errorobj={this.voucherTemp.error}
            float
            timeout={5000}
          />
        </Modal.Content>
        {viewMode ? null : <Modal.Actions>{this.renderFooter()}</Modal.Actions>}
      </Modal>
    );
  }

  private renderBank() {
    const { t, viewMode } = this.props;
    return (
      <BankAccount
        viewMode={viewMode}
        requiredFieldBankName
        title={t("modal.VoucherDetailModal.titleBank")}
        fieldBankName="toBankName"
        valueBankName={this.voucherTemp.toBankName}
        fieldBankAccountNo="toAccountNo"
        valueBankAccountNo={this.voucherTemp.toAccountNo}
        fieldBankAccountName="toAccountName"
        valueBankAccountName={this.voucherTemp.toAccountName}
        fieldBankAccountBranch="toAccountBranch"
        valueBankAccountBranch={this.voucherTemp.toAccountBranch}
        fieldBankAccountType="toAccountType"
        valueBankAccountType={this.voucherTemp.toAccountType}
        fieldBankAccountBranchCode="toBranchCode"
        valueBankAccountBranchCode={this.voucherTemp.toBranchCode}
        requiredFieldBankBranchCode
        setField={this.voucherTemp.setField}
      />
    );
  }

  private renderFooter = () => {
    const { t } = this.props;
    return (
      <Grid columns={"equal"}>
        <Grid.Column textAlign={"left"}>
          <PermissionControl codes={["VOUCHER.CANCEL"]}>
            <ConfirmModal
              title={t("modal.VoucherDetailModal.confirmVoucherCancellation")}
              trigger={
                <Form.Button type="button" style={styles.button}>
                  {t("modal.VoucherDetailModal.cancelVoucher")}
                </Form.Button>
              }
              onConfirm={this.onCancelVoucher}
            />
          </PermissionControl>
        </Grid.Column>
        <Grid.Column textAlign={"right"}>
          <Form.Button color="blue" type="submit" style={styles.button}>
            {t("save")}
          </Form.Button>
        </Grid.Column>
      </Grid>
    );
  };

  private renderViewMode() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <FormDisplay
          title={t("modal.VoucherDetailModal.partnerName")}
          value={this.voucherTemp.partnerName || ""}
          width={16}
        />
        <FormDisplay
          title={t("modal.VoucherDetailModal.partnerAddress")}
          value={this.voucherTemp.partnerAddress || ""}
          width={16}
        />
        {this.renderBank()}
        <FormDisplay
          title={t("modal.VoucherDetailModal.toSms")}
          value={this.voucherTemp.toSms || ""}
          width={16}
        />
        <FormDisplay
          title={t("modal.VoucherDetailModal.toEmail")}
          value={this.voucherTemp.toEmail || ""}
          width={16}
        />
        <FormDisplay
          title={t("modal.VoucherDetailModal.totalAmount")}
          value={t("module.loan.components.loanAmountBaht", {
            loanAmount: currency(this.voucherTemp.totalAmount, 2) || "-",
          })}
        />
      </React.Fragment>
    );
  }

  private renderEditMode() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <Form.Input
          label={t("modal.VoucherDetailModal.partnerName")}
          fluid
          placeholder={t("modal.VoucherDetailModal.specifyPartnerName")}
          value={this.voucherTemp.partnerName}
          onChange={(event: any, data: any) => {
            this.voucherTemp.setField({
              fieldname: "partnerName",
              value: data.value,
            });
          }}
        />
        <Form.TextArea
          label={t("modal.VoucherDetailModal.partnerAddress")}
          placeholder={t("modal.VoucherDetailModal.specifyPartnerAddress")}
          value={this.voucherTemp.partnerAddress}
          onChange={(event: any, data: any) => {
            this.voucherTemp.setField({
              fieldname: "partnerAddress",
              value: data.value,
            });
          }}
        />
        {this.renderBank()}
        <Form.Input
          label={t("modal.VoucherDetailModal.toSms")}
          fluid
          placeholder={t("modal.VoucherDetailModal.specifyToSms")}
          value={this.voucherTemp.toSms}
          onChange={(event: any, data: any) => {
            if (isNaN(data.value)) {
              return;
            }
            this.voucherTemp.setField({
              fieldname: "toSms",
              value: data.value,
            });
          }}
        />
        <Form.Input
          label={t("modal.VoucherDetailModal.toEmail")}
          fluid
          placeholder={t("modal.VoucherDetailModal.specifyToEmail")}
          value={this.voucherTemp.toEmail}
          onChange={(event: any, data: any) => {
            this.voucherTemp.setField({
              fieldname: "toEmail",
              value: data.value,
            });
          }}
        />
        <Form.Field
          readOnly={hasPermission("VOUCHER.EDIT.TOTALAMOUNT") ? false : true}
          label={t("modal.VoucherDetailModal.totalAmount")}
          width={16}
          id={`input-voucher-totalAmount-${
            this.voucherTemp.id ? this.voucherTemp.id : ""
          }`}
          control={CurrencyInput}
          labelText={t("module.loan.requestDetail.baht")}
          fieldName="totalAmount"
          value={this.voucherTemp.totalAmount}
          onChangeInputField={this.onChangeTotalAmount}
        />
      </React.Fragment>
    );
  }

  private onChangeTotalAmount = (fieldname: string, value: any) => {
    this.voucherTemp.setField({ fieldname, value });
  };

  private onCancelVoucher = async () => {
    const { voucher } = this.props;
    try {
      await this.voucherTemp.cancelVoucher();
      await voucher.setAllField(this.voucherTemp.voucherJSON);
      await this.close("delayBeforeClose");
    } catch (e) {
      throw e;
    } finally {
      //
    }
  };

  private onApproved = async () => {
    const { voucher } = this.props;
    try {
      await this.voucherTemp.updateVoucher();
      await voucher.setAllField(this.voucherTemp.voucherJSON);
      await this.close("delayBeforeClose");
    } catch (e) {
      throw e;
    } finally {
      //
    }
  };
}

const styles: any = {
  button: {
    paddingLeft: 50,
    paddingRight: 50,
  },
  approvedAmountSection: {
    padding: 14,
  },
  modalContent: {
    padding: 42,
  },
};
export default withTranslation()(VoucherDetailModal);
