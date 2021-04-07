import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { IAddressModel } from ".";
import DistrictDDL from "./DistrictDDL";
import { ILocationModel } from "./LocationModel";
import ProvinceDDL from "./ProvinceDDL";
import SubDistrictDDL from "./SubDistrictDDL";

interface IAddressFormShort extends WithTranslation {
    addressStore: IAddressModel;
    locationStore: ILocationModel;
}

@observer
class AddressFormShort extends React.Component<IAddressFormShort> {
    public render() {
        const store = this.props.addressStore;
        const { t } = this.props;
        return (
            <Segment padded>
                <Form.Group widths="equal">
                    <Form.Input
                        width="7"
                        id="house-noFormInfo"
                        label={t("component.addressFormBody.houseNumber")}
                        placeholder={t("component.addressFormBody.houseNumber")}
                        value={store.houseNo}
                        onChange={(event: any, data: any) =>
                            store.setField({
                                fieldname: "houseNo",
                                value: data.value,
                            })
                        }
                    />
                    <Form.Input
                        id="streetFormInfo"
                        label={t("component.addressFormBody.road")}
                        placeholder={t("component.addressFormBody.road")}
                        value={store.street}
                        onChange={(event: any, data: any) =>
                            store!.setField({
                                fieldname: "street",
                                value: data.value,
                            })
                        }
                    />
                </Form.Group>
                <Form.Field
                    id="subdistrictFormInfo"
                    label={t("component.addressFormBody.subdistrict")}
                    control={SubDistrictDDL}
                    value={store.subDistrictCode}
                    addressStore={store}
                    locationStore={this.props.locationStore}
                />
                <Form.Input
                    id="districtFormInfo"
                    label={t("component.addressFormBody.district")}
                    placeholder={t("component.addressFormBody.district")}
                    control={DistrictDDL}
                    value={store.districtCode}
                    addressStore={store}
                    locationStore={this.props.locationStore}
                />
                <Form.Input
                    id="provinceFormInfo"
                    label={t("component.addressFormBody.province")}
                    placeholder={t("component.addressFormBody.province")}
                    control={ProvinceDDL}
                    value={store.provinceCode}
                    addressStore={store}
                    locationStore={this.props.locationStore}
                />
            </Segment>
        );
    }
}
export default withTranslation()(AddressFormShort);
