import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { PageHeader } from "../../../components/project";
import PosTabHeader from "./PosTabHeader";
interface IPosPageHeader extends WithTranslation {
  //
}
@observer
class PosPageHeader extends React.Component<IPosPageHeader> {
  public render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <PageHeader
          icon="money bill alternate outline"
          title={t("component.sidebar.paymentSystem")}
          color="blue"
        />
        <PosTabHeader />
      </React.Fragment>
    );
  }
}
export default withTranslation()(PosPageHeader);
