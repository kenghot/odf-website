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
  AlertMessage,
  AttachedFile,
  DateInput,
  ErrorMessage
} from "../components/common";
import { Loading } from "../components/common/loading";
import {
  DebtCollectionLetterModel,
  IDebtCollectionLetterModel,
  IDebtCollectionModel
} from "../modules/debtCollection/DebtCollectionModel";

interface IM211DebtCollectionLetterFormModal extends WithTranslation {
  title?: string;
  headerTitle: string;
  trigger?: any;
  appStore?: IAppModel;
  letterType?: string;
  hidePrintButton?: boolean;
  letter?: IDebtCollectionLetterModel;
  debtCollection: IDebtCollectionModel;
  createBtnLabel: string;
}

@inject("appStore")
@observer
class M211DebtCollectionLetterFormModal extends React.Component<
  IM211DebtCollectionLetterFormModal
> {
  public state = {
    open: false
  };
  public letterItem = DebtCollectionLetterModel.create({});
  public close = () => {
    this.setState({ open: false });
    this.letterItem.resetAll();
  };
  public open = () => {
    this.setState({ open: true });
    if (this.props.letter && this.props.letter.id) {
      this.letterItem.setAllField(this.props.letter.debtCollectionLetterJSON);
    }
  };
  public render() {
    const { trigger, headerTitle } = this.props;
    const { open } = this.state;

    return (
      <Modal
        trigger={trigger}
        onOpen={this.open}
        open={open}
        closeIcon
        onClose={this.close}
        size="small"
      >
        <Modal.Header>
          <Header textAlign="center">{headerTitle}</Header>
        </Modal.Header>
        <Modal.Content scrolling>
          <AlertMessage
            messageobj={this.letterItem.alert}
            float={true}
            timeout={3000}
          />
          <Loading active={this.letterItem.loading} />
          <ErrorMessage
            errorobj={this.letterItem.error}
            float={true}
            timeout={10000}
          />
          {this.renderContent()}
        </Modal.Content>
        <Modal.Actions>{this.renderActions()}</Modal.Actions>
      </Modal>
    );
  }

  private renderContent() {
    const { t, letterType } = this.props;
    return (
      <Form>
        <Form.Field
          required
          label={t("modal.M211DebtCollectionLetterFormModal.dateMakingBook")}
          control={DateInput}
          value={this.letterItem.documentDate}
          fieldName={"documentDate"}
          onChangeInputField={this.onChangeInputField}
          id={`documentDateLetterItem${letterType}`}
        />
        <Form.Field
          label={t("modal.M211DebtCollectionLetterFormModal.bookDeliveryDate")}
          control={DateInput}
          fieldName={"postDate"}
          value={this.letterItem.postDate}
          onChangeInputField={this.onChangeInputField}
          id={`postDateLetterItem${letterType}`}
        />
        {this.letterItem.id ? (
          <Form.Field
            label={t("modal.M211DebtCollectionLetterFormModal.attachment")}
            mode="edit"
            control={AttachedFile}
            multiple={true}
            addFiles={this.letterItem.addFiles}
            removeFile={(index?: number) => this.onRemoveFile(index!)}
            fieldName="letterItem.attachedFiles"
            files={this.letterItem.fileList}
          />
        ) : null}
        {this.renderPostResult()}
      </Form>
    );
  }

  private renderPostResult() {
    const { t, appStore } = this.props;
    return (
      <Form.Field>
        <label>
          {t("modal.M211DebtCollectionLetterFormModal.resultBookDelivery")}
        </label>
        <Segment padded>
          <Form.Group>
            <Form.Field
              control={Radio}
              label={t(
                "modal.M211DebtCollectionLetterFormModal.letterReceiver"
              )}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                this.onChangeInputField("isSentBack", false)
              }
              checked={this.letterItem.isSentBack === false}
            />
            <Form.Field
              control={Radio}
              label={t(
                "modal.M211DebtCollectionLetterFormModal.letterReturned"
              )}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                this.onChangeInputField("isSentBack", true)
              }
              checked={this.letterItem.isSentBack === true}
            />
          </Form.Group>
          {this.letterItem.isSentBack === true ? (
            <Form.Select
              fluid
              label={t(
                "modal.M211DebtCollectionLetterFormModal.reasonBeingBounced"
              )}
              placeholder={t(
                "modal.M211DebtCollectionLetterFormModal.pleaseSelectReasonBeingBounced"
              )}
              options={appStore!.enumItems("letterSentBackReasonType")}
              onChange={(event, data) =>
                this.onChangeInputField("sentBackReasonType", data.value)
              }
              value={this.letterItem.sentBackReasonType || ""}
            />
          ) : null}
          {this.letterItem.isSentBack === true &&
          this.letterItem.sentBackReasonType === 99 ? (
            <Form.Field
              control={TextArea}
              label={t("modal.M211DebtCollectionLetterFormModal.explanation")}
              value={this.letterItem.sentBackReasonTypeDescription}
              placeholder={t(
                "modal.M211DebtCollectionLetterFormModal.pleaseExplainReasonBeingBounced"
              )}
              onChange={(event: any, data: any) =>
                this.onChangeInputField(
                  "sentBackReasonTypeDescription",
                  data.value
                )
              }
            />
          ) : null}
          {this.renderReceivedPayment()}
        </Segment>
      </Form.Field>
    );
  }

  private renderReceivedPayment() {
    const { t } = this.props;
    return (
      <Form.Field>
        <label>
          {t("modal.M211DebtCollectionLetterFormModal.receivedPaymentOrNot")}
        </label>
        <Segment padded style={{ paddingBottom: 7 }}>
          <Form.Group>
            <Form.Field
              control={Radio}
              label={t("modal.M211DebtCollectionLetterFormModal.yes")}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                this.onChangeInputField("isCollectable", true)
              }
              checked={this.letterItem.isCollectable === true}
            />
            <Form.Field
              control={Radio}
              label={t("modal.M211DebtCollectionLetterFormModal.no")}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                this.onChangeInputField("isCollectable", false)
              }
              checked={this.letterItem.isCollectable === false}
            />
          </Form.Group>
        </Segment>
      </Form.Field>
    );
  }

  private renderActions() {
    const { t, hidePrintButton, createBtnLabel } = this.props;
    return (
      <React.Fragment>
        {this.letterItem.id && !hidePrintButton ? (
          <Button
            color="blue"
            fluid
            type="button"
            icon="print"
            content={t(
              "modal.M211DebtCollectionLetterFormModal.printDemandBooks"
            )}
            onClick={this.onPrint}
            style={styles.buttonTop}
          />
        ) : null}
        {this.letterItem.id ? (
          <Button
            color="teal"
            fluid
            disabled={this.letterItem.documentDate ? false : true}
            type="button"
            onClick={this.onUpdate}
            style={styles.button}
            content={t("modal.M211DebtCollectionLetterFormModal.save")}
          />
        ) : (
          <Button
            color="teal"
            fluid
            disabled={this.letterItem.documentDate ? false : true}
            type="button"
            onClick={this.onCreate}
            style={styles.button}
            content={createBtnLabel}
          />
        )}
      </React.Fragment>
    );
  }

  private onChangeInputField = (fieldname: string, value: any) => {
    this.letterItem.setField({ fieldname, value });
  };
  private onPrint = async () => {
    try {
      await this.letterItem.printLetter();
      // this.close();
    } catch (e) {
      console.log(e);
    }
  };
  private onUpdate = async () => {
    const { debtCollection } = this.props;
    try {
      await this.letterItem.updateLetter();
      if (this.props.letter) {
        await this.props.letter.setAllField(
          this.letterItem.debtCollectionLetterJSON
        );
      }
      await debtCollection.getDebtCollectionDetail(true);
      this.close();
    } catch (e) {
      console.log(e);
    }
  };
  private onCreate = async () => {
    const { letterType, debtCollection, hidePrintButton } = this.props;
    try {
      this.letterItem.setField({
        fieldname: "letterType",
        value: letterType
      });
      await this.letterItem.createDebtCollectionLetter(debtCollection.id);
      if (!hidePrintButton) {
        await this.onPrint();
      }
      await debtCollection.getDebtCollectionDetail(true);
      await this.close();
    } catch (e) {
      console.log(e);
    }
  };
  private onRemoveFile = async (index: number) => {
    try {
      await this.letterItem.removeFile(index);
      if (this.props.letter) {
        await this.props.letter.setField({
          fieldname: "attachedFiles",
          value: clone(this.letterItem.attachedFiles)
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
  }
};
export default withTranslation()(M211DebtCollectionLetterFormModal);
