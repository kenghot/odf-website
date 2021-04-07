import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Dropdown } from "semantic-ui-react";
import { IRoleListModel } from "../RoleListModel";

interface IRoleDDL extends WithTranslation {
  roleList?: IRoleListModel;
  value?: string;
  id?: string;
  clearable?: boolean;
  onChange: (value: any) => void;
}

@observer
class RoleDDL extends React.Component<IRoleDDL> {
  public async componentDidMount() {
    await this.props.roleList!.load_data();
  }

  public render() {
    const { t, value, roleList, onChange, clearable, id } = this.props;

    return (
      <Dropdown
        id={id}
        search
        fluid
        label={t("module.admin.searchForm.underDepartment")}
        options={roleList!.list.map((a) => a.listitem)}
        placeholder={t("module.admin.searchForm.pleaseSelectAgency")}
        value={value}
        onChange={(event, data) => onChange(data.value!)}
        selection
        clearable={clearable}
      />
    );
  }
}

export default withTranslation()(RoleDDL);
