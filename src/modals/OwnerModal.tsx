import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Header, Modal, Radio, Segment } from "semantic-ui-react";
import { Loading } from "../components/common/loading";

interface IOwnerModal extends WithTranslation {
  trigger: any;
  onConfirm: (fileType: string) => void;
  disabled?: boolean;
}

class OwnerModal extends React.Component<IOwnerModal> {
  public _isMounted = false;
  public state = {
    open: false,
    loading: false,
    fileType: "pdf",
  };
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
    const { trigger, disabled, t } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={trigger}
        onOpen={disabled ? undefined : this.open}
        size="mini"
        open={open}
        onClose={this.close}
      >
        <Header icon={"print"} content={t("modal.OwnerModal.header")} />
        <Modal.Content>
          <Loading active={this.state!.loading} />
          <Form>
            <Form.Field>
              <label>{t("modal.OwnerModal.headerFileType")}</label>
              <Segment>
                <Form.Group>
                  <Form.Field
                    control={Radio}
                    label={"PDF"}
                    onChange={(
                      event: React.SyntheticEvent<HTMLElement>,
                      data: any
                    ) => this.setState({ fileType: "pdf" })}
                    checked={this.state.fileType === "pdf"}
                  />
                  <Form.Field
                    control={Radio}
                    label={"MS Word"}
                    onChange={(
                      event: React.SyntheticEvent<HTMLElement>,
                      data: any
                    ) => this.setState({ fileType: "docx" })}
                    checked={this.state.fileType === "docx"}
                  />
                </Form.Group>
              </Segment>
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="grey"
            floated="left"
            basic
            onClick={() => this.close()}
          >
            {t("modal.OwnerModal.buttonNo")}
          </Button>
          <Button color="teal" onClick={() => this.onConfirm()}>
            {t("modal.OwnerModal.buttonYes")}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
  private onConfirm = async () => {
    const { onConfirm } = this.props;
    try {
      this.setState({ loading: true });
      await onConfirm(this.state.fileType);
      this.close();
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      this.setState({ loading: false });
    }
  };
}

export default withTranslation()(OwnerModal);
