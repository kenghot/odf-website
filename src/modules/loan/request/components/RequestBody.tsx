import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  RequesAttachedFiles,
  RequesBorrowerGuarantorList,
  RequesLoanDetails,
  RequestStepIcon
} from ".";
// import { Loading } from "../../../../components/common/loading";
import { IRequestModel } from "../RequestModel";

interface IRequestBody extends WithTranslation {
  request: IRequestModel;
}
@observer
class RequestBody extends React.Component<IRequestBody> {
  public state = { step: 1 };
  public render() {
    const { request } = this.props;
    return (
      <React.Fragment>
        {/* <Loading active={request!.loading} /> */}
        <RequestStepIcon
          step={this.state.step}
          onNextStep={this.onNextStep}
          onPreviousStep={this.onPreviousStep}
          onClickStep={(index) => this.setState({ step: index })}
          hideSubmitButton
          viewMode
        />
        {this.state.step === 1 ? (
          <RequesBorrowerGuarantorList request={request} />
        ) : null}
        {this.state.step === 2 ? (
          <RequesLoanDetails request={request} readOnly />
        ) : null}
        {this.state.step === 3 ? (
          <RequesAttachedFiles
            request={request}
            mode="editMode"
            readOnly
            hideButtonSubmit
          />
        ) : null}

        <RequestStepIcon
          step={this.state.step}
          onNextStep={this.onNextStep}
          onPreviousStep={this.onPreviousStep}
          onClickStep={(index) => this.setState({ step: index })}
          hideSubmitButton
          viewMode
          positionBottom
        />
      </React.Fragment>
    );
  }
  private onNextStep = async () => {
    this.setState({ step: this.state.step + 1 });
  };
  private onPreviousStep = async () => {
    if (this.state.step > 1) {
      this.setState({ step: this.state.step - 1 });
    }
  };
}

export default withTranslation()(RequestBody);
