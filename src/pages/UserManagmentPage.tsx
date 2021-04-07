import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { IAppModel } from "../AppModel";
import { ErrorMessage } from "../components/common";
import SearchForm from "../modules/admin/user/components/SearchForm";
import UserTable from "../modules/admin/user/components/UserTable";
import { IUserListModel } from "../modules/admin/user/UserListModel";

interface IUserManagmentPage extends WithTranslation {
  appStore?: IAppModel;
  searchUserListStore?: IUserListModel;
}

@inject("appStore", "searchUserListStore")
@observer
class UserManagmentPage extends React.Component<IUserManagmentPage> {
  public componentDidMount() {
    this.props.appStore!.setField({ fieldname: "pageHeader", value: "admin" });
    this.props.searchUserListStore!.load_data();
  }
  public componentWillUnmount() {
    this.props.searchUserListStore!.resetFilter();
  }
  public render() {
    this.props.appStore!.setHeaderHeight();
    return (
      <React.Fragment>
        <SearchForm userlistStore={this.props.searchUserListStore!} />
        <ErrorMessage errorobj={this.props.searchUserListStore!.error} />
        <UserTable userlistStore={this.props.searchUserListStore!} />
      </React.Fragment>
    );
  }
}

export default withTranslation()(UserManagmentPage);
