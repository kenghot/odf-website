import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Dropdown, DropdownOnSearchChangeData } from "semantic-ui-react";
import { IRequestListModel } from "../RequestListModel";

interface IRequestDDL extends WithTranslation {
  requestList?: IRequestListModel;
  value?: any;
  multiple?: boolean;
  onChange: (value: any) => void;
}

@observer
class RequestDDL extends React.Component<IRequestDDL> {
  public async componentDidMount() {
    await this.props.requestList!.load_data();
  }

  public render() {
    const { t, value, requestList, onChange, multiple } = this.props;
    return (
      <Dropdown
        clearable
        search
        fluid
        multiple={multiple}
        options={requestList!.list.map((a) => a.listitem)}
        placeholder={t(
          "module.loan.agreementFormCreate.pleaseSelectRequestForm",
        )}
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
    data: DropdownOnSearchChangeData,
  ) {
    this.props.requestList!.setField({
      fieldname: "filterDocumentNumber",
      value: data.searchQuery,
    });
    setTimeout(() => {
      this.props.requestList!.load_data();
    }, 1500);
  }
}

export default withTranslation()(RequestDDL);
