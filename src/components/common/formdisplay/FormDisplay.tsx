import * as React from "react";
import { Form, FormFieldProps } from "semantic-ui-react";

interface IFormDisplay extends FormFieldProps {
  title: string;
  value: string;
  id?: string;
}

class FormDisplay extends React.Component<IFormDisplay> {
  public render() {
    const { title, value, id, ...rest } = this.props;
    return (
      <Form.Field id={id} {...rest}>
        <label style={styles.headerTitleStyle}>{title}</label>
        <p>{value === undefined || value === "" ? "-" : value}</p>
      </Form.Field>
    );
  }
}

const styles = {
  headerTitleStyle: {
    // color: "rgba(0,0,0,0.6)",
  }
};
export default FormDisplay;
