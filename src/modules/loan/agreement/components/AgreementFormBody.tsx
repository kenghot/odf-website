import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Button, Form, Header, Modal, Segment } from "semantic-ui-react";
import { AgreementFormBorrowerGuarantorList } from ".";
import { ILocationModel } from "../../../../components/address/LocationModel";
import { FormDisplay } from "../../../../components/common";
import { ListBlock } from "../../../../components/common/block";
import { DateInput } from "../../../../components/common/input";
import { Loading } from "../../../../components/common/loading";
import { PermissionControl } from "../../../../components/permission";
import { date_display_CE_TO_BE } from "../../../../utils";
import { hasPermission } from "../../../../utils/render-by-permission";
import {
  AddressFormShort,
  Installment,
  LoanDetails,
  SignerForm
} from "../../components";
import WitnessForm from "../../components/WitnessForm";
import { GuaranteeModel } from "../../guarantee/GuaranteeModel";
import { RequestDDL } from "../../request/components";
import { IRequestListModel } from "../../request/RequestListModel";
import { IAgreementModel } from "../AgreementModel";

interface IAgreementFormBody extends WithTranslation, RouteComponentProps {
  agreement: IAgreementModel;
  locationStore: ILocationModel;
  requestList: IRequestListModel;
}
@observer
class AgreementFormBody extends React.Component<IAgreementFormBody> {
  public state = { open: false };
  public close = () => {
    this.setState({ open: false });
  };
  public open = () => {
    this.setState({ open: true });
  };
  public render() {
    const { t, agreement, requestList, locationStore } = this.props;
    return (
      <React.Fragment>
        {this.renderReferenceDocument()}
        <PermissionControl codes={["AGREEMENT.EDIT.REQUEST"]}>
          <Form.Group widths="equal">
            <Form.Field
              label={t(
                "module.loan.agreementFormCreate.ReferenceRequestNumber"
              )}
              placeholder={t(
                "module.loan.agreementFormCreate.pleaseSelectRequestForm"
              )}
              control={RequestDDL}
              value={agreement.requestId}
              requestList={requestList}
              onChange={this.onChangeRequestDDL}
            />
            <Form.Button
              width={6}
              type="button"
              fluid
              floated="right"
              color="teal"
              style={styles.formButton}
              onClick={this.onRetrieveRequestInfo}
            >
              {t("module.loan.agreementFormCreate.retrieveRequest")}
            </Form.Button>
          </Form.Group>
        </PermissionControl>
        <Form.Group widths="equal">
          {agreement.id ? (
            <Form.Field
              label={t("module.loan.agreementDetail.contractDate")}
              control={DateInput}
              id={"documentDate"}
              value={agreement.documentDate || undefined}
              fieldName="documentDate"
              onChangeInputField={this.onChangeInputField}
            />
          ) : null}

          <Form.Field
            label={t("module.loan.agreementDetail.startDate")}
            control={DateInput}
            id={"startDate"}
            value={agreement.startDate || undefined}
            fieldName="startDate"
            onChangeInputField={this.onChangeInputField}
          />

          <Form.Field
            label={t("module.loan.agreementDetail.contractEndDate")}
            control={DateInput}
            id={"endDate"}
            value={agreement.endDate || undefined}
            fieldName="endDate"
            onChangeInputField={this.onChangeInputField}
          />
        </Form.Group>
        <Form.Input
          fluid
          label={t("module.loan.agreementFormCreate.contractingLocation")}
          placeholder={t(
            "module.loan.agreementFormCreate.pleaseSelectLocationContract"
          )}
          onChange={(event: any, data: any) =>
            agreement.setField({
              fieldname: "signLocation",
              value: data.value
            })
          }
          value={agreement.signLocation}
        />
        <Form.Field
          label={t("module.loan.agreementFormCreate.contractingAddress")}
          width={16}
          control={AddressFormShort}
          addressStore={agreement.signLocationAddress}
          locationStore={locationStore}
        />
        <Form.Field
          label={t("module.loan.agreementFormCreate.authorizedPerson")}
          width={16}
          control={SignerForm}
          agreementAuthorizedTitle={agreement.agreementAuthorizedTitle}
          agreementAuthorizedFirstname={agreement.agreementAuthorizedFirstname}
          agreementAuthorizedLastname={agreement.agreementAuthorizedLastname}
          agreementAuthorizedPosition={agreement.agreementAuthorizedPosition}
          agreementAuthorizedCommandNo={agreement.agreementAuthorizedCommandNo}
          agreementAuthorizedCommandDate={
            agreement.agreementAuthorizedCommandDate
          }
          onChangeInputField={this.onChangeInputField}
        />
        <Form.Field
          label={t("module.loan.agreementFormCreate.witness")}
          width={16}
          control={WitnessForm}
          witness1={agreement.witness1}
          witness2={agreement.witness2}
          onChangeInputField={this.onChangeInputField}
        />
        <AgreementFormBorrowerGuarantorList
          agreement={agreement}
          mode="editMode"
        />
        <Form.Field>
          <label>
            {t(
              "module.loan.agreementDetail.informationAboutLoanGuaranteesSpecifiedContract"
            )}
          </label>
          <Segment padded>
            <FormDisplay
              title={t("module.loan.agreementDetail.documentNumberGuarantee")}
              value={agreement.guaranteeDocumentNumber || "-"}
            />
            <FormDisplay
              title={t("module.loan.agreementDetail.dateGuaranteeContract")}
              value={
                date_display_CE_TO_BE(agreement.guaranteeDocumentDate) || "-"
              }
            />
          </Segment>
        </Form.Field>

        <Form.Field
          label={t("module.loan.agreementDetail.loanDetails")}
          width={16}
          control={LoanDetails}
          loanAmount={agreement.loanAmount}
          loanDurationYear={agreement.loanDurationYear}
          loanDurationMonth={agreement.loanDurationMonth}
          onChangeInputField={this.onChangeInputField}
          editMode={true}
        />
        <Form.Input
          fluid
          label={t("module.loan.agreementDetail.contractedPaymentLocation")}
          placeholder={t(
            "module.loan.agreementDetail.pleaseSpecifyPlacePaymentAccordingContract"
          )}
          onChange={(event: any, data: any) =>
            agreement.setField({
              fieldname: "loanPaymentLocation",
              value: data.value
            })
          }
          value={agreement.loanPaymentLocation}
        />

        <Form.Field
          label={t("module.loan.agreementDetail.loanRepayment")}
          width={16}
          id={agreement.id}
          control={Installment}
          loanAmount={agreement.loanAmount}
          installmentAmount={agreement.installmentAmount}
          installmentPeriodValue={agreement.installmentPeriodValue}
          installmentTimes={agreement.installmentTimes}
          installmentPeriodDay={agreement.installmentPeriodDay}
          installmentFirstDate={agreement.installmentFirstDate}
          installmentLastDate={agreement.installmentLastDate}
          installmentLastAmount={agreement.installmentLastAmount}
          onChangeInputField={this.onChangeInputField}
          editMode={true}
        />

        {["NW"].includes(agreement.status) ||
          hasPermission("DATA.ALL.EDIT") ||
          !agreement.id
          ? this.renderSaveButton()
          : null}
      </React.Fragment>
    );
  }
  private renderSaveButton() {
    const { agreement, t } = this.props;
    return (
      <div style={styles.buttonRow}>
        {agreement.id ? (
          <Link
            to={`/loan/agreement/view/${agreement.id}/${agreement.documentNumber}`}
          >
            <Button color="grey" floated="left" basic>
              {t("module.loan.agreementDetail.cancelEditing")}
            </Button>
          </Link>
        ) : null}

        <Button color="blue" floated="right" type="submit">
          {agreement.id
            ? t("module.loan.agreementDetail.save")
            : t("module.loan.agreementDetail.createAgreement")}
        </Button>
      </div>
    );
  }
  private renderReferenceDocument() {
    const { agreement, t } = this.props;
    const list = [];
    if (agreement.request && agreement.request.id) {
      list.push({
        title: t("module.loan.agreementDetail.referenceDocument"),
        description: agreement.request.documentNumber,
        url: `/loan/request/view/${agreement.request.id}/${agreement.request.documentNumber}`
      });
    }
    if (agreement.id && hasPermission("AGREEMENT.VIEW")) {
      list.push({
        title: t(
          "module.loan.agreementDetail.referenceNumberOfTheContractOfGuarantee"
        ),
        description: agreement.guaranteeId
          ? agreement.guaranteeDocumentNumber
          : "-",
        url: agreement.guaranteeId
          ? `/loan/guarantee/view/${agreement.guaranteeId}/${agreement.guaranteeDocumentNumber}`
          : "",
        children: agreement.guaranteeId
          ? this.onRenderModal()
          : this.onRenderButton()
      });
    }
    return list.length > 0 ? <ListBlock list={list} /> : null;
  }
  private onRetrieveRequestInfo = async () => {
    const { agreement } = this.props;
    try {
      if (agreement.requestId) {
        agreement.setField({ fieldname: "loading", value: true });
        await agreement.retrieveRequestData();
      }
    } catch (e) {
      agreement.error.setErrorMessage(e);
    } finally {
      agreement.setField({ fieldname: "loading", value: false });
    }
  };

