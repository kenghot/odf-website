import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Message, Segment } from "semantic-ui-react";

interface INoPermissionMessage extends WithTranslation {
  message?: string;
}

class NoPermissionMessage extends React.Component<INoPermissionMessage> {
  public render() {
    const { message, t } = this.props;
    return (
      <Segment textAlign="center">
        <Message
          icon="ban"
          header={
            message || t("component.noPermissionMessage.noPermissionAccess")
          }
        />
      </Segment>
    );
  }
}
export default withTranslation()(NoPermissionMessage);
