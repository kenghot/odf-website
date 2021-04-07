import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { ListBlock } from "../../../components/common/block";
import { hasPermission } from "../../../utils/render-by-permission";
import { IAccountReceivableModel } from "../AccountReceivableModel";

interface IAccountReceivableReferenceDocument extends WithTranslation {
  accountReceivable: IAccountReceivableModel;
}

@observer
class AccountReceivableReferenceDocument extends React.Component<
  IAccountReceivableReferenceDocument
> {
  public render() {
    const { accountReceivable, t } = this.props;
    const list = [];
    if (hasPermission("AGREEMENT.VIEW") && accountReceivable.agreement.id) {
      list.push({
        title: t(
          "module.accountReceivable.accountReceivableDetail.referenceLoanAgreement"
        ),
        description: accountReceivable.agreement.documentNumber,
        url: `/loan/agreement/view/${accountReceivable.agreement.id}/${accountReceivable.agreement.documentNumber}`
      });
    }
    if (hasPermission("GUANRANTEE.VIEW") && accountReceivable.guarantee.id) {
      list.push({
        title: t(
          "module.accountReceivable.accountReceivableDetail.referenceNumberOfGuarantee"
        ),
        description: accountReceivable.guarantee.documentNumber,
        url: `/loan/guarantee/view/${accountReceivable.guarantee.id}/${accountReceivable.guarantee.documentNumber}`
      });
    }
    if (
      accountReceivable.debtAcknowledgement.preAccountReceivableId &&
      accountReceivable.debtAcknowledgement.preAccountReceivableDocumentNumber
    ) {
      list.push({
        title: t("module.accountReceivable.accountReceivableDetail.refNumber"),
        description:
          accountReceivable.debtAcknowledgement
            .preAccountReceivableDocumentNumber,
        url: `/account_receivable/view/${accountReceivable.debtAcknowledgement.preAccountReceivableId}/${accountReceivable.debtAcknowledgement.preAccountReceivableDocumentNumber}`
      });
    }
    return <ListBlock list={list} />;
  }
}

export default withTranslation()(AccountReceivableReferenceDocument);
