import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Radio, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";

interface IEnvelopSize extends WithTranslation {
  onChangeInputField?: (fieldName: string, value: any) => void;
  inputFieldEnvelopSize: string;
  valueFieldEnvelopSize: number;
  readOnly?: boolean;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class EnvelopSize extends React.Component<IEnvelopSize> {
  public render() {
    const {
      inputFieldEnvelopSize,
      valueFieldEnvelopSize,
      readOnly,
      appStore
    } = this.props;
    return (
      <Segment>
        <div className="inline fields" style={styles.formGroup}>
          {appStore!
            .enumItems("envelopSize")
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
                    this.onChangeInputField(
                      inputFieldEnvelopSize,
                      data.value
                    )
                  }
                  checked={valueFieldEnvelopSize === item.value}
                  readOnly={readOnly}
                />
              </React.Fragment>
            ))}
        </div>
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
const styles: any = {
  formGroup: {
    flexWrap: "wrap",
    flexDirection: "initial",
    marginBottom: 0
  }
};
export default withTranslation()(EnvelopSize);
