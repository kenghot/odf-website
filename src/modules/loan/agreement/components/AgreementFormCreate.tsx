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
import { IAgreementModel } from "../AgreementModel";
import AgreementFormBody from "./AgreementFormBody";

interface IAgreementFormCreate extends WithTranslation, RouteComponentProps {
  agreement: IAgreementModel;
  appStore?: IAppModel;
  locationStore: ILocationModel;
  requestList: IRequestListModel;
  orgList: IOrgListModel;
}

@inject("appStore")
@observer
class AgreementFormCreate extends React.Component<IAgreementFormCreate> {
  public render() {
    const {
      t,
      agreement,
      appStore,
      requestList,
      locationStore,
      orgList
    } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t("module.loan.agreementFormCreate.createContract")}
          style={styles.header}
        />
        <Form onSubmit={this.createForm}>
          <Form.Group widths="equal">
            <Form.Field
              label={t("module.loan.agreementFormCreate.byOrganization")}
              placeholder={t(
                "module.loan.agreementFormCreate.pleaseSelectOrganization"
              )}
              control={OrganizationDDL}
              value={agreement.organizationId}
              orgList={orgList}
              onChange={this.onChangeOrganizationDDL}
            />
            <Form.Field
              label={t("module.loan.agreementFormCreate.contractDate")}
              control={DateInput}
              value={agreement.documentDate || undefined}
              fieldName="documentDate"
              onChangeInputField={(fieldname: string, value: any) => {
                agreement!.setField({ fieldname, value });
              }}
              id="agreement_documentDate"
            />

            <Form.Select
              search
              fluid
              label={t("module.loan.agreementFormCreate.category")}
              placeholder={t(
                "module.loan.agreementFormCreate.pleaseSelectCategory"
              )}
              options={appStore!.enumItems("loanType")}
              onChange={(event, data) => {
                this.onChangeAgreementType(data.value);
              }}
              value={agreement.agreementType}
            />
          </Form.Group>
          <AgreementFormBody
            agreement={agreement}
            locationStore={locationStore}
            requestList={requestList}
          />
        </Form>
      </Segment>
    );
  }

  // private renderGroupName() {
  //   const { t, agreement } = this.props;
  //   switch (agreement.agreementType) {
  //     case "G":
  //       return (
  //         <Form.Input
  //           fluid
  //           label={t("module.loan.searchForm.groupName")}
  //           placeholder={t("module.loan.searchForm.specifyGroupName")}
  //           onChange={(event: any, data: any) =>
  //             agreement!.setField({
  //               fieldname: "name",
  //               value: data.value
  //             })
  //           }
  //           value={agreement.name}
  //         />
  //       );
  //     default:
  //       return null;
  //   }
  // }

  private createForm = async () => {
    const { agreement, history } = this.props;
    try {
      await agreement!.createAgreement();
      if (agreement.id && agreement.documentNumber) {
        history.push(
          `/loan/agreement/view/${agreement.id}/${agreement.documentNumber}`
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  // private onRetrieveRequestInfo = async () => {
  //   const { agreement } = this.props;
  //   try {
  //     if (agreement.requestId) {
  //       agreement.retrieveRequestData();
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  private onChangeAgreementType = (selectedValue: any) => {
    const { agreement } = this.props;
    agreement.setField({ fieldname: "agreementType", value: selectedValue });
  };
  private onChangeOrganizationDDL = async (value: string) => {
    const { agreement, orgList, locationStore } = this.props;
    agreement.setField({ fieldname: "organizationId", value });
    const org = orgList.list.find(function(element) {
      return element.id === value;
    });
    if (org) {
      await agreement.setField({
        fieldname: "signLocation",
        value: org.orgName
      });
      await agreement.signLocationAddress.setAllField(org.address);
      await agreement.setField({
        fieldname: "agreementAuthorizedTitle",
        value: org.agreementAuthorizedTitle
      });
      await agreement.setField({
        fieldname: "agreementAuthorizedFirstname",
        value: org.agreementAuthorizedFirstname
      });
      await agreement.setField({
        fieldname: "agreementAuthorizedLastname",
        value: org.agreementAuthorizedLastname
      });
      await agreement.setField({
        fieldname: "agreementAuthorizedPosition",
        value: org.agreementAuthorizedPosition
      });
      await agreement.setField({
        fieldname: "agreementAuthorizedCommandNo",
        value: org.agreementAuthorizedCommandNo
      });
      await agreement.setField({
        fieldname: "agreementAuthorizedCommandDate",
        value: org.agreementAuthorizedCommandDate
      });
      await agreement.setField({
        fieldname: "witness1",
        value: org.witness1
      });
      await agreement.setField({
        fieldname: "witness2",
        value: org.witness2
      });
      await locationStore.loadSubdistrict(
        this.props.agreement.signLocationAddress.subDistrict
      );
      await locationStore.loadDistrict(
        this.props.agreement.signLocationAddress.district
      );
      await locationStore.loadProvince(
        this.props.agreement.signLocationAddress.province
      );
    }
  };
  // private onChangeRequestDDL = (value: string) => {
  //   const { agreement } = this.props;
  //   agreement!.setField({ fieldname: "requestId", value });
  // };
}

const styles: any = {
  header: {
    marginBottom: 28
  },
  buttom: {
    marginTop: 23
  },
  container: {
    marginBottom: 7
  }
};

export default withRouter(withTranslation()(AgreementFormCreate));
