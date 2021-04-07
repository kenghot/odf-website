import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Segment } from "semantic-ui-react";
import { RequesAttachedFiles, RequestHeader } from ".";
import { Loading } from "../../../../components/common/loading";
import { IRequestModel } from "../RequestModel";
import Validation from "./Validation";

interface IRequestValidation extends WithTranslation {
  request: IRequestModel;
}

@observer
class RequestValidation extends React.Component<IRequestValidation> {
  public async componentDidMount() {
    const { request } = this.props;
    if (!request.validationChecklist) {
      await request.getValidationChecklist();
    }
  }
  public render() {
    const { request, t } = this.props;
    return (
      <Segment padded basic>
        <RequestHeader request={request} hideBtn mode="view" />
        <Form>
          <Validation
            request={request}
            precoditionCheck={!request.validationCheckValue}
          />
          <br />
          {request.status !== "DN" ? (
            <Button
              content={t("module.loan.requestValidation.confirmProperties")}
              color={"blue"}
              floated={"right"}
              onClick={request.onConfirmValidation}
            />
          ) : null}
          <br />
          <RequesAttachedFiles
            request={request}
            mode={"editMode"}
            showButtonIsVerified
            // hideButtonSubmit
            readOnly
          />
          <br />
          <Loading active={request.loading} />
        </Form>
      </Segment>
    );
  }
}

export default withTranslation()(RequestValidation);
