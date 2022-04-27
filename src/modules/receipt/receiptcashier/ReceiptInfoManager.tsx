import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Header, Segment } from "semantic-ui-react";
import { FormDisplay } from "../../../components/common";
import { IReceiptModel } from "../ReceiptModel";

interface IReceiptInfoManager extends WithTranslation {
  receipt: IReceiptModel;
}

@observer
class ReceiptInfoManager extends React.Component<IReceiptInfoManager> {
  public render() {
    const { t, receipt } = this.props;
    return (
      <React.Fragment>
        <Segment padded id="Segment-Info-Manager">
          <Header
            size="medium"
            content={t("module.receipt.receiptInfoEdit.responsibleInfo")}
            style={styles.header}
          />
          <Form.Group widths="equal">
            <FormDisplay
              title={t("module.receipt.receiptInfoEdit.payee")}
              value={`${receipt.createdByName}${
                receipt.createdByPosition ? " : " : ""
              }${receipt.createdByPosition}`}
            />
            <FormDisplay
              title={t("module.receipt.receiptInfoEdit.recorder")}
              value={`${receipt.recieveByName}${
                receipt.recieveByPosition ? " : " : ""
              }${receipt.recieveByPosition}`}
            />
            {receipt.status === "CL" ? (
              <FormDisplay
                title={t("module.receipt.receiptInfoEdit.cancellationApprover")}
                value={`${receipt.cancelApprovedManagerName}${
                  receipt.cancelApprovedManagerPosition ? " : " : ""
                }${receipt.cancelApprovedManagerPosition}`}
              />
            ) : null}
          </Form.Group>
        </Segment>
      </React.Fragment>
    );
  }
}

const styles: any = {
  header: {
    marginBottom: 28
  }
};

export default withTranslation()(ReceiptInfoManager);
