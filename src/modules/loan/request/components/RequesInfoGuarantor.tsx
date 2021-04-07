import { observer } from "mobx-react";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { AddressBody } from "../../../../components/address";
import { FormDisplay } from "../../../../components/common";
import { ProfileInfoCard } from "../../../share/profile/components";
import {
  MarriageStatusType,
  OccupationInfoForm,
  RegistedAddressCurrentType,
  RegistedAddressType,
  RelationshipType,
  ResidenceStatusType,
  ResidenceType
} from "../../components";
import { IRequestItemModel } from "../RequestModel";

interface IRequesInfoGuarantor extends WithTranslation {
  requestItems: IRequestItemModel;
}

@observer
class RequesInfoGuarantor extends React.Component<IRequesInfoGuarantor> {
  public render() {
    const { requestItems, t } = this.props;
    return (
      <Segment padded style={styles.bg}>
        <ProfileInfoCard profile={requestItems.guarantor} noSegment />
        <Form.Field
          label={t("module.loan.agreementDetail.addressPerIDCard")}
          width={16}
          control={AddressBody}
          addressStore={requestItems.guarantor.idCardAddress}
        />
        <Form.Field
          label={t("module.loan.agreementDetail.status")}
          width={16}
          control={MarriageStatusType}
          inputFieldMarriageStatus="marriageStatus"
          valueFieldMarriageStatus={requestItems.guarantor.marriageStatus}
          readOnly
        />
        <Form.Field
          label={t("module.loan.agreementFormCreate.houseAddress")}
          width={16}
          control={RegistedAddressType}
          inputFieldAddressType="registeredAddressType"
          valueFieldAddressType={requestItems.guarantor.registeredAddressType}
          readOnly
        />
        {requestItems.guarantor.registeredAddressType === 99 ? (
          <Form.Field
            label={t(
              "module.loan.agreementDetail.addressDetailsAccordingToHouseRegistration"
            )}
            width={16}
            control={AddressBody}
            addressStore={requestItems.guarantor.registeredAddress}
          />
        ) : null}
        <Form.Field
          label={t("module.loan.agreementDetail.currentAddress")}
          width={16}
          control={RegistedAddressCurrentType}
          inputFieldCurrentAddressType="currentAddressType"
          valueFieldCurrentAddressType={
            requestItems.guarantor.currentAddressType
          }
          address={requestItems.guarantor.currentAddress}
          readOnly
        />
        {requestItems.guarantor.currentAddressType === 99 ? (
          <Form.Field
            label={t("module.loan.agreementDetail.currentAddressDetails")}
            width={16}
            control={AddressBody}
            addressStore={requestItems.guarantor.currentAddress}
          />
        ) : null}

        <Form.Field
          label={t("module.loan.agreementDetail.housingtType")}
          width={16}
          control={ResidenceType}
          inputFieldResidenceType="residenceType"
          valueFieldResidenceType={requestItems.guarantor.residenceType}
          inputFieldDescription="residenceTypeDescription"
          valueFieldDescription={
            requestItems.guarantor.residenceTypeDescription
          }
          readOnly
        />
        <Form.Field
          label={t("module.loan.agreementDetail.livingStatus")}
          width={16}
          control={ResidenceStatusType}
          id={"reques-info-guarantor-residence-status-type"}
          inputFieldStatusType="residenceStatusType"
          valueFieldStatusType={requestItems.guarantor.residenceStatusType}
          inputFieldDescription="residenceStatusTypeDescription"
          valueFieldDescription={
            requestItems.guarantor.residenceStatusTypeDescription
          }
          valueFieldAddressType={requestItems.guarantor.registeredAddressType}
          readOnly
        />
        <Form.Field
          label={t("module.loan.agreementDetail.relationsWithBorrowers")}
          width={16}
          control={RelationshipType}
          inputFieldRelationshipType="guarantorBorrowerRelationship"
          valueFieldRelationshipType={
            requestItems.guarantorBorrowerRelationship
          }
          readOnly
        />
        <Form.Field
          label={t("module.loan.components.occupation")}
          width={16}
          control={OccupationInfoForm}
          occupation={requestItems.guarantor.occupation}
          inputFieldCompanyName="guarantorCompanyName"
          inputFieldPosition="guarantorPosition"
          valueFieldCompanyName={requestItems.guarantorCompanyName}
          valueFieldPosition={requestItems.guarantorPosition}
          readOnly
        />
        <Form.Field
          label={t("module.loan.agreementDetail.companyAddress")}
          width={16}
          control={AddressBody}
          addressStore={requestItems.guarantorCompanyAddress}
        />
        <FormDisplay
          title={t("module.loan.agreementDetail.officePhoneNumber")}
          value={requestItems.guarantorCompanyTelephone}
        />
        <FormDisplay
          title={t("module.loan.agreementFormCreate.telephoneNumber")}
          value={requestItems.guarantor.telephone}
        />
        <FormDisplay
          title={t("module.loan.agreementDetail.mobilePhoneNumber")}
          value={requestItems.guarantor.mobilePhone}
        />
      </Segment>
    );
  }
}
const styles: any = {
  bg: {
    backgroundColor: "rgba(242, 113, 28,0.3)"
  }
};

export default withTranslation()(RequesInfoGuarantor);
