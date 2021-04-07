import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Segment } from "semantic-ui-react";
import {
  DebtCollectionBorrowerAndGuarantorButton,
  DebtCollectionFormBody,
  DebtCollectionHeader
} from ".";
import ARSummaryInfo from "../../accountReceivable/components/ARSummaryInfo";
import { IDebtCollectionModel } from "../DebtCollectionModel";

interface IDebtCollectionFormEdit extends WithTranslation {
  debtCollection: IDebtCollectionModel;
  editMode?: boolean;
}
@observer
class DebtCollectionFormEdit extends React.Component<IDebtCollectionFormEdit> {
  public render() {
    const { debtCollection, editMode } = this.props;
    return (
      <React.Fragment>
        <Segment padded="very">
          <DebtCollectionHeader
            debtCollection={debtCollection}
            disableEditBtn={editMode}
          />
          <ARSummaryInfo accountReceivable={debtCollection.accountReceivable} />
          <DebtCollectionBorrowerAndGuarantorButton
            debtCollection={debtCollection}
          />
        </Segment>
        <DebtCollectionFormBody
          editMode={editMode}
          debtCollection={debtCollection}
        />
      </React.Fragment>
    );
  }
}

export default withTranslation()(DebtCollectionFormEdit);
