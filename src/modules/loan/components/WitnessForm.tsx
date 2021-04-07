import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";

interface IWitnessForm extends WithTranslation {
  id?: string;
  witness1?: string;
  witness2?: string;
  onChangeInputField: (fieldname: string, value: any) => void;
}

@observer
class WitnessForm extends React.Component<IWitnessForm> {
  public render() {
    const { t, id, witness1, witness2, onChangeInputField } = this.props;
    return (
      <Segment padded>
        <Form.Input
          id={`${id}-1`}
          fluid
          label={t("module.loan.agreenmentWitness.witness1")}
          placeholder={t(
            "module.loan.agreenmentWitness.identifyWitnessesSurnames",
          )}
          onChange={(event: any, data: any) =>
            onChangeInputField("witness1", data.value)
          }
          value={witness1}
        />
        <Form.Input
          id={`${id}-2`}
          fluid
          label={t("module.loan.agreenmentWitness.witness2")}
          placeholder={t(
            "module.loan.agreenmentWitness.identifyWitnessesSurnames",
          )}
          onChange={(event: any, data: any) =>
            onChangeInputField("witness2", data.value)
          }
          value={witness2}
        />
      </Segment>
    );
  }
}

export default withTranslation()(WitnessForm);
