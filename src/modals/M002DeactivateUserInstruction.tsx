import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Header, Modal } from "semantic-ui-react";
import { Text } from "../components/common";
import { FILES_PATH } from "../constants";

interface IM002DeactivateUserInstruction extends WithTranslation {
  trigger: any;
}

class M002DeactivateUserInstruction extends React.Component<
  IM002DeactivateUserInstruction
> {
  public render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <Modal trigger={this.props.trigger} closeIcon size={"small"}>
          <Modal.Header>
            <Header shade={2} textAlign={"center"}>
              {t("modal.M002DeactivateUserInstruction.header")}
            </Header>
          </Modal.Header>
          <Modal.Content scrolling style={styles.modalContentStyle}>
            <Modal.Description style={styles.modalDescriptionStyle}>
              <Text shade={3} style={styles.spanStyle}>
                {t("modal.M002DeactivateUserInstruction.instruction")}
                {t("modal.M002DeactivateUserInstruction.line1")}
                <Link
                  target="_blank"
                  to={FILES_PATH.systemActivationRequestForm}
                  download
                  style={styles.link}
                >
                  <Text
                    id={"link-label-m002-download-form"}
                    underline
                    shade={5}
                  >
                    {t("modal.M002DeactivateUserInstruction.line1Link")}
                  </Text>
                </Link>
                {t("modal.M002DeactivateUserInstruction.line2")}
                {t("modal.M002DeactivateUserInstruction.line3")}
                {t("modal.M002DeactivateUserInstruction.line4")}
              </Text>
              <div style={styles.addressStyle}>
                <Text shade={3} style={styles.spanStyle}>
                  {t("modal.M002DeactivateUserInstruction.line4Address1")}
                  {t("modal.M002DeactivateUserInstruction.line4Address2")}
                  {t("modal.M002DeactivateUserInstruction.line4Address3")}
                  {t("modal.M002DeactivateUserInstruction.line4Address4")}
                  {t("modal.M002DeactivateUserInstruction.line4Address5")}
                </Text>
              </div>
              <Text shade={3} style={styles.spanStyle}>
                {t("modal.M002DeactivateUserInstruction.line5")}
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

export default withTranslation()(M002DeactivateUserInstruction);
