import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button, Form } from "semantic-ui-react";
import {
  GuaranteeBorrowerGuarantorList,
  GuaranteeFormLoanDetails,
  GuaranteeLoanDetails
} from ".";
import { ILocationModel } from "../../../../components/address/LocationModel";
import { DateInput } from "../../../../components/common/input";
import { PermissionControl } from "../../../../components/permission";
import { hasPermission } from "../../../../utils/render-by-permission";
import { AddressFormShort, SignerForm, WitnessForm } from "../../components";
import { RequestDDL } from "../../request/components";
import { IRequestListModel } from "../../request/RequestListModel";
import { IRequestModel } from "../../request/RequestModel";
import { IGuaranteeModel } from "../GuaranteeModel";

interface IGuaranteeFormBody extends WithTranslation {
  guarantee: IGuaranteeModel;
  locationStore: ILocationModel;
  requestList: IRequestListModel;
  request: IRequestModel;
}
@observer
class GuaranteeFormBody extends React.Component<IGuaranteeFormBody> {
  public render() {
    const { t, guarantee, requestList, locationStore } = this.props;
    return (
      <React.Fragment>
        {this.renderGroupName()}
        <PermissionControl codes={["GUANRANTEE.EDIT.REQUEST"]}>
          <Form.Group widths="equal">
            <Form.Field
              label={t(
                "module.loan.guaranteeFormCreate.ReferenceRequestNumber"
              )}
              placeholder={t(
                "module.loan.guaranteeFormCreate.pleaseSelectRequestForm"
              )}
              control={RequestDDL}
              value={guarantee.requestId}
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
              {t("module.loan.guaranteeFormCreate.retrieveRequest")}
            </Form.Button>
          </Form.Group>
        </PermissionControl>

        <Form.Group widths="equal">
          {guarantee.id ? (
            <Form.Field
              label={t("module.loan.guaranteeDetail.contractDate")}
              control={DateInput}
              value={guarantee.documentDate || undefined}
              fieldName="documentDate"
              onChangeInputField={this.onChangeInputField}
              id={"guarantee_documentDate"}
            />
          ) : null}
          <Form.Field
            label={t("module.loan.guaranteeDetail.startDate")}
            control={DateInput}
            value={guarantee.startDate || undefined}
            id={"guarantee_startDate"}
            fieldName="startDate"
            onChangeInputField={this.onChangeInputField}
          />

          <Form.Field
            label={t("module.loan.guaranteeDetail.contractEndDate")}
            control={DateInput}
            value={guarantee.endDate || undefined}
            fieldName="endDate"
            id={"guarantee_endDate"}
            onChangeInputField={this.onChangeInputField}
          />
        </Form.Group>
        <Form.Input
          fluid
          label={t("module.loan.guaranteeFormCreate.letterGuaranteeLocation")}
          placeholder={t(
            "module.loan.guaranteeFormCreate.pleaseSelectLocationContract"
          )}
          onChange={(event: any, data: any) =>
            guarantee.setField({
              fieldname: "signLocation",
              value: data.value
            })
          }
          value={guarantee.signLocation}
        />
        <Form.Field
          label={t("module.loan.guaranteeFormCreate.addressLetterGuarantee")}
          width={16}
          control={AddressFormShort}
          addressStore={guarantee.signLocationAddress}
          locationStore={locationStore}
        />
        <Form.Field
          label={t("module.loan.agreementFormCreate.authorizedPerson")}
          width={16}
          control={SignerForm}
          agreementAuthorizedTitle={guarantee.agreementAuthorizedTitle}
          agreementAuthorizedFirstname={guarantee.agreementAuthorizedFirstname}
          agreementAuthorizedLastname={guarantee.agreementAuthorizedLastname}
          agreementAuthorizedPosition={guarantee.agreementAuthorizedPosition}
          agreementAuthorizedCommandNo={guarantee.agreementAuthorizedCommandNo}
          agreementAuthorizedCommandDate={
            guarantee.agreementAuthorizedCommandDate
          }
          onChangeInputField={this.onChangeInputField}
        />
        <Form.Field
          label={t("module.loan.agreementFormCreate.witness")}
          width={16}
          control={WitnessForm}
          witness1={guarantee.witness1}
          witness2={guarantee.witness2}
          onChangeInputField={this.onChangeInputField}
        />

        <GuaranteeBorrowerGuarantorList guarantee={guarantee} mode="editMode" />
        <Form.Field
          label={t("module.loan.guaranteeDetail.loanDetails")}
          width={16}
          control={
            hasPermission("GUANRANTEE.EDIT.AGREEMENT")
              ? GuaranteeFormLoanDetails
              : GuaranteeLoanDetails
          }
          guarantee={guarantee}
        />
        {["NW"].includes(guarantee.status) ||
        hasPermission("DATA.ALL.EDIT") ||
        !guarantee.id
          ? this.renderButton()
          : null}
      </React.Fragment>
    );
  }
  private renderButton() {
    const { guarantee, t } = this.props;
    return (
      <div style={styles.buttonRow}>
        {guarantee.id ? (
          <Link
            to={`/loan/guarantee/view/${guarantee.id}/${guarantee.documentNumber}`}
          >
            <Button color="grey" floated="left" basic>
              {t("module.loan.guaranteeDetail.cancelEditing")}
            </Button>
          </Link>
        ) : null}

        {
          <Button color="blue" floated="right" type="submit">
            {guarantee.id
              ? t("module.loan.guaranteeDetail.save")
              : t("module.loan.guaranteeDetail.createLoanGuaranteeAgreement")}
          </Button>
        }
      </div>
    );
  }
  private renderGroupName() {
    const { t, guarantee } = this.props;
    return guarantee.guaranteeType === "G" ? (
      <Form.Input
        fluid
        label={t("module.loan.searchForm.groupName")}
        placeholder={t("module.loan.searchForm.specifyGroupName")}
        onChange={(event: any, data: any) =>
          guarantee.setField({
            fieldname: "name",
            value: data.value
          })
        }
        value={guarantee.name}
      />
    ) : null;
  }
  private onRetrieveRequestInfo = async () => {
    const { guarantee, request } = this.props;
    try {
      if (guarantee.requestId) {
        guarantee.setField({ fieldname: "loading", value: true });

        await request.setField({
          fieldname: "id",
          value: guarantee.requestId
        });
        await guarantee.retrieveRequestData();
      }
    } catch (e) {
      guarantee.error.setErrorMessage(e);
    } finally {
      guarantee.setField({ fieldname: "loading", value: false });
    }
  };
  private onChangeRequestDDL = async (value: string) => {
    const { guarantee } = this.props;
    guarantee.setField({ fieldname: "requestId", value });
    await this.onRetrieveRequestInfo();
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { guarantee } = this.props;
    guarantee.setField({ fieldname, value });
  };
}

const styles: any = {
  formButton: {
    marginTop: 23
  },
  buttom: {
    marginTop: 23
  },
  buttonRow: {
    paddingTop: 25,
    display: "flow-root"
  }
};

export default withTranslation()(GuaranteeFormBody);
