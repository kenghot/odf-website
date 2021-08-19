import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { IAddressModel } from ".";
import DistrictDDL from "./DistrictDDL";
import { ILocationModel } from "./LocationModel";
import ProvinceDDL from "./ProvinceDDL";
import SubDistrictDDL from "./SubDistrictDDL";
interface IAddressForm extends WithTranslation {
  id?: string;
  addressStore: IAddressModel;
  locationStore: ILocationModel;
  notDidMount?: boolean;
  onChangeInputField?: (value: IAddressModel) => void;
  children?: any;
}

@observer
class AddressFormBody extends React.Component<IAddressForm> {
  public render() {
    const store = this.props.addressStore;
    const { t, id, notDidMount, children } = this.props;
    return (
      <Segment padded>
        <Form.Group widths="equal">
          <Form.Input
            required
            id={`house-no-${id}`}
            label={t("component.addressFormBody.houseNumber")}
            placeholder={t("component.addressFormBody.houseNumber")}
            value={store.houseNo}
            onChange={(event: any, data: any) => {
              store.setField({
                fieldname: "houseNo",
                value: data.value
              });
              this.onChangeInputField(store);
            }}
          />
          <Form.Input
            id={`building-${id}`}
            label={t("component.addressFormBody.villageBuilding")}
            placeholder={t("component.addressFormBody.villageBuilding")}
            value={store.buildingName}
            onChange={(event: any, data: any) => {
              store.setField({
                fieldname: "buildingName",
                value: data.value
              });
              this.onChangeInputField(store);
            }}
          />
          <Form.Input
            id={`room-number-${id}`}
            label={t("component.addressFormBody.roomNumber")}
            placeholder={t("component.addressFormBody.roomNumber")}
            value={store.roomNo}
            onChange={(event: any, data: any) => {
              store.setField({
                fieldname: "roomNo",
                value: data.value
              });
              this.onChangeInputField(store);
            }}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            id={`floor-${id}`}
            label={t("component.addressFormBody.class")}
            placeholder={t("component.addressFormBody.class")}
            value={store.floor}
            onChange={(event: any, data: any) => {
              store.setField({
                fieldname: "floor",
                value: data.value
              });
              this.onChangeInputField(store);
            }}
          />
          <Form.Input
            required
            id={`hmoo-${id}`}
            label={t("component.addressFormBody.villageNo")}
            placeholder={t("component.addressFormBody.villageNo")}
            value={store.hmoo}
            onChange={(event: any, data: any) => {
              store.setField({
                fieldname: "hmoo",
                value: data.value
              });
              this.onChangeInputField(store);
            }}
          />
          <Form.Input
            id={`soi-${id}`}
            label={t("component.addressFormBody.alley")}
            placeholder={t("component.addressFormBody.alley")}
            value={store.soi}
            onChange={(event: any, data: any) => {
              store.setField({
                fieldname: "soi",
                value: data.value
              });
              this.onChangeInputField(store);
            }}
          />
        </Form.Group>
        <Form.Input
          id={`street-${id}`}
          label={t("component.addressFormBody.road")}
          placeholder={t("component.addressFormBody.road")}
          value={store.street}
          onChange={(event: any, data: any) => {
            store.setField({
              fieldname: "street",
              value: data.value
            });
            this.onChangeInputField(store);
          }}
        />
        <Form.Field
          required
          id={`subdistrict-${id}`}
          label={t("component.addressFormBody.subdistrict")}
          control={SubDistrictDDL}
          notDidMount={notDidMount}
          value={store.subDistrictCode}
          addressStore={store}
          locationStore={this.props.locationStore}
        />
        <Form.Input
          required
          id={`district-${id}`}
          label={t("component.addressFormBody.district")}
          placeholder={t("component.addressFormBody.district")}
          control={DistrictDDL}
          notDidMount={notDidMount}
          value={store.districtCode}
          addressStore={store}
          locationStore={this.props.locationStore}
        />
        <Form.Input
          required
          id={`province-${id}`}
          label={t("component.addressFormBody.province")}
          placeholder={t("component.addressFormBody.province")}
          control={ProvinceDDL}
          notDidMount={notDidMount}
          value={store.provinceCode}
          addressStore={store}
          locationStore={this.props.locationStore}
        />
        <Form.Input
          required
          id={`zipcode-${id}`}
          label={t("component.addressFormBody.zipcode")}
          placeholder={t("component.addressFormBody.zipcode")}
          value={store.zipcode}
          onChange={(event: any, data: any) => {
            store.setField({
              fieldname: "zipcode",
              value: data.value
            });
            this.onChangeInputField(store);
          }}
        />
        {children}
      </Segment>
    );
  }

  private onChangeInputField = (value: IAddressModel) => {
    const { onChangeInputField } = this.props;
    if (typeof onChangeInputField !== "undefined") {
      onChangeInputField(value);
    }
  };
}
export default withTranslation()(AddressFormBody);
