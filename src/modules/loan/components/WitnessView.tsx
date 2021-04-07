import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { FormDisplay } from "../../../components/common";

interface IWitnessView extends WithTranslation {
  witness1?: string;
  witness2?: string;
}

@observer
class WitnessView extends React.Component<IWitnessView> {
  public render() {
    const { t, witness1, witness2 } = this.props;
    return (
      <Segment padded>
        <Form.Group widths="equal">
          <FormDisplay
            title={t("module.loan.agreenmentWitness.witness1")}
            value={witness1 || "-"}
          />
          <FormDisplay
            title={t("module.loan.agreenmentWitness.witness2")}
            value={witness2 || "-"}
          />
        </Form.Group>
      </Segment>
    );
  }
}

export default withTranslation()(WitnessView);
