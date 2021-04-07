import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Radio, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";

interface IRelationshipType extends WithTranslation {
  onChangeInputField?: (fieldName: string, value: any) => void;
  inputFieldRelationshipType: string;
  valueFieldRelationshipType: number;
  readOnly?: boolean;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class RelationshipType extends React.Component<IRelationshipType> {
  public render() {
    const {
      inputFieldRelationshipType,
      valueFieldRelationshipType,
      readOnly,
      appStore
    } = this.props;
    return (
      <Segment>
        <Form.Group inline style={{ marginBottom: 0 }}>
          {appStore!
            .enumItems("guarantorBorrowerRelationship")
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
                      inputFieldRelationshipType,
                      data.value
                    )
                  }
                  checked={valueFieldRelationshipType === item.value}
                  readOnly={readOnly}
                />
              </React.Fragment>
            ))}
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

export default withTranslation()(RelationshipType);
