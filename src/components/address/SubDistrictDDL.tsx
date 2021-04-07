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

interface ISubDistrictDDL extends WithTranslation {
  locationStore?: ILocationModel;
  addressStore?: IAddressModel;
  notDidMount?: boolean;
  id?: string;
}

@observer
class SubDistrictDDL extends React.Component<ISubDistrictDDL> {
  public render() {
    const { t, id } = this.props;
    return (
      <Dropdown
        id={id}
        placeholder={t("component.addressFormBody.subdistrict")}
        clearable
        fluid
        search
        selection
        allowAdditions
        additionLabel={t("component.addressFormBody.selectSubdistrict")}
        options={this.props.locationStore!.subdistricts.map((a) => a.listitem)}
        onChange={(event, data) => this.onChange(event, data)}
        onAddItem={(event, data) => this.onAddItem(event, data)}
        onSearchChange={(event, data) => this.onSearchChange(event, data)}
        value={this.props.addressStore!.subDistrictCode}
      />
    );
  }
  public async componentDidMount() {
    if (!this.props.notDidMount) {
      this.props.locationStore!.loadSubdistrict();
    }
  }
  private onChange(
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ) {
    if (data.value === "") {
      this.props.addressStore!.setField({
        fieldname: "subDistrictCode",
        value: ""
      });

      this.props.addressStore!.setField({
        fieldname: "subDistrict",
        value: ""
      });
    } else {
      // serch for district and province vlue
      const selected = this.props.locationStore!.subdistricts.find(
        (item) => item.refCode === data.value
      );
      if (selected && !Number.isNaN(Number(selected.refCode))) {
        this.props.addressStore!.setField({
          fieldname: "subDistrictCode",
          value: selected.refCode
        });

        this.props.addressStore!.setField({
          fieldname: "subDistrict",
          value: selected.thName
        });
        this.props.locationStore!.loadDistrict(selected.district!.thName);
        this.props.addressStore!.setField({
          fieldname: "districtCode",
          value: selected.district!.refCode
        });
        this.props.addressStore!.setField({
          fieldname: "district",
          value: selected.district!.thName
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
        this.props.addressStore!.setField({
          fieldname: "zipcode",
          value: selected.zipcode
        });
      }
    }
  }
  private onAddItem(
    event: React.KeyboardEvent<HTMLElement>,
    data: DropdownProps
  ) {
    this.props.locationStore!.setField({
      fieldname: "subdistricts",
      value: [
        { id: data.value, thName: data.value },
        ...this.props.locationStore!.subdistricts
      ]
    });
    this.props.addressStore!.setField({
      fieldname: "subDistrict",
      value: data.value
    });
  }
  private onSearchChange(
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownOnSearchChangeData
  ) {
    setTimeout(() => {
      this.props.locationStore!.loadSubdistrict(data.searchQuery);
    }, 1500);
  }
}
export default withTranslation()(SubDistrictDDL);
