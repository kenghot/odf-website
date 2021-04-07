import { observer } from "mobx-react";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { AddressFormBody, LocationModel } from "../../../components/address";
import { IIDCardModel } from "../../../components/idcard/IDCardModel";
import IDCardReaderProfile from "../../../components/idcard/IDCardReaderProfile";
import { IProfileModel } from "../../share/profile/ProfileModel";

interface IDonationFormDonatorInfo extends WithTranslation {
  donator: IProfileModel;
  idCardItem: IIDCardModel;
}

@observer
class DonationFormDonatorInfo extends React.Component<IDonationFormDonatorInfo> {
  public locationDocumentDeliveryAddressStore = LocationModel.create({});
  public state = {
    subDistrict: "",
    district: "",
    province: "",
  };
  public _isMounted = false;
  public componentDidMount() {
    this._isMounted = true;
    setTimeout(() => {
      this.locationDocumentDeliveryAddressStore.loadSubdistrict(
        this.props.donator.documentDeliveryAddress.subDistrict
      );
      this.locationDocumentDeliveryAddressStore.loadDistrict(
        this.props.donator.documentDeliveryAddress.district
      );
      this.locationDocumentDeliveryAddressStore.loadProvince(
        this.props.donator.documentDeliveryAddress.province
      );
    }, 2000);
  }

  public async componentDidUpdate() {
    if (
      this.props.donator.documentDeliveryAddress.subDistrict !== "" &&
      this.props.donator.documentDeliveryAddress.subDistrict !==
        this.state.subDistrict
    ) {
      await this.locationDocumentDeliveryAddressStore.loadSubdistrict(
        this.props.donator.documentDeliveryAddress.subDistrict
      );
      await this.locationDocumentDeliveryAddressStore.loadDistrict(
        this.props.donator.documentDeliveryAddress.district
      );
      await this.locationDocumentDeliveryAddressStore.loadProvince(
        this.props.donator.documentDeliveryAddress.province
      );
      await this.setState({
        subDistrict: this.props.donator.documentDeliveryAddress.subDistrict,
      });
      await this.setState({
        district: this.props.donator.documentDeliveryAddress.district,
      });
      await this.setState({
        province: this.props.donator.documentDeliveryAddress.province,
      });
      this.forceUpdate();
    }
  }

  public componentWillUnmount() {
    this._isMounted = false;
    this.setState({
      subDistrict: "",
    });
    this.setState({
      district: "",
    });
    this.setState({
      province: "",
    });
  }

  public render() {
    const { t, donator, idCardItem } = this.props;
    return (
      <Segment padded>
        {idCardItem ? (
          <IDCardReaderProfile
            displayMode="full"
            idCardReadingStore={idCardItem}
            profile={donator}
            address={donator.idCardAddress}
            titleAddress={t(
              "module.donation.DonationFormDonatorInfo.titleAddress"
            )}
            noSegment
            fieldname="donator-profile"
            notDidMount
          />
        ) : null}
        <Form.Field
          label={t(
            "module.donation.DonationFormDonatorInfo.documentDeliveryAddress"
          )}
          width={16}
          control={AddressFormBody}
          notDidMount={true}
          addressStore={donator.documentDeliveryAddress}
          locationStore={this.locationDocumentDeliveryAddressStore}
        />
      </Segment>
    );
  }
}

export default withTranslation()(DonationFormDonatorInfo);
