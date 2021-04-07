import { inject, observer } from "mobx-react";
import { clone } from "mobx-state-tree";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Button,
  Form,
  Header,
  Modal,
  Radio,
  Segment,
  TextArea
} from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import {
  AddressBody,
  AddressFormBody,
  LocationModel
} from "../components/address";
import {
  AlertMessage,
  AttachedFile,
  DateInput,
  ErrorMessage,
  FormDisplay,
  InputLabel,
  MapMarker
} from "../components/common";
import { CurrencyInput } from "../components/common/input";
import { Loading } from "../components/common/loading";
import { IAuthModel } from "../modules/auth/AuthModel";
import {
  DebtCollectionVisitModel,
  IDebtCollectionModel,
  IDebtCollectionVisitModel
} from "../modules/debtCollection/DebtCollectionModel";
import { CurrentOccupationType } from "../modules/loan/components";
import { date_display_CE_TO_BE } from "../utils";

interface IM221DebtCollectionVisitFormModal extends WithTranslation {
  trigger?: any;
  visit?: IDebtCollectionVisitModel;
  debtCollection: IDebtCollectionModel;
  appStore?: IAppModel;
  editMode?: boolean;
  authStore?: IAuthModel;
}

@inject("appStore", "authStore")
@observer
class M221DebtCollectionVisitFormModal extends React.Component<
  IM221DebtCollectionVisitFormModal
