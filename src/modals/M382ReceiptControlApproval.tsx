import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Modal } from "semantic-ui-react";
import {
  AlertMessage,
  AttachedFile,
  ErrorMessage,
  FormDisplay,
  InputLabel,
  SubSectionContainer
} from "../components/common";
import { ErrorModel } from "../components/common/error";
import { MessageModel } from "../components/common/message";
import {
  IReceiptControlLogModel,
  ReceiptControlLogModel
} from "../modules/receiptcontrol/ReceiptControlLogModel";
import { currency, date_display_CE_TO_BE } from "../utils/format-helper";

interface IM382ReceiptControlApproval extends WithTranslation {
  trigger?: any;
  receiptControlLog: IReceiptControlLogModel;
  onAfterSubmit?: () => void;
  viewMode?: boolean;
}
@observer
class M382ReceiptControlApproval extends React.Component<
  IM382ReceiptControlApproval
> {
  private receiptControlLogTemp = ReceiptControlLogModel.create({});
  private errorObj = ErrorModel.create({});
  private alertMessageObj = MessageModel.create({});
  private alertMessageTimeout = 2500;

  public state = { open: false, loading: false };

  public close = async (delayBeforeClose?: "delayBeforeClose") => {
    if (delayBeforeClose) {
      // @ts-ignore
      await new Promise((resolve) =>
        setTimeout(resolve, this.alertMessageTimeout)
      );
    }
    this.setState({ open: false });
  };

  public open = () => {
    const { receiptControlLog } = this.props;
    this.receiptControlLogTemp.setAllField(
      receiptControlLog.receiptControlLogSON
    );
    if (!this.props.viewMode) {
      this.receiptControlLogTemp.setField({
        fieldname: "approveQuantity",
        value: +this.receiptControlLogTemp.requestQuantity
      });
    }
    this.setState({ open: true });
  };

  public render() {
    const { viewMode, trigger, t } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={trigger}
        onOpen={this.open}
        open={open}
        closeIcon
        onClose={() => this.close()}
        size="small"
        className={viewMode ? "no-action" : undefined}
      >
        <Modal.Header>
          <Header textAlign="center">
            {t("modal.M382ReceiptControlApproval.header")}
          </Header>
        </Modal.Header>
        <Modal.Content scrolling>
          <Form loading={this.state.loading}>
            {this.headerSection()}
            {this.renderRequestAttachedFileSection()}
            {this.renderApprovedAmountSection()}
            {this.renderApproveAttachedFileSection()}
          </Form>
          <AlertMessage
            messageobj={this.alertMessageObj}
            float
            timeout={this.alertMessageTimeout}
          />
          <ErrorMessage errorobj={this.errorObj} float timeout={5000} />
        </Modal.Content>
        {viewMode ? null : <Modal.Actions>{this.renderFooter()}</Modal.Actions>}
      </Modal>
    );
  }

  private headerSection = () => {
    const { t } = this.props;
    return (
      <Grid padded columns={3} stackable doubling>
        <Grid.Column>
          <FormDisplay
            title={t("modal.M382ReceiptControlApproval.date")}
            value={date_display_CE_TO_BE(
              this.receiptControlLogTemp.documentDate
            )}
          />
        </Grid.Column>
        <Grid.Column>
          <FormDisplay
            title={t("modal.M382ReceiptControlApproval.organization")}
            value={this.receiptControlLogTemp.pos.organization.orgName}
          />
        </Grid.Column>
        <Grid.Column>
          <FormDisplay
            title={t("modal.M382ReceiptControlApproval.pos")}
            value={`${this.receiptControlLogTemp.pos.posCode}`}
          />
        </Grid.Column>
        <Grid.Column>
          <FormDisplay
            title={t("modal.M382ReceiptControlApproval.withdrawal")}
            value={this.receiptControlLogTemp.user.fullname}
          />
        </Grid.Column>
        <Grid.Column>
          <FormDisplay
            title={t("modal.M382ReceiptControlApproval.approvers")}
            value={this.receiptControlLogTemp.onDutymanager.fullname}
          />
        </Grid.Column>
        <Grid.Column>
          <FormDisplay
            title={t("modal.M382ReceiptControlApproval.quantity")}
            value={`${currency(this.receiptControlLogTemp.requestQuantity)} ${t(
              "roll"
            )}`}
          />
        </Grid.Column>
      </Grid>
    );
  };

  private renderRequestAttachedFileSection = () => {
    const { t } = this.props;
    return (
      <SubSectionContainer
        title={t("modal.M382ReceiptControlApproval.requestAttachedFile")}
        basic
        fluid
      >
        <AttachedFile
          files={this.receiptControlLogTemp.requestAttachedFilesList}
          multiple
          mode={"view"}
        />
      </SubSectionContainer>
    );
  };

  private renderApproveAttachedFileSection = () => {
    const { viewMode, t } = this.props;
    return (
      <SubSectionContainer
        title={t("modal.M382ReceiptControlApproval.approveAttachedhFile")}
        basic
        fluid
      >
        <AttachedFile
          files={this.receiptControlLogTemp.approveAttachedFilesList}
          addFiles={(files: any) =>
            this.receiptControlLogTemp.addAttachedFiles(
              "approveAttachedFiles",
              files
            )
          }
          multiple
          mode={viewMode ? "view" : "edit"}
          removeFile={(index?: number) =>
            this.receiptControlLogTemp.removeAttachedFile(
              "approveAttachedFiles",
              index
            )
          }
        />
      </SubSectionContainer>
    );
  };

  private renderApprovedAmountSection = () => {
    const { viewMode, t } = this.props;
    return (
      <div style={styles.approvedAmountSection}>
        <Form.Field
          width={16}
          label={t("modal.M382ReceiptControlApproval.approvedAmount")}
          control={InputLabel}
          labelText={t("roll")}
          placeholder={0}
          type={"number"}
          value={this.receiptControlLogTemp.approveQuantity || ""}
          onChangeInputField={(fieldName: string, value: any) => {
            this.receiptControlLogTemp.setField({
              fieldname: "approveQuantity",
              value: +value
            });
          }}
          readOnly={viewMode}
        />
      </div>
    );
  };

  private renderFooter = () => {
    const { t } = this.props;
    return (
      <Grid columns={"equal"}>
        <Grid.Column textAlign={"left"}>
          <Button
            color="red"
            type="button"
            onClick={this.onNotApproved}
            style={styles.button}
          >
            {t("modal.M382ReceiptControlApproval.notApproved")}
          </Button>
        </Grid.Column>
        <Grid.Column textAlign={"right"}>
          <Button
            color="blue"
            type="button"
            onClick={this.onApproved}
            style={styles.button}
            disabled={this.receiptControlLogTemp.approveQuantity ? false : true}
          >
            {t("modal.M382ReceiptControlApproval.approved")}
          </Button>
        </Grid.Column>
      </Grid>
    );
  };

  private onNotApproved = async () => {
    const { onAfterSubmit } = this.props;
    try {
      this.setState({ loading: true });
      this.receiptControlLogTemp.setField({
        fieldname: "approveQuantity",
        value: 0
      });
      await this.receiptControlLogTemp.notApprove_data();
      if (onAfterSubmit) {
        await onAfterSubmit();
      }

      this.setState({ loading: false });
      this.alertMessageObj.setAlertMessage(
        "บันทึกสำเร็จค่ะ",
        "ไม่อนุมัติการเบิกจ่ายใบเสร็จเรียบร้อยแล้ว"
      );
      this.close("delayBeforeClose");
    } catch (e) {
      this.errorObj.setErrorMessage(e);
    } finally {
      this.setState({ loading: false });
    }
  };

  private onApproved = async () => {
    const { onAfterSubmit } = this.props;
    try {
      this.setState({ loading: true });
      await this.receiptControlLogTemp.approve_data();
      if (onAfterSubmit) {
        await onAfterSubmit();
      }

      this.setState({ loading: false });
      this.alertMessageObj.setAlertMessage(
        "บันทึกสำเร็จค่ะ",
        "อนุมัติเบิกจ่ายใบเสร็จเรียบร้อยแล้ว"
      );
      this.close("delayBeforeClose");
    } catch (e) {
      this.errorObj.setErrorMessage(e);
    } finally {
      this.setState({ loading: false });
    }
  };
}

const styles: any = {
  button: {
    paddingLeft: 50,
    paddingRight: 50
  },
  approvedAmountSection: {
    padding: 14
  }
};
export default withTranslation()(M382ReceiptControlApproval);
