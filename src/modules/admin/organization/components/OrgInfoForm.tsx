import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Checkbox, Form, Grid, Header, Segment } from "semantic-ui-react";
import { OrganizationDDL } from ".";
import { IAppModel } from "../../../../AppModel";
import { AddressFormBody, LocationModel } from "../../../../components/address";
import { DeleteModal } from "../../../../modals";
import { hasPermission } from "../../../../utils/render-by-permission";
import { OrgListModel } from "../OrgListModel";
import { IOrgModel } from "../OrgModel";

interface IOrgInfoForm extends WithTranslation, RouteComponentProps {
  org: IOrgModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class OrgInfoForm extends React.Component<IOrgInfoForm> {
  public locationStore = LocationModel.create({});
  private parentOrgList = OrgListModel.create({});

  public async componentDidMount() {
    setTimeout(() => {
      this.locationStore.loadSubdistrict(this.props.org.address.subDistrict);
      this.locationStore.loadDistrict(this.props.org.address.district);
      this.locationStore.loadProvince(this.props.org.address.province);
    }, 1000);
  }
  public render() {
    const { appStore, t, org } = this.props;
    return (
      <Segment padded="very">
        <Grid columns="equal" style={styles.header}>
          <Grid.Row verticalAlign="top">
            <Grid.Column>
              <Header
                size="medium"
                content={t("module.admin.orgInfoForm.organizationInfo")}
                subheader={t("module.admin.orgInfoForm.basicInfoOrganization")}
              />
            </Grid.Column>
            <Grid.Column floated="right" textAlign="right">
              <Form>
                <Form.Field>
                  <Checkbox
                    toggle
                    checked={org.active}
                    onChange={(e: any, data: any) =>
                      org.setField({
                        fieldname: "active",
                        value: data.checked
                      })
                    }
                    label={org.status}
                  />
                </Form.Field>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Form onSubmit={this.updateForm}>
          <Form.Input
            id="form-input-org-code"
            fluid
            label={t("module.admin.orgInfoForm.referenceCode")}
            placeholder={t("module.admin.orgInfoForm.referenceCode")}
            onChange={(event: any, data: any) =>
              org.setField({
                fieldname: "orgCode",
                value: data.value
              })
            }
            value={org.orgCode}
          />
          <Form.Input
            id="form-input-org-name"
            fluid
            label={t("module.admin.orgInfoForm.organizationName")}
            placeholder={t("module.admin.orgInfoForm.organizationName")}
            onChange={(event: any, data: any) =>
              org.setField({
                fieldname: "orgName",
                value: data.value
              })
            }
            value={org.orgName}
          />
          <Form.Field
            id="form-input-ddl-organization"
            label={t("module.admin.orgInfoForm.specifyOrganization")}
            control={OrganizationDDL}
            orgList={this.parentOrgList}
            onChange={this.onChangeOrganizationDDL}
            value={org.parent ? org.parent.id : ""}
          />
          <Form.Select
            fluid
            label={t("module.admin.orgInfoForm.region")}
            placeholder={t("module.admin.orgInfoForm.specifyRegion")}
            options={appStore!.enumItems("region")}
            onChange={(event: any, data: any) => {
              org.setField({
                fieldname: "region",
                value: data.value
              });
            }}
            value={org.region}
          />
          <Form.Field
            id="org"
            label={t("module.admin.orgInfoForm.address")}
            width={16}
            control={AddressFormBody}
            addressStore={org.address}
            locationStore={this.locationStore}
          />
          <Form.Input
            fluid
            id="form-input-org-telephone"
            label={t("module.admin.orgInfoForm.telephoneNumber")}
            placeholder={t("module.admin.orgInfoForm.telephoneNumber")}
            onChange={(event: any, data: any) =>
              org.setField({
                fieldname: "telephone",
                value: data.value
              })
            }
            value={org.telephone}
          />
          <Form.Group widths="equal">
            {org.id && hasPermission("ORG.DEL") ? (
              <DeleteModal
                onConfirmDelete={() => {
                  this.delteForm();
                }}
                trigger={
                  <Form.Button
                    id="form-button-delete"
                    floated="left"
                    color="red"
                    inverted
                    type="button"
                  >
                    {t("module.admin.orgInfoForm.delete")}
                  </Form.Button>
                }
              />
            ) : (
              <Form.Field />
            )}
            <Form.Button
              id="form-button-submit"
              width={5}
              fluid
              floated="right"
              color="blue"
            >
              {t("module.admin.orgInfoForm.save")}
            </Form.Button>
          </Form.Group>
        </Form>
      </Segment>
    );
  }
  private onChangeOrganizationDDL = (value: string) => {
    const { org } = this.props;
    if (org.parent) {
      org.parent.setField({ fieldname: "id", value });
    } else {
      org.setField({ fieldname: "parent", value: { id: value } });
    }
  };
  private updateForm = async () => {
    const { org, history } = this.props;
    try {
      if (org.id) {
        await org.updateOrg();
      } else {
        await org.createOrg();
        history.push(`/admin/org_management/edit/${org.id}/${org.orgName}`);
      }
    } catch (e) {
      console.log(e);
    }
  };
  private delteForm = async () => {
    const { org, history } = this.props;
    try {
      await org.deleteOrg();

      history.push(`/admin/org_management`);
    } catch (e) {
      console.log(e);
    }
  };
}

const styles: any = {
  header: {
    marginBottom: 14
  }
};

export default withRouter(withTranslation()(OrgInfoForm));
