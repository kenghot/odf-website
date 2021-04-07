import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Dropdown, DropdownOnSearchChangeData } from "semantic-ui-react";
import { PosListModel } from "../../../pos/PosListModel";
import { IPosModel } from "../../../pos/PosModel";
import { IOrgModel } from "../OrgModel";

interface IPosDDL extends WithTranslation {
  id?: string;
  org: IOrgModel;
  value?: any;
  onChange: (value: any) => void;
}

@observer
class PosDDL extends React.Component<IPosDDL> {
  private posList = PosListModel.create({});
  public async componentDidMount() {
    const { org } = this.props;
    await this.posList.load_data_by_org(org.id);
  }

  public render() {
    const { t, value, onChange, id } = this.props;
    return (
      <Dropdown
        id={id}
        clearable
        search
        fluid
        options={this.posList.list.map((a) => a.listitem)}
        placeholder={t("module.admin.ManagePosForm.posDDL")}
        onSearchChange={(event, data) => this.onSearchChange(event, data)}
        value={value}
        onChange={(event, data) => {
          onChange(
            this.posList.list.find((item: IPosModel) => item.id === data.value)
          );
        }}
        selection
      />
    );
  }
  private onSearchChange(
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownOnSearchChangeData
  ) {
    const { org } = this.props;
    this.posList.setField({
      fieldname: "filterPosName",
      value: data.searchQuery,
    });
    setTimeout(() => {
      this.posList.load_data_by_org(org.id);
    }, 1500);
  }
}

export default withTranslation()(PosDDL);
