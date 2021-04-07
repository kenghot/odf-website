import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Checkbox, Form, Radio, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import {
  AttachedFile,
  FormDisplay,
  InputLabel
} from "../../../components/common";
import { FormFieldCheckbox } from "../../../components/common/formfield";
import { date_display_CE_TO_BE } from "../../../utils";
import { IDebtCollectionAcknowledgementModel } from "../AccountReceivableModel";

interface IAccountReceivableAcknowledgementView extends WithTranslation {
  appStore?: IAppModel;
  debtAcknowledgement: IDebtCollectionAcknowledgementModel;
}
@inject("appStore")
@observer
class AccountReceivableAcknowledgementView extends React.Component<
  IAccountReceivableAcknowledgementView
> {
  public render() {
    const { t, debtAcknowledgement } = this.props;
    return (
      <Form>
        <Form.Group widths="equal">
          <FormDisplay
            title={t("modal.M241DebtCollectionModal.date")}
            value={
              date_display_CE_TO_BE(debtAcknowledgement.acknowledgeDate) || "-"
            }
          />
          <FormDisplay
            title={t("modal.M241DebtCollectionModal.place")}
            value={debtAcknowledgement.location || "-"}
          />
        </Form.Group>
        {this.renderIsBehalf()}
        {this.renderRecipientInformation()}
        <br />
        <Form.Group widths="equal">
          <Form.Field
            control={Checkbox}
            readOnly
            label={t(
              "modal.M241DebtCollectionModal.confirmReceiptDebtConditions"
            )}
            checked={debtAcknowledgement.isAcknowledge}
          />
        </Form.Group>
        <Form.Field
          label={t(
            "modal.M241DebtCollectionModal.documentsConfirmingReceiptDebtConditionSignatures"
          )}
          mode="view"
          control={AttachedFile}
          multiple={true}
          addFiles={debtAcknowledgement.addFiles}
          fieldName="debtAcknowledgement.attachedFiles"
          files={debtAcknowledgement.fileList}
        />
      </Form>
    );
  }

  private renderIsBehalf() {
    const { t, debtAcknowledgement } = this.props;
    return (
      <Form.Field>
        <label>{t("modal.M241DebtCollectionModal.receiveDebtBase")}</label>
        <Segment padded style={styles.radioButton}>
          <Form.Group>
            <Form.Field
              readOnly
              control={Radio}
              label={t("modal.M241DebtCollectionModal.borrower")}
              checked={debtAcknowledgement.isBehalf === false}
            />
            <Form.Field
              readOnly
              control={Radio}
              label={t(
                "modal.M241DebtCollectionModal.trusteeStatutoryBorrower"
              )}
              checked={debtAcknowledgement.isBehalf === true}
            />
          </Form.Group>
          {debtAcknowledgement.isBehalf ? (
            <FormDisplay
              title={t("modal.M241DebtCollectionModal.asTrusteeHeirOf")}
              value={debtAcknowledgement.onBehalfOf || "-"}
            />
          ) : null}
        </Segment>
      </Form.Field>
    );
  }

  private renderRecipientInformation() {
    const { t, debtAcknowledgement } = this.props;
    return (
      <Form.Field>
        <label>{t("modal.M241DebtCollectionModal.recipientInformation")}</label>
        <Segment padded>
          <FormDisplay
            title={t("modal.M241DebtCollectionModal.iDCardNumber")}
            value={debtAcknowledgement.idCardNo || "-"}
          />
          <Form.Group widths="equal">
            <FormDisplay
              title={t("component.idCardReader.title")}
              value={debtAcknowledgement.title || "-"}
              width={5}
            />
            <FormDisplay
              title={t("component.idCardReader.firstNames")}
              value={debtAcknowledgement.firstname || "-"}
            />
            <FormDisplay
              title={t("component.idCardReader.lastNames")}
              value={debtAcknowledgement.lastname || "-"}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <div
              className="twelve wide field"
              style={{
                display: !debtAcknowledgement.isOnlyBirthYear ? "none" : "block"
              }}
            >
              <FormDisplay
                title={t("component.idCardReader.yearBirth")}
                value={
                  date_display_CE_TO_BE(debtAcknowledgement.birthDate) || "-"
                }
                width={12}
              />
            </div>
            <div
              className="twelve wide field"
              style={{
                paddingLeft: 0,
                display: debtAcknowledgement.isOnlyBirthYear ? "none" : "block"
              }}
            >
              <FormDisplay
                title={t("component.idCardReader.dateBirth")}
                value={
                  debtAcknowledgement.birthDate
                    ? date_display_CE_TO_BE(debtAcknowledgement.birthDate)
                    : "-"
                }
                width={12}
              />
            </div>
            <FormFieldCheckbox
              disabled
              label={t("component.idCardReader.unknownDate")}
              label_checkbox={t("component.idCardReader.chooseOnlyYearBirth")}
              checked={debtAcknowledgement.isOnlyBirthYear}
            />
          </Form.Group>
          <Form.Field
            label={t("component.idCardReader.age")}
            control={InputLabel}
            labelText={t("component.idCardReader.year")}
            placeholder="-"
            readOnly
            value={
              debtAcknowledgement.birthDate
                ? debtAcknowledgement.ageDisplay
                : "-"
            }
          />
          <FormDisplay
            title={t("modal.M241DebtCollectionModal.mobilePhoneNumber")}
            value={debtAcknowledgement.telephone || "-"}
          />
        </Segment>
      </Form.Field>
    );
  }
}
const styles: any = {
  button: {
    marginLeft: 0,
    marginRight: 0
  },
  radioButton: {
    paddingBottom: 7
  }
};
export default withTranslation()(AccountReceivableAcknowledgementView);
