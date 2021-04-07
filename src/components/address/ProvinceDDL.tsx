import { observer } from "mobx-react";
import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import {
  Dropdown,
  DropdownOnSearchChangeData,
  DropdownProps
} from "semantic-ui-react";
import { IAddressModel } from "./IAddressModel";
import { ILocationModel } from "./LocationModel";

interface IProvinceDDL extends WithTranslation {
  id?: string;
  locationStore?: ILocationModel;
  addressStore?: IAddressModel;
  selectedValue?: any;
  onChange?: (value: any) => void;
  notDidMount?: boolean;
}

@observer
class ProvinceDDL extends React.Component<IProvinceDDL> {
  public render() {
    const { addressStore, selectedValue, t, id } = this.props;
    return (
      <Dropdown
        id={id}
        placeholder={t("component.addressFormBody.province")}
        fluid
        clearable
        search
        selection
        additionLabel={t("component.addressFormBody.chooseProvince")}
        noResultsMessage={t("component.addressFormBody.searchProvinceNotFound")}
        options={this.props.locationStore!.provinces.map((a) => a.listitem)}
        onChange={(event, data) => this.onChange(event, data)}
        onSearchChange={(event, data) => this.onSearchChange(event, data)}
        value={
          selectedValue
            ? selectedValue
            : addressStore
            ? addressStore.provinceCode
            : ""
        }
      />
    );
  }
  public async componentDidMount() {
    if (!this.props.notDidMount) {
      this.props.locationStore!.loadProvince();
    }
  }
  private onChange(
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ) {
    const { onChange, addressStore } = this.props;
    if (addressStore) {
      addressStore.setField({
        fieldname: "provinceCode",
        value: data.value
      });
      addressStore.setField({
        fieldname: "province",
        value: ""
      });
    } else {
      if (onChange) {
        onChange(data.value);
      }
    }

    // serch for province value
    const selected = this.props.locationStore!.provinces.find(
      (item) => item.refCode === data.value
    );
    if (selected) {
      if (addressStore) {
        addressStore.setField({
          fieldname: "province",
          value: selected.thName
        });
      }
    }
  }

  private onSearchChange(
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownOnSearchChangeData
  ) {
    setTimeout(() => {
      this.props.locationStore!.loadProvince(data.searchQuery);
    }, 1500);
  }
}

export default withTranslation()(ProvinceDDL);
