import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { RequestFormConsiderationItem, RequestHeader } from ".";
import { IAppModel } from "../../../../AppModel";
import { BankAccount } from "../../../../components/project";
import { hasPermission } from "../../../../utils/render-by-permission";
import { Installment, InstallmentView } from "../../components";
import { IRequestModel } from "../RequestModel";

interface IRequestFormConsideration extends WithTranslation {
  request: IRequestModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class RequestFormConsideration extends React.Component<
  IRequestFormConsideration
> {
  public componentDidMount() {
    const { request } = this.props;
    if (!request.recieveBankAccountName) {
      request.setField({
        fieldname: "recieveBankAccountName",
        value: request.name
      });
    }
  }
  public render() {
    const { request, t } = this.props;
    return (
      <Segment padded basic>
        <RequestHeader request={request} hideBtn mode="view" />
        <RequestFormConsiderationItem
          label={t("module.loan.requestDetail.groupLeaderComments")}
          resultItem={request.result1}
          onUpdate={() => request.updateResultItem(1)}
          activeLoading={request.loadingResultItem1}
          formId="result_1"
          readOnly={
            !["QF", "AP1"].includes(request.status) &&
            !hasPermission("DATA.ALL.EDIT")
          }
          requestType={request.requestType}
          limitBudget={request.requestBudget}
        />
        <RequestFormConsiderationItem
          label={t("module.loan.requestDetail.subcommitteeResolution")}
          resultItem={request.result2}
          onUpdate={() => request.updateResultItem(2)}
          activeLoading={request.loadingResultItem2}
          readOnly={
            !["AP1", "AP2"].includes(request.status) &&
            !hasPermission("DATA.ALL.EDIT")
          }
          formId="result_2"
          requestType={request.requestType}
          limitBudget={`${request.result1.approveBudget}`}
        />
        <RequestFormConsiderationItem
          label={t(
            "module.loan.requestDetail.fundManagementCommitteeResolution"
          )}
          requestType={request.requestType}
          resultItem={request.result3}
          onUpdate={this.updateForm}
          activeLoading={request.loadingResultItem3}
          readOnly={
            !["AP2", "AP3"].includes(request.status) &&
            !hasPermission("DATA.ALL.EDIT")
          }
          formId="result_3"
          childrenEdit={this.renderAP3ChildEdit()}
          childrendView={this.renderAP3ChildView()}
          limitBudget={`${request.result2.approveBudget}`}
        />
      </Segment>
    );
  }
  private renderBankInfo() {
    const { request, t } = this.props;
    return (
      <BankAccount
        title={t("module.loan.requestDetail.loanAccountInformation")}
        fieldBankName="receiveBankName"
        valueBankName={request.receiveBankName}
        fieldBankAccountNo="recieveBankAccountNo"
        valueBankAccountNo={request.recieveBankAccountNo}
        fieldBankAccountName="recieveBankAccountName"
        valueBankAccountName={request.recieveBankAccountName}
        requiredFieldBankAccountName
        setField={request.setField}
      />
    );
  }
  private renderBankInfoView() {
    const { request, t } = this.props;
    return (
      <BankAccount
        viewMode
        title={t("module.loan.requestDetail.loanAccountInformation")}
        valueBankName={request.receiveBankName}
        valueBankAccountNo={request.recieveBankAccountNo}
        valueBankAccountName={request.recieveBankAccountName}
        setField={request.setField}
      />
    );
  }
  private renderInstallment() {
    const { request, t } = this.props;
    return (
      <Form.Field
        label={t("module.loan.requestDetail.loanRepayment")}
        width={16}
        control={Installment}
        loanAmount={
          request.result3.approveBudget !== 0
            ? request.result3.approveBudget
            : request.result2.approveBudget !== 0
            ? request.result2.approveBudget
            : request.result1.approveBudget !== 0
            ? request.result1.approveBudget
            : request.requestBudget
        }
        installmentAmount={request.installmentAmount}
        installmentPeriodValue={request.installmentPeriodValue}
        installmentTimes={request.installmentTimes}
        installmentPeriodDay={request.installmentPeriodDay}
        installmentFirstDate={request.installmentFirstDate}
        installmentLastDate={request.installmentLastDate}
        installmentLastAmount={request.installmentLastAmount}
        onChangeInputField={this.onChangeInputField}
        editMode={true}
      />
    );
  }
  private renderInstallmentView() {
    const { request, t } = this.props;
    return (
      <Form.Field
        label={t("module.loan.requestDetail.loanRepayment")}
        id={request.id}
        width={16}
        control={InstallmentView}
        installmentAmount={request.installmentAmount}
        installmentPeriodValue={request.installmentPeriodValue}
        installmentTimes={request.installmentTimes}
        installmentPeriodDay={request.installmentPeriodDay}
        installmentFirstDate={request.installmentFirstDate}
        installmentLastDate={request.installmentLastDate}
        installmentLastAmount={request.installmentLastAmount}
      />
    );
  }
  private renderAP3ChildView() {
    return (
      <React.Fragment>
        {this.renderInstallmentView()}
        {this.renderBankInfoView()}
      </React.Fragment>
    );
  }
  private renderAP3ChildEdit() {
    return (
      <React.Fragment>
        {this.renderInstallment()}
        {this.renderBankInfo()}
      </React.Fragment>
    );
  }

  private onChangeInputField = (fieldname: string, value: any) => {
    const { request } = this.props;
    request.setField({ fieldname, value });
  };

  private updateForm = async () => {
    const { request } = this.props;
    try {
      await request.updateRequestConsideration();
    } catch (e) {
      console.log(e);
    }
  };
}

export default withTranslation()(RequestFormConsideration);
