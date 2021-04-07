import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Modal } from "semantic-ui-react";
import { IUserModel } from "../modules/admin/user/UserModel";
import { ResetPassword } from "../modules/auth/components";

interface IResetPasswordModal extends WithTranslation {
  trigger: any;
  user?: IUserModel;
}
@observer
class ResetPasswordModal extends React.Component<IResetPasswordModal> {
  public state = { open: false };
  public close = () => this.setState({ open: false });
  public open = () => this.setState({ open: true });
  public render() {
    const { user, t } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={this.props.trigger}
        onOpen={this.open}
        open={open}
        onClose={this.close}
        closeIcon
        size="tiny"
      >
        <Modal.Content style={styles.modalContentStyle}>
          <Modal.Description>
            <ResetPassword
              onChangeInputField={this.onChangeInputField}
              resetPassword={this.resetPassword}
              loading={user!.loading}
              error={user!.error}
              isPasswordMissMatch={user!.isPasswordMissMatch}
              isPasswordInCorrectFormat={user!.isPasswordInCorrectFormat}
              labelSubmit={t("modal.resetPasswordModal.save")}
            />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
  private onChangeInputField = (fieldname: string, value: string) => {
    const { user } = this.props;
    user!.setField({ fieldname, value });
  };
  private resetPassword = async (e: any) => {
    const { user } = this.props;
    try {
      e.stopPropagation(); // ใช้ submit เฉพาะ parent form ป้องกันการ submit root form
      await user!.updatePassword();
      await this.close();
    } catch (e) {
      console.log(e);
    }
  };
}

const styles: any = {
  modalContentStyle: {
    padding: 0
  }
};

export default withTranslation()(ResetPasswordModal);
