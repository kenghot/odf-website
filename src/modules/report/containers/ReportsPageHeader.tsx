import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { PageHeader } from "../../../components/project";
import { ReportTabHeader } from ".";

interface IReportsPageHeader extends WithTranslation {
  //
}
@observer
class ReportsPageHeader extends React.Component<IReportsPageHeader> {
  public render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <PageHeader
          icon="file alternate outline"
          title={t("module.report.reportPageHeader.reportSystem")}
          color="brown"
        />
        <ReportTabHeader />
      </React.Fragment>
    );
  }
}
export default withTranslation()(ReportsPageHeader);
