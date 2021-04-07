import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { FormDisplay } from "../../../../components/common";
import { CurrencyInput } from "../../../../components/common/input";
import { date_display_CE_TO_BE } from "../../../../utils";
import { IGuaranteeModel } from "../GuaranteeModel";

interface IGuaranteeLoanDetails extends WithTranslation {
  guarantee: IGuaranteeModel;
}

@observer
class GuaranteeLoanDetails extends React.Component<IGuaranteeLoanDetails> {
  public render() {
    const { t, guarantee } = this.props;
    return (
      <Segment padded>
        <FormDisplay
          title={t(
            "module.loan.guaranteeDetail.loanAgreementNumberAppearsGuaranteeContract"
          )}
          value={guarantee.agreementDocumentNumber || "-"}
        />
        <FormDisplay
          title={t(
            "module.loan.guaranteeDetail.dateSigningLoanAgreementAppearsGuaranteeContract"
          )}
          value={date_display_CE_TO_BE(guarantee.agreementDocumentDate) || "-"}
        />
        <Form.Field
          label={t("module.loan.guaranteeBorrowDetails.balance")}
          fluid
          control={CurrencyInput}
          id={"input-guaranteeLoanDetails-loanAmount"}
          labelText={t("module.loan.guaranteeBorrowDetails.baht")}
          readOnly
          value={guarantee.loanAmount}
        />
      </Segment>
    );
  }
}
export default withTranslation()(GuaranteeLoanDetails);
