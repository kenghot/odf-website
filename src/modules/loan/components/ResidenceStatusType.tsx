import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Radio, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { CurrencyInput } from "../../../components/common/input";

interface IResidenceStatusType extends WithTranslation {
  id: string;
  onChangeInputField?: (fieldName: string, value: any) => void;
  inputFieldStatusType: string;
  valueFieldStatusType: number;
  inputFieldDescription: string;
  valueFieldDescription: string;
  readOnly?: boolean;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class ResidenceStatusType extends React.Component<IResidenceStatusType> {
  public render() {
    const {
      inputFieldStatusType,
      valueFieldStatusType,
      readOnly,
      appStore
    } = this.props;
    return (
      <Segment>
        <div className="inline fields" style={styles.formGroup}>
          {appStore!
            .enumItems("residenceStatusType")
            .map((item: any, index: number) => (
              <React.Fragment key={index}>
                <Form.Field
                  control={Radio}
                  label={item.text}
                  value={item.value}
                  onChange={(
                    event: React.SyntheticEvent<HTMLElement>,
                    data: any
                  ) =>
                    this.onChangeInputField(inputFieldStatusType, data.value)
                  }
                  checked={valueFieldStatusType === item.value}
                  readOnly={readOnly}
                />
                {valueFieldStatusType === item.value &&
                (valueFieldStatusType === 0 || valueFieldStatusType === 1)
                  ? this.renderInput()
                  : null}
                {valueFieldStatusType === item.value &&
                valueFieldStatusType === 99
                  ? this.renderInputOther()
                  : null}
              </React.Fragment>
            ))}
        </div>
      </Segment>
    );
  }

  private renderInputOther() {
    const {
      readOnly,
      valueFieldDescription,
      inputFieldDescription,
      t
    } = this.props;
    return (
      <Form.Input
        width={5}
        placeholder={t("module.loan.components.specifyOtherDetails")}
        onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
          this.onChangeInputField(inputFieldDescription, data.value)
        }
        value={valueFieldDescription}
        style={styles.formInput}
        readOnly={readOnly}
      />
    );
  }

  private renderInput() {
    const {
      id,
      readOnly,
      valueFieldDescription,
      inputFieldDescription,
      t
    } = this.props;
    return (
      <Form.Field
        width={6}
        control={CurrencyInput}
        id={`input-value-field-description-${id}`}
        labelText={t("module.loan.components.bahtMonth")}
        readOnly={readOnly}
        value={valueFieldDescription}
        onChangeInputField={this.onChangeInputField}
        fieldName={inputFieldDescription}
        style={{ marginBottom: 7 }}
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
  },
  formGroup: {
    flexWrap: "wrap",
    flexDirection: "initial"
  }
};

export default withTranslation()(ResidenceStatusType);