> {
  public state = { open: false };
  public locationStore = LocationModel.create({});
  public visitItem = DebtCollectionVisitModel.create({});
  public close = () => {
    this.setState({ open: false });
    this.visitItem.resetAll();
  };
  public open = async () => {
    await this.setState({ open: true });
    if (this.props.visit && this.props.visit.id) {
      this.visitItem.setAllField(this.props.visit.debtCollectionVisitJSON);
    } else {
      this.visitItem.setField({ fieldname: "visitType", value: "DCB" });
      this.visitItem.setField({
        fieldname: "currentAddress",
        value: clone(
          this.props.debtCollection.accountReceivable.borrowerContactAddress
        )
      });
      this.visitItem.setField({
        fieldname: "contactTelephone",
        value: this.props.debtCollection.accountReceivable
          .borrowerContactTelephone
      });
      this.visitItem.setField({
        fieldname: "visitorName",
        value: this.props.authStore!.userProfile.fullname
      });
      this.visitItem.setField({
        fieldname: "visitorPosition",
        value: this.props.authStore!.userProfile.position
      });
    }
    await this.locationStore.loadSubdistrict(
      this.visitItem.currentAddress.subDistrict
    );
    await this.locationStore.loadDistrict(
      this.visitItem.currentAddress.district
    );
    await this.locationStore.loadProvince(
      this.visitItem.currentAddress.province
    );
  };
  public render() {
    const { t, trigger, editMode } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={trigger}
        onOpen={this.open}
        open={open}
        closeIcon
        onClose={this.close}
        size="large"
      >
        <Modal.Header>
          <Header textAlign="center">
            {t("modal.M221DebtCollectionVisitFormModal.homeVisitInformation")}
          </Header>
        </Modal.Header>
        <Modal.Content scrolling>
          <AlertMessage
            messageobj={this.visitItem.alert}
            float={true}
            timeout={3000}
          />
          <Loading active={this.visitItem.loading} />
          <ErrorMessage
            errorobj={this.visitItem.error}
            float={true}
            timeout={10000}
          />
          <Form>
            {this.renderDateVisit()}
            {this.renderVisitingType()}
            {this.renderVisitReport()}
            {this.renderAddress()}
            <Form.Field
              label={t(
                "modal.M221DebtCollectionVisitFormModal.currentAddressMap"
              )}
              width={16}
              control={MapMarker}
              addressStore={this.visitItem.currentAddress}
              mode={
                editMode ? (this.visitItem.id ? "editMode" : "createMode") : ""
              }
            />
            <Form.Field
              label={t(
                "modal.M221DebtCollectionVisitFormModal.currentOccupation"
              )}
              width={16}
              readOnly={!editMode}
              control={CurrentOccupationType}
              ocupationType={this.onChangeOcupationType()}
              isWorking={this.visitItem.isWorking}
              inputFieldIsWorking={"isWorking"}
              occupation={this.visitItem.occupation}
              onChangeInputField={this.onChangeInputField}
            />
            {this.renderOtherIncome()}
            {this.renderFamilyInformation()}
            {this.renderExpenseDeclaration()}
            {this.renderProblem()}
            {this.renderAscertaining()}
            {this.renderOpinionOfficer()}
            {this.visitItem.id ? (
              <Form.Field
                label={t("modal.M221DebtCollectionVisitFormModal.attachment")}
                mode={editMode ? "edit" : "view"}
                control={AttachedFile}
                multiple={true}
                addFiles={this.visitItem.addFiles}
                removeFile={(index?: number) => this.onRemoveFile(index!)}
                fieldName="letterItem.attachedFiles"
                files={this.visitItem.fileList}
              />
            ) : null}
          </Form>
        </Modal.Content>
        {editMode ? (
          <Modal.Actions>{this.renderActions()}</Modal.Actions>
        ) : null}
      </Modal>
    );
  }
  private renderDateVisit() {
    const { t, editMode } = this.props;
    return (
      <React.Fragment>
        {editMode && !this.visitItem.id ? (
          <Form.Field
            required
            label={t("modal.M221DebtCollectionVisitFormModal.dateVisit")}
            control={DateInput}
            value={this.visitItem.visitDate}
            fieldName={"visitDate"}
            onChangeInputField={this.onChangeInputField}
            id={"visitDateVisitItem"}
          />
        ) : (
          <FormDisplay
            title={t("modal.M221DebtCollectionVisitFormModal.dateVisit")}
            value={date_display_CE_TO_BE(this.visitItem.visitDate) || "-"}
          />
        )}
      </React.Fragment>
    );
  }
  private renderActions() {
    const { t } = this.props;
    return (
      <React.Fragment>
        {this.visitItem.id ? (
          <Button
            color="blue"
            fluid
            type="button"
            icon="print"
            content={t(
              "modal.M221DebtCollectionVisitFormModal.printVisitingForm"
            )}
            onClick={this.onPrint}
            style={styles.buttonTop}
          />
        ) : null}
        {this.visitItem.id ? (
          <Button
            color="teal"
            fluid
            type="button"
            onClick={this.onUpdate}
            style={styles.button}
            content={t("modal.M211DebtCollectionLetterFormModal.save")}
          />
        ) : (
          <Button
            color="teal"
            fluid
            type="button"
            onClick={this.onCreate}
            style={styles.button}
            content={t(
              "modal.M221DebtCollectionVisitFormModal.createHomeVisitInformation"
            )}
          />
        )}
      </React.Fragment>
    );
  }

  private renderVisitingType() {
    const { t, appStore } = this.props;
    return (
      <Form.Field>
        <label>
          {t("modal.M221DebtCollectionVisitFormModal.visitingForms")}
        </label>
        <Segment padded style={styles.radioButton}>
          <Form.Group widths="equal">
            {appStore!
              .enumItems("visitType")
              .map((item: any, index: number) => (
                <Form.Field
                  key={index}
                  control={Radio}
                  label={item.text}
                  value={item.value}
                  readOnly={this.visitItem.id ? true : false}
                  onChange={(
                    event: React.SyntheticEvent<HTMLElement>,
                    data: any
                  ) =>
                    this.onChangeInputFieldVisitType("visitType", data.value)
                  }
                  checked={this.visitItem.visitType === item.value}
                />
              ))}
          </Form.Group>
        </Segment>
      </Form.Field>
    );
  }

  private renderVisitReport() {
    const { t, editMode } = this.props;
    return (
      <Form.Field>
        <label>{t("modal.M221DebtCollectionVisitFormModal.visitReport")}</label>
        <Segment padded>
          <Form.Group>
            <Form.Field
              control={Radio}
              label={t("modal.M221DebtCollectionVisitFormModal.find")}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                this.onChangeInputField("isMeetTarget", true)
              }
              checked={this.visitItem.isMeetTarget === true}
              readOnly={!editMode}
            />
            <Form.Field
              control={Radio}
              label={t("modal.M221DebtCollectionVisitFormModal.notFound")}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                this.onChangeInputField("isMeetTarget", false)
              }
              checked={this.visitItem.isMeetTarget === false}
              readOnly={!editMode}
            />
          </Form.Group>
          {this.visitItem.isMeetTarget ? this.renderIsMeetTargetTure() : null}
          {this.visitItem.isMeetTarget === false
            ? this.renderIsMeetTargetFalse()
            : null}
        </Segment>
      </Form.Field>
    );
  }

  private renderIsMeetTargetTure() {
    const { t, editMode } = this.props;
    return editMode ? (
      <Form.Field
        control={TextArea}
        label={t(
          "module.debtCollection.debtCollectionVisitTable.reasonsForNonPayment"
        )}
        value={this.visitItem.overdueReasons}
        placeholder={t(
          "modal.M221DebtCollectionVisitFormModal.pleaseSpecifyDescription"
        )}
        onChange={(event: any, data: any) =>
          this.onChangeInputField("overdueReasons", data.value)
        }
      />
    ) : (
      <FormDisplay
        title={t(
          "module.debtCollection.debtCollectionVisitTable.reasonsForNonPayment"
        )}
        value={this.visitItem.overdueReasons || "-"}
      />
    );
  }

  private renderIsMeetTargetFalse() {
    const { t, editMode } = this.props;
    return editMode ? (
      <Form.Field
        control={TextArea}
        label={t(
          "module.debtCollection.debtCollectionVisitTable.causeNotfound"
        )}
        value={this.visitItem.dismissReason}
        placeholder={t(
          "modal.M221DebtCollectionVisitFormModal.pleaseSpecifyDescription"
        )}
        onChange={(event: any, data: any) =>
          this.onChangeInputField("dismissReason", data.value)
        }
      />
    ) : (
      <FormDisplay
        title={t(
          "module.debtCollection.debtCollectionVisitTable.causeNotfound"
        )}
        value={this.visitItem.dismissReason || "-"}
      />
    );
  }

  private renderAddress() {
    const { t, editMode } = this.props;
    return (
      <React.Fragment>
        {editMode ? (
          <Form.Field
            label={t("modal.M221DebtCollectionVisitFormModal.currentAddress")}
            width={16}
            control={AddressFormBody}
            notDidMount={true}
            addressStore={this.visitItem.currentAddress}
            locationStore={this.locationStore}
            children={
              <Form.Input
                label={"เบอร์โทรศัพท์"}
                placeholder={"กรุณาระบุเบอร์โทรศัพท์"}
                value={this.visitItem.contactTelephone}
                onChange={(event: any, data: any) =>
                  this.onChangeInputField("contactTelephone", data.value)
                }
              />
            }
          />
        ) : (
          <Form.Field
            label={t("modal.M221DebtCollectionVisitFormModal.currentAddress")}
            width={16}
            control={AddressBody}
            children={
              <FormDisplay
                title={t("เบอร์โทรศัพท์")}
                value={this.visitItem.contactTelephone || "-"}
              />
            }
            addressStore={this.visitItem.currentAddress}
          />
        )}
      </React.Fragment>
    );
  }

  private renderOtherIncome() {
    const { t, editMode } = this.props;
    return (
      <Form.Field>
        <label>{t("modal.M221DebtCollectionVisitFormModal.otherIncome")}</label>
        <Segment padded>
          <Form.Group>
            <Form.Field
              control={Radio}
              label={t("modal.M221DebtCollectionVisitFormModal.none")}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                this.onChangeInputField("hasExtraIncome", false)
              }
              readOnly={!editMode}
              checked={!this.visitItem.hasExtraIncome}
            />
            <Form.Field
              control={Radio}
              label={t("modal.M221DebtCollectionVisitFormModal.have")}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                this.onChangeInputField("hasExtraIncome", true)
              }
              readOnly={!editMode}
              checked={this.visitItem.hasExtraIncome}
            />
          </Form.Group>
          {this.visitItem.hasExtraIncome ? (
            <React.Fragment>
              {editMode ? (
                <Form.Field
                  control={TextArea}
                  label={t(
                    "modal.M221DebtCollectionVisitFormModal.sourceIncome"
                  )}
                  value={this.visitItem.extraIncomeDescription}
                  placeholder={t(
                    "modal.M221DebtCollectionVisitFormModal.pleaseSpecifyDescription"
                  )}
                  onChange={(event: any, data: any) =>
                    this.onChangeInputField(
                      "extraIncomeDescription",
                      data.value
                    )
                  }
                />
              ) : (
                <FormDisplay
                  title={t(
                    "modal.M221DebtCollectionVisitFormModal.sourceIncome"
                  )}
                  value={this.visitItem.extraIncomeDescription || "-"}
                />
              )}
              <Form.Field
                id={"input-visit-extraIncome"}
                label={t("modal.M221DebtCollectionVisitFormModal.income")}
                control={CurrencyInput}
                labelText={t(
                  "modal.M221DebtCollectionVisitFormModal.bahtMonth"
                )}
                readOnly={!editMode}
                value={this.visitItem.extraIncome || ""}
                onChangeInputField={this.onChangeInputFieldNumber}
                fieldName={"extraIncome"}
              />
            </React.Fragment>
          ) : null}
        </Segment>
      </Form.Field>
    );
  }

  private renderExpenseDeclaration() {
    const { t, editMode } = this.props;
    return (
      <React.Fragment>
        {editMode ? (
          <Form.Input
            fluid
            label={t(
              "modal.M221DebtCollectionVisitFormModal.expenseDeclaration"
            )}
            placeholder={t(
              "modal.M221DebtCollectionVisitFormModal.placeholderExpenseDeclaration"
            )}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField("expenseDeclaration", data.value)
            }
            value={this.visitItem.expenseDeclaration}
          />
        ) : (
          <FormDisplay
            title={t(
              "modal.M221DebtCollectionVisitFormModal.expenseDeclaration"
            )}
            value={this.visitItem.expenseDeclaration || "-"}
          />
        )}
      </React.Fragment>
    );
  }

  private renderFamilyInformation() {
    const { t, editMode } = this.props;
    return (
      <Form.Field>
        <label>
          {t("modal.M221DebtCollectionVisitFormModal.familyInformation")}
        </label>
        <Segment padded>
          <Form.Group widths="equal">
            <Form.Field
              label={t("modal.M221DebtCollectionVisitFormModal.numberMembers")}
              id={"input-visit-family-member"}
              width={6}
              control={InputLabel}
              readOnly={editMode ? false : true}
              labelText={t("modal.M221DebtCollectionVisitFormModal.person")}
              placeholder="0"
              type="number"
              value={this.visitItem.familyMember || ""}
              onChangeInputField={this.onChangeInputField}
              fieldName={"familyMember"}
            />
            {editMode ? (
              <Form.Input
                fluid
                label={t(
                  "modal.M221DebtCollectionVisitFormModal.descriptionFamilyMembers"
                )}
                placeholder={t(
                  "modal.M221DebtCollectionVisitFormModal.pleaseExplain"
                )}
                onChange={(
                  event: React.SyntheticEvent<HTMLElement>,
                  data: any
                ) =>
                  this.onChangeInputField("familyMemberDescription", data.value)
                }
                value={this.visitItem.familyMemberDescription}
              />
            ) : (
              <FormDisplay
                title={t(
                  "modal.M221DebtCollectionVisitFormModal.descriptionFamilyMembers"
                )}
                value={this.visitItem.familyMemberDescription || "-"}
              />
            )}
          </Form.Group>
        </Segment>
      </Form.Field>
    );
  }

  private renderProblem() {
    const { t, editMode } = this.props;
    return (
      <Form.Field>
        <label>{t("modal.M221DebtCollectionVisitFormModal.problem")}</label>
        <Segment padded>
          {editMode ? (
            <React.Fragment>
              <Form.Field
                control={TextArea}
                label={t("modal.M221DebtCollectionVisitFormModal.health")}
                value={this.visitItem.problem1}
                placeholder={t(
                  "modal.M221DebtCollectionVisitFormModal.pleaseExplain"
                )}
                onChange={(event: any, data: any) =>
                  this.onChangeInputField("problem1", data.value)
                }
              />
              <Form.Field
                control={TextArea}
                label={t(
                  "modal.M221DebtCollectionVisitFormModal.occupationSide"
                )}
                value={this.visitItem.problem2}
                placeholder={t(
                  "modal.M221DebtCollectionVisitFormModal.pleaseExplain"
                )}
                onChange={(event: any, data: any) =>
                  this.onChangeInputField("problem2", data.value)
                }
              />
              <Form.Field
                control={TextArea}
                label={t("modal.M221DebtCollectionVisitFormModal.otherSide")}
                value={this.visitItem.problem3}
                placeholder={t(
                  "modal.M221DebtCollectionVisitFormModal.pleaseExplain"
                )}
                onChange={(event: any, data: any) =>
                  this.onChangeInputField("problem3", data.value)
                }
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <FormDisplay
                title={t("modal.M221DebtCollectionVisitFormModal.health")}
                value={this.visitItem.problem1 || "-"}
              />
              <FormDisplay
                title={t(
                  "modal.M221DebtCollectionVisitFormModal.occupationSide"
                )}
                value={this.visitItem.problem2 || "-"}
              />
              <FormDisplay
                title={t("modal.M221DebtCollectionVisitFormModal.otherSide")}
                value={this.visitItem.problem3 || "-"}
              />
            </React.Fragment>
          )}
        </Segment>
      </Form.Field>
    );
  }

  private renderAscertaining() {
    const { t, editMode } = this.props;
    return (
      <Form.Field>
        <label>
          {t("modal.M221DebtCollectionVisitFormModal.ascertaining")}
        </label>
        <Segment padded>
          {editMode ? (
            <React.Fragment>
              <Form.Field
                control={TextArea}
                label={t("modal.M221DebtCollectionVisitFormModal.debt")}
                value={this.visitItem.inspection1}
                placeholder={t(
                  "modal.M221DebtCollectionVisitFormModal.pleaseExplain"
                )}
                onChange={(event: any, data: any) =>
                  this.onChangeInputField("inspection1", data.value)
                }
              />
              <Form.Field
                control={TextArea}
                label={t("modal.M221DebtCollectionVisitFormModal.estate")}
                value={this.visitItem.inspection2}
                placeholder={t(
                  "modal.M221DebtCollectionVisitFormModal.pleaseExplain"
                )}
                onChange={(event: any, data: any) =>
                  this.onChangeInputField("inspection2", data.value)
                }
              />
              <Form.Field
                control={TextArea}
                label={t(
                  "modal.M221DebtCollectionVisitFormModal.claimsFromThirdParties"
                )}
                value={this.visitItem.inspection3}
                placeholder={t(
                  "modal.M221DebtCollectionVisitFormModal.pleaseExplain"
                )}
                onChange={(event: any, data: any) =>
                  this.onChangeInputField("inspection3", data.value)
                }
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <FormDisplay
                title={t("modal.M221DebtCollectionVisitFormModal.debt")}
                value={this.visitItem.inspection1 || "-"}
              />
              <FormDisplay
                title={t("modal.M221DebtCollectionVisitFormModal.estate")}
                value={this.visitItem.inspection2 || "-"}
              />
              <FormDisplay
                title={t(
                  "modal.M221DebtCollectionVisitFormModal.claimsFromThirdParties"
                )}
                value={this.visitItem.inspection3 || "-"}
              />
            </React.Fragment>
          )}
        </Segment>
      </Form.Field>
    );
  }

  private renderOpinionOfficer() {
    const { t, editMode } = this.props;
    return (
      <Segment padded>
        <Header
          size="medium"
          content={t("modal.M221DebtCollectionVisitFormModal.opinionOfficer")}
          subheader={t(
            "modal.M221DebtCollectionVisitFormModal.basicInformationAccessing"
          )}
        />
        {editMode ? (
          <React.Fragment>
            <Form.Input
              fluid
              label={t("modal.M221DebtCollectionVisitFormModal.visitedBy")}
              placeholder={t(
                "modal.M221DebtCollectionVisitFormModal.pleaseEnterVisitorName"
              )}
              value={this.visitItem.visitorName}
              onChange={(event: any, data: any) =>
                this.visitItem.setField({
                  fieldname: "visitorName",
                  value: data.value
                })
              }
            />
            <Form.Input
              fluid
              label={t("modal.M221DebtCollectionVisitFormModal.guestPosition")}
              placeholder={t(
                "modal.M221DebtCollectionVisitFormModal.pleaseSpecifyVisitingLocation"
              )}
              onChange={(event: any, data: any) =>
                this.visitItem.setField({
                  fieldname: "visitorPosition",
                  value: data.value
                })
              }
              value={this.visitItem.visitorPosition}
            />
            <Form.Field
              control={TextArea}
              label={t(
                "modal.M221DebtCollectionVisitFormModal.noticeStaffAboutBorrowerGuarantor"
              )}
              value={this.visitItem.comments}
              placeholder={t(
                "modal.M221DebtCollectionVisitFormModal.pleaseSpecifyObservation"
              )}
              onChange={(event: any, data: any) =>
                this.visitItem.setField({
                  fieldname: "comments",
                  value: data.value
                })
              }
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <FormDisplay
              title={t("modal.M221DebtCollectionVisitFormModal.visitedBy")}
              value={this.visitItem.visitorName || "-"}
            />
            <FormDisplay
              title={t("modal.M221DebtCollectionVisitFormModal.guestPosition")}
              value={this.visitItem.visitorPosition || "-"}
            />
            <FormDisplay
              title={t(
                "modal.M221DebtCollectionVisitFormModal.noticeStaffAboutBorrowerGuarantor"
              )}
              value={this.visitItem.comments || "-"}
            />
          </React.Fragment>
        )}
      </Segment>
    );
  }

  private onChangeOcupationType = () => {
    switch (this.visitItem.visitType) {
      case "DCB":
        return "borrow";
      case "DCG":
        return "guarantee";
      default:
        return "";
    }
  };

  private onChangeInputField = (fieldname: string, value: any) => {
    this.visitItem.setField({ fieldname, value });
  };
  private onChangeInputFieldVisitType = async (
    fieldname: string,
    value: any
  ) => {
    await this.visitItem.setField({ fieldname, value });
    if (value === "DCB") {
      await this.visitItem.setField({
        fieldname: "currentAddress",
        value: clone(
          this.props.debtCollection.accountReceivable.borrowerContactAddress
        )
      });
      await this.visitItem.setField({
        fieldname: "contactTelephone",
        value: this.props.debtCollection.accountReceivable
          .borrowerContactTelephone
      });
    } else if (value === "DCG") {
      await this.visitItem.setField({
        fieldname: "currentAddress",
        value: clone(
          this.props.debtCollection.accountReceivable.guarantorContactAddress
        )
      });
      await this.visitItem.setField({
        fieldname: "contactTelephone",
        value: this.props.debtCollection.accountReceivable
          .guarantorContactTelephone
      });
    }
    await this.locationStore.loadSubdistrict(
      this.visitItem.currentAddress.subDistrict
    );
    await this.locationStore.loadDistrict(
      this.visitItem.currentAddress.district
    );
    await this.locationStore.loadProvince(
      this.visitItem.currentAddress.province
    );
  };
  private onChangeInputFieldNumber = (fieldname: string, value: any) => {
    this.visitItem.setField({ fieldname, value: +value });
  };

  private onUpdate = async () => {
    const { debtCollection } = this.props;
    try {
      await this.visitItem.updateVisit();
      if (this.props.visit) {
        await this.props.visit.setAllField(
          this.visitItem.debtCollectionVisitJSON
        );
      }
      await debtCollection.getDebtCollectionDetail(true);
      this.close();
    } catch (e) {
      console.log(e);
    }
  };
  private onCreate = async () => {
    const { debtCollection } = this.props;
    try {
      await this.visitItem.createDebtCollectionVisit(debtCollection.id);
      await this.onPrint();
      await debtCollection.getDebtCollectionDetail(true);
      await this.close();
    } catch (e) {
      console.log(e);
    }
  };
  private onPrint = async () => {
    try {
      await this.visitItem.printVisit();
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  private onRemoveFile = async (index: number) => {
    try {
      await this.visitItem.removeFile(index);
      if (this.props.visit) {
        await this.props.visit.setField({
          fieldname: "attachedFiles",
          value: clone(this.visitItem.attachedFiles)
        });
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
  buttonTop: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 7
  }
};
export default withTranslation()(M221DebtCollectionVisitFormModal);
