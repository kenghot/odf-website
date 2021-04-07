import { inject, observer } from "mobx-react";
import { clone } from "mobx-state-tree";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button, Checkbox, Form, Radio, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { AttachedFile, FormDisplay } from "../../../components/common";
import { IDCardModel } from "../../../components/idcard";
import IDCardReaderProfile from "../../../components/idcard/IDCardReaderProfile";
import { date_display_CE_TO_BE } from "../../../utils";
import { ProfileModel } from "../../share/profile/ProfileModel";
import {
  IAccountReceivableModel,
  IDebtCollectionAcknowledgementModel
} from "../AccountReceivableModel";

interface IAccountReceivableAcknowledgementEdit extends WithTranslation {
  appStore?: IAppModel;
  debtAcknowledgement: IDebtCollectionAcknowledgementModel;
  accountReceivable: IAccountReceivableModel;
}
@inject("appStore")
@observer
class AccountReceivableAcknowledgementEdit extends React.Component<
  IAccountReceivableAcknowledgementEdit
> {
  public idCard = IDCardModel.create({});
  public profile = ProfileModel.create({});

  public async componentDidMount() {
    // const { accountReceivable, debtAcknowledgement } = this.props;
    // if (accountReceivable.agreement && !debtAcknowledgement.isBehalf) {
    //   if (
    //     accountReceivable.agreement.agreementItems &&
    //     accountReceivable.agreement.agreementItems.length > 0
    //   ) {
    //     debtAcknowledgement.setIsBehalfBorrower(
    //       accountReceivable.agreement.agreementItems[0].borrower
    //     );
    //   } else {
    //     debtAcknowledgement.resetIsBehalfBorrower();
    //   }
    // }
    this.onSetProfile();
  }

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
          <Form.Input
            fluid
            label={t("modal.M241DebtCollectionModal.place")}
            placeholder={t(
              "modal.M241DebtCollectionModal.pleaseFillOutPlaceWhereDebtReceived"
            )}
            value={debtAcknowledgement.location}
            onChange={(event: any, data: any) =>
              this.onChangeInputField("location", data.value)
            }
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
          <Form.Button
            color="teal"
            type="button"
            icon="print"
            floated="right"
            content={t(
              "modal.M241DebtCollectionModal.printLetterAcceptDebtCondition"
            )}
            onClick={this.onPrint}
          />
        </Form.Group>
        <Form.Field
          label={t(
            "modal.M241DebtCollectionModal.documentsConfirmingReceiptDebtConditionSignatures"
          )}
          mode="edit"
          control={AttachedFile}
          multiple={true}
          addFiles={debtAcknowledgement.addFiles}
          removeFile={(index?: number) => this.onRemoveFile(index!)}
          fieldName="debtAcknowledgement.attachedFiles"
          files={debtAcknowledgement.fileList}
        />
        {this.renderSaveButton()}
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
              control={Radio}
              label={t("modal.M241DebtCollectionModal.borrower")}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                this.onChangeInputFieldIsBehalf("isBehalf", false)
              }
              checked={debtAcknowledgement.isBehalf === false}
            />
            <Form.Field
              control={Radio}
              label={t(
                "modal.M241DebtCollectionModal.trusteeStatutoryBorrower"
              )}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                this.onChangeInputFieldIsBehalf("isBehalf", true)
              }
              checked={debtAcknowledgement.isBehalf === true}
            />
          </Form.Group>
          {debtAcknowledgement.isBehalf ? (
            <Form.Input
              fluid
              label={t("modal.M241DebtCollectionModal.asTrusteeHeirOf")}
              placeholder={t(
                "modal.M241DebtCollectionModal.specifyAsTrusteeHeirOf"
              )}
              value={debtAcknowledgement.onBehalfOf}
              onChange={(event: any, data: any) =>
                this.onChangeInputField("onBehalfOf", data.value)
              }
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
          <IDCardReaderProfile
            displayMode="mini"
            idCardReadingStore={this.idCard}
            profile={this.profile}
            address={this.profile.idCardAddress}
            noSegment
            fieldname="M241DebtCollectionModal"
          />
          <Form.Input
            fluid
            label={t("modal.M241DebtCollectionModal.mobilePhoneNumber")}
            placeholder={t("modal.M241DebtCollectionModal.mobilePhoneNumber")}
            value={debtAcknowledgement.telephone}
            onChange={(event: any, data: any) =>
              this.onChangeInputField("telephone", data.value)
            }
          />
        </Segment>
      </Form.Field>
    );
  }

  private onChangeInputFieldIsBehalf = (fieldname: string, value: any) => {
    const { accountReceivable, debtAcknowledgement } = this.props;
    debtAcknowledgement.setField({ fieldname, value });
    if (!value) {
      if (accountReceivable.agreement && !debtAcknowledgement.isBehalf) {
        if (
          accountReceivable.agreement.agreementItems &&
          accountReceivable.agreement.agreementItems.length > 0
        ) {
          debtAcknowledgement.setIsBehalfBorrower(
            accountReceivable.agreement.agreementItems[0].borrower
          );
          this.onSetProfile();
          if (!debtAcknowledgement.telephone) {
            debtAcknowledgement.setField({
              fieldname: "telephone",
              value:
                accountReceivable.agreement.agreementItems[0].borrowerTelephone
            });
          }
          debtAcknowledgement.setField({
            fieldname: "onBehalfOf",
            value: ""
          });
        } else {
          debtAcknowledgement.resetIsBehalfBorrower();
          this.onResetProfile();
        }
      } else {
        debtAcknowledgement.resetIsBehalfBorrower();
        this.onResetProfile();
      }
    } else {
      debtAcknowledgement.setField({
        fieldname: "onBehalfOf",
        value: accountReceivable.fullname
      });
      debtAcknowledgement.resetIsBehalfBorrower();
      this.onResetProfile();
    }
  };

  private onSetProfile = async () => {
    const { debtAcknowledgement } = this.props;
    this.profile.setField({
      fieldname: "idCardNo",
      value: debtAcknowledgement.idCardNo
    });
    this.profile.setField({
      fieldname: "title",
      value: debtAcknowledgement.title
    });
    this.profile.setField({
      fieldname: "firstname",
      value: debtAcknowledgement.firstname
    });
    this.profile.setField({
      fieldname: "lastname",
      value: debtAcknowledgement.lastname
    });
    this.profile.setField({
      fieldname: "birthDate",
      value: debtAcknowledgement.birthDate
    });
    this.profile.setField({
      fieldname: "isOnlyBirthYear",
      value: debtAcknowledgement.isOnlyBirthYear
    });
  };

  private onResetProfile = async () => {
    this.profile.setField({
      fieldname: "idCardNo",
      value: ""
    });
    this.profile.setField({
      fieldname: "title",
      value: ""
    });
    this.profile.setField({
      fieldname: "firstname",
      value: ""
    });
    this.profile.setField({
      fieldname: "lastname",
      value: ""
    });
    this.profile.setField({
      fieldname: "birthDate",
      value: ""
    });
    this.profile.setField({
      fieldname: "isOnlyBirthYear",
      value: false
    });
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { debtAcknowledgement } = this.props;
    debtAcknowledgement.setField({ fieldname, value });
  };
  private onRemoveFile = async (index: number) => {
    const { debtAcknowledgement } = this.props;
    try {
      await debtAcknowledgement.removeFile(index);
    } catch (e) {
      console.log(e);
    }
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

        <Button
          color="blue"
          floated="right"
          type="button"
          onClick={this.onSubmit}
        >
          {t("module.accountReceivable.accountReceivableDetail.save")}
        </Button>
        <br />
        <br />
      </div>
    );
  }

  private onSetDebtAcknowledgement = async () => {
    const { debtAcknowledgement } = this.props;
    debtAcknowledgement.setField({
      fieldname: "idCardNo",
      value: this.profile.idCardNo
    });
    debtAcknowledgement.setField({
      fieldname: "title",
      value: this.profile.title
    });
    debtAcknowledgement.setField({
      fieldname: "firstname",
      value: this.profile.firstname
    });
    debtAcknowledgement.setField({
      fieldname: "lastname",
      value: this.profile.lastname
    });
    debtAcknowledgement.setField({
      fieldname: "birthDate",
      value: this.profile.birthDate
    });
    debtAcknowledgement.setField({
      fieldname: "isOnlyBirthYear",
      value: this.profile.isOnlyBirthYear
    });
  };

  private onSubmit = async () => {
    const { accountReceivable, debtAcknowledgement } = this.props;
    try {
      await this.onSetDebtAcknowledgement();
      await accountReceivable.updateDebtAcknowledgement(
        clone(debtAcknowledgement),
        false
      );
    } catch (e) {
      console.log(e);
    }
  };

  private onPrint = async () => {
    const { accountReceivable, debtAcknowledgement } = this.props;
    try {
      await this.onSetDebtAcknowledgement();
      await accountReceivable.printAcknowledge(clone(debtAcknowledgement));
    } catch (e) {
      console.log(e);
    }
  };
}
const styles: any = {
  button: {
    marginLeft: 0,
    marginRight: 0
  },
  radioButton: {
    paddingBottom: 7
  },
  marginTop: {
    marginTop: 35
  }
};
export default withTranslation()(AccountReceivableAcknowledgementEdit);
