import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { RequesAttachedFiles, RequesFormBorrowerGuarantorList, RequesLoanDetails, RequestStepIcon } from ".";
// import { Loading } from "../../../../components/common/loading";
import { IRequestModel } from "../RequestModel";
import { IAuthModel } from "../../../../modules/auth/AuthModel";
import { hasPermission } from "../../../../utils/render-by-permission";
import { Form } from "semantic-ui-react";
import { fetchNoService } from "../../../../utils/request-noservice";
import { PermissionControl, NoPermissionMessage } from "../../../../components/permission";
import { ClickLinkModal } from "../../../../modals";


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
    const { request, mode, history } = this.props;
    if (hasPermission("REQUEST.ONLINE.CREATE") && (request.status === "NWO" || request.status === "NW" || request.status === "QF"
      || request.status === "AP1" || request.status === "AP2" || request.status === "AP3" || request.status === "DN")) {
      return (<NoPermissionMessage />);
    } else {
      return (
        <Form onSubmit={this.onNextStep}>
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
          {hasPermission("REQUEST.ONLINE.CREATE") && (mode == "editMode" || request.successRequestOnline) ? <ClickLinkModal /> : null}
          {hasPermission("REQUEST.ONLINE.CREATE") && (request.successRequestOnline && request.id && request.requestType) ? history.push(`/loan/request/edit/${request.id}/${request.requestType}`) : null}
        </Form>
      );
    }
  }
  private onSave = async () => {
    const { request, history, location, t, authStore } = this.props;
    const pathname = location.pathname;
    try {
      if (request.checkTotalBudgetAllocationItems && request.requestBudget != '0.00') {
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
      if (hasPermission("REQUEST.ONLINE.CREATE")
        && !request.requestOccupation.id) {
        const errorMessage = {
          code: "",
          name: "",
          message: "โปรดกรอกเลือกข้อมูลหัวข้อเพื่อนำไปประกอบอาชีพ",
          technical_stack: "",
        };
        request.error.setErrorMessage(errorMessage);
        throw errorMessage;
      }
      if (hasPermission("REQUEST.ONLINE.CREATE")
        && (request.requestOccupationAddress.latitude == "" || request.requestOccupationAddress.longitude == "")) {
        const errorMessage = {
          code: "",
          name: "",
          message: "โปรดกรอกระบุข้อมูลแผนผังสถานที่ประกอบอาชีพ",
          technical_stack: "",
        };
        request.error.setErrorMessage(errorMessage);
        throw errorMessage;
      }
      if (!request.checkTotalBudgetAllocationItems && request.requestBudget != '0.00') {
        if (request.id) {
          await request.updateRequesLoanDetails();
        } else {
          if (hasPermission("REQUEST.ONLINE.CREATE") && !request.id) {
            await request!.setRequestItemsAttachedFiles();
          } else {
            await request!.createRequest();
          }
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
      // console.log(request.requestItems[0].borrower.residenceStatusTypeDescription)
      if (hasPermission("REQUEST.ONLINE.CREATE")
        && (request.requestItems[0].borrower.residenceStatusType === 0
          || request.requestItems[0].borrower.residenceStatusType === 1)
        && (request.requestItems[0].borrower.residenceStatusTypeDescription == "0" || !request.requestItems[0].borrower.residenceStatusTypeDescription)) {
        const errorMessage = {
          code: "",
          name: "",
          message: "โปรดกรอกค่าเช่า/ผ่อน หรือ อื่นๆในหัวข้อสถานะการอยู่อาศัยของผู้กู้",
          technical_stack: "",
        };
        request.error.setErrorMessage(errorMessage);
        throw errorMessage;
      }
      if (hasPermission("REQUEST.ONLINE.CREATE")
        && (request.requestItems[0].guarantor.residenceStatusType === 0
          || request.requestItems[0].guarantor.residenceStatusType === 1)
        && (request.requestItems[0].guarantor.residenceStatusTypeDescription == "0" || !request.requestItems[0].guarantor.residenceStatusTypeDescription)) {
        const errorMessage = {
          code: "",
          name: "",
          message: "โปรดกรอกค่าเช่า/ผ่อน หรือ อื่นๆในหัวข้อสถานะการอยู่อาศัยของผู้ค้ำ",
          technical_stack: "",
        };
        request.error.setErrorMessage(errorMessage);
        throw errorMessage;
      }
      if (hasPermission("REQUEST.ONLINE.CREATE")
        && (request.requestItems[0].guarantor.occupation.salary == "0" || !request.requestItems[0].guarantor.occupation.salary)) {
        const errorMessage = {
          code: "",
          name: "",
          message: "โปรดกรอกรายได้ของผู้ค้ำ",
          technical_stack: "",
        };
        request.error.setErrorMessage(errorMessage);
        throw errorMessage;
      }
      if (request.id) {
        await request!.updateRequest();
        if (hasPermission("REQUEST.ONLINE.CREATE")) {
          await request!.updateRequestAll();
          await request!.getRequestDetail();
          await request!.setRequestItemsAttachedFiles();
          if (request.requestItems.length && request.requestItems[0].id) {
            await request.requestItems[0].getAttachedFiles(request.id || "");
          }
        }
      } else {
        if (hasPermission("REQUEST.ONLINE.CREATE") && !request.id) {
          //exit
        } else {
          await request!.createRequest();
        }
      }
      await this.setState({ step: 2 });
    } catch (e) {
      console.log(e);
    }
  };

  private onCreate = async () => {
    const { request, history, t, authStore } = this.props;
    try {
      if (request.checkTotalBudgetAllocationItems && request.requestBudget != '0.00') {
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
