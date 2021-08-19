import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { RequestBody, RequestHeader } from ".";
import { IRequestModel } from "../RequestModel";
import { IAuthModel } from "../../../../modules/auth/AuthModel";
import { hasPermission } from "../../../../utils/render-by-permission";
import {
  NoPermissionMessage,
  PermissionControl
} from "../../../../components/permission";

interface IRequestDetail extends WithTranslation {
  request: IRequestModel;
  authStore?: IAuthModel;
}

@inject("authStore")
@observer
class RequestDetail extends React.Component<IRequestDetail> {
  public render() {
    const { request, authStore } = this.props;
    if (hasPermission("REQUEST.ONLINE.VIEW") && request.id_card != authStore!.userProfile.username) {
      return (<NoPermissionMessage />);
    } else {
      return (
        <Segment padded basic>
          <RequestHeader request={request} mode="view" />
          <Form>
            <RequestBody request={request} />
          </Form>
        </Segment>
      );
    }
  }
}
export default withTranslation()(RequestDetail);
