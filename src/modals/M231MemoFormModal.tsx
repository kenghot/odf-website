import { inject, observer } from "mobx-react";
import { clone } from "mobx-state-tree";
import moment from "moment";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { TimeInput } from "semantic-ui-calendar-react";
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
import { LocationModel } from "../components/address";
import {
  AlertMessage,
  AttachedFile,
  DateInput,
  ErrorMessage,
  FormDisplay
} from "../components/common";
import { Loading } from "../components/common/loading";
import { IAuthModel } from "../modules/auth/AuthModel";
import { DebtCollectionMemoInformerForm } from "../modules/debtCollection/components";
import {
  DebtCollectionMemoModel,
  IDebtCollectionMemoModel,
  IDebtCollectionModel
} from "../modules/debtCollection/DebtCollectionModel";
import { date_display_CE_TO_BE } from "../utils";

interface IM231MemoFormModal extends WithTranslation {
  trigger?: any;
  memo?: IDebtCollectionMemoModel;
  debtCollection: IDebtCollectionModel;
  appStore?: IAppModel;
  editMode?: boolean;
  authStore?: IAuthModel;
}

@inject("appStore", "authStore")
@observer
class M231MemoFormModal extends React.Component<IM231MemoFormModal> {
  public state = { open: false };
  public locationStore = LocationModel.create({});
  public memoItem = DebtCollectionMemoModel.create({});
  public close = () => {
    this.setState({ open: false });
    this.memoItem.resetAll();
  };
  public open = async () => {
    await this.setState({ open: true });
    if (this.props.memo && this.props.memo.id) {
      this.memoItem.setAllField(this.props.memo.debtCollectionMemoJSON);
    } else {
      this.memoItem.setField({
        fieldname: "location",
        value: this.props.debtCollection.accountReceivable.organization.orgName
      });
      this.memoItem.setField({
        fieldname: "interviewerName",
        value: this.props.authStore!.userProfile.fullname
      });
      this.memoItem.setField({
        fieldname: "interviewerPosition",
        value: this.props.authStore!.userProfile.position
      });
      this.memoItem.setField({
        fieldname: "documentDate",
        value: moment().format("YYYY-MM-DD")
      });
      this.memoItem.setField({
        fieldname: "documentTime",
        value: moment().format("LT")
      });
    }
    await this.locationStore.loadSubdistrict(
      this.memoItem.currentAddress.subDistrict
    );
    await this.locationStore.loadDistrict(
      this.memoItem.currentAddress.district
    );
    await this.locationStore.loadProvince(
      this.memoItem.currentAddress.province
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
            {t("modal.M231MemoFormModal.memo")}
          </Header>
        </Modal.Header>
        <Modal.Content scrolling>
          <AlertMessage
            messageobj={this.memoItem.alert}
            float={true}
            timeout={3000}
          />
          <Loading active={this.memoItem.loading} />
          <ErrorMessage
            errorobj={this.memoItem.error}
            float={true}
            timeout={10000}
          />
          <Form>
            <Form.Group widths="equal" style={{ verticalAlign: "bottom" }}>
              {this.renderDate()}
              {this.renderNoteLocation()}
            </Form.Group>
            {this.renderMemoInformerType()}
            <DebtCollectionMemoInformerForm
              memo={this.memoItem}
              editMode={editMode}
              locationStore={this.locationStore}
            />
            {this.renderMemoNote()}
            {this.renderOpinionOfficer()}
            {this.memoItem.id ? (
              <Form.Field
                label={t(
                  "modal.M231MemoFormModal.documentationSignatureEvidence"
                )}
                mode={editMode ? "edit" : "view"}
                control={AttachedFile}
                multiple={true}
                addFiles={this.memoItem.addFiles}
                removeFile={(index?: number) => this.onRemoveFile(index!)}
                fieldName="memoItem.attachedFiles"
                files={this.memoItem.fileList}
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
  private renderActions() {
    const { t } = this.props;
    return (
      <React.Fragment>
        {this.memoItem.id ? (
          <Button
            color="blue"
            fluid
            type="button"
            icon="print"
            content={t("modal.M231MemoFormModal.printMemoForm")}
            onClick={this.onPrint}
            style={styles.buttonTop}
          />
        ) : null}
        {this.memoItem.id ? (
          <Button
            color="teal"
            fluid
            type="button"
            onClick={this.onUpdate}
            style={styles.button}
            content={t("modal.M231MemoFormModal.save")}
            disabled={
              !(
                this.memoItem.documentDate &&
                this.memoItem.documentTime &&
                this.memoItem.location &&
                this.memoItem.birthDate
              )
            }
          />
        ) : (
          <Button
            color="teal"
            fluid
            type="button"
            onClick={this.onCreate}
            style={styles.button}
            content={t("modal.M231MemoFormModal.createMemo")}
            disabled={
              !(
                this.memoItem.documentDate &&
                this.memoItem.documentTime &&
                this.memoItem.location &&
                this.memoItem.birthDate
              )
            }
          />
        )}
      </React.Fragment>
    );
  }
  private renderDate() {
    const { t, editMode } = this.props;
    return editMode && !this.memoItem.id ? (
      <React.Fragment>
        <Form.Field
          width={3}
          required
          label={t("modal.M231MemoFormModal.dateMemo")}
          control={DateInput}
          value={this.memoItem.documentDate}
          fieldName={"documentDate"}
          onChangeInputField={this.onChangeInputField}
          id={"documentDateMemoItem"}
        />
        <div className="three wide field">
          <label style={styles.timeLabel}></label>
          <TimeInput
            fluid
            // label={t("modal.M231MemoFormModal.whenContactingStaff")}
            name="time"
            placeholder="HH:MM"
            value={this.memoItem.timeDisplay}
            onChange={(event: any, data: any) =>
              this.onChangeInputField("documentTime", data.value)
            }
            animation={"none" as any}
          />
        </div>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <FormDisplay
          width={3}
          title={t("modal.M231MemoFormModal.dateMemo")}
          value={date_display_CE_TO_BE(this.memoItem.documentDate) || "-"}
        />
        <Form.Field width={3}>
          <label style={styles.timeLabel}></label>
          <p>{this.memoItem.timeDisplay || "-"}</p>
        </Form.Field>
      </React.Fragment>
    );
  }

  private renderNoteLocation() {
    const { t, editMode } = this.props;
    return editMode ? (
      <Form.Input
        required
        width={10}
        id={t("modal.M231MemoFormModal.noteLocation")}
        label={t("modal.M231MemoFormModal.noteLocation")}
        placeholder={t("modal.M231MemoFormModal.pleaseNoteLocation")}
        value={this.memoItem.location}
        onChange={(event: any, data: any) =>
          this.memoItem.setField({
            fieldname: "location",
            value: data.value
          })
        }
      />
    ) : (
      <FormDisplay
        width={10}
        title={t("modal.M231MemoFormModal.noteLocation")}
        value={this.memoItem.location || "-"}
      />
    );
  }

  private renderMemoInformerType() {
    const { t, appStore, editMode } = this.props;
    return (
      <Form.Field>
        <label>{t("modal.M231MemoFormModal.personGaveWords")}</label>
        <Segment padded>
          <div className="inline fields" style={styles.formGroup}>
            {appStore!
              .enumItems("memoInformerType")
              .map((item: any, index: number) => (
                <Form.Field
                  key={index}
                  control={Radio}
                  label={item.text}
                  value={item.value}
                  readOnly={editMode && !this.memoItem.id ? false : true}
                  onChange={(
                    event: React.SyntheticEvent<HTMLElement>,
                    data: any
                  ) =>
                    this.onChangeInputFieldInformer("memoInformer", data.value)
                  }
                  checked={this.memoItem.memoInformer === item.value}
                />
              ))}
          </div>
        </Segment>
      </Form.Field>
    );
  }
  private renderMemoNote() {
    const { t, editMode } = this.props;
    return (
      <Form.Field>
        <label>{t("modal.M231MemoFormModal.reasonContacting")}</label>
        <Segment padded>
          {editMode ? (
            <Form.Input
              fluid
              label={t("modal.M231MemoFormModal.subject")}
              placeholder={t("modal.M231MemoFormModal.pleaseSpecifySubject")}
              value={this.memoItem.memoTitle}
              onChange={(event: any, data: any) =>
                this.memoItem.setField({
                  fieldname: "memoTitle",
                  value: data.value
                })
              }
            />
          ) : (
            <FormDisplay
              title={t("modal.M231MemoFormModal.subject")}
              value={this.memoItem.memoTitle || "-"}
            />
          )}
          {editMode ? (
            <Form.Field
              control={TextArea}
              style={styles.textAreaHeight}
              label={t("modal.M231MemoFormModal.pleaseMakeStatement")}
              value={this.memoItem.memoNote}
              placeholder={t("modal.M231MemoFormModal.pleaseWords")}
              onChange={(event: any, data: any) =>
                this.memoItem.setField({
                  fieldname: "memoNote",
                  value: data.value
                })
              }
            />
          ) : (
            <FormDisplay
              title={t("modal.M231MemoFormModal.pleaseMakeStatement")}
              value={this.memoItem.memoNote || "-"}
            />
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
          content={t("modal.M231MemoFormModal.opinionOfficer")}
          subheader={t(
            "modal.M231MemoFormModal.pleaseSpecifyBorrowerGuarantor"
          )}
        />
        {editMode ? (
          <React.Fragment>
            <Form.Input
              fluid
              label={t("modal.M231MemoFormModal.memoBy")}
              placeholder={t(
                "modal.M231MemoFormModal.pleaseSpecifyRecordingPerson"
              )}
              value={this.memoItem.interviewerName}
              onChange={(event: any, data: any) =>
                this.memoItem.setField({
                  fieldname: "interviewerName",
                  value: data.value
                })
              }
            />
            <Form.Input
              fluid
              label={t("modal.M231MemoFormModal.recorderPosition")}
              placeholder={t(
                "modal.M231MemoFormModal.pleaseSpecifyPositionRecordingOfficer"
              )}
              onChange={(event: any, data: any) =>
                this.memoItem.setField({
                  fieldname: "interviewerPosition",
                  value: data.value
                })
              }
              value={this.memoItem.interviewerPosition}
            />
            <Form.Field
              control={TextArea}
              label={t(
                "modal.M231MemoFormModal.noticeStaffAboutBorrowerGuarantor"
              )}
              value={this.memoItem.comments}
              placeholder={t("modal.M231MemoFormModal.pleaseSpecifyRemarks")}
              onChange={(event: any, data: any) =>
                this.memoItem.setField({
                  fieldname: "comments",
                  value: data.value
                })
              }
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <FormDisplay
              title={t("modal.M231MemoFormModal.memoBy")}
              value={this.memoItem.interviewerName || "-"}
            />
            <FormDisplay
              title={t("modal.M231MemoFormModal.recorderPosition")}
              value={this.memoItem.interviewerPosition || "-"}
            />
            <FormDisplay
              title={t(
                "modal.M231MemoFormModal.noticeStaffAboutBorrowerGuarantor"
              )}
              value={this.memoItem.comments || "-"}
            />
          </React.Fragment>
        )}
      </Segment>
    );
  }

  private onChangeInputField = (fieldname: string, value: any) => {
    this.memoItem.setField({ fieldname, value });
  };
  private onChangeInputFieldInformer = async (
    fieldname: string,
    value: any
  ) => {
    const { debtCollection } = this.props;
    this.memoItem.setField({ fieldname, value });
    if (value === "B" || value === "G") {
      this.memoItem.setField({
        fieldname: "memoInformerRelationship",
        value: ""
      });
      if (value === "B") {
        if (debtCollection.accountReceivable.agreement) {
          if (
            debtCollection.accountReceivable.agreement.agreementItems &&
            debtCollection.accountReceivable.agreement.agreementItems.length > 0
          ) {
            await this.memoItem.setInformer(
              debtCollection.accountReceivable.agreement.agreementItems[0]
                .borrower,
              debtCollection.accountReceivable.borrowerContactAddress
            );
            await this.locationStore.loadSubdistrict(
              this.memoItem.currentAddress.subDistrict
            );
            await this.locationStore.loadDistrict(
              this.memoItem.currentAddress.district
            );
            await this.locationStore.loadProvince(
              this.memoItem.currentAddress.province
            );
          } else {
            await this.memoItem.resetInformer();
          }
        } else {
          await this.memoItem.resetInformer();
        }
      } else {
        if (debtCollection.accountReceivable.guarantee) {
          if (
            debtCollection.accountReceivable.guarantee.guaranteeItems &&
            debtCollection.accountReceivable.guarantee.guaranteeItems.length > 0
          ) {
            await this.memoItem.setInformer(
              debtCollection.accountReceivable.guarantee.guaranteeItems[0]
                .guarantor,
              debtCollection.accountReceivable.guarantorContactAddress
            );
            await this.locationStore.loadSubdistrict(
              this.memoItem.currentAddress.subDistrict
            );
            await this.locationStore.loadDistrict(
              this.memoItem.currentAddress.district
            );
            await this.locationStore.loadProvince(
              this.memoItem.currentAddress.province
            );
          } else {
            await this.memoItem.resetInformer();
          }
        } else {
          await this.memoItem.resetInformer();
        }
      }
    } else {
      await this.memoItem.resetInformer();
    }
  };
  private onUpdate = async () => {
    const { debtCollection } = this.props;
    try {
      await this.memoItem.updateMemo();
      if (this.props.memo) {
        await this.props.memo.setAllField(this.memoItem.debtCollectionMemoJSON);
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
      await this.memoItem.createDebtCollectionMemo(debtCollection.id);
      await debtCollection.getDebtCollectionDetail(true);
      await this.close();
    } catch (e) {
      console.log(e);
    }
  };
  private onPrint = async () => {
    try {
      await this.memoItem.printMemo();
    } catch (e) {
      console.log(e);
    }
  };
  private onRemoveFile = async (index: number) => {
    try {
      await this.memoItem.removeFile(index);
      if (this.props.memo) {
        await this.props.memo.setField({
          fieldname: "attachedFiles",
          value: clone(this.memoItem.attachedFiles)
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
  buttonTop: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 7
  },
  radioButton: {
    paddingBottom: 7
  },
  formGroup: {
    flexWrap: "wrap",
    flexDirection: "initial",
    marginBottom: 0
  },
  textAreaHeight: {
    minHeight: 200
  },
  timeLabel: {
    padding: 9
  }
};
export default withTranslation()(M231MemoFormModal);
