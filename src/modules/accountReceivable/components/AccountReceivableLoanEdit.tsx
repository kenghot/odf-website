import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button, Form } from "semantic-ui-react";
import { Installment, LoanDetails } from "../../loan/components";
import { IAccountReceivableModel } from "../AccountReceivableModel";

interface IAccountReceivableLoanEdit extends WithTranslation {
  accountReceivable: IAccountReceivableModel;
  hideButtonSubmit?: boolean;
  noneForm?: boolean;
  hideLoanDetails?: boolean;
  onRerender?: boolean;
}

@observer
class AccountReceivableLoanEdit extends React.Component<
  IAccountReceivableLoanEdit
> {
  public render() {
    const { accountReceivable, hideButtonSubmit, noneForm } = this.props;
    return hideButtonSubmit ? (
      noneForm ? (
        <React.Fragment>{this.renderBody()}</React.Fragment>
      ) : (
        <Form>{this.renderBody()}</Form>
      )
    ) : (
      <Form onSubmit={accountReceivable.updateAccountReceivable}>
        {this.renderBody()}
        {this.renderSaveButton()}
      </Form>
    );
  }

  private renderBody() {
    const { t, accountReceivable, hideLoanDetails, onRerender } = this.props;
    return (
      <React.Fragment>
        {hideLoanDetails ? null : (
          <Form.Field
            label={t("module.loan.agreementDetail.loanDetails")}
            width={16}
            control={LoanDetails}
            loanAmount={accountReceivable.loanAmount}
            loanDurationYear={accountReceivable.loanDurationYear}
            loanDurationMonth={accountReceivable.loanDurationMonth}
            onChangeInputField={this.onChangeInputField}
            editMode={true}
          />
        )}

        <Form.Field
          label={t("module.loan.agreementDetail.loanRepayment")}
          width={16}
          id={accountReceivable.id}
          control={Installment}
          onRerender={onRerender}
          loanAmount={+accountReceivable.outstandingDebtBalance}
          installmentAmount={accountReceivable.installmentAmount}
          installmentPeriodValue={accountReceivable.installmentPeriodValue}
          installmentTimes={accountReceivable.installmentTimes}
          installmentPeriodDay={accountReceivable.installmentPeriodDay}
          installmentFirstDate={accountReceivable.installmentFirstDate}
          installmentLastDate={accountReceivable.installmentLastDate}
          installmentLastAmount={accountReceivable.installmentLastAmount}
          onChangeInputField={this.onChangeInputField}
          editMode={true}
        />
      </React.Fragment>
    );
  }

  private onChangeInputField = (fieldname: string, value: any) => {
    const { accountReceivable } = this.props;
    accountReceivable.setField({ fieldname, value });
  };
  private renderSaveButton() {
    const { accountReceivable, t } = this.props;
    return (
      <div style={styles.marginTop}>
        <Link
          to={`/account_receivable/view/${accountReceivable.id}/${accountReceivable.documentNumber}`}
        >
          <Button color="grey" floated="left" basic>
            {t(
              "module.accountReceivable.accountReceivableDetail.cancelEditing"
            )}
          </Button>
        </Link>

        <Button color="blue" floated="right" type="submit">
          {t("module.accountReceivable.accountReceivableDetail.save")}
        </Button>
        <br />
        <br />
      </div>
    );
  }
}
const styles: any = {
  marginTop: {
    marginTop: 35
  }
};

export default withTranslation()(AccountReceivableLoanEdit);
