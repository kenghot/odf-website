import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

import { inject, observer } from "mobx-react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { IAppModel } from "../AppModel";
import { AlertMessage, ErrorMessage } from "../components/common";
import { UserModel } from "../modules/admin/user";
import {
  OrgResponsibleForm,
  UserInfoForm,
  UserPosCode
} from "../modules/admin/user/components";
import UserRoleForm from "../modules/admin/user/UserRoleForm";
import { IAuthModel } from "../modules/auth/AuthModel";

interface IUserFormPage extends WithTranslation, RouteComponentProps<any> {
  authStore?: IAuthModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class UserFormPage extends React.Component<IUserFormPage> {
  private user = UserModel.create({});
  public componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "admin"
    });
    const id = this.props.location.state || this.props.match.params.id;
    this.user.setField({ fieldname: "id", value: id || "" });
    if (id) {
      this.user.getUserDetail();
    }
  }
  public componentWillUnmount() {
    this.user.resetAll();
  }
  public render() {
    this.props.appStore!.setHeaderHeight();
    return (
      <React.Fragment>
        <ErrorMessage errorobj={this.user.error} float timeout={10000} />
        <AlertMessage
          messageobj={this.user.alert}
          float={true}
          timeout={3000}
        />
        <UserInfoForm user={this.user} />
        {this.user.id ? <UserPosCode user={this.user} editMode /> : null}
        {this.user.id ? <OrgResponsibleForm user={this.user} editMode /> : null}
        {this.user.id ? <UserRoleForm user={this.user} editMode /> : null}
      </React.Fragment>
    );
  }
}

export default withRouter(withTranslation()(UserFormPage));
