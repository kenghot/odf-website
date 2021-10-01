import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form } from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import { DateInput, FormDisplay } from "../../../../components/common";
import { OrganizationDDL } from "../../../admin/organization/components";
import { OrgListModel } from "../../../admin/organization/OrgListModel";
import { IRequestModel } from "../RequestModel";
import { hasPermission } from "../../../../utils/render-by-permission";
import { date_display_CE_TO_BE } from "../../../../utils";
import { IAuthModel } from "../../../../modules/auth/AuthModel";

interface IRequesFormHeader extends WithTranslation {
  request: IRequestModel;
  appStore?: IAppModel;
  authStore?: IAuthModel;
}

@inject("appStore", "authStore")
@observer
class RequesFormHeader extends React.Component<IRequesFormHeader> {
  private orgList = OrgListModel.create({});
  public render() {
    const { t, request, appStore, authStore } = this.props;
    if (hasPermission("REQUEST.ONLINE.CREATE")) {
      try {
        request.setField({
          fieldname: "organizationId",
          value: authStore!.userProfile.organization.id ? authStore!.userProfile.organization.id : null
        })
      } catch {

      }
      return (
        <Form.Group widths="equal">
          <FormDisplay
            title={t("module.loan.agreementCardInfo.byOrganization")}
            value={authStore!.userProfile.organization.orgName || "-"}
            width={8}
          />
          <FormDisplay
            title={t("module.loan.requestDetail.dateRequestReceived")}
            value={date_display_CE_TO_BE(request.documentDate) || "-"}
            width={4}
          />
          <FormDisplay
            title={t("module.loan.agreementCardInfo.category")}
            value={
              appStore!.enumItemLabel("loanType", request.requestType) ||
              "-"
            }
            width={3}
          />
        </Form.Group>
      );
    } else {
      return (
        <Form.Group widths="equal">
          <Form.Field
            required
            label={t("module.loan.agreementFormCreate.byOrganization")}
            placeholder={t(
              "module.loan.agreementFormCreate.pleaseSelectOrganization"
            )}
            control={OrganizationDDL}
            value={request.organizationId}
            orgList={this.orgList}
            onChange={this.onChangeOrganizationDDL}
          />
          <Form.Field
            required
            label={t("module.loan.requestDetail.dateRequestReceived")}
            control={DateInput}
            value={request.documentDate}
            fieldName="documentDate"
            onChangeInputField={this.onChangeInputField}
            id="req_docuemntDate"
          />
          <Form.Select
            required
            search
            fluid
            label={t("module.loan.agreementFormCreate.category")}
            placeholder={t(
              "module.loan.agreementFormCreate.pleaseSelectCategory"
            )}
            options={appStore!.enumItems("loanType")}
            onChange={(event, data) =>
              this.onChangeInputFieldRequestType("requestType", data.value)
            }
            value={request.requestType}
          />
        </Form.Group>
      );
    }

  }
  private onChangeInputFieldRequestType = (fieldname: string, value: any) => {
    const { request } = this.props;
    request.setField({ fieldname, value });
    if (request.requestType === "P") {
      request.setRequestItemPersonType();
    }
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { request } = this.props;
    request.setField({ fieldname, value });
  };
  private onChangeOrganizationDDL = (value: string) => {
    const { request } = this.props;
    request.setField({ fieldname: "organizationId", value });
  };
}

export default withTranslation()(RequesFormHeader);
