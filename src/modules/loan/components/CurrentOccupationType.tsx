import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Radio, Segment } from "semantic-ui-react";
import { FormDisplay } from "../../../components/common";
import { CurrencyInput } from "../../../components/common/input";
import { OcupationDDL } from "../../admin/occupation/components";
import { OcupationListModel } from "../../admin/occupation/OcupationListModel";
import { IOcupationModel } from "../../admin/occupation/OcupationModel";

interface ICurrentOccupationType extends WithTranslation {
  occupation: IOcupationModel;
  isWorking: boolean;
  onChangeInputField?: (fieldName: string, value: any) => void;
  inputFieldIsWorking: string;
  readOnly?: boolean;
  ocupationType?: "borrow" | "guarantee" | "request";
}

@observer
class CurrentOccupationType extends React.Component<ICurrentOccupationType> {
  private ocupationList = OcupationListModel.create({});
  public render() {
    const { inputFieldIsWorking, isWorking, readOnly, t } = this.props;
    return (
      <Segment>
        <Form.Group inline>
          <Form.Field
            control={Radio}
            label={t("module.loan.components.career")}
            value={0}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField(inputFieldIsWorking, true)
            }
            checked={isWorking === true}
            readOnly={readOnly}
          />
          <Form.Field
            control={Radio}
            label={t("module.loan.components.noOccupation")}
            value={1}
            onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
              this.onChangeInputField(inputFieldIsWorking, false)
            }
            checked={isWorking === false}
            readOnly={readOnly}
          />
        </Form.Group>
        {isWorking ? this.renderIsWorking() : null}
      </Segment>
    );
  }

  private renderIsWorking() {
    const { readOnly, occupation, ocupationType, t } = this.props;

    return (
      <React.Fragment>
        <Form.Group widths="equal">
          {readOnly ? (
            <FormDisplay
              title={t("module.loan.components.occupation")}
              value={occupation.name}
            />
          ) : (
            <Form.Field
              label={t("module.loan.components.occupation")}
              placeholder={t("module.loan.components.pleaseChooseOccupation")}
              control={OcupationDDL}
              value={occupation.id}
              ocupationList={this.ocupationList}
              onChange={this.onChangeOcupationDDL}
              // ocupationType="borrow"
              ocupationType={ocupationType}
              disabled={readOnly}
            />
          )}

          {readOnly ? (
            <FormDisplay
              title={t("module.loan.components.description")}
              value={occupation.description}
            />
          ) : (
            <Form.Input
              fluid
              label={t("module.loan.components.description")}
              placeholder={t("module.loan.components.specifyOccupationDetails")}
              onChange={(event: any, data: any) =>
                occupation!.setField({
                  fieldname: "description",
                  value: data.value
                })
              }
              value={occupation.description}
            />
          )}
        </Form.Group>
        <Form.Field
          id={"input-occupation-salary-type"}
          label={t("module.loan.components.income")}
          control={CurrencyInput}
          labelText={t("module.loan.components.bahtMonth")}
          readOnly={readOnly}
          value={occupation.salary}
          onChangeInputField={this.onChangeInputSalary}
          fieldName={"salary"}
        />
      </React.Fragment>
    );
  }

  private onChangeInputSalary = (fieldname: string, value: any) => {
    const { occupation } = this.props;
    occupation.setField({ fieldname, value });
  };

  private onChangeInputField = (fieldName: string, value: any) => {
    const { onChangeInputField } = this.props;
    if (typeof onChangeInputField !== "undefined") {
      onChangeInputField(fieldName, value);
    }
  };
  private onChangeOcupationDDL = (id: any) => {
    const { occupation } = this.props;
    if (this.ocupationList.list.length > 0) {
      const item = this.ocupationList.list.find(
        (item: IOcupationModel) => item.id === id
      );
      if (item) {
        occupation!.setField({ fieldname: "id", value: item.id });
        occupation!.setField({ fieldname: "salary", value: item.salary });
        occupation!.setField({
          fieldname: "description",
          value: item.description
        });
        occupation!.setField({ fieldname: "name", value: item.name });
      }
    }
  };
}

export default withTranslation()(CurrentOccupationType);
