import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { FormDisplay } from "../../../../components/common";
import { CurrencyInput } from "../../../../components/common/input";
import { IOcupationModel } from "../../../admin/occupation/OcupationModel";

interface IGuaranteeOccuption extends WithTranslation {
  guarantorOccupation: IOcupationModel;
  guarantorSalary: number | string;
  guarantorCompanyName: string;
  guarantorPosition: string;
}

@observer
class GuaranteeOccuption extends React.Component<IGuaranteeOccuption> {
  public render() {
    const {
      t,
      guarantorOccupation,
      guarantorSalary,
      guarantorCompanyName,
      guarantorPosition
    } = this.props;
    return (
      <Segment padded>
        <Form.Group widths="equal">
          <FormDisplay
            title={t("module.loan.guaranteeOccuption.occupation")}
            value={
              guarantorOccupation.id
                ? `${guarantorOccupation.name} ${guarantorOccupation.description} `
                : "-"
            }
          />
          <FormDisplay
            title={t("module.loan.guaranteeOccuption.company")}
            value={guarantorCompanyName || "-"}
          />
          <FormDisplay
            title={t("module.loan.guaranteeOccuption.position")}
            value={guarantorPosition || "-"}
          />
        </Form.Group>
        <Form.Field
          label={t("module.loan.guaranteeOccuption.income")}
          width={16}
          control={CurrencyInput}
          id={"input-guaranteeOccuption-guarantorSalary"}
          labelText={t("module.loan.guaranteeOccuption.bahtMonth")}
          value={guarantorSalary}
          readOnly
        />
      </Segment>
    );
  }
}
export default withTranslation()(GuaranteeOccuption);
