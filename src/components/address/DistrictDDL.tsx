import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Dropdown,
  DropdownOnSearchChangeData,
  DropdownProps
} from "semantic-ui-react";
import { IAddressModel } from "./IAddressModel";
import { ILocationModel } from "./LocationModel";

interface IDistrictDDL extends WithTranslation {
  id?: string;
  locationStore?: ILocationModel;
  addressStore?: IAddressModel;
  notDidMount?: boolean;
}

@observer
class DistrictDDL extends React.Component<IDistrictDDL> {
  public render() {
    const { t, id } = this.props;
    return (
      <Dropdown
        id={id}
        placeholder={t("component.addressFormBody.district")}
        fluid
        clearable
        search
        selection
        allowAdditions
        additionLabel={t("component.addressFormBody.selectDistrict")}
        options={this.props.locationStore!.districts.map((a) => a.listitem)}
        onChange={(event, data) => this.onChange(event, data)}
        onAddItem={(event, data) => this.onAddItem(event, data)}
        onSearchChange={(event, data) => this.onSearchChange(event, data)}
        value={this.props.addressStore!.districtCode}
      />
    );
  }
  public async componentDidMount() {
    if (!this.props.notDidMount) {
      this.props.locationStore!.loadDistrict();
    }
  }
  private onChange(
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ) {
    this.props.addressStore!.setField({
      fieldname: "districtCode",
      value: data.value
    });
    this.props.addressStore!.setField({
      fieldname: "district",
      value: ""
    });
    // serch for province value
    const selected = this.props.locationStore!.districts.find(
      (item) => item.refCode === data.value
    );
    if (selected && !Number.isNaN(Number(selected.refCode))) {
      this.props.addressStore!.setField({
        fieldname: "district",
        value: selected.thName
      });
      this.props.locationStore!.loadProvince(selected.province!.thName);
      this.props.addressStore!.setField({
        fieldname: "provinceCode",
        value: selected.province!.refCode
      });
      this.props.addressStore!.setField({
        fieldname: "province",
        value: selected.province!.thName
      });
    }
  }
  private onAddItem(
    event: React.KeyboardEvent<HTMLElement>,
    data: DropdownProps
  ) {
    this.props.locationStore!.setField({
      fieldname: "districts",
      value: [
        { id: data.value, thName: data.value },
        ...this.props.locationStore!.districts
      ]
    });
    this.props.addressStore!.setField({
      fieldname: "district",
      value: data.value
    });
  }
  private onSearchChange(
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownOnSearchChangeData
  ) {
    setTimeout(() => {
      this.props.locationStore!.loadDistrict(data.searchQuery);
    }, 1500);
  }
}

export default withTranslation()(DistrictDDL);
