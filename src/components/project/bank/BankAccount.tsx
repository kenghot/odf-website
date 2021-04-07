import { inject, observer } from "mobx-react";
import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { IInput } from "../../../utils/common-interface";
import { FormDisplay } from "../../common";

export interface IBankAccount extends WithTranslation {
  appStore?: IAppModel;
  viewMode?: boolean;
  title?: string;
  fieldBankName?: string;
  valueBankName: string;
  fieldBankAccountNo?: string;
  valueBankAccountNo: string;
  fieldBankAccountName?: string;
  valueBankAccountName: string;
  fieldBankAccountBranch?: string;
  valueBankAccountBranch?: string;
  fieldBankAccountBranchCode?: string;
  valueBankAccountBranchCode?: string;
  fieldBankAccountType?: string;
  valueBankAccountType?: string;
  setField?: ({ fieldname, value }: IInput) => void;
  requiredFieldBankName?: boolean;
  requiredFieldBankAccountName?: boolean;
  requiredFieldBankBranchCode?: boolean;
  notSegment?: boolean;
}

@inject("appStore")
@observer
class BankAccount extends React.Component<IBankAccount> {
  public render() {
    const { notSegment, viewMode, title } = this.props;
    return notSegment ? (
      <React.Fragment>{viewMode ? this.renderViewMode() : this.renderEditMode()}</React.Fragment>
    ) : (
      <Form.Field>
        {title ? <label>{title}</label> : null}
        <Segment padded>{viewMode ? this.renderViewMode() : this.renderEditMode()}</Segment>
      </Form.Field>
    );
  }

  private renderViewMode() {
    const {
      t,
      appStore,
      valueBankName,
      valueBankAccountNo,
      valueBankAccountName,
      valueBankAccountBranch,
      valueBankAccountBranchCode,
      valueBankAccountType,
    } = this.props;
    return (
      <React.Fragment>
        <FormDisplay
          title={t("module.loan.requestDetail.bankName")}
          value={appStore!.enumItemLabel("bank", valueBankName) || "-"}
          width={16}
        />
        {valueBankAccountBranch ? (
          <FormDisplay
            title={t("module.loan.requestDetail.bankBranch")}
            value={valueBankAccountBranch || ""}
            width={16}
          />
        ) : null}
        {valueBankAccountBranchCode ? (
          <FormDisplay
            title={t("module.loan.requestDetail.bankBranchCode")}
            value={valueBankAccountBranchCode || ""}
            width={16}
          />
        ) : null}
        {valueBankAccountType ? (
          <FormDisplay title={t("module.loan.requestDetail.bankType")} value={valueBankAccountType || ""} width={16} />
        ) : null}
        <FormDisplay title={t("module.loan.requestDetail.bankAccount")} value={valueBankAccountNo || ""} width={16} />
        <FormDisplay
          title={t("module.loan.requestDetail.bankAccountName")}
          value={valueBankAccountName || ""}
          width={16}
        />
      </React.Fragment>
    );
  }

  private renderEditMode() {
    const {
      appStore,
      t,
      fieldBankName,
      valueBankName,
      fieldBankAccountNo,
      valueBankAccountNo,
      fieldBankAccountName,
      valueBankAccountName,
      fieldBankAccountBranch,
      valueBankAccountBranch,
      fieldBankAccountBranchCode,
      valueBankAccountBranchCode,
      fieldBankAccountType,
      valueBankAccountType,
      requiredFieldBankName,
      requiredFieldBankAccountName,
      requiredFieldBankBranchCode,
    } = this.props;
    return (
      <React.Fragment>
        {fieldBankName ? (
          <Form.Select
            required={requiredFieldBankName}
            fluid
            label={t("module.loan.requestDetail.bankName")}
            placeholder={t("module.loan.requestDetail.specifyBankName")}
            options={appStore!.enumItems("bank")}
            onChange={(event: any, data: any) => {
              this.onSetField({
                fieldname: fieldBankName,
                value: data.value,
              });
            }}
            value={valueBankName}
          />
        ) : null}
        {fieldBankAccountBranch ? (
          <Form.Input
            label={t("module.loan.requestDetail.bankBranch")}
            fluid
            placeholder={t("module.loan.requestDetail.specifyBankBranch")}
            value={valueBankAccountBranch}
            onChange={(event: any, data: any) => {
              this.onSetField({
                fieldname: fieldBankAccountBranch,
                value: data.value,
              });
              event.target.setCustomValidity("");
            }}
          />
        ) : null}
        {fieldBankAccountBranchCode ? (
          <Form.Input
            required={requiredFieldBankBranchCode}
            label={t("module.loan.requestDetail.bankBranchCode")}
            fluid
            maxLength="4"
            placeholder={t("module.loan.requestDetail.specifyBankBranchCode")}
            value={valueBankAccountBranchCode}
            onChange={(event: any, data: any) => {
              this.onSetField({
                fieldname: fieldBankAccountBranchCode,
                value: data.value,
              });
              event.target.setCustomValidity("");
            }}
          />
        ) : null}
        {fieldBankAccountType ? (
          <Form.Input
            label={t("module.loan.requestDetail.bankType")}
            fluid
            placeholder={t("module.loan.requestDetail.specifyBankType")}
            value={valueBankAccountType}
            onChange={(event: any, data: any) => {
              this.onSetField({
                fieldname: fieldBankAccountType,
                value: data.value,
              });
              event.target.setCustomValidity("");
            }}
          />
        ) : null}
        {fieldBankAccountNo ? (
          <Form.Input
            required
            label={t("module.loan.requestDetail.bankAccount")}
            fluid
            placeholder={t("module.loan.requestDetail.enterBankAccountNumber")}
            value={valueBankAccountNo}
            onChange={(event: any, data: any) => {
              this.onSetField({
                fieldname: fieldBankAccountNo,
                value: data.value,
              });
              event.target.setCustomValidity("");
            }}
            onInvalid={(e: any, data: any) =>
              e.target.setCustomValidity(t("module.loan.requestDetail.enterBankAccountNumber"))
            }
          />
        ) : null}
        {fieldBankAccountName ? (
          <Form.Input
            required={requiredFieldBankAccountName}
            label={t("module.loan.requestDetail.bankAccountName")}
            fluid
            placeholder={t("module.loan.requestDetail.specifyBankAccountName")}
            value={valueBankAccountName}
            onChange={(event: any, data: any) => {
              this.onSetField({
                fieldname: fieldBankAccountName,
                value: data.value,
              });
              event.target.setCustomValidity("");
            }}
            onInvalid={(e: any, data: any) =>
              e.target.setCustomValidity(t("module.loan.requestDetail.specifyBankAccountName"))
            }
          />
        ) : null}
      </React.Fragment>
    );
  }
  private onSetField = ({ fieldname, value }: IInput) => {
    const { setField } = this.props;
    if (typeof setField !== "undefined") {
      setField({ fieldname, value });
    }
  };
}
export default withTranslation()(BankAccount);
