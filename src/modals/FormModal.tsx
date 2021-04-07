import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Header, Modal } from "semantic-ui-react";
// import { IEnumItemModel } from "../AppModel";

interface IFormModal extends WithTranslation {
  title?: string;
  buttonLabel?: string;
  trigger: any;
  onSubmit?: (value?: any) => void;
  style?: any;
  disabled?: boolean;
}
@observer
class FormModal extends React.Component<IFormModal> {
  public state = { open: false, selected: "" };
  public close = () => this.setState({ open: false });
  public open = () => this.setState({ open: true });
  public render() {
    const {
      trigger,
      style,
      title,
      buttonLabel,
      disabled,
      children
    } = this.props;
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
          <Header textAlign="center">{title}</Header>
        </Modal.Header>
        <Form onSubmit={this.onSubmit}>
          <Modal.Content>{children}</Modal.Content>
          <Modal.Actions style={styles.block}>
            <Button color="red" fluid style={styles.button} disabled={disabled}>
              {buttonLabel}
            </Button>
          </Modal.Actions>
        </Form>
      </Modal>
    );
  }

  private onSubmit = async () => {
    const { onSubmit } = this.props;
    try {
      if (typeof onSubmit !== "undefined") {
        await onSubmit();
        this.close();
      }
    } catch (error) {
      console.log(error);
    }
  };
}
const styles: any = {
  button: {
    marginLeft: 0,
    marginRight: 0
  },
  block: {
    padding: 10
  }
};
export default withTranslation()(FormModal);
