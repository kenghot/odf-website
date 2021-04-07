import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Header, Modal, TextArea } from "semantic-ui-react";
import { UserDDL } from "../modules/admin/user";
import { UserListModel } from "../modules/admin/user/UserListModel";
import { IPosModel } from "../modules/pos/PosModel";

interface IM355SwapManagerModal extends WithTranslation {
  trigger: any;
  pos: IPosModel;
  style?: any;
}

@observer
class M355SwapManagerModal extends React.Component<IM355SwapManagerModal> {
  private userList = UserListModel.create({});
  public state = { open: false, note: "", userId: "" };
  public close = () => {
    const { pos } = this.props;
    this.userList.resetAll();
    pos.setField({ fieldname: "pin", value: "" });
    this.setState({ note: "" });
    this.setState({ userId: "" });
    this.setState({ open: false });
  };
  public open = async () => {
    const { pos } = this.props;
    await this.userList.setFieldFilterOrg(pos.organizationId);
    await this.userList.load_data_pos();
    this.setState({ open: true });
  };
  public render() {
    const { t, trigger, pos, style } = this.props;
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
            {t("modal.M355SwapManagerModal.header")}
          </Header>
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field
              id="form-ddl-manager"
              label={t("modal.M355SwapManagerModal.username")}
              placeholder={t("modal.M355SwapManagerModal.placeholderUsername")}
              control={UserDDL}
              userList={this.userList}
              onChange={this.onChangeUserDDL}
              value={this.state.userId}
            />
            <Form.Input
              id="form-input-pin-manager"
              fluid
              label={t("modal.M355SwapManagerModal.password")}
              placeholder={t("modal.M355SwapManagerModal.placeholderPassword")}
              type="password"
              value={pos.pin || ""}
              onChange={(event: any, data: any) =>
                this.onChangeInputField("pin", data.value)
              }
            />
            <Form.Field
              control={TextArea}
              label={t("modal.M355SwapManagerModal.note")}
              value={this.state.note}
              placeholder={t("modal.M355SwapManagerModal.placeholderNote")}
              onChange={(event: any, data: any) =>
                this.setState({ note: data.value })
              }
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="blue"
            fluid
            type="button"
            disabled={!pos.pin}
            onClick={this.onClick}
            style={styles.button}
          >
            {t("modal.M355SwapManagerModal.button")}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
  private onChangeInputField = (fieldname: string, value: any) => {
    const { pos } = this.props;
    pos.setField({ fieldname, value });
  };
  private onChangeUserDDL = (value: string) => {
    this.setState({ userId: value });
  };
  private onClick = async () => {
    const { pos } = this.props;
    try {
      await pos.onChangeDutymanager(this.state.userId, this.state.note);
      this.close();
    } catch (e) {
      await pos.error.setErrorMessage(e);
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
export default withTranslation()(M355SwapManagerModal);
