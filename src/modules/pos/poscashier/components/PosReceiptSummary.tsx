import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Grid,
  Header,
  Message,
  Segment,
  SemanticCOLORS
} from "semantic-ui-react";
import {
  PosDetailSummary,
  PosPaymentListItem,
  PosPaymentSumTotal,
  PosReceiptPayer,
  PosReceiptPaymentType
} from ".";
import { IAppModel } from "../../../../AppModel";
import { AlertMessage, ErrorMessage } from "../../../../components/common";
import { Loading } from "../../../../components/common/loading";
import { COLORS } from "../../../../constants";
import { date_display_CE_TO_BE } from "../../../../utils";
import { IReceiptListModel } from "../../../receipt/ReceiptListModel";
import { IReceiptModel } from "../../../receipt/ReceiptModel";
import { IPosModel } from "../../PosModel";

interface IPosReceiptSummary extends WithTranslation {
  previousReceipt: IReceiptModel;
  pos: IPosModel;
  color?: SemanticCOLORS;
  receiptList: IReceiptListModel;
  appStore?: IAppModel;
}
@inject("appStore")
@observer
class PosReceiptSummary extends React.Component<IPosReceiptSummary> {
  public render() {
    const { t, previousReceipt, pos, color } = this.props;
    return (
      <React.Fragment>
        <AlertMessage
          messageobj={previousReceipt.alert}
          float={true}
          timeout={3000}
        />
        <Loading active={previousReceipt.loading} />
        <ErrorMessage errorobj={previousReceipt.error} float timeout={5000} />
        <Segment.Group style={styles.segmentGroup}>
          <PosDetailSummary
            pos={pos}
            color={color}
            headerLabel1={
              previousReceipt.id
                ? `${t("module.pos.posReceiptSummary.header")}: ${
                    previousReceipt.documentNumber
                  }`
                : t("module.pos.posReceiptSummary.documentNumber")
            }
            headerLabel2={
              previousReceipt.id
                ? `${t(
                    "module.pos.posReceiptSummary.documentDate"
                  )} ${date_display_CE_TO_BE(previousReceipt.documentDate)}`
                : t("module.pos.posReceiptSummary.subheader")
            }
            childrenRightheader={
              previousReceipt.id ? (
                <Grid.Column>
                  <Header size="medium" textAlign="right">
                    <Header.Content style={styles.headerBlue}>
                      {`.`}
                      <Header.Subheader style={styles.header}>
                        {t("module.pos.posReceiptSummary.print", {
                          value: previousReceipt.printCount
                        })}
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                </Grid.Column>
              ) : null
            }
            headerColor={COLORS.blue}
            children={this.renderChildren()}
          />
        </Segment.Group>
      </React.Fragment>
    );
  }

  private renderChildren() {
    const { t, previousReceipt, pos, receiptList } = this.props;
    return (
      <React.Fragment>
        {previousReceipt.id ? (
          <React.Fragment>
            <PosPaymentListItem receipt={previousReceipt} />
            <PosPaymentSumTotal receipt={previousReceipt} />
          </React.Fragment>
        ) : (
          <Segment padded textAlign="center">
            <Message
              icon="sticky note"
              header={t("module.pos.posReceiptSummary.message")}
            />
          </Segment>
        )}
        {previousReceipt.id ? (
          <React.Fragment>
            <PosReceiptPaymentType previousReceipt={previousReceipt} />
            <PosReceiptPayer
              receiptList={receiptList}
              pos={pos}
              previousReceipt={previousReceipt}
            />
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}
const styles: any = {
  segmentGroup: {
    margin: 0,
    border: 0,
    boxShadow: "none"
  },
  headerBlue: {
    color: COLORS.blue
  },
  header: {
    color: COLORS.white
  }
};
export default withTranslation()(PosReceiptSummary);
