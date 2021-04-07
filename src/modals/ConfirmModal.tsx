import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Header, Icon, Modal, SemanticICONS } from "semantic-ui-react";

interface IConfirmModal extends WithTranslation {
  trigger: any;
  title?: string;
  description?: string;
  iconNameHeader?: SemanticICONS;
  onConfirm: () => void;
}

class ConfirmModal extends React.Component<IConfirmModal> {
  public _isMounted = false;
  public state = { open: false };
  public componentDidMount() {
    this._isMounted = true;
  }
  public componentWillUnmount() {
    this._isMounted = false;
  }
  public close = () => {
    if (this._isMounted) {
      this.setState({ open: false });
    }
  };
  public open = () => {
    if (this._isMounted) {
      this.setState({ open: true });
    }
  };
  public render() {
    const { trigger, description, title, iconNameHeader, t } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={<div onClick={this.open}>{trigger}</div>}
        basic
        size="mini"
        // onOpen={this.open}
        open={open}
        onClose={this.close}
      >
        <Header icon={iconNameHeader} content={title} />
        {description ? (
          <Modal.Content>
            <p>{description}</p>
          </Modal.Content>
        ) : null}
        <Modal.Actions>
          <Button basic color="red" inverted onClick={this.close}>
            <Icon name="remove" /> {t("modal.DeleteModal.no")}
          </Button>
          <Button color="green" inverted onClick={this.onConfirm}>
            <Icon name="checkmark" /> {t("modal.DeleteModal.yes")}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
  private onConfirm = async () => {
    const { onConfirm } = this.props;
    try {
      await onConfirm();
      this.close();
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
}

export default withTranslation()(ConfirmModal);
