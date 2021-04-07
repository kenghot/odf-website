import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { DropdownProps, Form, Header, Segment } from "semantic-ui-react";
import { AttachedFile } from "../../../../components/common";
import { TitleDDL } from "../../../../components/project";
import { IOrgModel } from "../OrgModel";

interface IDonationPersonForm extends WithTranslation {
  org: IOrgModel;
}
@observer
class DonationPersonForm extends React.Component<IDonationPersonForm> {
  public render() {
    const { t, org } = this.props;
    return (
      <Segment padded="very">
        <Header
          id="header-form-donation-person"
          size="medium"
          content={t("module.admin.DonationPersonForm.header")}
          subheader={t("module.admin.DonationPersonForm.subheader")}
          style={styles.header}
        />
        <Form onSubmit={this.updateForm}>
          <Form.Group widths="equal">
            <TitleDDL
              id="form-input-ddl-donation-authorized-title"
              search
              fluid
              placeholder={t("module.admin.authorizedPersonForm.prefix")}
              label={t("module.admin.authorizedPersonForm.title")}
              onChange={(
                event: React.SyntheticEvent<HTMLElement, Event>,
                data: DropdownProps
              ) =>
                org.setField({
                  fieldname: "donationAuthorizedTitle",
                  value: data.value,
                })
              }
              value={org.donationAuthorizedTitle}
            />
            <Form.Input
              id="form-input-donation-authorized-firstname"
              fluid
              label={t("module.admin.authorizedPersonForm.firstName")}
              placeholder={t("module.admin.authorizedPersonForm.firstName")}
              onChange={(event: any, data: any) =>
                org.setField({
                  fieldname: "donationAuthorizedFirstname",
                  value: data.value,
                })
              }
              value={org.donationAuthorizedFirstname}
            />
            <Form.Input
              id="form-input-donation-authorized-lastname"
              fluid
              label={t("module.admin.authorizedPersonForm.lastNames")}
              placeholder={t("module.admin.authorizedPersonForm.lastNames")}
              onChange={(event: any, data: any) =>
                org.setField({
                  fieldname: "donationAuthorizedLastname",
                  value: data.value,
                })
              }
              value={org.donationAuthorizedLastname}
            />
          </Form.Group>
          <Form.Input
            fluid
            id="form-input-donation-authorized-position"
            label={t("module.admin.authorizedPersonForm.position")}
            placeholder={t("module.admin.authorizedPersonForm.position")}
            onChange={(event: any, data: any) =>
              org.setField({
                fieldname: "donationAuthorizedPosition",
                value: data.value,
              })
            }
            value={org.donationAuthorizedPosition}
          />
          <Form.Field
            label={t("module.admin.DonationPersonForm.headerAttachedFile")}
            mode="edit"
            control={AttachedFile}
            multiple={true}
            addFiles={org.addFiles}
            removeFile={(index?: number) => this.onRemoveFile(index!)}
            fieldName="org.attachedFiles"
            files={org.fileList}
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
  private onRemoveFile = async (index: number) => {
    const { org } = this.props;
    try {
      await org.removeFile(index);
    } catch (e) {
      console.log(e);
    }
  };
  private updateForm = async () => {
    const { org } = this.props;
    try {
      if (org.id) {
        await org.updateDonationAuthorized();
      }
    } catch (e) {
      console.log(e);
    }
  };
}

const styles: any = {
  header: {
    marginBottom: 28,
  },
  row: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  column: {
    paddingTop: 14,
    paddingBottom: 14,
  },
};

export default withTranslation()(DonationPersonForm);
