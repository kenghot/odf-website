import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Input, Label, List } from "semantic-ui-react";

interface IInputButton extends WithTranslation {
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  style?: any;
  type?: string;
  value?: any;
  fieldName?: string;
  id?: string;
  onClickPlus?: () => void;
  onClickMinus?: () => void;
  onChangeInputField?: (fieldName: string, value: any) => void;
}
@observer
class InputButton extends React.Component<IInputButton> {
  public render() {
    const {
      style,
      placeholder,
      type,
      readOnly,
      value,
      disabled,
      id,
      fieldName
    } = this.props;
    return (
      <Input
        fluid
        style={style}
        disabled={disabled}
        readOnly={readOnly}
        labelPosition="right"
        type={type || "text"}
        placeholder={placeholder}
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
          value={value}
          onChange={(event: any) =>
            this.onChangeInputField(fieldName!, event.target.value)
          }
        />
        <Label basic style={styles.labelStyle}>
          <List>
            <List.Item
              style={styles.iconPlus}
              onClick={() => this.onClickPlus()}
            >
              +
            </List.Item>
            <List.Item
              style={styles.iconMinus}
              onClick={() => this.onClickMinus()}
            >
              -
            </List.Item>
          </List>
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
  private onClickPlus = () => {
    const { onClickPlus, readOnly } = this.props;
    if (typeof onClickPlus !== "undefined" && !readOnly) {
      onClickPlus();
    }
  };
  private onClickMinus = () => {
    const { onClickMinus, readOnly } = this.props;
    if (typeof onClickMinus !== "undefined" && !readOnly) {
      onClickMinus();
    }
  };
}
const styles: any = {
  iconMinus: {
    paddingTop: 0,
    paddingLeft: 11.662,
    paddingRight: 11.662,
    textAlign: "center",
    cursor: "pointer"
  },
  iconPlus: {
    paddingBottm: 0,
    paddingLeft: 11.662,
    paddingRight: 11.662,
    borderBottom: "1px solid #E8E8E8",
    textAlign: "center",
    cursor: "pointer"
  },
  labelStyle: {
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 0,
    paddingRight: 0
  }
};
export default withTranslation()(InputButton);
