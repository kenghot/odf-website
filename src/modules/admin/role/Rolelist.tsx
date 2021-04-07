import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Header, Segment } from "semantic-ui-react";
import { RoleModel } from ".";
import { ErrorMessage, SubSectionContainer } from "../../../components/common";
import { Loading } from "../../../components/common/loading";
import { hasPermission } from "../../../utils/render-by-permission";
import { RoleFormCard } from "./components";
import { IRoleListModel } from "./RoleListModel";
import { IRoleModel } from "./RoleModel";

interface IRolelist extends WithTranslation {
  roleList: IRoleListModel;
  roleListPermission: IRoleListModel;
}

@observer
class Rolelist extends React.Component<IRolelist> {
  public state = { showCreateForm: false };
  public render() {
    const { t, roleList } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t("module.admin.userGroupForm.userGroup")}
          subheader={t("module.admin.userGroupForm.createOrEditUserGroup")}
          style={styles.header}
        />
        <SubSectionContainer
          idLink={"btn-add-role"}
          stretch
          linkLabel={
            hasPermission("ROLE.CREATE")
              ? t("module.admin.userGroupForm.addUserGroups")
              : undefined
          }
          iconName="plus circle"
          onClick={() =>
            this.setState({ showCreateForm: !this.state.showCreateForm })
          }
          styleContent={styles.subSection}
        >
          {this.renderLists()}
        </SubSectionContainer>
        <Loading active={roleList.loading} />
        <ErrorMessage errorobj={roleList.error} float timeout={10000} />
      </Segment>
    );
  }
  private renderLists() {
    const roleCreate = RoleModel.create({});
    return (
      <React.Fragment>
        <RoleFormCard
          item={roleCreate}
          showFormCreate={() =>
            this.setState({ showCreateForm: !this.state.showCreateForm })
          }
          createMode={this.state.showCreateForm}
          onUpdate={this.createForm}
          id={"mode-create"}
        />
        {this.props.roleList.list.map((item: IRoleModel, index: number) => {
          return (
            <RoleFormCard
              id={`${index}`}
              key={index}
              item={item}
              editMode
              onDelete={this.deleteForm}
              onUpdate={this.updateForm}
            />
          );
        })}
      </React.Fragment>
    );
  }

  private createForm = async (item: IRoleModel) => {
    try {
      await item.create_data();
      await this.props.roleList.load_data();
      await this.props.roleListPermission.load_data();
      await this.setState({ showCreateForm: false });
    } catch (e) {
      console.log(e);
    }
  };
  private updateForm = async (item: IRoleModel) => {
    try {
      await item.updateRolelist(item.id);
      await this.props.roleListPermission.load_data();
    } catch (e) {
      console.log(e);
    }
  };
  private deleteForm = async (item: IRoleModel) => {
    try {
      await item.delete_data(item.id);
      await this.props.roleList.load_data();
      await this.props.roleListPermission.load_data();
    } catch (e) {
      console.log(e);
    }
  };
}

const styles: any = {
  header: {
    marginBottom: 28
  },
  subSection: {
    paddingBottom: 16,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0
  }
};

export default withTranslation()(Rolelist);
