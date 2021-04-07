import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Dropdown, DropdownOnSearchChangeData } from "semantic-ui-react";
import { IPosListModel } from "../../PosListModel";

interface IPosDDL extends WithTranslation {
  posList: IPosListModel;
  value?: any;
  onChange: (value: any) => void;
  id?: string;
}

@observer
class PosDDL extends React.Component<IPosDDL> {
  public async componentDidMount() {
    this.props.posList.load_data();
  }

  public render() {
    const { t, value, posList, onChange, id } = this.props;
    return (
      <Dropdown
        id={id}
        clearable
        search
        fluid
        options={posList.list.map((a) => a.listitem)}
        placeholder={t("module.pos.posDDL.placeholder")}
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
    this.props.posList.setField({
      fieldname: "filterPosName",
      value: data.searchQuery
    });
    setTimeout(() => {
      this.props.posList.load_data();
    }, 1500);
  }
}

export default withTranslation()(PosDDL);
