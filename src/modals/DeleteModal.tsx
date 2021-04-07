import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

interface IDeleteModal extends WithTranslation {
  trigger: any;
  title?: string;
  idSubmit?: string;
  idClose?: string;
  description?: string;
  onConfirmDelete: () => void;
}

class DeleteModal extends React.Component<IDeleteModal> {
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
    const { trigger, description, title, t, idClose, idSubmit } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={trigger}
        basic
        size="mini"
        onOpen={this.open}
        open={open}
        onClose={this.close}
      >
        <Header
          icon="trash alternate outline"
          content={title ? title : t("modal.DeleteModal.confirmDelete")}
        />
        {description ? (
          <Modal.Content>
            <p>{description}</p>
          </Modal.Content>
        ) : null}
        <Modal.Actions>
          <Button
            id={idClose || "modal-btn-icon-close"}
            basic
            color="red"
            inverted
            onClick={this.close}
          >
            <Icon name="remove" /> {t("modal.DeleteModal.no")}
          </Button>
          <Button
            id={idSubmit || "modal-btn-icon-confirm-delete"}
            color="green"
            inverted
            onClick={this.onConfirmDelete}
          >
            <Icon name="checkmark" /> {t("modal.DeleteModal.yes")}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
  private onConfirmDelete = async () => {
    const { onConfirmDelete } = this.props;
    try {
      await onConfirmDelete();
      this.close();
    } catch (e) {
      console.log(e);
    }
  };
}

export default withTranslation()(DeleteModal);
