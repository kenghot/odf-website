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
    const { request, mode } = this.props;
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
          {hasPermission("REQUEST.ONLINE.CREATE") && mode == "editMode" ? <ClickLinkModal /> : null}
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
      if (hasPermission("REQUEST.ONLINE.CREATE")) {
        if (
          !request.requestItems[0].borrower.attachedFiles[0].file.filename
          || !request.requestItems[0].borrower.attachedFiles[1].file.filename
          || !request.requestItems[0].borrower.attachedFiles[6].file.filename
          || !request.requestItems[0].guarantor.attachedFiles[0].file.filename
          || !request.requestItems[0].guarantor.attachedFiles[1].file.filename
          || !request.requestItems[0].guarantor.attachedFiles[3].file.filename
        ) {
          const errorMessage = {
            code: "",
            name: "",
            message: "โปรดแนบเอกสารให้ครบและกดนำส่งเอกสาร",
            technical_stack: "",
          };
          request.error.setErrorMessage(errorMessage);
          throw errorMessage;
        }
      }
      if (request.id) {
        // console.log(request.borrower.attachedFiles)
        if (pathname === "/loan/request/create") {
          history.push(`/loan/request/edit/${request.id}/${request.requestType}`);
          if (hasPermission("REQUEST.ONLINE.CREATE") && request.id_card == authStore!.userProfile.username && request.status == "DFO") {
            // try {
            //   const smsApiUrl = `${process.env.REACT_APP_SMS_SERVICE_API}/odf_sms_api.php`;
            //   const result: any = await fetch(`${smsApiUrl}?msisdn=${authStore!.userProfile.telephone}&message=เอกสารแบบร่างคำร้องออนไลน์ ได้บันทึกและส่งไปยังระบบกองทุนผู้สูงอายุเรียบร้อยแล้ว`);
            //   const response: any = await result.json();
            //   if (response.QUEUE.Status == "0") {
            //     console.log("ส่ง SMS ไม่สำเร็จ โปรดตรวจสอบหมายเลขโทรศัพท์ หรือลองใหม่อีกครั้ง Error:" + response.QUEUE.Detail);
            //   } else {
            //     console.log("ส่ง SMS สำเร็จ");
            //   }
            // } catch (e) {
            //   console.log(e);
            //   throw e;
            // }
          }
          if (hasPermission("REQUEST.ONLINE.CREATE")) {
            request.setField({
              fieldname: "successRequestOnline",
              value: true
            });
          }
        } else {
          await request!.updateRequestAll();
          await request!.getRequestDetail();
          await request!.setRequestItemsAttachedFiles();
          if (request.requestItems.length && request.requestItems[0].id) {
            await request.requestItems[0].getAttachedFiles(request.id || "");
          }
          if (hasPermission("REQUEST.ONLINE.CREATE")) {
            request.setField({
              fieldname: "successRequestOnline",
              value: true
            });
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
      if (!request.checkTotalBudgetAllocationItems && request.requestBudget != '0.00') {
        if (request.id) {
          await request.updateRequesLoanDetails();
        } else {
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
