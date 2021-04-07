import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Dropdown } from "semantic-ui-react";
import { IAppModel, IEnumItemModel } from "../../../AppModel";

interface IReceiptControlLogStatusDDL extends WithTranslation {
  id?: string;
  value?: number;
  clearable?: boolean;
  onChange: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class ReceiptControlLogStatusDDL extends React.Component<
  IReceiptControlLogStatusDDL
> {
  public render() {
    const {
      value,
      onChange,
      clearable,
      placeholder,
      disabled,
      id,
      appStore
    } = this.props;

    return (
      <Dropdown
        id={id}
        search
        fluid
        disabled={disabled}
        options={appStore!
          .enumItems("receiptControlLogStatus")
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

export default withTranslation()(ReceiptControlLogStatusDDL);
