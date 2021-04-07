import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Card, Form, Header, Segment } from "semantic-ui-react";
import { RoleModel } from ".";
import { AlertMessage, ErrorMessage } from "../../../components/common";
import { Loading } from "../../../components/common/loading";
import { IPermissionListModal } from "../permissions/PermissionListModal";
import { IPermissionModel } from "../permissions/PermissionModel";
import { RoleDDL, RolePermissionCard } from "./components";
import { IRoleListModel } from "./RoleListModel";
import { IRoleModel } from "./RoleModel";

interface IRolePermission extends WithTranslation {
  roleListPermission: IRoleListModel;
  permissionList: IPermissionListModal;
}

@observer
class RolePermission extends React.Component<IRolePermission> {
  private role = RoleModel.create({});
  public componentDidMount() {
    this.onChangeRoleDDL("1");
  }
  public render() {
    const { t } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t("module.admin.userPermissionForm.setPermissions")}
          subheader={t(
            "module.admin.userPermissionForm.specifyRightsGroupUsers"
          )}
          style={styles.header}
        />
        <Form>
          <Form.Field
            id="form-input-ddl-role-permission"
            label={t("module.admin.userPermissionForm.userGroup")}
            control={RoleDDL}
            value={this.role.id}
            roleList={this.props.roleListPermission}
            onChange={this.onChangeRoleDDL}
          />
          {this.renderUserPermissionCard()}
        </Form>
      </Segment>
    );
  }

  private renderUserPermissionCard() {
    return (
      <Segment>
        <Card.Group itemsPerRow={1}>
          {this.props.permissionList.list.map(
            (item: IPermissionModel, index: number) => {
              return (
                <RolePermissionCard
                  icon={item.icon}
                  color={item.color}
                  title={item.title}
                  role={this.role}
                  item={item}
                  key={index}
                  onUpdate={this.updateForm}
                />
              );
            }
          )}
        </Card.Group>
        <Loading active={this.role.loading} />
        <ErrorMessage errorobj={this.role.error} float timeout={5000} />
        <AlertMessage
          messageobj={this.role.alert}
          float={true}
          timeout={3000}
        />
      </Segment>
    );
  }

  private updateForm = async (item: IRoleModel) => {
    try {
      await item.updateRolePermission(item.id);
    } catch (e) {
      console.log(e);
    }
  };

  private onChangeRoleDDL = async (value: string) => {
    this.role.setField({ fieldname: "id", value });
    if (this.role.id) {
      await this.role.getRole();
    }
  };
}

const styles: any = {
  header: {
    marginBottom: 28
  }
};

export default withTranslation()(RolePermission);
