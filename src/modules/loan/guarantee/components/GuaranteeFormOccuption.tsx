import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { CurrencyInput } from "../../../../components/common/input";
import { OcupationDDL } from "../../../admin/occupation/components";
import { OcupationListModel } from "../../../admin/occupation/OcupationListModel";
import { IOcupationModel } from "../../../admin/occupation/OcupationModel";

interface IGuaranteeFormOccuption extends WithTranslation {
  guarantorOccupation: IOcupationModel;
  guarantorSalary: number;
  guarantorCompanyName: string;
  guarantorPosition: string;
  onChangeTextField: (fieldname: string, value: any) => void;
}

@observer
class GuaranteeFormOccuption extends React.Component<IGuaranteeFormOccuption> {
  private ocupationList = OcupationListModel.create({});
  public render() {
    const {
      guarantorOccupation,
      guarantorSalary,
      guarantorPosition,
      guarantorCompanyName,
      onChangeTextField,
      t
    } = this.props;
    return (
      <Segment padded>
        <Form.Field
          label={t("module.loan.guaranteeOccuption.occupation")}
          placeholder={t(
            "module.loan.guaranteeOccuption.pleaseChooseOccupation"
          )}
          control={OcupationDDL}
          value={
            guarantorOccupation.id ? guarantorOccupation.id.toString() : ""
          }
          ocupationList={this.ocupationList}
          onChange={this.onChangeOcupationDDL}
          ocupationType="guarantee"
        />
        <Form.Input
          fluid
          label={t("module.loan.guaranteeOccuption.company")}
          placeholder={t("module.loan.guaranteeOccuption.pleaseSpecifyCompany")}
          onChange={(event, data) =>
            onChangeTextField("guarantorCompanyName", data.value)
          }
          value={guarantorCompanyName}
        />
        <Form.Input
          fluid
          label={t("module.loan.guaranteeOccuption.position")}
          placeholder={t("module.loan.guaranteeOccuption.specifyPosition")}
          onChange={(event, data) =>
            onChangeTextField("guarantorPosition", data.value)
          }
          value={guarantorPosition}
        />
        <Form.Field
          label={t("module.loan.guaranteeOccuption.income")}
          width={16}
          control={CurrencyInput}
          id={"input-guarantee-guarantorSalary"}
          labelText={t("module.loan.guaranteeOccuption.bahtMonth")}
          onChangeInputField={(fieldName: string, value: any) =>
            onChangeTextField("guarantorSalary", value)
          }
          fieldName="salary"
          value={guarantorSalary}
        />
      </Segment>
    );
  }

  private onChangeOcupationDDL = (id: any) => {
    const { guarantorOccupation } = this.props;
    if (this.ocupationList.list.length > 0) {
      const item = this.ocupationList.list.find(
        (item: IOcupationModel) => item.id === id
      );
      if (item) {
        guarantorOccupation!.setField({ fieldname: "id", value: item.id });
        guarantorOccupation!.setField({
          fieldname: "salary",
          value: item.salary
        });
        guarantorOccupation!.setField({
          fieldname: "description",
          value: item.description
        });
        guarantorOccupation!.setField({ fieldname: "name", value: item.name });
      }
    }
  };
}
export default withTranslation()(GuaranteeFormOccuption);
