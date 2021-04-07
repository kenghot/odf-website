import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Button,
  Grid,
  Header,
  Icon,
  Segment,
  Statistic
} from "semantic-ui-react";
import { M381RequestReceiptModal } from "../../../modals";
import { IPosModel } from "../../pos/PosModel";
import { logTypeEnum } from "../ReceiptControlLogModel";

interface IPosRequestReceipt extends WithTranslation {
  pos: IPosModel;
  fluid?: boolean;
  fromPos?: boolean;
}
@observer
class PosRequestReceipt extends React.Component<IPosRequestReceipt> {
  public render() {
    const { t, fluid, pos, fromPos } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t("module.receiptcontrol.posRequestReceipt.content")}
          subheader={t("module.receiptcontrol.posRequestReceipt.subheader")}
          style={styles.header}
        />
        <Grid stackable textAlign="center">
          <Grid.Row columns="equal" verticalAlign="middle">
            {fluid ? null : (
              <Grid.Column width={2} only="computer"></Grid.Column>
            )}
            <Grid.Column>
              <Segment basic style={styles.segment}>
                <Statistic size="mini">
                  <Statistic.Label>
                    {t("module.receiptcontrol.posRequestReceipt.amountReceipt")}
                  </Statistic.Label>
                  <Statistic.Value>{pos.onhandReceipt}</Statistic.Value>
                  <Statistic.Label>{t("roll")} </Statistic.Label>
                </Statistic>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment basic style={styles.segment}>
                <Statistic size="mini">
                  <Statistic.Label>
                    {t(
                      "module.receiptcontrol.posRequestReceipt.receiptsApproval"
                    )}
                  </Statistic.Label>
                  <Statistic.Value>{pos.requestReceipt}</Statistic.Value>
                  <Statistic.Label>{t("roll")} </Statistic.Label>
                </Statistic>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <M381RequestReceiptModal
                fromPos={fromPos}
                title={t(
                  "module.receiptcontrol.posRequestReceipt.receiptRequestList"
                )}
                pos={pos}
                trigger={
                  <Button fluid color="teal">
                    <Statistic size="tiny" inverted>
                      <Statistic.Value>
                        <Icon inverted name="plus" style={styles.icon} />
                      </Statistic.Value>
                      <Statistic.Label>
                        {t(
                          "module.receiptcontrol.posRequestReceipt.widenCentral"
                        )}
                      </Statistic.Label>
                    </Statistic>
                  </Button>
                }
                logType={logTypeEnum.request}
              />
            </Grid.Column>
            <Grid.Column>
              <M381RequestReceiptModal
                fromPos={fromPos}
                title={t(
                  "module.receiptcontrol.posRequestReceipt.listRequestsUse"
                )}
                pos={pos}
                trigger={
                  <Button fluid color="blue">
                    <Statistic size="tiny" inverted>
                      <Statistic.Value>
                        <Icon inverted name="minus" style={styles.icon} />
                      </Statistic.Value>
                      <Statistic.Label>
                        {t("module.receiptcontrol.posRequestReceipt.apply")}
                      </Statistic.Label>
                    </Statistic>
                  </Button>
                }
                logType={logTypeEnum.used}
              />
            </Grid.Column>
            {fluid ? null : (
              <Grid.Column width={2} only="computer"></Grid.Column>
            )}
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

const styles: any = {
  header: {
    marginBottom: 28
  },
  segment: {
    padding: 0
  },
  icon: {
    marginBottom: 7
  }
};

export default withTranslation()(PosRequestReceipt);
