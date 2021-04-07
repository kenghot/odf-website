import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { FormDisplay } from "../../../../components/common";
import { PermissionControl } from "../../../../components/permission";
import { DeleteModal } from "../../../../modals";
import { IRoleModel } from "../RoleModel";

interface IRoleFormCard extends WithTranslation {
  onDelete?: (item: IRoleModel) => void;
  onUpdate: (item: IRoleModel) => void;
  item: IRoleModel;
  editMode?: boolean;
  createMode?: boolean;
  showFormCreate?: () => void;
  id?: string;
}

@observer
class RoleFormCard extends React.Component<IRoleFormCard> {
  public state = { showForm: false };
  public render() {
    const { item, editMode, createMode, id, t } = this.props;
    const { showForm } = this.state;
    return (
      <React.Fragment>
        {showForm || createMode ? (
          <Form>
            <Segment padded style={styles.form}>
              {createMode ? (
                <Form.Button
                  icon="x"
                  circular
                  floated="right"
                  size="mini"
                  type="button"
                  onClick={() => this.showFormCreate()}
                />
              ) : (
                  <Form.Button
                    icon="x"
                    circular
                    floated="right"
                    size="mini"
                    type="button"
                    onClick={() => this.setState({ showForm: false })}
                  />
                )}
              <Form.Input
                id={`form-input-name-${id}`}
                fluid
                label={t("module.admin.userGroupCard.userGroupName")}
                placeholder={t(
                  "module.admin.userGroupCard.specifyUserGroupName"
                )}
                onChange={(event: any, data: any) =>
                  item.setField({
                    fieldname: "name",
                    value: data.value
                  })
                }
                value={item.name || ""}
              />
              <Form.Input
                id={`form-input-description-${id}`}
                fluid
                label={t("module.admin.userGroupCard.groupRightsDescription")}
                placeholder={t(
                  "module.admin.userGroupCard.specifyGroupRightsDescriptions"
                )}
                onChange={(event: any, data: any) =>
                  item.setField({
                    fieldname: "description",
                    value: data.value
                  })
                }
                value={item.description || ""}
              />
              <Form.Checkbox
                id={`form-input-isPrivate-${id}`}
                toggle
                label={t("module.admin.userGroupCard.isPrivate")}
                onChange={(event: any, data: any) => {
                  console.log("toggle: :", data.checked);
                  item.setField({
                    fieldname: "isPrivate",
                    value: data.checked
                  });
                }
                }
                checked={item.isPrivate}
              />
              <Form.Button
                id={`btn-role-submit-update`}
                floated="right"
                color="blue"
                type="button"
                onClick={() => this.onUpdate(item)}
              >
                {t("module.admin.userGroupCard.save")}
              </Form.Button>
            </Segment>
          </Form>
        ) : null}
        {!showForm && editMode ? (
          <Form>
            <Form.Group widths="equal" style={styles.formGroup}>
              <FormDisplay title={item.name} value={item.description} />
              <Form.Group>
                <PermissionControl codes={["ROLE.EDIT"]}>
                  <Form.Button
                    id={`btn-role-edit-${id}`}
                    icon="edit outline"
                    circular
                    floated="right"
                    color="olive"
                    size="small"
                    type="button"
                    onClick={() => this.setState({ showForm: true })}
                  />
                </PermissionControl>
                <PermissionControl codes={["ROLE.DEL"]}>
                  <DeleteModal
                    idSubmit={`btn-role-delete-submit-${id}`}
                    onConfirmDelete={() => {
                      this.onDelete(item);
                    }}
                    trigger={
                      <Form.Button
                        id={`btn-role-delete-${id}`}
                        icon="trash alternate outline"
                        circular
                        floated="right"
                        color="red"
                        size="small"
                        type="button"
                      />
                    }
                  />
                </PermissionControl>
              </Form.Group>
            </Form.Group>
          </Form>
        ) : null}
      </React.Fragment>
    );
  }
  private onDelete = async (item: IRoleModel) => {
    const { onDelete } = this.props;
    if (typeof onDelete !== "undefined") {
      await onDelete(item);
    }
  };
  private onUpdate = async (item: IRoleModel) => {
    const { onUpdate } = this.props;
    await onUpdate(item);
    await this.setState({ showForm: false });
  };
  private showFormCreate = () => {
    const { showFormCreate } = this.props;
    if (typeof showFormCreate !== "undefined") {
      showFormCreate();
    }
  };
}
const styles: any = {
  form: {
    paddingBottom: "48px",
    paddingRight: "28px",
    paddingLeft: "35px",
    background: "#F9FAFB"
  },
  formGroup: {
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 0,
    margin: 0
  }
};

export default withTranslation()(RoleFormCard);
