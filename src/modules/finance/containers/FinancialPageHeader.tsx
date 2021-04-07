import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { PageHeader } from "../../../components/project";
import FinancialTabHeader from "./FinancialTabHeader";

interface IFinancialPageHeader extends WithTranslation {
  //
}
@observer
class FinancialPageHeader extends React.Component<IFinancialPageHeader> {
  public render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <PageHeader
          icon="dollar sign"
          title={t("component.sidebar.financialSystem")}
          color="teal"
        />
        <FinancialTabHeader />
      </React.Fragment>
    );
  }
}
export default withTranslation()(FinancialPageHeader);
