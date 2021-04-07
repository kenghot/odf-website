import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Radio, Segment } from "semantic-ui-react";

interface IRegistedAddressType extends WithTranslation {
  onChangeInputField?: (fieldName: string, value: any) => void;
  inputFieldAddressType: string;
  valueFieldAddressType: number;
  readOnly?: boolean;
}

@observer
class RegistedAddressType extends React.Component<IRegistedAddressType> {
  public render() {
    const {
      inputFieldAddressType,
      valueFieldAddressType,
      readOnly,
      t
    } = this.props;
    return (
      <Segment>
        <Form.Group inline style={{ marginBottom: 0 }}>
          <Form.Field
            control={Radio}
            label={t("module.loan.components.byIDCard")}
            value={0}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField(inputFieldAddressType, data.value)
            }
            checked={valueFieldAddressType === 0}
            readOnly={readOnly}
          />
          <Form.Field
            control={Radio}
            label={t("module.loan.components.other")}
            value={99}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField(inputFieldAddressType, data.value)
            }
            checked={valueFieldAddressType === 99}
            readOnly={readOnly}
          />
        </Form.Group>
      </Segment>
    );
  }
  private onChangeInputField = (fieldName: string, value: any) => {
    const { onChangeInputField } = this.props;
    if (typeof onChangeInputField !== "undefined") {
      onChangeInputField(fieldName, value);
    }
  };
}

export default withTranslation()(RegistedAddressType);
