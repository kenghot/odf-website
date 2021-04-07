import { observer } from "mobx-react";
import moment from "moment";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import { ErrorMessage, FormDisplay } from "../components/common";
import { CurrencyInput } from "../components/common/input";
import { Loading } from "../components/common/loading";
import { UserDDL } from "../modules/admin/user";
import { UserListModel } from "../modules/admin/user/UserListModel";
import { IPosModel } from "../modules/pos/PosModel";

interface IM35401OpenShiftModal extends WithTranslation {
  trigger: any;
  pos: IPosModel;
  swapManagerMode?: boolean;
  style?: any;
}

@observer
class M35401OpenShiftModal extends React.Component<IM35401OpenShiftModal> {
  private userList = UserListModel.create({});
  public state = { open: false, userId: "" };
  public close = () => {
    const { pos } = this.props;
    this.userList.resetAll();
    this.setState({ userId: "" });
    pos.setField({ fieldname: "pin", value: "" });
    this.setState({ open: false });
  };
  public open = async () => {
    const { pos, swapManagerMode } = this.props;
    if (swapManagerMode) {
      await this.userList.setFieldFilterOrg(
        pos.organizationId
        // pos.manager.firstname
      );
      await this.userList.load_data_pos();
    } else {
      this.setState({ userId: pos.manager.id });
    }
    this.setState({ open: true });
  };
  public render() {
    const { t, trigger, style, swapManagerMode, pos } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={trigger}
        onOpen={this.open}
        open={open}
        closeIcon
        onClose={this.close}
        size="small"
        style={style}
      >
        <Modal.Header>
          <Header textAlign="center">
            {swapManagerMode
              ? t("modal.M35401OpenShiftModal.headerSwap")
              : t("modal.M35401OpenShiftModal.header")}
          </Header>
        </Modal.Header>
        <Modal.Content>
          <Loading active={pos.loading} />
          <ErrorMessage errorobj={pos.error} float timeout={5000} />
          <Form>
            <Form.Field
              required
              id={"input-pos-lastest-posShift-openingAmount"}
              label={t("modal.M35401OpenShiftModal.label")}
              control={CurrencyInput}
              value={
                pos.lastestPosShift && pos.lastestPosShift.openingAmount
                  ? pos.lastestPosShift.openingAmount
                  : ""
              }
              onChangeInputField={this.onChangeInputFieldOpeningAmount}
              fieldName={"openingAmount"}
            />
            <Form.Field>
              <Header size="small">
                {t("modal.M35302CancelPaymentModal.header")}
              </Header>
            </Form.Field>
            {swapManagerMode ? (
              <Form.Field
                label={t("modal.M35302CancelPaymentModal.title")}
                placeholder={t("modal.M35401OpenShiftModal.placeholder")}
                control={UserDDL}
                userList={this.userList}
                onChange={this.onChangeUserDDL}
                value={this.state.userId}
              />
            ) : (
              <FormDisplay
                title={t("modal.M35302CancelPaymentModal.title")}
                value={pos.manager.fullname}
              />
            )}
            <Form.Input
              fluid
              label={t("modal.M35302CancelPaymentModal.pin")}
              placeholder={t("modal.M35302CancelPaymentModal.pin")}
              value={pos.pin || ""}
              type="password"
              onChange={(event: any, data: any) =>
                this.onChangeInputField("pin", data.value)
              }
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="blue"
            fluid
            type="button"
            disabled={
              pos.pin &&
              pos.lastestPosShift &&
              pos.lastestPosShift.openingAmount
                ? false
                : true
            }
            onClick={this.onClick}
            style={styles.button}
          >
            {t("modal.M35401OpenShiftModal.button")}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private onChangeUserDDL = (value: string) => {
    this.setState({ userId: value });
  };

  private onChangeInputFieldOpeningAmount = (fieldname: string, value: any) => {
    const { pos } = this.props;

    if (pos.lastestPosShift) {
      pos.lastestPosShift.setField({ fieldname, value });
    }
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { pos } = this.props;

    pos.setField({ fieldname, value });
  };
  private onClick = async () => {
    const { pos } = this.props;
    try {
      await pos.lastestPosShift.setField({
        fieldname: "startedShift",
        value: moment().format()
      });
      await pos.onPosOpenShift(this.state.userId);
      this.close();
    } catch (e) {
      console.log(e);
    }
  };
}
const styles: any = {
  button: {
    marginLeft: 0,
    marginRight: 0
  }
};
export default withTranslation()(M35401OpenShiftModal);
