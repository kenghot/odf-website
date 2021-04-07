import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Radio, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";

interface IResidenceType extends WithTranslation {
  onChangeInputField?: (fieldName: string, value: any) => void;
  inputFieldResidenceType: string;
  valueFieldResidenceType: number;
  inputFieldDescription: string;
  valueFieldDescription: string;
  readOnly?: boolean;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class ResidenceType extends React.Component<IResidenceType> {
  public render() {
    const {
      inputFieldResidenceType,
      valueFieldResidenceType,
      readOnly,
      appStore
    } = this.props;
    return (
      <Segment>
        <div className="inline fields" style={styles.formGroup}>
          {appStore!
            .enumItems("residenceType")
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
                    this.onChangeInputField(inputFieldResidenceType, data.value)
                  }
                  checked={valueFieldResidenceType === item.value}
                  readOnly={readOnly}
                />
                {valueFieldResidenceType === item.value &&
                valueFieldResidenceType === 99
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
      inputFieldDescription,
      valueFieldDescription,
      readOnly,
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

  private onChangeInputField = (fieldName: string, value: any) => {
    const { onChangeInputField } = this.props;
    if (typeof onChangeInputField !== "undefined") {
      onChangeInputField(fieldName, value);
    }
  };
}

const styles: any = {
  formInput: {
    marginTop: 7
  },
  formGroup: {
    flexWrap: "wrap",
    flexDirection: "initial",
    marginBottom: 0
  }
};

export default withTranslation()(ResidenceType);
