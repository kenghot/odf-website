import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Radio, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";

interface IMarriageStatusType extends WithTranslation {
  onChangeInputField?: (fieldName: string, value: any) => void;
  inputFieldMarriageStatus: string;
  valueFieldMarriageStatus: number;
  readOnly?: boolean;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class MarriageStatusType extends React.Component<IMarriageStatusType> {
  public render() {
    const {
      inputFieldMarriageStatus,
      valueFieldMarriageStatus,
      readOnly,
      appStore
    } = this.props;
    return (
      <Segment>
        <div className="inline fields" style={styles.formGroup}>
          {appStore!
            .enumItems("marriageStatus")
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
                      inputFieldMarriageStatus,
                      data.value
                    )
                  }
                  checked={valueFieldMarriageStatus === item.value}
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
export default withTranslation()(MarriageStatusType);
