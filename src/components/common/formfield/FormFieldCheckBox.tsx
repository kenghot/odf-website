import * as React from "react";
import { Checkbox, Form } from "semantic-ui-react";

interface IFormFieldCheckbox {
  label?: string;
  id?: string;
  label_checkbox?: string;
  disabled?: boolean;
  onChangeInputField?: (fieldName: string, value: any) => void;
  fieldName?: string;
  checked?: boolean;
}
class FormFieldCheckbox extends React.Component<IFormFieldCheckbox> {
  public render() {
    return (
      <Form.Field>
        <label>{this.props.label}</label>
        <Checkbox
          onChange={(event: any, data: any) =>
            this.onChangeInputField(this.props.fieldName!, data.checked)
          }
          id={this.props.id}
          checked={this.props.checked}
          disabled={this.props.disabled}
          style={{ ...styles.checkbox }}
          label={this.props.label_checkbox}
        />
      </Form.Field>
    );
  }
  private onChangeInputField = (fieldName: string, value: any) => {
    const { onChangeInputField } = this.props;
    if (typeof onChangeInputField !== "undefined") {
      onChangeInputField(fieldName, value);
    }
  };
}
const styles = {
  checkbox: {
    // "line-height": "36px",
  }
};
export default FormFieldCheckbox;
