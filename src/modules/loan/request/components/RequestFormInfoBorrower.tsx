import { observer } from "mobx-react";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { AddressFormBody, LocationModel } from "../../../../components/address";
import { IIDCardModel } from "../../../../components/idcard/IDCardModel";
import IDCardReaderProfile from "../../../../components/idcard/IDCardReaderProfile";
import {
  CurrentOccupationType,
  MarriageStatusType,
  RegistedAddressCurrentType,
  RegistedAddressType,
  ResidenceStatusType,
  ResidenceType,
} from "../../components";
import { IRequestItemModel } from "../RequestModel";

interface IRequestFormInfoBorrower extends WithTranslation {
  requestItems: IRequestItemModel;
  idCardBorrowerItems: IIDCardModel;
  idCardSpouseItems: IIDCardModel;
  documentDate: string;
}

@observer
class RequestFormInfoBorrower extends React.Component<IRequestFormInfoBorrower> {
  public locationRegisteredAddressStore = LocationModel.create({});
  public locationCurrentAddressStore = LocationModel.create({});
  public _isMounted = false;
  public componentDidMount() {
    this._isMounted = true;
    setTimeout(() => {
      if (this._isMounted) {
        this.locationCurrentAddressStore.loadSubdistrict(this.props.requestItems.borrower.currentAddress.subDistrict);
        this.locationCurrentAddressStore.loadDistrict(this.props.requestItems.borrower.currentAddress.district);
        this.locationCurrentAddressStore.loadProvince(this.props.requestItems.borrower.currentAddress.province);
        this.locationRegisteredAddressStore.loadSubdistrict(
          this.props.requestItems.borrower.registeredAddress.subDistrict
        );
        this.locationRegisteredAddressStore.loadDistrict(this.props.requestItems.borrower.registeredAddress.district);
        this.locationRegisteredAddressStore.loadProvince(this.props.requestItems.borrower.registeredAddress.province);
      }
    }, 2000);
  }
  public componentWillUnmount() {
    this._isMounted = false;
  }

  public render() {
    const { requestItems, t, idCardBorrowerItems, idCardSpouseItems, documentDate } = this.props;
    return (
      <Segment padded style={styles.bg}>
        {idCardBorrowerItems ? (
          <IDCardReaderProfile
            displayMode="full"
            idCardReadingStore={idCardBorrowerItems}
            profile={requestItems.borrower}
            address={requestItems.borrower.idCardAddress}
            fieldname="borrow"
            noSegment
            calculateAgeDate={documentDate}
          />
        ) : null}
        <Form.Field
          label={t("module.loan.requestDetail.status")}
          width={16}
          control={MarriageStatusType}
          inputFieldMarriageStatus="marriageStatus"
          valueFieldMarriageStatus={requestItems.borrower.marriageStatus}
          onChangeInputField={this.onChangeInputFieldBorrower}
        />
        {[1].includes(requestItems.borrower.marriageStatus) ? (
          <Form.Field>
            <label>{t("module.loan.requestDetail.spouseInfo")}</label>
            <IDCardReaderProfile
              displayMode="simple"
              idCardReadingStore={idCardSpouseItems}
              profile={requestItems.spouse}
              address={requestItems.spouse.idCardAddress}
              fieldname="spouse"
              calculateAgeDate={documentDate}
            />
          </Form.Field>
        ) : null}

        <Form.Field
          label={t("module.loan.agreementFormCreate.houseAddress")}
          width={16}
          control={RegistedAddressType}
          inputFieldAddressType="registeredAddressType"
          valueFieldAddressType={requestItems.borrower.registeredAddressType}
          onChangeInputField={this.onChangeInputFieldBorrower}
        />
        {requestItems.borrower.registeredAddressType === 99 ? (
          <Form.Field
            label={t("module.loan.agreementDetail.addressDetailsAccordingToHouseRegistration")}
            width={16}
            control={AddressFormBody}
            addressStore={requestItems.borrower.registeredAddress}
            locationStore={this.locationRegisteredAddressStore}
          />
        ) : null}
        <Form.Field
          label={t("module.loan.requestDetail.currentAddress")}
          width={16}
          control={RegistedAddressCurrentType}
          inputFieldCurrentAddressType="currentAddressType"
          valueFieldCurrentAddressType={requestItems.borrower.currentAddressType}
          address={requestItems.borrower.currentAddress}
          onChangeInputField={this.onChangeInputFieldBorrower}
        />
        {requestItems.borrower.currentAddressType === 99 ? (
          <Form.Field
            label={t("module.loan.requestDetail.currentAddressDetails")}
            width={16}
            control={AddressFormBody}
            addressStore={requestItems.borrower.currentAddress}
            locationStore={this.locationCurrentAddressStore}
          />
        ) : null}

        <Form.Input
          required
          fluid
          label={t("module.loan.agreementFormCreate.telephoneNumber")}
          placeholder={t("module.loan.agreementFormCreate.specifyPhoneNumber")}
          onChange={(event: any, data: any) => {
            if (isNaN(data.value)) {
              return;
            }
            requestItems!.borrower.setField({
              fieldname: "telephone",
              value: data.value,
            });
          }}
          value={requestItems.borrower.telephone}
        />
        <Form.Input
          fluid
          label={t("module.loan.agreementDetail.mobilePhoneNumber")}
          placeholder={t("module.loan.agreementDetail.enterMobilePhoneNumber")}
          onChange={(event: any, data: any) => {
            if (isNaN(data.value)) {
              return;
            }
            requestItems!.borrower.setField({
              fieldname: "mobilePhone",
              value: data.value,
            });
          }}
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
          onChangeInputField={this.onChangeInputFieldBorrower}
        />
        <Form.Field
          label={t("module.loan.agreementDetail.livingStatus")}
          width={16}
          control={ResidenceStatusType}
          id={"request-form-info-borrower-residence-status-type"}
          inputFieldStatusType="residenceStatusType"
          valueFieldStatusType={requestItems.borrower.residenceStatusType}
          inputFieldDescription="residenceStatusTypeDescription"
          valueFieldDescription={requestItems.borrower.residenceStatusTypeDescription}
          valueFieldAddressType={requestItems.borrower.registeredAddressType}
          onChangeInputField={this.onChangeInputFieldBorrower}
        />
        <Form.Field
          label={t("module.loan.agreementDetail.currentOccupation")}
          width={16}
          control={CurrentOccupationType}
          ocupationType="borrow"
          isWorking={requestItems.borrower.isWorking}
          inputFieldIsWorking={"isWorking"}
          occupation={requestItems.borrower.occupation}
          onChangeInputField={this.onChangeInputFieldBorrower}
        />
      </Segment>
    );
  }

  private onChangeInputFieldBorrower = (fieldname: string, value: any) => {
    const { requestItems } = this.props;
    requestItems.borrower.setField({ fieldname, value });
  };
}

const styles: any = {
  bg: {
    backgroundColor: "rgba(163, 51, 199,0.3)",
  },
};

export default withTranslation()(RequestFormInfoBorrower);
