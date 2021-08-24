import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Dropdown, DropdownOnSearchChangeData } from "semantic-ui-react";
import { IOrgListModel } from "../OrgListModel";

interface IProvinceByOrgDDL extends WithTranslation {
  orgList?: IOrgListModel;
  value?: any;
  multiple?: boolean;
  onChange: (value: any) => void;
  inActive?: boolean;
  id?: string;
}

@observer
class ProvinceByOrgDDL extends React.Component<IProvinceByOrgDDL> {
  public async componentDidMount() {
    if (this.props.inActive) {
      await this.props.orgList!.load_data_list();
    } else {
      await this.props.orgList!.load_data();
    }
  }

  public render() {
    const { t, value, orgList, onChange, multiple, id } = this.props;
    return (
      <Dropdown
        id={id}
        clearable
        search
        fluid
        multiple={multiple}
        options={orgList!.list.map((a) => a.listitemProvince)}
        placeholder={t("module.admin.searchForm.pleaseSelectProvince")}
        onSearchChange={(event, data) => this.onSearchChange(event, data)}
        value={value}
        onChange={(event, data) => {
          onChange(data.value!);
        }}
        selection
      />
    );
  }
  private onSearchChange(
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownOnSearchChangeData
  ) {
    this.props.orgList!.setField({
      fieldname: "filterName",
      value: data.searchQuery
    });
    setTimeout(() => {
      if (this.props.inActive) {
        this.props.orgList!.load_data_list();
      } else {
        this.props.orgList!.load_data();
      }
    }, 1500);
  }
}

export default withTranslation()(ProvinceByOrgDDL);
