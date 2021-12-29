import { inject, observer } from "mobx-react";
import { clone } from "mobx-state-tree";
import moment from "moment";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  Button,
  Checkbox,
  Form,
  Grid,
  Header,
  List,
  Modal,
  Radio,
  Segment
} from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import {
  AttachedFile,
  DateInput,
  ErrorMessage,
  FormDisplay
} from "../components/common";
import { Loading } from "../components/common/loading";
import { IDCardModel } from "../components/idcard";
import IDCardReaderProfile from "../components/idcard/IDCardReaderProfile";
import {
  AccountReceivableModel,
  DebtCollectionAcknowledgementModel
} from "../modules/accountReceivable/AccountReceivableModel";
import { AccountReceivableLoanEdit } from "../modules/accountReceivable/components";
import { IDebtCollectionModel } from "../modules/debtCollection/DebtCollectionModel";
import { ProfileModel } from "../modules/share/profile/ProfileModel";
import { currency, date_display_CE_TO_BE } from "../utils/format-helper";

interface IM241DebtAcknowledgementModal
  extends WithTranslation,
    RouteComponentProps {
  trigger?: any;
  debtCollection: IDebtCollectionModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class M241DebtAcknowledgementModal extends React.Component<
  IM241DebtAcknowledgementModal
> {
  public state = { open: false, onRerender: false };
  public idCard = IDCardModel.create({});
  public profile = ProfileModel.create({});
  public debtAcknowledgementItem = DebtCollectionAcknowledgementModel.create(
    {}
  );
  public accountReceivableItem = AccountReceivableModel.create({});
  public close = () => {
    this.setState({ open: false });
    this.profile.resetAll();
    this.debtAcknowledgementItem.resetAll();
    this.accountReceivableItem.resetAll();
  };
  public open = async () => {
    const { debtCollection } = this.props;
    await this.setState({ open: true });
    await this.debtAcknowledgementItem.setAllField(
      debtCollection.accountReceivable.debtAcknowledgement
        .debtCollectionAcknowledgementJSON
    );
    await this.debtAcknowledgementItem.setField({
      fieldname: "id",
      value: debtCollection.accountReceivable.id
    });
    await this.accountReceivableItem.setAllField(
      debtCollection.accountReceivable.accountReceivableModelJSON
    );
    await this.accountReceivableItem.setField({
      fieldname: "installmentFirstDate",
      value: ""
    });
    await this.debtAcknowledgementItem.setField({
      fieldname: "location",
      value: this.props.debtCollection.accountReceivable.organization.orgName
    });
    if (
      debtCollection.accountReceivable.agreement &&
      !this.debtAcknowledgementItem.isBehalf
    ) {
      if (
        debtCollection.accountReceivable.agreement.agreementItems &&
        debtCollection.accountReceivable.agreement.agreementItems.length > 0
      ) {
        this.debtAcknowledgementItem.setIsBehalfBorrower(
          debtCollection.accountReceivable.agreement.agreementItems[0].borrower
        );
      } else {
        this.debtAcknowledgementItem.resetIsBehalfBorrower();
      }
    }
    if (!this.debtAcknowledgementItem.telephone) {
      this.debtAcknowledgementItem.setField({
        fieldname: "telephone",
        value:
          debtCollection.accountReceivable.agreement.agreementItems[0]
            .borrowerTelephone
      });
    }
    if (debtCollection.deathNotification.isConfirm) {
      this.debtAcknowledgementItem.setField({
        fieldname: "isBehalf",
        value: true
      });
      this.debtAcknowledgementItem.setField({
        fieldname: "onBehalfOf",
        value: debtCollection.accountReceivable.fullname
      });
    } else {
      this.onSetProfile();
    }
    this.debtAcknowledgementItem.setField({
      fieldname: "acknowledgeDate",
      value: moment().format("YYYY-MM-DD")
    });
    await this.setState({ onRerender: !this.state.onRerender });
  };
  public render() {
    const { t, trigger } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={trigger}
        onOpen={this.open}
        open={open}
        closeIcon
        onClose={this.close}
        size="fullscreen"
      >
        <Modal.Header>
          <Header textAlign="center">
            {t("modal.M241DebtCollectionModal.receiveDebt")}
          </Header>
        </Modal.Header>
        <Modal.Content scrolling>
          <Loading
            active={this.props.debtCollection.accountReceivable.loading}
          />
          <ErrorMessage
            errorobj={this.props.debtCollection.accountReceivable.error}
            float={true}
            timeout={10000}
          />
          <Loading active={this.accountReceivableItem.loading} />
          <ErrorMessage
            errorobj={this.accountReceivableItem.error}
            float={true}
            timeout={10000}
          />
          <Segment basic padded style={styles.segment}>
            <Form>
              <Form.Group widths="equal">
                <Form.Field
                  required
                  label={t("modal.M241DebtCollectionModal.acknowledgeDate")}
                  control={DateInput}
                  fluid
                  value={this.debtAcknowledgementItem.acknowledgeDate}
                  fieldName={"acknowledgeDate"}
                  onChangeInputField={this.onChangeInputField}
                  id={"acknowledgeDate"}
                />
                <Form.Input
                  fluid
                  label={t("modal.M241DebtCollectionModal.place")}
                  placeholder={t(
                    "modal.M241DebtCollectionModal.pleaseFillOutPlaceWhereDebtReceived"
                  )}
                  value={this.debtAcknowledgementItem.location}
                  onChange={(event: any, data: any) =>
                    this.onChangeInputField("location", data.value)
                  }
                />
              </Form.Group>

              {this.renderIsBehalf()}
              {this.renderRecipientInformation()}
              {this.renderLoanDetails()}
              <AccountReceivableLoanEdit
                hideLoanDetails
                noneForm
                hideButtonSubmit
                accountReceivable={this.accountReceivableItem}
                onRerender={open}
              />
              <br />
              <Form.Group widths="equal">
                <Form.Field
                  control={Checkbox}
                  label={t(
                    "modal.M241DebtCollectionModal.confirmReceiptDebtConditions"
                  )}
                  checked={this.debtAcknowledgementItem.isAcknowledge}
                  onChange={(e: any, data: any) =>
                    this.onChangeInputField("isAcknowledge", data.checked)
                  }
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
              {this.debtAcknowledgementItem.isAcknowledge ? (
                <React.Fragment>
                  {/* <Form.Field
                    label={t("modal.M241DebtCollectionModal.isAcknowledge")}
                    error
                  /> */}
                  <br />
                </React.Fragment>
              ) : null}
              <Form.Field
                label={t(
                  "modal.M241DebtCollectionModal.documentsConfirmingReceiptDebtConditionSignatures"
                )}
                mode="edit"
                control={AttachedFile}
                multiple={true}
                addFiles={this.debtAcknowledgementItem.addFiles}
                removeFile={(index?: number) => this.onRemoveFile(index!)}
                fieldName="debtAcknowledgement.attachedFiles"
                files={this.debtAcknowledgementItem.fileList}
              />
            </Form>
          </Segment>
        </Modal.Content>
        <Modal.Actions>{this.renderActions()}</Modal.Actions>
      </Modal>
    );
  }

  private renderActions() {
    const { t } = this.props;
    return (
      <Button
        color="teal"
        fluid
        type="button"
        disabled={
          !(
            this.debtAcknowledgementItem.isAcknowledge &&
            this.accountReceivableItem.installmentAmount &&
            this.accountReceivableItem.installmentPeriodValue &&
            this.accountReceivableItem.installmentTimes &&
            this.accountReceivableItem.installmentPeriodDay &&
            this.accountReceivableItem.installmentFirstDate &&
            this.accountReceivableItem.installmentLastDate &&
            this.accountReceivableItem.installmentLastAmount
          )
        }
        onClick={this.onSubmit}
        style={styles.button}
        content={t("modal.M211DebtCollectionLetterFormModal.save")}
      />
    );
  }

  private renderIsBehalf() {
    const { t } = this.props;
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
              checked={this.debtAcknowledgementItem.isBehalf === false}
            />
            <Form.Field
              control={Radio}
              label={t(
                "modal.M241DebtCollectionModal.trusteeStatutoryBorrower"
              )}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                this.onChangeInputFieldIsBehalf("isBehalf", true)
              }
              checked={this.debtAcknowledgementItem.isBehalf === true}
            />
          </Form.Group>
          {this.debtAcknowledgementItem.isBehalf ? (
            <Form.Input
              fluid
              label={t("modal.M241DebtCollectionModal.asTrusteeHeirOf")}
              placeholder={t(
                "modal.M241DebtCollectionModal.specifyAsTrusteeHeirOf"
              )}
              value={this.debtAcknowledgementItem.onBehalfOf}
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
    const { t } = this.props;
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
            value={this.debtAcknowledgementItem.telephone}
            onChange={(event: any, data: any) =>
              this.onChangeInputField("telephone", data.value)
            }
          />
        </Segment>
      </Form.Field>
    );
  }
  private renderLoanDetails() {
    const { t, debtCollection } = this.props;
    return (
      <Form.Field>
        <label>{t("modal.M241DebtCollectionModal.detailsLoan")}</label>
        <Segment padded>
          <Grid columns={2} verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={4}>
                <FormDisplay
                  width={16}
                  title={t("modal.M241DebtCollectionModal.loanAgreement")}
                  value={debtCollection.accountReceivable.documentNumber || "-"}
                />
                <FormDisplay
                  width={16}
                  title={t("modal.M241DebtCollectionModal.datedLoanAgreement")}
                  value={
                    date_display_CE_TO_BE(
                      debtCollection.accountReceivable.documentDate
                    ) || "-"
                  }
                />
              </Grid.Column>
              <Grid.Column width={12}>
                <Segment>
                  <List verticalAlign="middle">
                    <List.Item>
                      <List.Content floated="right">
                        {t("modal.M241DebtCollectionModal.valueBaht", {
                          value: currency(
                            debtCollection.accountReceivable.loanAmount
                          )
                        })}
                      </List.Content>
                      <List.Content>
                        {t("modal.M241DebtCollectionModal.loanBalance")}
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content floated="right">
                        {t("modal.M241DebtCollectionModal.valueBaht", {
                          value: currency(
                            debtCollection.accountReceivable
                              .outstandingDebtBalance
                          )
                        })}
                      </List.Content>
                      <List.Content>
                        {t("modal.M241DebtCollectionModal.outstandingDebt")}
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content floated="right">
                        {t("modal.M241DebtCollectionModal.valueBaht", {
                          value: currency(
                            debtCollection.accountReceivable.installmentAmount
                          )
                        })}
                      </List.Content>
                      <List.Content>
                        {t(
                          "modal.M241DebtCollectionModal.amountPaidInstallment"
                        )}
                      </List.Content>
                    </List.Item>
                  </List>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Form.Field>
    );
  }
  private onChangeInputField = (fieldname: string, value: any) => {
    this.debtAcknowledgementItem.setField({ fieldname, value });
  };
  private onChangeInputFieldIsBehalf = (fieldname: string, value: any) => {
    const { debtCollection } = this.props;
    this.debtAcknowledgementItem.setField({ fieldname, value });
    if (!value) {
      if (
        debtCollection.accountReceivable.agreement &&
        !this.debtAcknowledgementItem.isBehalf
      ) {
        if (
          debtCollection.accountReceivable.agreement.agreementItems &&
          debtCollection.accountReceivable.agreement.agreementItems.length > 0
        ) {
          this.debtAcknowledgementItem.setIsBehalfBorrower(
            debtCollection.accountReceivable.agreement.agreementItems[0]
              .borrower
          );
          this.onSetProfile();
          if (!this.debtAcknowledgementItem.telephone) {
            this.debtAcknowledgementItem.setField({
              fieldname: "telephone",
              value:
                debtCollection.accountReceivable.agreement.agreementItems[0]
                  .borrowerTelephone
            });
          }
          this.debtAcknowledgementItem.setField({
            fieldname: "onBehalfOf",
            value: ""
          });
        } else {
          this.debtAcknowledgementItem.resetIsBehalfBorrower();
          this.onResetProfile();
        }
      } else {
        this.debtAcknowledgementItem.resetIsBehalfBorrower();
        this.onResetProfile();
      }
    } else {
      this.debtAcknowledgementItem.setField({
        fieldname: "onBehalfOf",
        value: debtCollection.accountReceivable.fullname
      });
      this.debtAcknowledgementItem.resetIsBehalfBorrower();
      this.onResetProfile();
    }
  };

  private onSetProfile = async () => {
    this.profile.setField({
      fieldname: "idCardNo",
      value: this.debtAcknowledgementItem.idCardNo
    });
    this.profile.setField({
      fieldname: "title",
      value: this.debtAcknowledgementItem.title
    });
    this.profile.setField({
      fieldname: "firstname",
      value: this.debtAcknowledgementItem.firstname
    });
    this.profile.setField({
      fieldname: "lastname",
      value: this.debtAcknowledgementItem.lastname
    });
    this.profile.setField({
      fieldname: "birthDate",
      value: this.debtAcknowledgementItem.birthDate
    });
    this.profile.setField({
      fieldname: "isOnlyBirthYear",
      value: this.debtAcknowledgementItem.isOnlyBirthYear
    });
  };

  private onSetDebtAcknowledgement = async () => {
    this.debtAcknowledgementItem.setField({
      fieldname: "idCardNo",
      value: this.profile.idCardNo
    });
    this.debtAcknowledgementItem.setField({
      fieldname: "title",
      value: this.profile.title
    });
    this.debtAcknowledgementItem.setField({
      fieldname: "firstname",
      value: this.profile.firstname
    });
    this.debtAcknowledgementItem.setField({
      fieldname: "lastname",
      value: this.profile.lastname
    });
    this.debtAcknowledgementItem.setField({
      fieldname: "birthDate",
      value: this.profile.birthDate
    });
    this.debtAcknowledgementItem.setField({
      fieldname: "isOnlyBirthYear",
      value: this.profile.isOnlyBirthYear
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

  private onSubmit = async () => {
    const { history } = this.props;
    try {
      await this.onSetDebtAcknowledgement();
      await this.accountReceivableItem.updateDebtAcknowledgement(
        clone(this.debtAcknowledgementItem),
        true
      );
      history.push(
        `/account_receivable/view/${this.accountReceivableItem.id}/${this.accountReceivableItem.documentNumber}`
      );
      this.close();
    } catch (e) {
      console.log(e);
    }
  };
  private onPrint = async () => {
    const { debtCollection } = this.props;
    try {
      await this.onSetDebtAcknowledgement();
      await debtCollection.accountReceivable.printAcknowledge(
        clone(this.debtAcknowledgementItem),
        clone(this.accountReceivableItem)
      );
    } catch (e) {
      console.log(e);
    }
  };
  private onRemoveFile = async (index: number) => {
    try {
      await this.debtAcknowledgementItem.removeFile(index);
      if (this.props.debtCollection.accountReceivable.debtAcknowledgement) {
        await this.props.debtCollection.accountReceivable.debtAcknowledgement.setField(
          {
            fieldname: "attachedFiles",
            value: clone(this.debtAcknowledgementItem.attachedFiles)
          }
        );
      }
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
  segment: {
    margin: 0
  }
};
export default withRouter(withTranslation()(M241DebtAcknowledgementModal));
