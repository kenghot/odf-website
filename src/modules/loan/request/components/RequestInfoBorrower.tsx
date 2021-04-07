import { observer } from "mobx-react";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { AddressBody } from "../../../../components/address";
import { FormDisplay } from "../../../../components/common";
import { ProfileInfoCard } from "../../../share/profile/components";
import {
  CurrentOccupationType,
  MarriageStatusType,
  RegistedAddressCurrentType,
  RegistedAddressType,
  ResidenceStatusType,
  ResidenceType
} from "../../components";
import { IRequestItemModel } from "../RequestModel";

interface IRequestInfoBorrower extends WithTranslation {
  requestItems: IRequestItemModel;
}

@observer
class RequestInfoBorrower extends React.Component<IRequestInfoBorrower> {
  public render() {
    const { requestItems, t } = this.props;
    return (
      <Segment padded style={styles.bg}>
        <ProfileInfoCard profile={requestItems.borrower} noSegment />
        <Form.Field
          label={t("module.loan.agreementDetail.addressPerIDCard")}
          width={16}
          control={AddressBody}
          addressStore={requestItems.borrower.idCardAddress}
        />
        <Form.Field
          label={t("module.loan.requestDetail.status")}
          width={16}
          control={MarriageStatusType}
          inputFieldMarriageStatus="marriageStatus"
          valueFieldMarriageStatus={requestItems.borrower.marriageStatus}
          readOnly
        />
        {[1, 3, 4].includes(requestItems.borrower.marriageStatus) ? (
          <Form.Field>
            <label>{t("module.loan.requestDetail.spouseInfo")}</label>
            <Segment padded>
              <ProfileInfoCard profile={requestItems.spouse} noSegment />
            </Segment>
          </Form.Field>
        ) : null}

        <Form.Field
          label={t("module.loan.agreementFormCreate.houseAddress")}
          width={16}
          control={RegistedAddressType}
          inputFieldAddressType="registeredAddressType"
          valueFieldAddressType={requestItems.borrower.registeredAddressType}
          readOnly
        />
        {requestItems.borrower.registeredAddressType === 99 ? (
          <Form.Field
            label={t(
              "module.loan.agreementDetail.addressDetailsAccordingToHouseRegistration"
            )}
            width={16}
            control={AddressBody}
            addressStore={requestItems.borrower.registeredAddress}
          />
        ) : null}
        <Form.Field
          label={t("module.loan.requestDetail.currentAddress")}
          width={16}
          control={RegistedAddressCurrentType}
          inputFieldCurrentAddressType="currentAddressType"
          valueFieldCurrentAddressType={
            requestItems.borrower.currentAddressType
          }
          address={requestItems.borrower.currentAddress}
          readOnly
        />
        {requestItems.borrower.currentAddressType === 99 ? (
          <Form.Field
            label={t("module.loan.requestDetail.currentAddressDetails")}
            width={16}
            control={AddressBody}
            addressStore={requestItems.borrower.currentAddress}
          />
        ) : null}
        <FormDisplay
          title={t("module.loan.agreementFormCreate.telephoneNumber")}
          value={requestItems.borrower.telephone}
        />
        <FormDisplay
          title={t("module.loan.agreementDetail.mobilePhoneNumber")}
          value={requestItems.borrower.mobilePhone}
        />
        <Form.Field
          label={t("module.loan.agreementDetail.housingtType")}
          width={16}
          control={ResidenceType}
          inputFieldResidenceType="residenceType"
          valueFieldResidenceType={requestItems.borrower.residenceType}
          inputFieldDescription="residenceTypeDescription"
          valueFieldDescription={requestItems.borrower.residenceTypeDescription}
          readOnly
        />
        <Form.Field
          label={t("module.loan.agreementDetail.livingStatus")}
          width={16}
          control={ResidenceStatusType}
          id={"request-info-borrower-residence-status-type"}
          inputFieldStatusType="residenceStatusType"
          valueFieldStatusType={requestItems.borrower.residenceStatusType}
          inputFieldDescription="residenceStatusTypeDescription"
          valueFieldDescription={
            requestItems.borrower.residenceStatusTypeDescription
          }
          valueFieldAddressType={requestItems.borrower.registeredAddressType}
        />
        <Form.Field
          label={t("module.loan.agreementDetail.currentOccupation")}
          width={16}
          control={CurrentOccupationType}
          ocupationType="borrow"
          isWorking={requestItems.borrower.isWorking}
          inputFieldIsWorking={"isWorking"}
          occupation={requestItems.borrower.occupation}
          readOnly
        />
      </Segment>
    );
  }
}
const styles: any = {
  bg: {
    backgroundColor: "rgba(163, 51, 199,0.3)"
  }
};

export default withTranslation()(RequestInfoBorrower);
