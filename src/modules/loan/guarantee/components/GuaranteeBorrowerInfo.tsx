import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { FormDisplay } from "../../../../components/common";
import { IGuaranteeItemModel } from "../GuaranteeModel";

interface IGuaranteeBorrowerInfo extends WithTranslation {
  guaranteeItem: IGuaranteeItemModel;
}

@observer
class GuaranteeBorrowerInfo extends React.Component<IGuaranteeBorrowerInfo> {
  public render() {
    const { t, guaranteeItem } = this.props;
    return (
      <Segment padded>
        <Form.Group widths="equal">
          <FormDisplay
            width={5}
            title={t("module.loan.guaranteeBorrowerInfo.prefix")}
            value={guaranteeItem.borrower.title}
          />
          <FormDisplay
            title={t("module.loan.guaranteeBorrowerInfo.firstName")}
            value={guaranteeItem.borrower.firstname}
          />
          <FormDisplay
            title={t("module.loan.guaranteeBorrowerInfo.lastNames")}
            value={guaranteeItem.borrower.lastname}
          />
        </Form.Group>
      </Segment>
    );
  }
}

export default withTranslation()(GuaranteeBorrowerInfo);
