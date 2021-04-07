import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { InputLabel } from "../../../components/common";
import { CurrencyInput } from "../../../components/common/input";

interface ILoanDetails extends WithTranslation {
  loanAmount?: string;
  loanDurationYear?: string;
  loanDurationMonth?: string;
  onChangeInputField: (fieldname: string, value: any) => void;
  editMode?: boolean;
}

@observer
class LoanDetails extends React.Component<ILoanDetails> {
  public render() {
    const {
      t,
      loanAmount,
      loanDurationYear,
      loanDurationMonth,
      editMode,
      onChangeInputField
    } = this.props;
    return (
      <Segment padded>
        <Form.Field
          label={t("module.loan.agreenmentBorrowDetails.balance")}
          width={16}
          control={CurrencyInput}
          id={"input-loanDetails-loanAmount"}
          labelText={t("module.loan.agreenmentBorrowDetails.baht")}
          value={loanAmount}
          readOnly={!editMode}
          onChangeInputField={onChangeInputField}
          fieldName={"loanAmount"}
        />
        <Form.Group widths="equal">
          <Form.Field
            label={t("module.loan.agreenmentBorrowDetails.paymentScheduleTime")}
            control={InputLabel}
            labelText={t("module.loan.agreenmentBorrowDetails.year")}
            placeholder="0"
            type="number"
            value={loanDurationYear}
            readOnly={!editMode}
            onChangeInputField={onChangeInputField}
            fieldName={"loanDurationYear"}
          />
          <Form.Field
            style={styles.formField}
            control={InputLabel}
            labelText={t("module.loan.agreenmentBorrowDetails.month")}
            placeholder="0"
            type="number"
            value={loanDurationMonth}
            readOnly={!editMode}
            onChangeInputField={onChangeInputField}
            fieldName={"loanDurationMonth"}
          />
        </Form.Group>
      </Segment>
    );
  }
}

const styles: any = {
  formField: {
    marginTop: 23
  }
};
export default withTranslation()(LoanDetails);
