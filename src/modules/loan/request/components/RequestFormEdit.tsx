import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { RequestFormBody, RequestHeader } from ".";
import { IAppModel } from "../../../../AppModel";
import { IRequestModel } from "../RequestModel";
import { IAuthModel } from "../../../../modules/auth/AuthModel";
import { hasPermission } from "../../../../utils/render-by-permission";
import {
  NoPermissionMessage,
  PermissionControl
} from "../../../../components/permission";


interface IRequestFormEdit extends WithTranslation {
  request: IRequestModel;
  appStore?: IAppModel;
  authStore?: IAuthModel;
  mode: "editMode" | "createMode";
}
@inject("appStore", "authStore")
@observer
class RequestFormEdit extends React.Component<IRequestFormEdit> {
  public render() {
    const { request, authStore, mode } = this.props;
    if (hasPermission("REQUEST.ONLINE.EDIT") && request.id_card != authStore!.userProfile.username) {
      return (<NoPermissionMessage />);
    } else {
      return (
        <Segment basic>
          <RequestHeader request={request} mode="edit" />
          <Form>
            <RequestFormBody request={request} mode={mode} />
          </Form>
        </Segment>
      );
    }
  }
}

export default withTranslation()(RequestFormEdit);