  private onRenderButton() {
    const { t } = this.props;
    return hasPermission("AGREEMENT.GENERATE.GUARANTEE") ? (
      <Button
        type="button"
        floated="right"
        color="blue"
        onClick={this.onCreateGuarantee}
      >
        {t("module.loan.agreementDetail.createGuarantee")}
      </Button>
    ) : null;
  }

  private onRenderModal() {
    const { t, agreement } = this.props;
    const { open } = this.state;
    return hasPermission("AGREEMENT.GENERATE.GUARANTEE") ? (
      <Modal
        trigger={
          <Button type="button" floated="right" color="blue">
            {t("module.loan.agreementDetail.changeAgreement")}
          </Button>
        }
        size="tiny"
        onOpen={this.open}
        open={open}
        onClose={this.close}
      >
        <Header
          icon="exchange"
          content={t(
            "module.loan.agreementDetail.pleaseConfirmChangeGuarantee"
          )}
        />
        <Modal.Content>
          <Loading active={agreement.loading} />
          <p>
            {t(
              "module.loan.agreementDetail.changingNewGuaranteeAgreementSystemCncelContract"
            )}
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.close}>
            {t("module.loan.agreementDetail.cancel")}
          </Button>
          <Button color="blue" onClick={this.onCreateGuarantee}>
            {t("module.loan.agreementDetail.confirm")}
          </Button>
        </Modal.Actions>
      </Modal>
    ) : null;
  }

  private onCreateGuarantee = async () => {
    const { agreement, history } = this.props;
    const guarantee = GuaranteeModel.create({ agreementId: agreement.id });
    try {
      agreement.setField({ fieldname: "loading", value: true });
      await guarantee.createGuaranteeByAgreement();
      if (guarantee.id) {
        history.push(
          `/loan/guarantee/edit/${guarantee.id}/${guarantee.documentNumber}`
        );
      }
    } catch (e) {
      this.close();
      agreement.error.setField({ fieldname: "tigger", value: true });
      agreement.error.setField({ fieldname: "code", value: e.code });
      agreement.error.setField({ fieldname: "title", value: e.name });
      agreement.error.setField({ fieldname: "message", value: e.message });
      agreement.error.setField({
        fieldname: "technical_stack",
        value: e.technical_stack
      });
      console.log(e);
    } finally {
      agreement.setField({ fieldname: "loading", value: false });
    }
  };
  private onChangeRequestDDL = async (value: string) => {
    const { agreement } = this.props;
    agreement.setField({ fieldname: "requestId", value });
    await this.onRetrieveRequestInfo();
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { agreement } = this.props;
    agreement.setField({ fieldname, value });
  };
}

const styles: any = {
  formButton: {
    marginTop: 23
  },
  buttonRow: {
    paddingTop: 25,
    display: "flow-root"
  }
};

export default withRouter(withTranslation()(AgreementFormBody));
