import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form } from "semantic-ui-react";
import { IAppModel, IEnumItemModel } from "../../AppModel";

interface IPOSRefTypeDDL extends WithTranslation {
  id?: string;
  label?: string;
  value?: string;
  clearable?: boolean;
  onChange: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class POSRefTypeDDL extends React.Component<IPOSRefTypeDDL> {
  public render() {
    const { value, onChange, clearable, placeholder, disabled, id, label, appStore } = this.props;

    return (
      <Form.Dropdown
        id={id}
        label={label}
        search
        fluid
        disabled={disabled}
        options={appStore!.enumItems("posRefType").map((item: IEnumItemModel) => item)}
        placeholder={placeholder}
        value={value}
        onChange={(event, data) => onChange(data.value!)}
        selection
        clearable={clearable || true}
      />
    );
  }
}

export default withTranslation()(POSRefTypeDDL);
