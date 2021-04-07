import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Grid, Header, Segment } from "semantic-ui-react";
import { SubSectionContainer } from "../../../components/common";
import { Loading } from "../../../components/common/loading";
import { RoleCheckBoxList } from "../role/components";
import { IUserModel } from "./UserModel";

interface IUserRoleForm extends WithTranslation {
  editMode?: boolean;
  user?: IUserModel;
}
@observer
class UserRoleForm extends React.Component<IUserRoleForm> {
  public render() {
    const { t, editMode, user } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t("module.admin.userGroupForm.userGroupAssignment")}
          subheader={t("module.admin.userGroupForm.selectAppropriateUserGroup")}
          style={styles.header}
        />
        <SubSectionContainer
          title={t("module.admin.userGroupForm.userGroup")}
          stretch
        >
          <RoleCheckBoxList
            id="role-check-box-list"
            editMode={editMode}
            onSelectedRole={user!.onSelectedRole}
            rolesSelectedIdList={user!.rolesSelectedIdList}
          />
        </SubSectionContainer>
        {editMode ? (
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Button
                  id="btn-save-user-add-user-group"
                  floated="right"
                  loading={user!.roleLoading}
                  color="blue"
                  onClick={this.updateForm}
                >
                  {t("module.admin.userGroupForm.save")}
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        ) : null}
        <Loading active={user!.roleLoading} />
      </Segment>
    );
  }
  private updateForm = async () => {
    const { user } = this.props;
    try {
      await user!.updateRolesUser(user!.id);
    } catch (e) {
      console.log(e);
    }
  };
}

const styles: any = {
  header: {
    marginBottom: 28,
  },
};

export default withTranslation()(UserRoleForm);
