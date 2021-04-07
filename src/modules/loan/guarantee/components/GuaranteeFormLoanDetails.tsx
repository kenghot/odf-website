import { observer } from "mobx-react";
import { clone } from "mobx-state-tree";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { CurrencyInput, DateInput } from "../../../../components/common/input";
import { Loading } from "../../../../components/common/loading";
import { AgreementListModel } from "../../agreement/AgreementListModel";
import {
  AgreementModel,
  IAgreementModel
} from "../../agreement/AgreementModel";
import { AgreementDDL } from "../../agreement/components";
import { IGuaranteeModel } from "../GuaranteeModel";

interface IGuaranteeFormLoanDetails extends WithTranslation {
  guarantee: IGuaranteeModel;
}

@observer
class GuaranteeFormLoanDetails extends React.Component<
  IGuaranteeFormLoanDetails
> {
  private agreementList = AgreementListModel.create({});
  private agreement = AgreementModel.create({});

  public render() {
    const { t, guarantee } = this.props;
    return (
      <Segment padded>
        <Loading active={this.agreement.loading} />
        <Form.Group widths="equal">
          <Form.Field
            label={t("module.loan.guaranteeDetail.referenceLoanAgreement")}
            placeholder={t(
              "module.loan.guaranteeDetail.pleaseSelectLoanContract"
            )}
            control={AgreementDDL}
            value={guarantee.existingAgreementId}
            agreementList={this.agreementList}
            onChange={this.onChangeAgreementDDL}
          />
          <Form.Button
            width={5}
            fluid
            floated="right"
            color="teal"
            style={styles.formButton}
            type="button"
            onClick={this.onRetrieveAgreementInfo}
          >
            {t("module.loan.guaranteeDetail.retrieveContractInformation")}
          </Form.Button>
        </Form.Group>

        <Form.Input
          fluid
          label={t(
            "module.loan.guaranteeDetail.loanAgreementNumberAppearsGuaranteeContract"
          )}
          placeholder={t(
            "module.loan.guaranteeDetail.pleaseSpecifyPlacePaymentAccordingContract"
          )}
          onChange={(event: any, data: any) =>
            guarantee.setField({
              fieldname: "agreementDocumentNumber",
              value: data.value
            })
          }
          value={guarantee.agreementDocumentNumber}
        />
        <Form.Field
          label={t(
            "module.loan.guaranteeDetail.dateSigningLoanAgreementAppearsGuaranteeContract"
          )}
          control={DateInput}
          value={guarantee.agreementDocumentDate || undefined}
          fieldName="agreementDocumentDate"
          id={"agreementDocumentDate"}
          onChangeInputField={this.onChangeInputField}
        />

        <Form.Field
          label={t("module.loan.guaranteeBorrowDetails.balance")}
          fluid
          control={CurrencyInput}
          id={"input-guarantee-loanAmount"}
          labelText={t("module.loan.guaranteeBorrowDetails.baht")}
          value={guarantee.loanAmount}
          fieldName="loanAmount"
          onChangeInputField={this.onChangeInputField}
        />
      </Segment>
    );
  }

  private onChangeInputField = (fieldname: string, value: any) => {
    const { guarantee } = this.props;
    guarantee.setField({ fieldname, value });
  };
  private onChangeAgreementDDL = (value: string) => {
    const { guarantee } = this.props;
    guarantee.setField({ fieldname: "existingAgreementId", value });
  };
  private onRetrieveAgreementInfo = async () => {
    const { guarantee } = this.props;
    const value = guarantee ? guarantee.agreementId : "";
    if (value) {
      const selected = this.agreementList.list.find(
        (_item: IAgreementModel) => _item.id === value
      );
      if (selected) {
        await guarantee.setField({
          fieldname: "existingAgreementDocumentNumber",
          value: guarantee.agreementDocumentNumber
        });
        await this.agreement.setField({ fieldname: "id", value });
        await this.agreement.getAgreementDetail();
        await guarantee.setField({
          fieldname: "agreementDocumentDate",
          value: selected.documentDate
        });
        await guarantee.setField({
          fieldname: "agreementDocumentNumber",
          value: selected.documentNumber
        });
        await guarantee.setField({
          fieldname: "loanAmount",
          value: selected.loanAmount
        });
        await guarantee.setField({
          fieldname: "agreementId",
          value: guarantee.existingAgreementId
        });
        await guarantee.setField({
          fieldname: "isSelectedAgreement",
          value: clone(this.agreement)
        });
      }
    }
  };
}
const styles: any = {
  formButton: {
    marginTop: 23
  },
  buttonRow: {
    paddingTop: 25,
    display: "flow-root"
  }
};
export default withTranslation()(GuaranteeFormLoanDetails);
