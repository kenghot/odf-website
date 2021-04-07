import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Dropdown } from "semantic-ui-react";
import { IOcupationListModel } from "../OcupationListModel";
import { IOcupationModel } from "../OcupationModel";

interface IOcupationDDL extends WithTranslation {
  ocupationList?: IOcupationListModel;
  value?: any;
  onChange: (value: any) => void;
  ocupationType?: "borrow" | "guarantee" | "request";
  disabled?: boolean;
  inActive?: boolean;
}

@observer
class OcupationDDL extends React.Component<IOcupationDDL> {
  public async componentDidMount() {
    await this.props.ocupationList!.load_data(!this.props.inActive);
  }

  public render() {
    const { t, value, onChange, disabled } = this.props;
    return (
      <Dropdown
        clearable
        search
        fluid
        options={this.renderOptions()}
        placeholder={t("module.admin.searchForm.pleaseSelectAgency")}
        value={value}
        onChange={(event, data) => {
          onChange(data.value!);
        }}
        selection
        disabled={disabled}
      />
    );
  }
  private renderOptions() {
    const { ocupationType, ocupationList } = this.props;
    switch (ocupationType) {
      case "borrow":
        return ocupationList!.occupation_list_0.map(
          (item: IOcupationModel) => ({
            key: item.id,
            value: item.id,
            text: item.name,
            description: item.name
          })
        );

      case "guarantee":
        return ocupationList!.occupation_list_1.map(
          (item: IOcupationModel) => ({
            key: item.id,
            value: item.id,
            text: item.name,
            description: item.name
          })
        );
      case "request":
        return ocupationList!.occupation_list_2.map(
          (item: IOcupationModel) => ({
            key: item.id,
            value: item.id,
            text: item.name,
            description: item.name
          })
        );
      default:
        return ocupationList!.list.map(
          (item: IOcupationModel) => ({
            key: item.id,
            value: item.id,
            text: item.name,
            description: item.name
          })
        );
    }
  }
}

export default withTranslation()(OcupationDDL);
