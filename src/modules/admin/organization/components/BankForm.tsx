import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Header, Segment } from "semantic-ui-react";
import { BankAccount } from "../../../../components/project";
import { IOrgModel } from "../OrgModel";

interface IBankForm extends WithTranslation {
  org: IOrgModel;
}
@observer
class BankForm extends React.Component<IBankForm> {
  public render() {
    const { t, org } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t("module.admin.bankForm.content")}
          subheader={t("module.admin.bankForm.subheader")}
          style={styles.header}
        />
        <Form onSubmit={this.updateForm}>
          <BankAccount
            notSegment
            requiredFieldBankName
            fieldBankName="bankName"
            valueBankName={org.bankName}
            fieldBankAccountNo="bankAccountNo"
            valueBankAccountNo={org.bankAccountNo}
            fieldBankAccountName="bankAccountName"
            valueBankAccountName={org.bankAccountName}
            fieldBankAccountBranchCode="bankBranchCode"
            valueBankAccountBranchCode={org.bankBranchCode}
            setField={org.setField}
          />
          <Form.Group widths="equal">
            <Form.Field />
            <Form.Button
              width={5}
              id="form-button-submit-authorized-person-form"
              fluid
              floated="right"
              color="blue"
            >
              {t("module.admin.authorizedPersonForm.save")}
            </Form.Button>
          </Form.Group>
        </Form>
      </Segment>
    );
  }

  private updateForm = async () => {
    const { org } = this.props;
    try {
      await org.updateBankOrg();
    } catch (e) {
      throw e;
    }
  };
}

const styles: any = {
  header: {
    marginBottom: 28
  },
  row: {
    paddingTop: 0,
    paddingBottom: 0
  },
  column: {
    paddingTop: 14,
    paddingBottom: 14
  }
};

export default withTranslation()(BankForm);
