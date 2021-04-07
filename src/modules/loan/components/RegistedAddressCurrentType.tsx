import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Icon, Radio, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { IAddressModel } from "../../../components/address";
import MapModal from "../../../modals/MapModal";

interface IRegistedAddressCurrentType extends WithTranslation {
  onChangeInputField?: (fieldName: string, value: any) => void;
  inputFieldCurrentAddressType: string;
  valueFieldCurrentAddressType: number;
  address?: IAddressModel;
  readOnly?: boolean;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class RegistedAddressCurrentType extends React.Component<
  IRegistedAddressCurrentType
> {
  public render() {
    const {
      inputFieldCurrentAddressType,
      valueFieldCurrentAddressType,
      readOnly,
      address,
      appStore,
      t
    } = this.props;
    return (
      <Segment>
        <Form.Group inline style={{ marginBottom: 0 }} widths="equal">
          {appStore!
            .enumItems("addressType")
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
                      inputFieldCurrentAddressType,
                      data.value
                    )
                  }
                  checked={valueFieldCurrentAddressType === item.value}
                  readOnly={readOnly}
                />
              </React.Fragment>
            ))}
          {address ? (
            <Form.Field
              control={MapModal}
              address={address}
              mode={readOnly ? undefined : "editMode"}
              trigger={
                <Button floated="right" color="red" type="button">
                  <Icon name="map marker alternate" />
                  {t("module.loan.components.diagram")}
                </Button>
              }
            />
          ) : null}
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

export default withTranslation()(RegistedAddressCurrentType);
