import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form } from "semantic-ui-react";
import { InstallmentView, LoanDetailsView } from "../../loan/components";
import { IAccountReceivableModel } from "../AccountReceivableModel";

interface IAccountReceivableLoanView extends WithTranslation {
  accountReceivable: IAccountReceivableModel;
}

@observer
class AccountReceivableLoanView extends React.Component<
  IAccountReceivableLoanView
> {
  public render() {
    const { t, accountReceivable } = this.props;
    return (
      <Form>
        <Form.Field
          label={t("module.loan.agreementDetail.loanDetails")}
          width={16}
          control={LoanDetailsView}
          loanAmount={accountReceivable.loanAmount}
          loanDurationYear={accountReceivable.loanDurationYear}
          loanDurationMonth={accountReceivable.loanDurationMonth}
        />
        <Form.Field
          label={t("module.loan.agreementDetail.loanRepayment")}
          width={16}
          control={InstallmentView}
          installmentAmount={accountReceivable.installmentAmount}
          installmentPeriodValue={accountReceivable.installmentPeriodValue}
          installmentTimes={accountReceivable.installmentTimes}
          installmentPeriodDay={accountReceivable.installmentPeriodDay}
          installmentFirstDate={accountReceivable.installmentFirstDate}
          installmentLastDate={accountReceivable.installmentLastDate}
          installmentLastAmount={accountReceivable.installmentLastAmount}
        />
      </Form>
    );
  }
}

export default withTranslation()(AccountReceivableLoanView);
