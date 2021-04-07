import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form } from "semantic-ui-react";
import { IAppModel, IEnumItemModel } from "../../../AppModel";

interface IMonthDDL extends WithTranslation {
  id?: string;
  value?: number;
  label?: string;
  clearable?: boolean;
  onChange: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  locale?: "th" | "en";
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class MonthDDL extends React.Component<IMonthDDL> {
  public render() {
    const {
      label,
      value,
      onChange,
      clearable,
      placeholder,
      disabled,
      id,
      locale,
      appStore
    } = this.props;

    return (
      <Form.Dropdown
        id={id}
        search
        fluid
        disabled={disabled}
        options={appStore!
          .enumItems(locale === "en" ? "monthEN" : "monthTH")
          .map((item: IEnumItemModel) => item)}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(event, data) => onChange(data.value!)}
        selection
        clearable={clearable || true}
      />
    );
  }
}

export default withTranslation()(MonthDDL);
