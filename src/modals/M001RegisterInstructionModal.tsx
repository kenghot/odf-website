import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Header, Modal } from "semantic-ui-react";
import { Text } from "../components/common";
import { FILES_PATH } from "../constants";

interface IM001RegisterInstructionModal extends WithTranslation {
  trigger: any;
}

class M001RegisterInstructionModal extends React.Component<
  IM001RegisterInstructionModal
> {
  public render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <Modal trigger={this.props.trigger} closeIcon size={"small"}>
          <Modal.Header>
            <Header shade={2} textAlign={"center"}>
              {t("modal.M001RegisterInstructionModal.header")}
            </Header>
          </Modal.Header>
          <Modal.Content scrolling style={styles.modalContentStyle}>
            <Modal.Description style={styles.modalDescriptionStyle}>
              <Text shade={3} style={styles.spanStyle}>
                {t("modal.M001RegisterInstructionModal.instruction")}
                {t("modal.M001RegisterInstructionModal.line1")}
                <Link
                  target="_blank"
                  to={FILES_PATH.systemActivationRequestForm}
                  download
                  style={styles.link}
                >
                  <Text
                    id={"link-label-m001-download-form"}
                    underline
                    shade={5}
                  >
                    {t("modal.M001RegisterInstructionModal.line1Link")}
                  </Text>
                </Link>
                {t("modal.M001RegisterInstructionModal.line2")}
                {t("modal.M001RegisterInstructionModal.line3")}
                {t("modal.M001RegisterInstructionModal.line4")}
              </Text>
              <div style={styles.addressStyle}>
                <Text shade={3} style={styles.spanStyle}>
                  {t("modal.M001RegisterInstructionModal.line4Address1")}
                  {t("modal.M001RegisterInstructionModal.line4Address2")}
                  {t("modal.M001RegisterInstructionModal.line4Address3")}
                  {t("modal.M001RegisterInstructionModal.line4Address4")}
                  {t("modal.M001RegisterInstructionModal.line4Address5")}
                </Text>
              </div>
              <Text shade={3} style={styles.spanStyle}>
                {t("modal.M001RegisterInstructionModal.line5")}
              </Text>

              <Text shade={3} underline style={styles.spanStyle}>
                {t("modal.M001RegisterInstructionModal.note")}
              </Text>
              <Text
                shade={3}
                style={{ ...styles.displayInline, ...styles.spanStyle }}
              >
                {t("modal.M001RegisterInstructionModal.noteDescription")}
              </Text>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </React.Fragment>
    );
  }
}

const styles: any = {
  spanStyle: {
    // whiteSpace: "pre-wrap",
    whiteSpace: "pre-line"
  },
  addressStyle: {
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

export default withTranslation()(M001RegisterInstructionModal);
