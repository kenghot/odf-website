import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { IAddressModel } from ".";
import { FormDisplay } from "../common";
interface IAddressBody extends WithTranslation {
  addressStore: IAddressModel;
  children?: any;
}

@observer
class AddressBody extends React.Component<IAddressBody> {
  public render() {
    const store = this.props.addressStore;
    const { t, children } = this.props;
    return (
      <Segment padded>
        <Form.Group widths="equal">
          <FormDisplay
            title={t("component.addressFormBody.houseNumber")}
            value={store.houseNo || "-"}
          />
          <FormDisplay
            title={t("component.addressFormBody.villageBuilding")}
            value={store.buildingName || "-"}
          />
          <FormDisplay
            title={t("component.addressFormBody.roomNumber")}
            value={store.roomNo || "-"}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <FormDisplay
            title={t("component.addressFormBody.class")}
            value={store.floor || "-"}
          />
          <FormDisplay
            title={t("component.addressFormBody.villageNo")}
            value={store.hmoo || "-"}
          />
          <FormDisplay
            title={t("component.addressFormBody.alley")}
            value={store.soi || "-"}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <FormDisplay
            title={t("component.addressFormBody.road")}
            value={store.street || "-"}
          />
          <FormDisplay
            title={t("component.addressFormBody.subdistrict")}
            value={store.subDistrict || "-"}
          />
          <FormDisplay
            title={t("component.addressFormBody.district")}
            value={store.district || "-"}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <FormDisplay
            width={8}
            title={t("component.addressFormBody.province")}
            value={store.province || "-"}
          />
          <FormDisplay
            title={t("component.addressFormBody.zipcode")}
            value={store.zipcode || "-"}
          />
        </Form.Group>
        {children}
      </Segment>
    );
  }
}
export default withTranslation()(AddressBody);
