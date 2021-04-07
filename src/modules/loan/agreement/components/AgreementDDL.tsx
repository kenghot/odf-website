import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Dropdown, DropdownOnSearchChangeData } from "semantic-ui-react";
import { IAgreementListModel } from "../AgreementListModel";
import { IAgreementModel } from "../AgreementModel";

interface IAgreementDDL extends WithTranslation {
  agreementList?: IAgreementListModel;
  value?: any;
  multiple?: boolean;
  onChange: (value: any) => void;
}

@observer
class AgreementDDL extends React.Component<IAgreementDDL> {
  public async componentDidMount() {
    await this.props.agreementList!.load_data();
  }

  public render() {
    const { t, value, agreementList, onChange, multiple } = this.props;
    return (
      <Dropdown
        clearable
        search
        fluid
        multiple={multiple}
        options={agreementList!.list.map((a: IAgreementModel) => a.listitem)}
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
    this.props.agreementList!.setField({
      fieldname: "filterDocumentNumber",
      value: data.searchQuery,
    });
    setTimeout(() => {
      this.props.agreementList!.load_data();
    }, 1000);
  }
}

export default withTranslation()(AgreementDDL);
