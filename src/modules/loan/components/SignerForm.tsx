import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { DateInput } from "../../../components/common/input";
import { TitleDDL } from "../../../components/project";

interface ISignerForm extends WithTranslation {
  agreementAuthorizedTitle?: string;
  agreementAuthorizedFirstname?: string;
  agreementAuthorizedLastname?: string;
  agreementAuthorizedPosition?: string;
  agreementAuthorizedCommandNo?: string;
  agreementAuthorizedCommandDate?: string;
  onChangeInputField: (fieldname: string, value: any) => void;
}

@observer
class SignerForm extends React.Component<ISignerForm> {
  public render() {
    const {
      t,
      onChangeInputField,
      agreementAuthorizedTitle,
      agreementAuthorizedFirstname,
      agreementAuthorizedLastname,
      agreementAuthorizedPosition,
      agreementAuthorizedCommandNo,
      agreementAuthorizedCommandDate
    } = this.props;
    return (
      <Segment padded>
        <Form.Group widths="equal">
          <TitleDDL
            placeholder={t("module.loan.agreementSigner.specifyNamePrefix")}
            label={t("module.loan.agreementSigner.title")}
            fluid
            width={4}
            onChange={(event: any, data: any) =>
              onChangeInputField("agreementAuthorizedTitle", data.value)
            }
            value={agreementAuthorizedTitle}
          />
          <Form.Input
            label={t("module.loan.agreementSigner.firstname")}
            placeholder={t("module.loan.agreementSigner.specifyName")}
            width={6}
            fluid
            onChange={(event: any, data: any) =>
              onChangeInputField("agreementAuthorizedFirstname", data.value)
            }
            value={agreementAuthorizedFirstname}
          />
          <Form.Input
            label={t("module.loan.agreementSigner.lastNames")}
            placeholder={t("module.loan.agreementSigner.specifyLastName")}
            width={6}
            fluid
            onChange={(event: any, data: any) =>
              onChangeInputField("agreementAuthorizedLastname", data.value)
            }
            value={agreementAuthorizedLastname}
          />
        </Form.Group>
        <Form.Input
          fluid
          label={t("module.loan.agreementSigner.position")}
          placeholder={t("module.loan.agreementSigner.specifyLocation")}
          onChange={(event: any, data: any) =>
            onChangeInputField("agreementAuthorizedPosition", data.value)
          }
          value={agreementAuthorizedPosition}
        />
        <Form.Input
          fluid
          label={t("module.loan.agreementSigner.acceptedAccordingOrderNumber")}
          placeholder={t("module.loan.agreementSigner.specifyOrderNumber")}
          onChange={(event: any, data: any) =>
            onChangeInputField("agreementAuthorizedCommandNo", data.value)
          }
          value={agreementAuthorizedCommandNo}
        />
        <Form.Field
          label={t("module.loan.agreementSigner.datedOrder")}
          control={DateInput}
          id={"agreementAuthorizedCommandDate"}
          value={agreementAuthorizedCommandDate}
          fieldName="agreementAuthorizedCommandDate"
          onChangeInputField={onChangeInputField}
        />
      </Segment>
    );
  }
}

export default withTranslation()(SignerForm);
