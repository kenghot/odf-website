import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Icon } from "semantic-ui-react";
import { BorrowerGuarantorInfoModal } from "../../../modals";
import { IDebtCollectionModel } from "../DebtCollectionModel";

interface IDebtCollectionBorrowerAndGuarantorButton extends WithTranslation {
  debtCollection: IDebtCollectionModel;
}
@observer
class DebtCollectionBorrowerAndGuarantorButton extends React.Component<
  IDebtCollectionBorrowerAndGuarantorButton
> {
  public render() {
    const { debtCollection, t } = this.props;
    return (
      <BorrowerGuarantorInfoModal
        activeIndexTab={0}
        headerTitle={t(
          "module.debtCollection.debtCollectionBorrowerAndGuarantorButton.arDetails"
        )}
        accountReceivable={debtCollection.accountReceivable}
        trigger={
          <Button color="purple" fluid size="large">
            <Icon
              name="address card outline"
              size="large"
              style={styles.button}
            />
            {t(
              "module.debtCollection.debtCollectionBorrowerAndGuarantorButton.arDetails"
            )}
          </Button>
        }
      />
    );
  }
}
const styles: any = {
  button: {
    float: "left"
  }
};
export default withTranslation()(DebtCollectionBorrowerAndGuarantorButton);
