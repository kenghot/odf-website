import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { RequesAttachedFiles, RequesFormBorrowerGuarantorList, RequesLoanDetails, RequestStepIcon } from ".";
// import { Loading } from "../../../../components/common/loading";
import { IRequestModel } from "../RequestModel";
import { IAuthModel } from "../../../../modules/auth/AuthModel";
import { hasPermission } from "../../../../utils/render-by-permission";

interface IRequestFormBody extends WithTranslation, RouteComponentProps {
  request: IRequestModel;
  mode: "editMode" | "createMode";
  authStore?: IAuthModel;
}

@inject("authStore")
@observer
class RequestFormBody extends React.Component<IRequestFormBody> {
  public componentDidMount() {
    if (this.props.mode === "createMode") {
      if (this.props.request.requestItems.length === 0) {
        this.props.request.setRequestItems();
      }
    }
  }
  public state = { step: 1 };
  public render() {
    const { request, mode } = this.props;
    return (
      <React.Fragment>
        {/* <Loading active={request!.loading} /> */}
        <RequestStepIcon
          step={this.state.step}
          onNextStep={this.onNextStep}
          onPreviousStep={this.onPreviousStep}
          onClickStep={(index) => this.setState({ step: index })}
          onSave={this.onSave}
          onCreate={this.onCreate}
          hideSubmitButton={(request.status === "DF" || "DFO") || !request.id ? false : true}
          isInvalid={request.checkTotalBudgetAllocationItems}
        />
        {this.state.step === 1 ? <RequesFormBorrowerGuarantorList mode={mode} request={request} /> : null}
        {this.state.step === 2 ? <RequesLoanDetails request={request} mode={mode} /> : null}
        {this.state.step === 3 ? <RequesAttachedFiles request={request} mode={mode} /> : null}

        <RequestStepIcon
          step={this.state.step}
          onNextStep={this.onNextStep}
          onPreviousStep={this.onPreviousStep}
          onClickStep={(index) => this.setState({ step: index })}
          onSave={this.onSave}
          onCreate={this.onCreate}
          hideSubmitButton={(request.status === "DF" || "DFO") || !request.id ? false : true}
          positionBottom
          isInvalid={request.checkTotalBudgetAllocationItems}
        />
      </React.Fragment>
    );
  }
  private onSave = async () => {
    const { request, history, location, t, authStore } = this.props;
    const pathname = location.pathname;
    try {
      if (request.checkTotalBudgetAllocationItems) {
        const errorMessage = {
          code: "",
          name: "",
          message: t("module.loan.budgetAllocationItem.estimatedCostLessAmountRequested"),
          technical_stack: "",
        };
        request.error.setErrorMessage(errorMessage);
        throw errorMessage;
      }
      if (request.id) {
        if (pathname === "/loan/request/create") {
          history.push(`/loan/request/edit/${request.id}/${request.requestType}`);
        } else {
          await request!.updateRequestAll();
          await request!.getRequestDetail();
          await request!.setRequestItemsAttachedFiles();
          if (request.requestItems.length && request.requestItems[0].id) {
            await request.requestItems[0].getAttachedFiles(request.id || "");
          }
        }
      } else {
        if (hasPermission("REQUEST.ONLINE.CREATE") && request.id_card == authStore!.userProfile.username) {
          request.setField({ fieldname: "status", value: "DFO" });
        } else {
          request.setField({ fieldname: "status", value: "DF" });
        }
        await request!.createRequest();
      }
    } catch (e) {
      console.log(e);
    }
  };
  private onNextStep = async () => {
    switch (this.state.step) {
      case 1:
        await this.sendFormStep1();
        break;
      case 2:
        await this.sendFormStep2();
        break;
    }
  };
  private onPreviousStep = async () => {
    if (this.state.step > 1) {
      this.setState({ step: this.state.step - 1 });
    }
  };

  private sendFormStep2 = async () => {
    const { request, t, authStore } = this.props;
    try {
      if (!request.checkTotalBudgetAllocationItems) {
        if (request.id) {
          await request.updateRequesLoanDetails();
        } else {
          if (hasPermission("REQUEST.ONLINE.CREATE") && request.id_card == authStore!.userProfile.username) {
            request.setField({ fieldname: "status", value: "DFO" });
          } else {
            request.setField({ fieldname: "status", value: "DF" });
          }
          await request.createRequest();
        }
        await this.setState({ step: 3 });
      } else {
        const errorMessage = {
          code: "",
          name: "",
          message: t("module.loan.budgetAllocationItem.estimatedCostLessAmountRequested"),
          technical_stack: "",
        };
        request.error.setErrorMessage(errorMessage);
        throw errorMessage;
      }
    } catch (e) {
      console.log(e);
    }
  };
  private sendFormStep1 = async () => {
    const { request, authStore } = this.props;
    try {
      if (request.id) {
        await request!.updateRequest();
      } else {
        if (hasPermission("REQUEST.ONLINE.CREATE") && request.id_card == authStore!.userProfile.username) {
          request.setField({ fieldname: "status", value: "DFO" });
        } else {
          request.setField({ fieldname: "status", value: "DF" });
        }
        await request!.createRequest();
      }
      await this.setState({ step: 2 });
    } catch (e) {
      console.log(e);
    }
  };
  private onCreate = async () => {
    const { request, history, t, authStore } = this.props;
    try {
      if (request.checkTotalBudgetAllocationItems) {
        const errorMessage = {
          code: "",
          name: "",
          message: t("module.loan.budgetAllocationItem.estimatedCostLessAmountRequested"),
          technical_stack: "",
        };
        request.error.setErrorMessage(errorMessage);
        throw errorMessage;
      }
      if (request.status == "DFO") {
        request.setField({ fieldname: "status", value: "NWO" });
      } else {
        request.setField({ fieldname: "status", value: "NW" });
      }
      if (request.id) {
        await request!.updateRequestStatusCreate();
      } else {
        await request!.createRequestAllStatusCreate();
        history.push(`/loan/request/edit/${request.id}/${request.requestType}`);
      }
      history.push(`/loan/request/view/${request.id}/${request.requestType}`);
    } catch (e) {
      console.log(e);
    }
  };
}
export default withRouter(withTranslation()(RequestFormBody));
