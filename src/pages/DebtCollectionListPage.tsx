import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Container } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import { ErrorMessage } from "../components/common";
import { Loading } from "../components/common/loading";
import { DebtCollectionTable } from "../modules/debtCollection/components";
import SearchForm from "../modules/debtCollection/components/SearchForm";
import { IDebtCollectionListModel } from "../modules/debtCollection/DebtCollectionListModel";
import { hasPermission } from "../utils/render-by-permission";
import { IAuthModel } from "../modules/auth/AuthModel";

interface IDebtCollectionListPage extends WithTranslation {
  appStore?: IAppModel;
  searchDebtCollectionListPageStore?: IDebtCollectionListModel;
  authStore?: IAuthModel;
}

@inject("appStore", "searchDebtCollectionListPageStore","authStore")
@observer
class DebtCollectionListPage extends React.Component<IDebtCollectionListPage> {

  public componentDidMount() {
    this.props.appStore!.setField({
      fieldname: "pageHeader",
      value: "debtCollection"
    });
    if (!hasPermission("REQUEST.ONLINE.ACCESS")) {
      this.props.searchDebtCollectionListPageStore!.setField({
        fieldname: "filterOrganizationId",
        value: this.props.authStore!.userProfile.organization.id ? this.props.authStore!.userProfile.organization.id : ''
      });
    }
    this.props.searchDebtCollectionListPageStore!.load_data();
  }
  public componentWillUnmount() {
    // this.props.searchDebtCollectionListPageStore!.resetFilter();
  }
  public render() {
    return (
      <Container>
        <SearchForm
          searchDebtCollectionListPageStore={
            this.props.searchDebtCollectionListPageStore!
          }
        />
        <Loading
          active={this.props.searchDebtCollectionListPageStore!.loading}
        />
        <ErrorMessage
          errorobj={this.props.searchDebtCollectionListPageStore!.error}
          float
          timeout={5000}
        />
        <DebtCollectionTable
          searchDebtCollectionListPageStore={
            this.props.searchDebtCollectionListPageStore!
          }
        />
      </Container>
    );
  }
}

export default withTranslation()(DebtCollectionListPage);
