import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { DropdownProps, Form, Header, Segment } from "semantic-ui-react";
import { DateInput } from "../../../../components/common";
import { TitleDDL } from "../../../../components/project";
import { WitnessForm } from "../../../loan/components";
import { IOrgModel } from "../OrgModel";

interface IAuthorizedPersonForm extends WithTranslation {
  org: IOrgModel;
}
@observer
class AuthorizedPersonForm extends React.Component<IAuthorizedPersonForm> {
  public render() {
    const { t, org } = this.props;
    return (
      <Segment padded="very">
        <Header
          id="header-form-authorized-person"
          size="medium"
          content={t("module.admin.authorizedPersonForm.authorizedPerson")}
          subheader={t(
            "module.admin.authorizedPersonForm.pleaseSpecifyAuthorizedSignatoryDocument"
          )}
          style={styles.header}
        />
        <Form onSubmit={this.updateForm}>
          <Form.Group widths="equal">
            <TitleDDL
              id="form-input-ddl-agreement-authorized-title"
              search
              fluid
              placeholder={t("module.admin.authorizedPersonForm.prefix")}
              label={t("module.admin.authorizedPersonForm.title")}
              onChange={(
                event: React.SyntheticEvent<HTMLElement, Event>,
                data: DropdownProps
              ) =>
                org.setField({
                  fieldname: "agreementAuthorizedTitle",
                  value: data.value
                })
              }
              value={org.agreementAuthorizedTitle}
            />
            <Form.Input
              id="form-input-agreement-authorized-firstname"
              fluid
              label={t("module.admin.authorizedPersonForm.firstName")}
              placeholder={t("module.admin.authorizedPersonForm.firstName")}
              onChange={(event: any, data: any) =>
                org.setField({
                  fieldname: "agreementAuthorizedFirstname",
                  value: data.value
                })
              }
              value={org.agreementAuthorizedFirstname}
            />
            <Form.Input
              id="form-input-agreement-authorized-lastname"
              fluid
              label={t("module.admin.authorizedPersonForm.lastNames")}
              placeholder={t("module.admin.authorizedPersonForm.lastNames")}
              onChange={(event: any, data: any) =>
                org.setField({
                  fieldname: "agreementAuthorizedLastname",
                  value: data.value
                })
              }
              value={org.agreementAuthorizedLastname}
            />
          </Form.Group>
          <Form.Input
            fluid
            id="form-input-agreement-authorized-position"
            label={t("module.admin.authorizedPersonForm.position")}
            placeholder={t("module.admin.authorizedPersonForm.position")}
            onChange={(event: any, data: any) =>
              org.setField({
                fieldname: "agreementAuthorizedPosition",
                value: data.value
              })
            }
            value={org.agreementAuthorizedPosition}
          />
          <Form.Input
            id="form-input-agreement-authorized-command-no"
            fluid
            label={t("module.admin.authorizedPersonForm.authorizedOrderNumber")}
            placeholder={t(
              "module.admin.authorizedPersonForm.specifyOrderNumber"
            )}
            onChange={(event: any, data: any) =>
              org.setField({
                fieldname: "agreementAuthorizedCommandNo",
                value: data.value
              })
            }
            value={org.agreementAuthorizedCommandNo}
          />
          <Form.Field
            id="form-input-agreement-authorized-command-date"
            fluid
            label={t("module.admin.authorizedPersonForm.datedOrder")}
            control={DateInput}
            fieldName="agreementAuthorizedCommandDate"
            onChangeInputField={(fieldname: string, value: any) =>
              org.setField({ fieldname, value })
            }
            value={org.agreementAuthorizedCommandDate || ""}
          />
          <Form.Field
            id="form-input-witness"
            label={t("module.loan.agreementFormCreate.witness")}
            width={16}
            control={WitnessForm}
            witness1={org.witness1}
            witness2={org.witness2}
            onChangeInputField={this.onChangeInputField}
          />
          <Form.Group widths="equal">
            <Form.Field />
            <Form.Button
              width={5}
              id="form-button-submit-authorized-person-form"
              fluid
              floated="right"
              color="blue"
            >
              {t("module.admin.authorizedPersonForm.save")}
            </Form.Button>
          </Form.Group>
        </Form>
      </Segment>
    );
  }
  private onChangeInputField = (fieldname: string, value: any) => {
    const { org } = this.props;
    org.setField({ fieldname, value });
  };
  private updateForm = async () => {
    const { org } = this.props;
    try {
      if (org.id) {
        await org.updateAuthorizedPersonOrg();
      }
    } catch (e) {
      console.log(e);
    }
  };
}

const styles: any = {
  header: {
    marginBottom: 28
  },
  row: {
    paddingTop: 0,
    paddingBottom: 0
  },
  column: {
    paddingTop: 14,
    paddingBottom: 14
  }
};

export default withTranslation()(AuthorizedPersonForm);
