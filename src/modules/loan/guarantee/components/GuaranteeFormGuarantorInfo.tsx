import { observer } from "mobx-react";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { GuaranteeFormOccuption } from ".";
import { AddressFormBody, LocationModel } from "../../../../components/address";
import { IIDCardModel } from "../../../../components/idcard/IDCardModel";
import IDCardReaderProfile from "../../../../components/idcard/IDCardReaderProfile";
import { date_DDMMYYYY_TO_YYYYMMDD_BE_TO_CE } from "../../../../utils/format-helper";
import { RegistedAddressType } from "../../components";
import { IGuaranteeItemModel } from "../GuaranteeModel";

interface IGuaranteeFormGuarantorInfo extends WithTranslation {
  guaranteeItem: IGuaranteeItemModel;
  idCardItem: IIDCardModel;
  documentDate: string;
}

@observer
class GuaranteeFormGuarantorInfo extends React.Component<
  IGuaranteeFormGuarantorInfo
> {
  public locationRegisteredAddressStore = LocationModel.create({});
  public state = {
    subDistrict: "",
    district: "",
    province: ""
  };
  public _isMounted = false;
  public componentDidMount() {
    this._isMounted = true;
    setTimeout(() => {
      this.locationRegisteredAddressStore.loadSubdistrict(
        this.props.guaranteeItem.guarantorRegisteredAddress.subDistrict
      );
      this.locationRegisteredAddressStore.loadDistrict(
        this.props.guaranteeItem.guarantorRegisteredAddress.district
      );
      this.locationRegisteredAddressStore.loadProvince(
        this.props.guaranteeItem.guarantorRegisteredAddress.province
      );
    }, 2000);
  }

  public async componentDidUpdate() {
    if (
      this.props.guaranteeItem.guarantorRegisteredAddress.subDistrict !== "" &&
      this.props.guaranteeItem.guarantorRegisteredAddress.subDistrict !==
        this.state.subDistrict
    ) {
      await this.locationRegisteredAddressStore.loadSubdistrict(
        this.props.guaranteeItem.guarantorRegisteredAddress.subDistrict
      );
      await this.locationRegisteredAddressStore.loadDistrict(
        this.props.guaranteeItem.guarantorRegisteredAddress.district
      );
      await this.locationRegisteredAddressStore.loadProvince(
        this.props.guaranteeItem.guarantorRegisteredAddress.province
      );
      await this.setState({
        subDistrict: this.props.guaranteeItem.guarantorRegisteredAddress
          .subDistrict
      });
      await this.setState({
        district: this.props.guaranteeItem.guarantorRegisteredAddress.district
      });
      await this.setState({
        province: this.props.guaranteeItem.guarantorRegisteredAddress.province
      });
      this.forceUpdate();
    }
  }
  public componentWillUnmount() {
    this._isMounted = false;
    this.setState({
      subDistrict: ""
    });
    this.setState({
      district: ""
    });
    this.setState({
      province: ""
    });
  }

  public render() {
    const { guaranteeItem, t, idCardItem, documentDate } = this.props;
    return (
      <Segment padded>
        {idCardItem ? (
          // <IDCardReader
          //   displayMode="full"
          //   idCardReadingStore={idCardItem}
          //   noSegment
          //   onReadCard={this.onReadCard}
          //   onChangeInputField={this.onChangeInputFieldCard}
          // />
          <IDCardReaderProfile
            displayMode="full"
            idCardReadingStore={idCardItem}
            profile={guaranteeItem.guarantor}
            address={guaranteeItem.guarantorIdCardAddress}
            noSegment
            fieldname="gurantor"
            calculateAgeDate={documentDate}
          />
        ) : null}
        <Form.Field
          label={t("module.loan.agreementFormCreate.houseAddress")}
          width={16}
          control={RegistedAddressType}
          inputFieldAddressType="guarantorRegisteredAddressType"
          valueFieldAddressType={guaranteeItem.guarantorRegisteredAddressType}
          onChangeInputField={this.onChangeInputFieldLoanFormHouseParticulars}
        />
        {guaranteeItem.guarantorRegisteredAddressType === 99 ? (
          <Form.Field
            label={t(
              "module.loan.guaranteeDetail.addressDetailsAccordingToHouseRegistration"
            )}
            width={16}
            control={AddressFormBody}
            notDidMount={true}
            addressStore={guaranteeItem.guarantorRegisteredAddress}
            locationStore={this.locationRegisteredAddressStore}
          />
        ) : null}
        <Form.Field
          label={t("module.loan.guaranteeGuarantorInfo.occupation")}
          width={16}
          control={GuaranteeFormOccuption}
          guarantorOccupation={guaranteeItem.guarantorOccupation}
          guarantorSalary={guaranteeItem.guarantorSalary}
          guarantorCompanyName={guaranteeItem.guarantorCompanyName}
          guarantorPosition={guaranteeItem.guarantorPosition}
          onChangeTextField={(fieldname: string, value: any) => {
            console.log(value);
            guaranteeItem.setField({ fieldname, value });
          }}
        />
        <Form.Input
          fluid
          label={t("module.loan.agreementFormCreate.telephoneNumber")}
          placeholder={t("module.loan.agreementFormCreate.specifyPhoneNumber")}
          onChange={(event: any, data: any) =>
            guaranteeItem!.setField({
              fieldname: "guarantorTelephone",
              value: data.value
            })
          }
          value={guaranteeItem.guarantorTelephone}
        />
      </Segment>
    );
  }

  private onChangeInputFieldLoanFormHouseParticulars = async (
    fieldname: string,
    value: any
  ) => {
    const { guaranteeItem } = this.props;
    await guaranteeItem.setField({ fieldname, value });
    await this.locationRegisteredAddressStore.loadSubdistrict(
      this.props.guaranteeItem.guarantorRegisteredAddress.subDistrict
    );
    await this.locationRegisteredAddressStore.loadDistrict(
      this.props.guaranteeItem.guarantorRegisteredAddress.district
    );
    await this.locationRegisteredAddressStore.loadProvince(
      this.props.guaranteeItem.guarantorRegisteredAddress.province
    );
  };
  private onReadCard = (value: IIDCardModel) => {
    const { guaranteeItem } = this.props;
    guaranteeItem.guarantor.setField({
      fieldname: "idCardNo",
      value: value.id
    });
    guaranteeItem.guarantor.setField({
      fieldname: "title",
      value: value.title
    });
    guaranteeItem.guarantor.setField({
      fieldname: "firstname",
      value: value.firstname
    });
    guaranteeItem.guarantor.setField({
      fieldname: "lastname",
      value: value.lastname
    });
    guaranteeItem.guarantor.setField({
      fieldname: "birthDate",
      value: date_DDMMYYYY_TO_YYYYMMDD_BE_TO_CE(value.birthday)
    });
    guaranteeItem.guarantor.setField({
      fieldname: "idCardIssuedDate",
      value: date_DDMMYYYY_TO_YYYYMMDD_BE_TO_CE(value.issued_date)
    });
    guaranteeItem.guarantor.setField({
      fieldname: "idCardExpireDate",
      value: date_DDMMYYYY_TO_YYYYMMDD_BE_TO_CE(value.expired_date)
    });
    guaranteeItem.guarantor.setField({
      fieldname: "idCardIssuer",
      value: value.issuer
    });
    guaranteeItem.guarantorIdCardAddress.setAllField(value.address);
    guaranteeItem.guarantor.setField({ fieldname: "age", value: +value.age });
    guaranteeItem.guarantor.setField({
      fieldname: "idCardLifetime",
      value: value.idCardLifetime
    });
  };
  private onChangeInputFieldCard = (value: IIDCardModel) => {
    const { guaranteeItem } = this.props;
    guaranteeItem.guarantor.setField({
      fieldname: "idCardNo",
      value: value.id
    });
    guaranteeItem.guarantor.setField({
      fieldname: "title",
      value: value.title
    });
    guaranteeItem.guarantor.setField({
      fieldname: "firstname",
      value: value.firstname
    });
    guaranteeItem.guarantor.setField({
      fieldname: "lastname",
      value: value.lastname
    });
    guaranteeItem.guarantor.setField({
      fieldname: "birthDate",
      value: date_DDMMYYYY_TO_YYYYMMDD_BE_TO_CE(value.birthday)
    });
    guaranteeItem.guarantor.setField({
      fieldname: "idCardIssuedDate",
      value: date_DDMMYYYY_TO_YYYYMMDD_BE_TO_CE(value.issued_date)
    });
    guaranteeItem.guarantor.setField({
      fieldname: "idCardExpireDate",
      value: date_DDMMYYYY_TO_YYYYMMDD_BE_TO_CE(value.expired_date)
    });
    guaranteeItem.guarantor.setField({
      fieldname: "idCardIssuer",
      value: value.issuer
    });
    guaranteeItem.guarantorIdCardAddress.setAllField(value.address);
    guaranteeItem.guarantor.setField({ fieldname: "age", value: +value.age });
    guaranteeItem.guarantor.setField({
      fieldname: "idCardLifetime",
      value: value.idCardLifetime
    });
  };
}

export default withTranslation()(GuaranteeFormGuarantorInfo);
