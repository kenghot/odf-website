import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { RequestFormBody, RequestHeader } from ".";
import { IAppModel } from "../../../../AppModel";
import { IRequestModel } from "../RequestModel";

interface IRequestFormEdit extends WithTranslation {
  request: IRequestModel;
  appStore?: IAppModel;
  mode: "editMode" | "createMode";
}
@inject("appStore")
@observer
class RequestFormEdit extends React.Component<IRequestFormEdit> {
  public render() {
    const { request, mode } = this.props;
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

export default withTranslation()(RequestFormEdit);
