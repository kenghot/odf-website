import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { FormDisplay } from "../../../components/common";
import { currency } from "../../../utils/format-helper";

interface ILoanDetailsView extends WithTranslation {
  loanAmount?: string;
  loanDurationYear?: string;
  loanDurationMonth?: string;
}

@observer
class LoanDetailsView extends React.Component<ILoanDetailsView> {
  public render() {
    const { t, loanAmount, loanDurationYear, loanDurationMonth } = this.props;
    return (
      <Segment padded>
        <Form.Group widths="equal">
          <FormDisplay
            title={t("module.loan.agreenmentBorrowDetails.balance")}
            value={t("module.loan.components.loanAmountBaht", {
              loanAmount: currency(loanAmount, 2) || "-"
            })}
          />
          <FormDisplay
            title={t("module.loan.agreenmentBorrowDetails.paymentScheduleTime")}
            value={t(
              "module.loan.components.loanDurationYearloanDurationMonth",
              {
                year: loanDurationYear || "-",
                month: loanDurationMonth || "-"
              }
            )}
          />
        </Form.Group>
      </Segment>
    );
  }
}

export default withTranslation()(LoanDetailsView);
