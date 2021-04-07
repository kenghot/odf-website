import { observer } from "mobx-react";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { AddressFormBody, LocationModel } from "../../../../components/address";
import { IIDCardModel } from "../../../../components/idcard/IDCardModel";
import IDCardReaderProfile from "../../../../components/idcard/IDCardReaderProfile";
import { date_DDMMYYYY_TO_YYYYMMDD_BE_TO_CE } from "../../../../utils/format-helper";
import { RegistedAddressType } from "../../components";
import { IAgreementItemModel } from "../AgreementModel";

interface IAgreementFormInfoBorrower extends WithTranslation {
  agreementItem: IAgreementItemModel;
  idCardItem: IIDCardModel;
  documentDate: string;
}

@observer
class AgreementFormInfoBorrower extends React.Component<
  IAgreementFormInfoBorrower
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
        this.props.agreementItem.borrowerRegisteredAddress.subDistrict
      );
      this.locationRegisteredAddressStore.loadDistrict(
        this.props.agreementItem.borrowerRegisteredAddress.district
      );
      this.locationRegisteredAddressStore.loadProvince(
        this.props.agreementItem.borrowerRegisteredAddress.province
      );
    }, 2000);
  }
  public async componentDidUpdate() {
    if (
      this.props.agreementItem.borrowerRegisteredAddress.subDistrict !== "" &&
      this.props.agreementItem.borrowerRegisteredAddress.subDistrict !==
        this.state.subDistrict
    ) {
      await this.locationRegisteredAddressStore.loadSubdistrict(
        this.props.agreementItem.borrowerRegisteredAddress.subDistrict
      );
      await this.locationRegisteredAddressStore.loadDistrict(
        this.props.agreementItem.borrowerRegisteredAddress.district
      );
      await this.locationRegisteredAddressStore.loadProvince(
        this.props.agreementItem.borrowerRegisteredAddress.province
      );
      await this.setState({
        subDistrict: this.props.agreementItem.borrowerRegisteredAddress
          .subDistrict
      });
      await this.setState({
        district: this.props.agreementItem.borrowerRegisteredAddress.district
      });
      await this.setState({
        province: this.props.agreementItem.borrowerRegisteredAddress.province
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
    const { agreementItem, t, idCardItem, documentDate } = this.props;
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
            profile={agreementItem.borrower}
            address={agreementItem.borrowerIdCardAddress}
            noSegment
            fieldname="agreement"
            calculateAgeDate={documentDate}
          />
        ) : null}

        <Form.Field
          label={t("module.loan.agreementFormCreate.houseAddress")}
          width={16}
          control={RegistedAddressType}
          inputFieldAddressType="borrowerRegisteredAddressType"
          valueFieldAddressType={agreementItem.borrowerRegisteredAddressType}
          onChangeInputField={this.onChangeInputFieldLoanFormHouseParticulars}
        />
        {agreementItem.borrowerRegisteredAddressType === 99 ? (
          <Form.Field
            label={t(
              "module.loan.agreementDetail.addressDetailsAccordingToHouseRegistration"
            )}
            width={16}
            control={AddressFormBody}
            addressStore={agreementItem.borrowerRegisteredAddress}
            locationStore={this.locationRegisteredAddressStore}
          />
        ) : null}

        <Form.Input
          fluid
          label={t("module.loan.agreementFormCreate.telephoneNumber")}
          placeholder={t("module.loan.agreementFormCreate.specifyPhoneNumber")}
          onChange={(event: any, data: any) =>
            agreementItem!.setField({
              fieldname: "borrowerTelephone",
              value: data.value
            })
          }
          value={agreementItem.borrowerTelephone}
        />
      </Segment>
    );
  }

  private onChangeInputFieldLoanFormHouseParticulars = (
    fieldname: string,
    value: any
  ) => {
    const { agreementItem } = this.props;
    agreementItem.setField({ fieldname, value });
  };

  private onReadCard = (value: IIDCardModel) => {
    const { agreementItem } = this.props;
    agreementItem.borrower.setField({
      fieldname: "idCardNo",
      value: value.id
    });
    agreementItem.borrower.setField({
      fieldname: "title",
      value: value.title
    });
    agreementItem.borrower.setField({
      fieldname: "firstname",
      value: value.firstname
    });
    agreementItem.borrower.setField({
      fieldname: "lastname",
      value: value.lastname
    });
    agreementItem.borrower.setField({
      fieldname: "birthDate",
      value: date_DDMMYYYY_TO_YYYYMMDD_BE_TO_CE(value.birthday)
    });
    agreementItem.borrower.setField({
      fieldname: "idCardIssuedDate",
      value: date_DDMMYYYY_TO_YYYYMMDD_BE_TO_CE(value.issued_date)
    });
    agreementItem.borrower.setField({
      fieldname: "idCardExpireDate",
      value: date_DDMMYYYY_TO_YYYYMMDD_BE_TO_CE(value.expired_date)
    });
    agreementItem.borrower.setField({
      fieldname: "idCardIssuer",
      value: value.issuer
    });
    agreementItem.borrowerIdCardAddress.setAllField(value.address);
    agreementItem.borrower.setField({
      fieldname: "age",
      value: +value.age
    });
    agreementItem.borrower.setField({
      fieldname: "idCardLifetime",
      value: value.idCardLifetime
    });
  };
  private onChangeInputFieldCard = (value: IIDCardModel) => {
    const { agreementItem } = this.props;
    agreementItem.borrower.setField({
      fieldname: "idCardNo",
      value: value.id
    });
    agreementItem.borrower.setField({
      fieldname: "title",
      value: value.title
    });
    agreementItem.borrower.setField({
      fieldname: "firstname",
      value: value.firstname
    });
    agreementItem.borrower.setField({
      fieldname: "lastname",
      value: value.lastname
    });
    agreementItem.borrower.setField({
      fieldname: "birthDate",
      value: date_DDMMYYYY_TO_YYYYMMDD_BE_TO_CE(value.birthday)
    });
    agreementItem.borrower.setField({
      fieldname: "idCardIssuedDate",
      value: date_DDMMYYYY_TO_YYYYMMDD_BE_TO_CE(value.issued_date)
    });
    agreementItem.borrower.setField({
      fieldname: "idCardExpireDate",
      value: date_DDMMYYYY_TO_YYYYMMDD_BE_TO_CE(value.expired_date)
    });
    agreementItem.borrower.setField({
      fieldname: "idCardIssuer",
      value: value.issuer
    });
    agreementItem.borrowerIdCardAddress.setAllField(value.address);
    agreementItem.borrower.setField({
      fieldname: "age",
      value: +value.age
    });
    agreementItem.borrower.setField({
      fieldname: "idCardLifetime",
      value: value.idCardLifetime
    });
  };
}

export default withTranslation()(AgreementFormInfoBorrower);
