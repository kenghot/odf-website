import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { PageHeader } from "../../../components/project";

@observer
class DebtCollectionPageHeader extends React.Component<WithTranslation> {
  public render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <PageHeader
          icon="crosshairs"
          title={t(
            "module.debtCollection.debtCollectionPageHeader.loanTrackingSystem"
          )}
          color="purple"
        />
      </React.Fragment>
    );
  }
}
export default withTranslation()(DebtCollectionPageHeader);
