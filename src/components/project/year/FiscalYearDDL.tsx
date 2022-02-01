import { observer } from "mobx-react";
import moment from "moment";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Dropdown } from "semantic-ui-react";

interface IFiscalYearDDL extends WithTranslation {
  id?: string;
  value?: string;
  clearable?: boolean;
  onChange: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
}

@observer
class FiscalYearDDL extends React.Component<IFiscalYearDDL> {
  public render() {
    const {
      value,
      onChange,
      clearable,
      placeholder,
      disabled,
      id
    } = this.props;

    return (
      <Dropdown
        id={id}
        search
        fluid
        disabled={disabled}
        options={this.getYearListOptions()}
        placeholder={placeholder}
        value={value}
        onChange={(event, data) => onChange(data.value!)}
        selection
        clearable={clearable || true}
      />
    );
  }
  private getYearListOptions = () => {
    const defaultYear = 543;
    const currentBuddhistYear = moment()
      .add(defaultYear + 3, "years")
      .format("YYYY");
    let i = 1;
    const yearListOptions: any = [];
    const buddhistYear=Number.parseInt(currentBuddhistYear);
    for (i = buddhistYear; i >= 2549; i--) {
      const year =  i;
      yearListOptions.push({
        key: i.toString(),
        text: year.toString(),
        value: year.toString()
      });
    }
    return yearListOptions;
  };
}

export default withTranslation()(FiscalYearDDL);
