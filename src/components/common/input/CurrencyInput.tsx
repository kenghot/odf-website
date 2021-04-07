import { observer } from "mobx-react";
import * as React from "react";
import { Input, Label } from "semantic-ui-react";
import { COLORS } from "../../../constants";

interface ICurrencyInput {
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  requiredField?: boolean;
  style?: any;
  value?: number | string;
  fieldName?: string;
  numberOfdecimal?: number;
  delimiterPadding?: number;
  dicimalPadding?: number;
  float?: "left" | "right";
  labelText?: string;
  onChangeInputField?: (fieldName: string, value: string) => void;
  onBlur?: () => void;
  id?: string;
}

@observer
class CurrencyInput extends React.Component<ICurrencyInput> {
  public state = { delimiterLength: 0 };
  private dicimalPadding = 2;
  private re = "";
  private regx = new RegExp(this.re, "g");
  public componentDidMount() {
    const { delimiterPadding, dicimalPadding } = this.props;
    this.dicimalPadding = dicimalPadding || 2;
    this.re =
      "\\d(?=(\\d{" +
      (delimiterPadding || 3) +
      "})+" +
      ((dicimalPadding || 2) > 0 ? "\\." : "$") +
      ")";
    this.regx = new RegExp(this.re, "g");
  }

  public render() {
    const {
      value,
      style,
      disabled,
      readOnly,
      requiredField,
      fieldName,
      placeholder,
      float,
      labelText,
      id,
      onBlur
    } = this.props;
    const currenecyDomestic = labelText || "บาท";
    const componentStyle = readOnly ? styles.read : styles.edit;
    return (
      <Input
        style={style}
        disabled={disabled}
        readOnly={readOnly}
        labelPosition="right"
        placeholder={placeholder || "0.00"}
      >
        <input
          id={id}
          onClick={() => {
            const input: any = document.getElementById(id || "");
            if (input) {
              input.focus();
              input.select();
            }
          }}
          required={requiredField}
          value={this.tryConvert(value)}
          style={{ ...componentStyle, textAlign: float ? float : "left" }}
          onChange={(event: any) => this.onSetField(event, fieldName)}
          onBlur={onBlur}
        />
        <Label style={readOnly ? styles.labelRead : styles.labelEdit}>
          {currenecyDomestic}
        </Label>
      </Input>
    );
  }

  private tryConvert = (value?: number | string) => {
    const { numberOfdecimal } = this.props;

    if (value) {
      // Check undefined value
      const _value = value !== undefined ? (+value).toString() : "";
      // remove Unformat charactor
      const clearingValue: string = _value.replace(/[^0-9.-]+/g, "");
      // Set parseFloat value to inputValue
      const input = parseFloat(clearingValue);

      if (numberOfdecimal === 0) {
        return new Intl.NumberFormat("th-TH").format(input);
      } else {
        return new Intl.NumberFormat("th-TH", {
          minimumFractionDigits: numberOfdecimal || 2,
          maximumFractionDigits: numberOfdecimal || 2
        }).format(input);
      }
    } else {
      return "";
    }
  };

  private onSetField = (event: any, fieldName?: string) => {
    const { onChangeInputField } = this.props;

    // stop jumping cursor
    const caret = event.target.selectionStart;
    const element = event.target;

    // clear comma
    let clearingValue: string = event.target.value.replace(/[^0-9.-]+/g, "");
    // check if match currency condition
    const match = clearingValue.match(this.regx);
    // set end cursor
    const end =
      match && match!.length > this.state.delimiterLength ? caret + 1 : caret;
    window.requestAnimationFrame(() => {
      element.selectionStart = end;
      element.selectionEnd = end;
    });

    if (onChangeInputField && fieldName) {
      const countDot = clearingValue.match(/\./g) || 0;
      if (clearingValue.length > 1 && countDot == 0) {
        // check if remove dot
        clearingValue = clearingValue.slice(0, -2);
      } else {
        // check if key more than 1 dot
        clearingValue = clearingValue.replace(/\.+/g, ".");
      }
      // set value
      if (+clearingValue < Number.MAX_SAFE_INTEGER) {
        onChangeInputField(fieldName, clearingValue || "0");
        this.setState({ delimiterLength: match ? match.length : 0 });
      }
    }
  };
}
const styles: any = {
  read: {
    background: COLORS.solitude
  },
  edit: {
    background: COLORS.white
  },
  labelRead: {
    border: "1px solid #CBCFD3"
  },
  labelEdit: {
    border: "initial"
  }
};

export default CurrencyInput;
