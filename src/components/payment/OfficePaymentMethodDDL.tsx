import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form } from "semantic-ui-react";
import { IAppModel, IEnumItemModel } from "../../AppModel";

interface IOfficePaymentMethodDDL extends WithTranslation {
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
class OfficePaymentMethodDDL extends React.Component<IOfficePaymentMethodDDL> {
  public render() {
    const {
      value,
      onChange,
      clearable,
      placeholder,
      disabled,
      id,
      label,
      appStore
    } = this.props;

    return (
      <Form.Dropdown
        id={id}
        label={label}
        search
        fluid
        disabled={disabled}
        options={appStore!
          .enumItems("officePaymentMethod")
          .map((item: IEnumItemModel) => item)}
        placeholder={placeholder}
        value={value}
        onChange={(event, data) => onChange(data.value!)}
        selection
        clearable={clearable || true}
      />
    );
  }
}

export default withTranslation()(OfficePaymentMethodDDL);
