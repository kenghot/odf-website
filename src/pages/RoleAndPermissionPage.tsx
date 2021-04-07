import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { IAppModel } from "../AppModel";
import { PermissionControl } from "../components/permission";
import { PermissionListModal } from "../modules/admin/permissions/PermissionListModal";
import Rolelist from "../modules/admin/role/Rolelist";
import { RoleListModel } from "../modules/admin/role/RoleListModel";
import RolePermission from "../modules/admin/role/RolePermission";
import { IAuthModel } from "../modules/auth/AuthModel";

interface IRoleAndPermissionPage extends WithTranslation {
  authStore?: IAuthModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class RoleAndPermissionPage extends React.Component<IRoleAndPermissionPage> {
  private roleList = RoleListModel.create({});
  private roleListPermission = RoleListModel.create({});
  private permissionList = PermissionListModal.create({});

  public async componentDidMount() {
    await this.props.appStore!.setField({ fieldname: "pageHeader", value: "admin" });
    await this.roleList.load_data();
    await this.permissionList.load_data();
  }
  public render() {
    this.props.appStore!.setHeaderHeight();
    return (
      <React.Fragment>
        <Rolelist
          roleListPermission={this.roleListPermission}
          roleList={this.roleList}
        />
        <PermissionControl codes={["ROLE.PERMISSION.VIEW"]}>
          <RolePermission
            roleListPermission={this.roleListPermission}
            permissionList={this.permissionList}
          />
        </PermissionControl>
      </React.Fragment>
    );
  }
}

export default withTranslation()(RoleAndPermissionPage);
