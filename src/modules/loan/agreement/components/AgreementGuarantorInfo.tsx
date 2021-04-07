import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { FormDisplay } from "../../../../components/common";
import { IAgreementItemModel } from "../AgreementModel";

interface IAgreementGuarantorInfo extends WithTranslation {
  agreementItem: IAgreementItemModel;
}

@observer
class AgreementGuarantorInfo extends React.Component<IAgreementGuarantorInfo> {
  public render() {
    const { t, agreementItem } = this.props;
    return (
      <Segment padded>
        <Form.Group widths="equal">
          <FormDisplay
            title={t("module.loan.agreementGuarantorInfo.title")}
            value={agreementItem.guarantor.title || "-"}
          />
          <FormDisplay
            title={t("module.loan.agreementGuarantorInfo.firstname")}
            value={agreementItem.guarantor.firstname || "-"}
          />
          <FormDisplay
            title={t("module.loan.agreementGuarantorInfo.lastNames")}
            value={agreementItem.guarantor.lastname || "-"}
          />
        </Form.Group>
      </Segment>
    );
  }
}

export default withTranslation()(AgreementGuarantorInfo);
