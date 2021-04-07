import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { PageHeader } from "../../../components/project";
interface IReceiptsPageHeader extends WithTranslation {
  //
}
@observer
class ReceiptsPageHeader extends React.Component<IReceiptsPageHeader> {
  public render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <PageHeader
          icon="money bill alternate outline"
          title={t("component.sidebar.paymentSystem")}
          color="blue"
        />
      </React.Fragment>
    );
  }
}
export default withTranslation()(ReceiptsPageHeader);
