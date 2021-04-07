import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { FormDisplay } from "../../../components/common";
import { CurrencyInput } from "../../../components/common/input";
import { OcupationDDL } from "../../admin/occupation/components";
import { OcupationListModel } from "../../admin/occupation/OcupationListModel";
import { IOcupationModel } from "../../admin/occupation/OcupationModel";

interface IOccupationInfoForm extends WithTranslation {
  occupation: IOcupationModel;
  onChangeInputField?: (fieldName: string, value: any) => void;
  inputFieldCompanyName: string;
  inputFieldPosition: string;
  valueFieldCompanyName: string;
  valueFieldPosition: string;
  readOnly?: boolean;
}

@observer
class OccupationInfoForm extends React.Component<IOccupationInfoForm> {
  private ocupationList = OcupationListModel.create({});
  public render() {
    const {
      readOnly,
      occupation,
      inputFieldCompanyName,
      valueFieldCompanyName,
      inputFieldPosition,
      valueFieldPosition,
      t
    } = this.props;
    return (
      <Segment>
        <Form.Group widths="equal">
          {readOnly ? (
            <FormDisplay
              title={t("module.loan.components.occupation")}
              value={occupation.name || "-"}
            />
          ) : (
            <Form.Field
              label={t("module.loan.components.occupation")}
              placeholder={t("module.loan.components.pleaseChooseOccupation")}
              control={OcupationDDL}
              value={occupation.id}
              ocupationList={this.ocupationList}
              onChange={this.onChangeOcupationDDL}
              ocupationType="guarantee"
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
        {readOnly ? (
          <FormDisplay
            title={t("module.loan.components.companyOfficeName")}
            value={valueFieldCompanyName}
          />
        ) : (
          <Form.Input
            fluid
            label={t("module.loan.components.companyOfficeName")}
            placeholder={t("module.loan.components.specifyCompanyOfficeName")}
            onChange={(event: any, data: any) =>
              this.onChangeInputField(inputFieldCompanyName, data.value)
            }
            value={valueFieldCompanyName}
          />
        )}
        {readOnly ? (
          <FormDisplay
            title={t("module.loan.components.position")}
            value={valueFieldPosition}
          />
        ) : (
          <Form.Input
            fluid
            label={t("module.loan.components.position")}
            placeholder={t("module.loan.components.specifyPosition")}
            onChange={(event: any, data: any) =>
              this.onChangeInputField(inputFieldPosition, data.value)
            }
            value={valueFieldPosition}
          />
        )}
        <Form.Field
          id={"input-occupationInfoForm-salary"}
          label={t("module.loan.components.income")}
          control={CurrencyInput}
          labelText={t("module.loan.components.bahtMonth")}
          readOnly={readOnly}
          value={occupation.salary}
          onChangeInputField={this.onChangeInputSalary}
          fieldName={"salary"}
        />
      </Segment>
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

export default withTranslation()(OccupationInfoForm);
