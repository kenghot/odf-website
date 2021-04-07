import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { RequestBody, RequestHeader } from ".";
import { IRequestModel } from "../RequestModel";

interface IRequestDetail extends WithTranslation {
  request: IRequestModel;
}

@observer
class RequestDetail extends React.Component<IRequestDetail> {
  public render() {
    const { request } = this.props;
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
export default withTranslation()(RequestDetail);
