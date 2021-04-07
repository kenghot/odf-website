import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { PageHeader } from "../../../components/project";
import LoanTabHeader from "./LoanTabHeader";

interface ILoanPageHeader extends WithTranslation {
  noneTabHeader?: boolean;
}
@observer
class LoanPageHeader extends React.Component<ILoanPageHeader> {
  public render() {
    const { t, noneTabHeader } = this.props;
    return (
      <React.Fragment>
        <PageHeader
          icon="address card"
          title={t("module.loan.loanTabHeader.loanRequestSystem")}
          color="pink"
        />
        {noneTabHeader ? null : <LoanTabHeader />}
      </React.Fragment>
    );
  }
}
export default withTranslation()(LoanPageHeader);
