import { observer } from "mobx-react";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { AddressFormBody, LocationModel } from "../../../../components/address";
import { IIDCardModel } from "../../../../components/idcard/IDCardModel";
import IDCardReaderProfile from "../../../../components/idcard/IDCardReaderProfile";
import {
  MarriageStatusType,
  OccupationInfoForm,
  RegistedAddressCurrentType,
  RegistedAddressType,
  RelationshipType,
  ResidenceStatusType,
  ResidenceType,
} from "../../components";
import { IRequestItemModel } from "../RequestModel";

interface IRequestFormInfoGuarantor extends WithTranslation {
  requestItems: IRequestItemModel;
  idCardItem: IIDCardModel;
  documentDate: string;
}

@observer
class RequestFormInfoGuarantor extends React.Component<IRequestFormInfoGuarantor> {
  public _isMounted = false;
  public locationRegisteredAddressStore = LocationModel.create({});
  public locationCurrentAddressStore = LocationModel.create({});
  public locationGuarantorCompanyAddressStore = LocationModel.create({});
  public componentDidMount() {
    this._isMounted = true;
    setTimeout(() => {
      if (this._isMounted) {
        this.locationRegisteredAddressStore.loadSubdistrict(
          this.props.requestItems.guarantor.registeredAddress.subDistrict
        );
        this.locationRegisteredAddressStore.loadDistrict(this.props.requestItems.guarantor.registeredAddress.district);
        this.locationRegisteredAddressStore.loadProvince(this.props.requestItems.guarantor.registeredAddress.province);
        this.locationCurrentAddressStore.loadSubdistrict(this.props.requestItems.guarantor.currentAddress.subDistrict);
        this.locationCurrentAddressStore.loadDistrict(this.props.requestItems.guarantor.currentAddress.district);
        this.locationCurrentAddressStore.loadProvince(this.props.requestItems.guarantor.currentAddress.province);
        this.locationGuarantorCompanyAddressStore.loadSubdistrict(
          this.props.requestItems.guarantorCompanyAddress.subDistrict
        );
        this.locationGuarantorCompanyAddressStore.loadDistrict(
          this.props.requestItems.guarantorCompanyAddress.district
        );
        this.locationGuarantorCompanyAddressStore.loadProvince(
          this.props.requestItems.guarantorCompanyAddress.province
        );
      }
    }, 2000);
  }
  public componentWillUnmount() {
    this._isMounted = false;
  }
  public render() {
    const { requestItems, t, idCardItem, documentDate } = this.props;
    return (
      <Segment padded style={styles.bg}>
        {idCardItem ? (
          <IDCardReaderProfile
            displayMode="full"
            idCardReadingStore={idCardItem}
            profile={requestItems.guarantor}
            address={requestItems.guarantor.idCardAddress}
            noSegment
            fieldname="gurantor"
            calculateAgeDate={documentDate}
          />
        ) : null}

        <Form.Field
          label={t("module.loan.requestDetail.status")}
          width={16}
          control={MarriageStatusType}
          inputFieldMarriageStatus="marriageStatus"
          valueFieldMarriageStatus={requestItems.guarantor.marriageStatus}
          onChangeInputField={this.onChangeInputFieldBorrower}
        />
        <Form.Field
          label={t("module.loan.agreementFormCreate.houseAddress")}
          width={16}
          control={RegistedAddressType}
          inputFieldAddressType="registeredAddressType"
          valueFieldAddressType={requestItems.guarantor.registeredAddressType}
          onChangeInputField={this.onChangeInputFieldRegisteredAddressType}
        />
        {requestItems.guarantor.registeredAddressType === 99 ? (
          <Form.Field
            label={t("module.loan.agreementDetail.addressDetailsAccordingToHouseRegistration")}
            width={16}
            control={AddressFormBody}
            addressStore={requestItems.guarantor.registeredAddress}
            locationStore={this.locationRegisteredAddressStore}
          />
        ) : null}
        <Form.Field
          label={t("module.loan.agreementDetail.currentAddress")}
          width={16}
          control={RegistedAddressCurrentType}
          inputFieldCurrentAddressType="currentAddressType"
          valueFieldCurrentAddressType={requestItems.guarantor.currentAddressType}
          onChangeInputField={this.onChangeInputFieldCurrentAddressType}
          address={requestItems.guarantor.currentAddress}
        />
        {requestItems.guarantor.currentAddressType === 99 ? (
          <Form.Field
            label={t("module.loan.agreementDetail.currentAddressDetails")}
            width={16}
            control={AddressFormBody}
            addressStore={requestItems.guarantor.currentAddress}
            locationStore={this.locationCurrentAddressStore}
          />
        ) : null}

        <Form.Field
          label={t("module.loan.agreementDetail.housingtType")}
          width={16}
          control={ResidenceType}
          inputFieldResidenceType="residenceType"
          valueFieldResidenceType={requestItems.guarantor.residenceType}
          inputFieldDescription="residenceTypeDescription"
          valueFieldDescription={requestItems.guarantor.residenceTypeDescription}
          onChangeInputField={this.onChangeInputFieldBorrower}
        />
        <Form.Field
          label={t("module.loan.agreementDetail.livingStatus")}
          width={16}
          id={"request-form-info-guarantor-residence-status-type"}
          control={ResidenceStatusType}
          inputFieldStatusType="residenceStatusType"
          valueFieldStatusType={requestItems.guarantor.residenceStatusType}
          inputFieldDescription="residenceStatusTypeDescription"
          valueFieldDescription={requestItems.guarantor.residenceStatusTypeDescription}
          valueFieldAddressType={requestItems.guarantor.registeredAddressType}
          onChangeInputField={this.onChangeInputFieldBorrower}
        />
        <Form.Field
          label={t("module.loan.agreementDetail.relationsWithBorrowers")}
          width={16}
          control={RelationshipType}
          inputFieldRelationshipType="guarantorBorrowerRelationship"
          valueFieldRelationshipType={requestItems.guarantorBorrowerRelationship}
          onChangeInputField={this.onChangeInputField}
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
          onChangeInputField={this.onChangeInputField}
        />
        <Form.Field
          label={t("module.loan.agreementDetail.companyAddress")}
          width={16}
          control={AddressFormBody}
          addressStore={requestItems.guarantorCompanyAddress}
          locationStore={this.locationGuarantorCompanyAddressStore}
        />
        <Form.Input
          fluid
          label={t("module.loan.agreementDetail.officePhoneNumber")}
          placeholder={t("module.loan.agreementFormCreate.specifyPhoneNumber")}
          onChange={(event: any, data: any) => {
            if (isNaN(data.value)) {
              return;
            }
            requestItems!.setField({
              fieldname: "guarantorCompanyTelephone",
              value: data.value,
            });
          }}
          value={requestItems.guarantorCompanyTelephone}
        />
        <Form.Input
          required
          fluid
          label={t("module.loan.agreementFormCreate.telephoneNumber")}
          placeholder={t("module.loan.agreementFormCreate.specifyPhoneNumber")}
          onChange={(event: any, data: any) => {
            if (isNaN(data.value)) {
              return;
            }
            requestItems.guarantor.setField({
              fieldname: "telephone",
              value: data.value,
            });
          }}
          value={requestItems.guarantor.telephone}
        />
        <Form.Input
          fluid
          label={t("module.loan.agreementDetail.mobilePhoneNumber")}
          placeholder={t("module.loan.agreementDetail.enterMobilePhoneNumber")}
          onChange={(event: any, data: any) => {
            if (isNaN(data.value)) {
              return;
            }
            requestItems.guarantor.setField({
              fieldname: "mobilePhone",
              value: data.value,
            });
          }}
          value={requestItems.guarantor.mobilePhone}
        />
      </Segment>
    );
  }
  private onChangeInputFieldRegisteredAddressType = (fieldname: string, value: any) => {
    const { requestItems } = this.props;
    requestItems.guarantor.setField({ fieldname, value });
  };
  private onChangeInputFieldCurrentAddressType = (fieldname: string, value: any) => {
    const { requestItems } = this.props;
    requestItems.guarantor.setField({ fieldname, value });
  };
  private onChangeInputFieldBorrower = (fieldname: string, value: any) => {
    const { requestItems } = this.props;
    requestItems.guarantor.setField({ fieldname, value });
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { requestItems } = this.props;
    requestItems.setField({ fieldname, value });
  };
}

const styles: any = {
  bg: {
    backgroundColor: "rgba(242, 113, 28,0.3)",
  },
};
export default withTranslation()(RequestFormInfoGuarantor);
