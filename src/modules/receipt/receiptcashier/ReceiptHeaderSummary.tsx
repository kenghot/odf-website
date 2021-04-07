import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Grid, Header, Segment } from "semantic-ui-react";
import { COLORS } from "../../../constants";
import { date_display_CE_TO_BE } from "../../../utils";
import { IReceiptModel } from "../ReceiptModel";

interface IReceiptHeaderSummary extends WithTranslation {
  receipt: IReceiptModel;
}

@observer
class ReceiptHeaderSummary extends React.Component<IReceiptHeaderSummary> {
  public render() {
    const { t, receipt } = this.props;
    return (
      <Segment id="receiptHeaderSummary" style={styles.segment}>
        <Grid>
          <Grid.Row columns="equal">
            <Grid.Column>
              <Header size="medium">
                <Header.Content style={styles.header}>
                  {receipt.id
                    ? `${t("module.pos.posReceiptSummary.header")}: ${
                        receipt.documentNumber
                      }`
                    : t("module.pos.posReceiptSummary.documentNumber")}
                  <Header.Subheader style={styles.header}>
                    {receipt.id
                      ? `${t(
                          "module.pos.posReceiptSummary.documentDate"
                        )} ${date_display_CE_TO_BE(receipt.documentDate)}`
                      : t("module.pos.posReceiptSummary.subheader")}
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Column>
            {receipt.id ? (
              <Grid.Column>
                <Header size="medium" textAlign="right">
                  <Header.Content style={styles.headerBlue}>
                    {`.`}
                    <Header.Subheader style={styles.header}>
                      {t("module.pos.posReceiptSummary.print", {
                        value: receipt.printCount
                      })}
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
            ) : null}
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}
const styles: any = {
  segment: {
    background: COLORS.blue
  },
  header: {
    color: COLORS.white
  },
  headerBlue: {
    color: COLORS.blue
  }
};
export default withTranslation()(ReceiptHeaderSummary);
