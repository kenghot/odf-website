import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Radio, Segment } from "semantic-ui-react";
import { InputLabel } from "../../../components/common";

interface IResidenceWith extends WithTranslation {
  onChangeInputField?: (fieldName: string, value: any) => void;
  inputFieldResidenceWith: string;
  valueFieldResidenceWith: number;
  inputFieldDescription: string;
  valueFieldDescription: string;
  readOnly?: boolean;
}

@observer
class ResidenceWith extends React.Component<IResidenceWith> {
  public render() {
    const {
      inputFieldResidenceWith,
      valueFieldResidenceWith,
      readOnly,
      t
    } = this.props;
    return (
      <Segment>
        <Form.Group inline style={{ marginBottom: 0 }}>
          <Form.Field
            control={Radio}
            label={t("module.loan.components.spouse")}
            value={0}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField(inputFieldResidenceWith, data.value)
            }
            checked={valueFieldResidenceWith === 0}
            readOnly={readOnly}
          />
          {this.renderResidenceWithChildren()}
          {this.renderOther()}
        </Form.Group>
      </Segment>
    );
  }

  private renderOther() {
    const {
      inputFieldResidenceWith,
      valueFieldResidenceWith,
      inputFieldDescription,
      valueFieldDescription,
      readOnly,
      t
    } = this.props;
    return (
      <React.Fragment>
        <Form.Field
          control={Radio}
          label={t("module.loan.components.other")}
          value={2}
          onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
            this.onChangeInputField(inputFieldResidenceWith, data.value)
          }
          checked={valueFieldResidenceWith === 2}
          readOnly={readOnly}
        />
        {valueFieldResidenceWith === 2 ? (
          <Form.Input
            width={5}
            placeholder={t("module.loan.components.specifyOtherDetails")}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField(inputFieldDescription, data.value)
            }
            value={valueFieldDescription}
            style={styles.formInput}
          />
        ) : null}
      </React.Fragment>
    );
  }
  private renderResidenceWithChildren() {
    const {
      inputFieldResidenceWith,
      valueFieldResidenceWith,
      readOnly,
      t
    } = this.props;
    return (
      <React.Fragment>
        <Form.Field
          control={Radio}
          label={t("module.loan.components.child")}
          value={1}
          onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
            this.onChangeInputField(inputFieldResidenceWith, data.value)
          }
          checked={valueFieldResidenceWith === 1}
          readOnly={readOnly}
        />
        {valueFieldResidenceWith === 1 ? this.renderInput() : null}
      </React.Fragment>
    );
  }

  private renderInput() {
    const {
      readOnly,
      valueFieldDescription,
      inputFieldDescription,
      t
    } = this.props;
    return (
      <Form.Field
        width={5}
        type="number"
        control={InputLabel}
        labelText={t("module.loan.components.person")}
        placeholder="0"
        readOnly={readOnly}
        value={valueFieldDescription}
        onChangeInputField={this.onChangeInputField}
        fieldName={inputFieldDescription}
      />
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
  formInput: {
    marginTop: 14
  }
};

export default withTranslation()(ResidenceWith);
