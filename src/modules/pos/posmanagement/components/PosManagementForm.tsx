import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Checkbox, Form, Grid, Header, Segment } from "semantic-ui-react";
import { PermissionControl } from "../../../../components/permission";
import { DeleteModal } from "../../../../modals";
import { OrganizationDDL } from "../../../admin/organization/components";
import { IOrgListModel } from "../../../admin/organization/OrgListModel";
import { UserDDL } from "../../../admin/user";
import { IUserListModel } from "../../../admin/user/UserListModel";
import { IPosModel } from "../../PosModel";

interface IPosManagementForm extends WithTranslation, RouteComponentProps {
  pos: IPosModel;
  orgList: IOrgListModel;
  userList: IUserListModel;
}
@observer
class PosManagementForm extends React.Component<IPosManagementForm> {
  public render() {
    const { t, pos } = this.props;
    return (
      <Segment padded="very">
        <Form onSubmit={this.updateForm}>
          <Grid columns="equal" style={styles.header}>
            <Grid.Row verticalAlign="top">
              <Grid.Column>
                <Header
                  size="medium"
                  content={t("module.pos.posManagementForm.headerContent")}
                />
              </Grid.Column>
              <Grid.Column floated="right" textAlign="right">
                <Form.Field>
                  <Checkbox
                    toggle
                    checked={pos.active}
                    onChange={(e: any, data: any) =>
                      pos.setField({
                        fieldname: "active",
                        value: data.checked
                      })
                    }
                    label={pos.activeLabel}
                  />
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Form.Field
            required
            id="form-input-ddl-organization"
            label={t("module.pos.posManagementForm.organizationId")}
            control={OrganizationDDL}
            orgList={this.props.orgList}
            onChange={this.onChangeOrganizationDDL}
            value={pos.organizationId ? pos.organizationId : ""}
          />
          <Form.Input
            required
            maxLength="3"
            fluid
            label={t("module.pos.posManagementForm.posCode")}
            placeholder={t("module.pos.posManagementForm.placeholderPosCode")}
            onChange={(event: any, data: any) =>
              pos.setField({
                fieldname: "posCode",
                value: data.value
              })
            }
            value={pos.posCode}
          />
          <Form.Input
            fluid
            label={t("module.pos.posManagementForm.posName")}
            placeholder={t("module.pos.posManagementForm.placeholderPosName")}
            onChange={(event: any, data: any) =>
              pos.setField({
                fieldname: "posName",
                value: data.value
              })
            }
            value={pos.posName}
            maxLength="8"
          />
          {pos.organizationId ? (
            <Form.Field
              required
              id="form-input-ddl-manager"
              label={t("module.pos.posManagementForm.managerId")}
              placeholder={t(
                "module.pos.posManagementForm.placeholderManagerId"
              )}
              control={UserDDL}
              userList={this.props.userList}
              onChange={this.onChangeUserDDL}
              value={pos.managerId ? pos.managerId : ""}
            />
          ) : null}
          <PermissionControl codes={["POS.EDIT.VAT"]}>
            {this.renderVatForm()}
          </PermissionControl>
          <Form.Group widths="equal" style={styles.formGroup}>
            {pos.id ? (
              <PermissionControl codes={["POS.DEL"]}>
                <DeleteModal
                  onConfirmDelete={() => {
                    this.delteForm();
                  }}
                  trigger={
                    <Form.Button
                      floated="left"
                      color="red"
                      inverted
                      type="button"
                    >
                      {t("delete")}
                    </Form.Button>
                  }
                />
              </PermissionControl>
            ) : (
              <Form.Field />
            )}
            <Form.Button width={5} fluid floated="right" color="blue">
              {t("save")}
            </Form.Button>
          </Form.Group>
        </Form>
      </Segment>
    );
  }

  private renderVatForm() {
    const { t, pos } = this.props;
    return (
      <React.Fragment>
        <Grid columns="equal" style={styles.headerTax}>
          <Grid.Row verticalAlign="top">
            <Grid.Column>
              <Header
                size="medium"
                content={t("module.pos.posManagementForm.headerContentTax")}
                subheader={t("module.pos.posManagementForm.subHeaderTax")}
              />
            </Grid.Column>
            <Grid.Column floated="right" textAlign="right">
              <Form.Field>
                <Checkbox
                  toggle
                  checked={pos.registedVAT}
                  onChange={(e: any, data: any) =>
                    pos.setField({
                      fieldname: "registedVAT",
                      value: data.checked
                    })
                  }
                  label={pos.registedVATLabel}
                />
              </Form.Field>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Form.Input
          fluid
          label={t("module.pos.posManagementForm.registedVATCode")}
          placeholder={t(
            "module.pos.posManagementForm.placeholderRegistedVATCode"
          )}
          onChange={(event: any, data: any) =>
            pos.setField({
              fieldname: "registedVATCode",
              value: data.value
            })
          }
          value={pos.registedVATCode}
        />
      </React.Fragment>
    );
  }

  private onChangeOrganizationDDL = async (value: string) => {
    const { pos } = this.props;
    if (pos.organizationId !== value) {
      await pos.setField({ fieldname: "managerId", value: "" });
    }
    await pos.setField({ fieldname: "organizationId", value });
    if (value) {
      await this.props.userList.setFieldFilterOrg(value);
      await this.props.userList.load_data();
    } else {
      await pos.setField({ fieldname: "managerId", value: "" });
    }
  };
  private onChangeUserDDL = (value: string) => {
    const { pos } = this.props;
    pos.setField({ fieldname: "managerId", value });
  };
  private updateForm = async () => {
    const { pos, history } = this.props;
    try {
      if (pos.id) {
        await pos.updatePos();
      } else {
        await pos.createPos();
        history.push(`/pos/management/edit/${pos.id}`);
      }
    } catch (e) {
      console.log(e);
    }
  };
  private delteForm = async () => {
    const { pos, history } = this.props;
    try {
      await pos.deletePos();
      history.push(`/pos/management`);
    } catch (e) {
      console.log(e);
    }
  };
}

const styles: any = {
  header: {
    marginBottom: 14
  },
  headerTax: {
    marginTop: 42,
    marginBottom: 7
  },
  formGroup: {
    marginTop: 42,
    marginBottom: 0
  }
};

export default withRouter(withTranslation()(PosManagementForm));
