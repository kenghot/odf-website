import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Header, Modal, Button } from "semantic-ui-react";
import { Text } from "../components/common";
import { FILES_PATH } from "../constants";


interface IClickLinkModal extends WithTranslation {
  trigger: any;
}

class ClickLinkModal extends React.Component<
  IClickLinkModal
> {
  public render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <Modal trigger={this.props.trigger} closeIcon size={"small"}>
          <Modal.Header>
            <Header shade={2} textAlign={"center"}>
              {t("modal.googleFromsModal.header")}
            </Header>
          </Modal.Header>
          <Modal.Content scrolling style={styles.modalContentStyle}>
            <Modal.Description style={styles.modalDescriptionStyle}>
              <Text
                id={"link-label-m001-download-form"}
              >
                {t("modal.googleFromsModal.instruction")}
              </Text>
              <Button
                id={"modal-btn-icon-confirm-delete"}
                style={styles.textStyle}
                color="brown"
                inverted
                onClick={this.onChangeFieldName}
              > {"คลิก"}
              </Button>

            </Modal.Description>
          </Modal.Content>
        </Modal>
      </React.Fragment>
    );
  }
  private onChangeFieldName = () => {
    console.log("url")
    let url = process.env.REACT_APP_GOOGLE_FORM_URL;
    window.open(url, '_blank');
  };
}

const styles: any = {
  spanStyle: {
    // whiteSpace: "pre-wrap",
    whiteSpace: "pre-line"
  },
  textStyle: {
    marginLeft: 42
  },
  displayInline: {
    display: "inline"
  },
  modalDescriptionStyle: {
    lineHeight: 1.8
  },
  modalContentStyle: {
    padding: 42
  },
  link: {
    opacity: "inherit"
  }
};

export default withTranslation()(ClickLinkModal);
