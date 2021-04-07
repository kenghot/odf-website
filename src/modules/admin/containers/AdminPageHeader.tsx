import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { PageHeader } from "../../../components/project";
import AdminTabHeader from "./AdminTabHeader";

interface IAdminPageHeader extends WithTranslation {
  //
}
@observer
class AdminPageHeader extends React.Component<IAdminPageHeader> {
  public render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <PageHeader
          icon="settings"
          title={t("component.sidebar.managementSystem")}
          color="green"
        />
        <AdminTabHeader />
      </React.Fragment>
    );
  }
}
export default withTranslation()(AdminPageHeader);
