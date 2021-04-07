import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { FormDisplay } from "../../../components/common";
import { date_display_CE_TO_BE } from "../../../utils";

interface ISignerView extends WithTranslation {
  agreementAuthorizedTitle?: string;
  agreementAuthorizedFirstname?: string;
  agreementAuthorizedLastname?: string;
  agreementAuthorizedPosition?: string;
  agreementAuthorizedCommandNo?: string;
  agreementAuthorizedCommandDate?: string;
}

@observer
class SignerView extends React.Component<ISignerView> {
  public render() {
    const {
      t,
      agreementAuthorizedTitle,
      agreementAuthorizedFirstname,
      agreementAuthorizedLastname,
      agreementAuthorizedPosition,
      agreementAuthorizedCommandNo,
      agreementAuthorizedCommandDate,
    } = this.props;
    return (
      <Segment padded>
        <Form.Group widths="equal">
          <FormDisplay
            title={t("module.loan.agreementSigner.title")}
            value={agreementAuthorizedTitle || "-"}
          />
          <FormDisplay
            title={t("module.loan.agreementSigner.firstname")}
            value={agreementAuthorizedFirstname || "-"}
          />
          <FormDisplay
            title={t("module.loan.agreementSigner.lastNames")}
            value={agreementAuthorizedLastname || "-"}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <FormDisplay
            title={t("module.loan.agreementSigner.position")}
            value={agreementAuthorizedPosition || "-"}
          />
          <FormDisplay
            title={t(
              "module.loan.agreementSigner.acceptedAccordingOrderNumber",
            )}
            value={agreementAuthorizedCommandNo || "-"}
          />
          <FormDisplay
            title={t("module.loan.agreementSigner.datedOrder")}
            value={date_display_CE_TO_BE(agreementAuthorizedCommandDate) || "-"}
          />
        </Form.Group>
      </Segment>
    );
  }
}

export default withTranslation()(SignerView);
