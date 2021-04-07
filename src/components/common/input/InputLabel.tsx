import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Input, Label } from "semantic-ui-react";
import { COLORS } from "../../../constants";

interface IInputLabel extends WithTranslation {
  id?: string;
  labelText?: string;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  requiredField?: boolean;
  fluid?: boolean;
  style?: any;
  type?: string;
  value: any;
  fieldName?: string;
  onChangeInputField?: (fieldName: string, value: any) => void;
}
@observer
class InputLabel extends React.Component<IInputLabel> {
  public render() {
    const {
      id,
      labelText,
      style,
      placeholder,
      type,
      readOnly,
      value,
      disabled,
      fieldName,
      fluid,
      requiredField
    } = this.props;
    return (
      <Input
        fluid={fluid}
        style={style}
        disabled={disabled}
        readOnly={readOnly}
        labelPosition="right"
        type={type || "text"}
        placeholder={placeholder}
      >
        {requiredField ? (
          <input
            id={id}
            onClick={() => {
              const input: any = document.getElementById(id || "");
              if (input) {
                input.focus();
                input.select();
              }
            }}
            required
            value={value}
            style={readOnly ? styles.read : styles.edit}
            onChange={(event: any) =>
              this.onChangeInputField(fieldName!, event.target.value)
            }
          />
        ) : (
          <input
            id={id}
            onClick={() => {
              const input: any = document.getElementById(id || "");
              if (input) {
                input.focus();
                input.select();
              }
            }}
            value={value}
            style={readOnly ? styles.read : styles.edit}
            onChange={(event: any) =>
              this.onChangeInputField(fieldName!, event.target.value)
            }
          />
        )}
        <Label style={readOnly ? styles.labelRead : styles.labelEdit}>
          {labelText}
        </Label>
      </Input>
    );
  }
  private onChangeInputField = (fieldName: string, value: any) => {
    const { onChangeInputField } = this.props;
    if (typeof onChangeInputField !== "undefined") {
      onChangeInputField(fieldName, value);
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
export default withTranslation()(InputLabel);
