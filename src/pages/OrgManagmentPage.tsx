import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { IAppModel } from "../AppModel";
import { ErrorMessage } from "../components/common";
import { Loading } from "../components/common/loading";
import { OrgTable, SearchForm } from "../modules/admin/organization/components";
import { IOrgListModel } from "../modules/admin/organization/OrgListModel";

interface IOrgManagmentPage extends WithTranslation {
  appStore?: IAppModel;
  searchOrgListStore?: IOrgListModel;
}

@inject("appStore", "searchOrgListStore")
@observer
class OrgManagmentPage extends React.Component<IOrgManagmentPage> {
  public componentDidMount() {
    this.props.appStore!.setField({ fieldname: "pageHeader", value: "admin" });
    this.props.searchOrgListStore!.load_data_list();
  }
  public componentWillUnmount() {
    this.props.searchOrgListStore!.resetFilter();
  }
  public render() {
    this.props.appStore!.setHeaderHeight();
    return (
      <React.Fragment>
        <SearchForm orglistStore={this.props.searchOrgListStore!} />
        <ErrorMessage errorobj={this.props.searchOrgListStore!.error} />
        <Loading active={this.props.searchOrgListStore!.loading} />
        <OrgTable orglistStore={this.props.searchOrgListStore!} />
      </React.Fragment>
    );
  }
}

export default withTranslation()(OrgManagmentPage);
