import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form, Header, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import { ILocationModel } from "../../../../components/address/LocationModel";
import { DateInput } from "../../../../components/common/input";
import { OrganizationDDL } from "../../../admin/organization/components";
import { IOrgListModel } from "../../../admin/organization/OrgListModel";
import { IRequestListModel } from "../../request/RequestListModel";
import { IRequestModel } from "../../request/RequestModel";
import { IGuaranteeModel } from "../GuaranteeModel";
import GuaranteeFormBody from "./GuaranteeFormBody";

interface IGuaranteeFormCreate extends WithTranslation, RouteComponentProps {
  guarantee: IGuaranteeModel;
  locationStore: ILocationModel;
  orgList: IOrgListModel;
  requestList: IRequestListModel;
  request: IRequestModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class GuaranteeFormCreate extends React.Component<IGuaranteeFormCreate> {
  public render() {
    const {
      t,
      guarantee,
      appStore,
      orgList,
      locationStore,
      requestList,
      request
    } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t("module.loan.guaranteeFormCreate.createLetterGuarantee")}
          style={styles.header}
        />
        <Form onSubmit={this.createForm}>
          <Form.Group widths="equal">
            <Form.Field
              label={t("module.loan.guaranteeFormCreate.byOrganization")}
              placeholder={t(
                "module.loan.guaranteeFormCreate.pleaseSelectOrganization"
              )}
              control={OrganizationDDL}
              value={guarantee.organizationId}
              orgList={orgList}
              onChange={this.onChangeOrganizationDDL}
            />
            <Form.Field
              required
              label={t("module.loan.guaranteeFormCreate.contractDate")}
              control={DateInput}
              value={guarantee.documentDate}
              fieldName="documentDate"
              onChangeInputField={(fieldname: string, value: any) => {
                guarantee!.setField({ fieldname, value });
              }}
              id="guarantee_documentDate"
            />
            <Form.Select
              search
              fluid
              label={t("module.loan.guaranteeFormCreate.category")}
              placeholder={t(
                "module.loan.guaranteeFormCreate.pleaseSelectCategory"
              )}
              options={appStore!.enumItems("loanType")}
              onChange={(event, data) => {
                this.onChangeGuaranteeType(data.value);
              }}
              value={guarantee.guaranteeType}
            />
          </Form.Group>
          <GuaranteeFormBody
            guarantee={guarantee}
            locationStore={locationStore}
            requestList={requestList}
            request={request}
          />
        </Form>
      </Segment>
    );
  }

  private createForm = async () => {
    const { guarantee, history } = this.props;
    try {
      await guarantee.createGuarantee();
      if (guarantee.id) {
        history.push(
          `/loan/guarantee/view/${guarantee.id}/${guarantee.documentNumber}`
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  private onChangeGuaranteeType = (selectedValue: any) => {
    const { guarantee } = this.props;
    guarantee.setField({ fieldname: "guaranteeType", value: selectedValue });
  };
  private onChangeOrganizationDDL = async (value: string) => {
    const { guarantee, orgList, locationStore } = this.props;
    guarantee.setField({ fieldname: "organizationId", value });
    const org = orgList.list.find(function(element) {
      return element.id === value;
    });
    if (org) {
      await guarantee.setField({
        fieldname: "signLocation",
        value: org.orgName
      });
      await guarantee.setField({
        fieldname: "agreementAuthorizedTitle",
        value: org.agreementAuthorizedTitle
      });
      await guarantee.setField({
        fieldname: "agreementAuthorizedFirstname",
        value: org.agreementAuthorizedFirstname
      });
      await guarantee.setField({
        fieldname: "agreementAuthorizedLastname",
        value: org.agreementAuthorizedLastname
      });
      await guarantee.setField({
        fieldname: "agreementAuthorizedPosition",
        value: org.agreementAuthorizedPosition
      });
      await guarantee.setField({
        fieldname: "agreementAuthorizedCommandNo",
        value: org.agreementAuthorizedCommandNo
      });
      await guarantee.setField({
        fieldname: "agreementAuthorizedCommandDate",
        value: org.agreementAuthorizedCommandDate
      });
      await guarantee.setField({
        fieldname: "witness1",
        value: org.witness1
      });
      await guarantee.setField({
        fieldname: "witness2",
        value: org.witness2
      });
      await guarantee.signLocationAddress.setAllField(org.address);
      await locationStore.loadSubdistrict(
        guarantee.signLocationAddress.subDistrict
      );
      await locationStore.loadDistrict(guarantee.signLocationAddress.district);
      await locationStore.loadProvince(guarantee.signLocationAddress.province);
    }
  };
}

const styles: any = {
  header: {
    marginBottom: 28
  },
  buttom: {
    marginTop: 23
  }
};

export default withRouter(withTranslation()(GuaranteeFormCreate));
