import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { PageHeader } from "../../../components/project";

interface IAccountReceivablePageHeader extends WithTranslation {}
@observer
class AccountReceivablePageHeader extends React.Component<
  IAccountReceivablePageHeader
> {
  public render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <PageHeader
          icon="users"
          title={t(
            "module.accountReceivable.accountReceivablePageHeader.accountsReceivableRegistrationSystem",
          )}
          color="orange"
        />
      </React.Fragment>
    );
  }
}
export default withTranslation()(AccountReceivablePageHeader);
