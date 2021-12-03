import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Container } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { ErrorMessage } from "../components/common";
import { Loading } from "../components/common/loading";
import { IAccountReceivableListModel } from "../modules/accountReceivable/AccountReceivableListModel";
import AccountReceivableTable from "../modules/accountReceivable/components/AccountReceivableTable";
import SearchForm from "../modules/accountReceivable/components/SearchForm";
import { hasPermission } from "../utils/render-by-permission";
import { IAuthModel } from "../modules/auth/AuthModel";

interface IAccountReceivableListPage extends WithTranslation {
  appStore?: IAppModel;
  searchAccountReceivableListStore?: IAccountReceivableListModel;
  authStore?: IAuthModel;
}

@inject("appStore", "searchAccountReceivableListStore", "authStore")
@observer
class AccountReceivableListPage extends React.Component<
IAccountReceivableListPage
> {
  public componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "accountReceivable"
    });
    if (!hasPermission("REQUEST.ONLINE.ACCESS")) {
      this.props.searchAccountReceivableListStore!.setField({
        fieldname: "filterOrganizationId",
        value: this.props.authStore!.userProfile.organization.id ? this.props.authStore!.userProfile.organization.id : ''
      });
    }
    this.props.searchAccountReceivableListStore!.load_data();
  }
  public componentWillUnmount() {
    // this.props.searchAccountReceivableListStore!.resetFilter();
  }
  public render() {
    this.props.appStore!.setHeaderHeight();
    if (hasPermission("REQUEST.ONLINE.ACCESS")) {
      this.props.searchAccountReceivableListStore!.setField({
        fieldname: "idcardRequestOnline",
        value: this.props.authStore!.userProfile.username ? this.props.authStore!.userProfile.username : 'null'
      });
    }
    return (
      <Container>
        {hasPermission("REQUEST.ONLINE.ACCESS") ? null :
          <SearchForm
            accountReceivableListStore={
              this.props.searchAccountReceivableListStore!
            }
          />
        }
        <Loading
          active={this.props.searchAccountReceivableListStore!.loading}
        />
        <ErrorMessage
          errorobj={this.props.searchAccountReceivableListStore!.error}
          float
          timeout={5000}
        />
        <AccountReceivableTable
          accountReceivableListStore={
            this.props.searchAccountReceivableListStore!
          }
        />
      </Container>
    );
  }
}

export default withTranslation()(AccountReceivableListPage);
