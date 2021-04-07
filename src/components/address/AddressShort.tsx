import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { IAddressModel } from ".";
import { FormDisplay } from "../common";

interface IAddressShort extends WithTranslation {
  addressStore: IAddressModel;
}

@observer
class AddressShort extends React.Component<IAddressShort> {
  public render() {
    const { t, addressStore } = this.props;
    return (
      <Segment padded>
        <Form.Group widths="equal">
          <FormDisplay
            title={t("component.addressFormBody.houseNumber")}
            value={addressStore.houseNo || "-"}
            width={8}
          />
          <FormDisplay
            title={t("component.addressFormBody.road")}
            value={addressStore.street || "-"}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <FormDisplay
            title={t("component.addressFormBody.subdistrict")}
            value={addressStore.subDistrict || "-"}
          />
          <FormDisplay
            title={t("component.addressFormBody.district")}
            value={addressStore.district || "-"}
          />
          <FormDisplay
            title={t("component.addressFormBody.province")}
            value={addressStore.province || "-"}
          />
        </Form.Group>
      </Segment>
    );
  }
}
export default withTranslation()(AddressShort);
