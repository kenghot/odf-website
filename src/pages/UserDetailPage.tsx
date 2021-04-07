import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { IAppModel } from "../AppModel";
import { UserModel } from "../modules/admin/user";
import {
  OrgResponsibleForm,
  UserInfoView,
  UserPosCode
} from "../modules/admin/user/components";
import UserRoleForm from "../modules/admin/user/UserRoleForm";
import { IAuthModel } from "../modules/auth/AuthModel";

interface IUserDetailPage extends WithTranslation, RouteComponentProps<any> {
  authStore?: IAuthModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class UserDetailPage extends React.Component<IUserDetailPage> {
  private user = UserModel.create({});
  public componentDidMount() {
    this.props.appStore!.setField({ fieldname: "pageHeader", value: "admin" });
    const id = this.props.location.state || this.props.match.params.id;
    this.user.setField({ fieldname: "id", value: id });
    this.user.getUserDetail();
  }
  public componentWillUnmount() {
    this.user.resetAll();
  }
  public render() {
    this.props.appStore!.setHeaderHeight();
    return (
      <React.Fragment>
        <UserInfoView user={this.user} />
        <UserPosCode user={this.user} />
        <OrgResponsibleForm user={this.user} />
        <UserRoleForm user={this.user} />
      </React.Fragment>
    );
  }
}

export default withRouter(withTranslation()(UserDetailPage));
