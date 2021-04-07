import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Button,
  Grid,
  Icon,
  Label,
  List,
  Segment,
  Statistic
} from "semantic-ui-react";
import { Text } from "../../../../components/common";
import { COLORS } from "../../../../constants";
import { date_display_CE_TO_BE, date_To_Time } from "../../../../utils";
import { currency } from "../../../../utils/format-helper";
import { IPosShiftModel } from "../../PosModel";
import { TimeRangeLabel } from "../../../../components/project";

interface IPosShiftSummaryHeader extends WithTranslation {
  posShift: IPosShiftModel;
  isTimeActive?: boolean;
}

@observer
class PosShiftSummaryHeader extends React.Component<IPosShiftSummaryHeader> {
  public state = { openDetail: false };
  public render() {
    const { t, posShift, isTimeActive } = this.props;
    return (
      <React.Fragment>
        <Segment id="PosShiftSummaryHeaderTop" style={styles.segmentDate}>
          <List horizontal>
            <List.Item>
              <Text size="small">
                <Icon name="calendar alternate" />
                {t("module.pos.posShiftSummaryHeader.startedShift")}
                {date_display_CE_TO_BE(posShift.startedShift)}
              </Text>
            </List.Item>
            <List.Item>
              {isTimeActive ? this.renderTimeActive() : this.renderTime()}
            </List.Item>
          </List>
        </Segment>
        <Segment id="PosShiftSummaryHeaderMiddle">
          <Grid columns={4} divided="vertically">
            {this.state.openDetail
              ? this.renderOpenDetail()
              : this.renderCloseDetail()}
          </Grid>
        </Segment>
        <Segment id="PosShiftSummaryHeaderBottom" style={styles.segmentButton}>
          <Button
            style={styles.button}
            fluid
            icon
            onClick={() =>
              this.setState({ openDetail: !this.state.openDetail })
            }
          >
            <Icon
              style={styles.icon}
              name={this.state.openDetail ? "minus" : "plus circle"}
            />
            {this.state.openDetail
              ? t("module.pos.posShiftSummaryHeader.closeDetail")
              : t("module.pos.posShiftSummaryHeader.openDetail")}
          </Button>
        </Segment>
      </React.Fragment>
    );
  }

  private renderTimeActive() {
    const { t, posShift } = this.props;
    return (
      <Text size="small">
        <Icon name="clock" />
        {t("module.pos.posShiftSummaryHeader.time")}
        {`${date_To_Time(posShift.startedShift, true)} - `}
        <Label size="mini" color="blue">
          {t("module.pos.posShiftSummaryHeader.present")}
        </Label>
      </Text>
    );
  }

  private renderTime() {
    const { t, posShift } = this.props;
    return (
      <Text size="small">
        <Icon name="clock" />
        {t("module.pos.posShiftSummaryHeader.time")}
        <TimeRangeLabel
          started={posShift.startedShift}
          ended={posShift.endedShift}
        />
      </Text>
    );
  }

  private renderCloseDetail() {
    const { t, posShift } = this.props;
    return (
      <Grid.Row textAlign="center">
        <Grid.Column>
          <Statistic size="tiny">
            <Statistic.Label>
              {t("module.pos.posShiftSummaryHeader.openingAmount")}
            </Statistic.Label>
            <Statistic.Value>
              {currency(posShift.openingAmount)}
            </Statistic.Value>
          </Statistic>
        </Grid.Column>
        <Grid.Column>
          <Statistic size="tiny">
            <Statistic.Label>
              {t("module.pos.posShiftSummaryHeader.addAmount")}{" "}
            </Statistic.Label>
            <Statistic.Value>{currency(posShift.addAmount)}</Statistic.Value>
          </Statistic>
        </Grid.Column>
        <Grid.Column>
          <Statistic size="tiny">
            <Statistic.Label>
              {t("module.pos.posShiftSummaryHeader.dropAmount")}
            </Statistic.Label>
            <Statistic.Value>{currency(posShift.dropAmount)}</Statistic.Value>
          </Statistic>
        </Grid.Column>
        <Grid.Column>
          <Statistic size="tiny">
            <Statistic.Label>
              {t("module.pos.posShiftSummaryHeader.expectedDrawerAmount")}
            </Statistic.Label>
            <Statistic.Value>
              {currency(posShift.expectedDrawerAmount)}
            </Statistic.Value>
          </Statistic>
        </Grid.Column>
      </Grid.Row>
    );
  }
  private renderOpenDetail() {
    const { t, posShift } = this.props;
    return (
      <React.Fragment>
        {this.renderCloseDetail()}
        <Grid.Row textAlign="center">
          <Grid.Column>
            <Statistic size="tiny">
              <Statistic.Label>
                {t("module.pos.posShiftSummaryHeader.transactionAmount")}
              </Statistic.Label>
              <Statistic.Value>
                {currency(posShift.transactionAmount)}
              </Statistic.Value>
              <Statistic.Label>
                {`(${posShift.transactionCount || 0} ${t("list")})`}
              </Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic size="tiny">
              <Statistic.Label>
                {t("module.pos.posShiftSummaryHeader.cash")}{" "}
              </Statistic.Label>
              <Statistic.Value>
                {currency(posShift.transactionCashAmount)}
              </Statistic.Value>
              <Statistic.Label>
                {`(${posShift.transactionCashCount || 0} ${t("list")})`}
              </Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic size="mini">
              <Statistic.Label>
                {t("module.pos.posShiftSummaryHeader.moneyOrder")}
              </Statistic.Label>
              <Statistic.Value>
                {currency(posShift.transactionMoneyOrderAmount)}
              </Statistic.Value>
              <Statistic.Label>
                {`(${posShift.transactionMoneyOrderCount || 0} ${t("list")})`}
              </Statistic.Label>
            </Statistic>
          </Grid.Column>

          <Grid.Column>
            <Statistic size="mini">
              <Statistic.Label>
                {t("module.pos.posShiftSummaryHeader.check")}
              </Statistic.Label>
              <Statistic.Value>
                {currency(posShift.transactionCheckAmount)}
              </Statistic.Value>
              <Statistic.Label>
                {`(${posShift.transactionCheckCount || 0} ${t("list")})`}
              </Statistic.Label>
            </Statistic>
          </Grid.Column>
        </Grid.Row>
      </React.Fragment>
    );
  }
}
const styles: any = {
  segment: {
    background: COLORS.teal
  },
  header: {
    color: COLORS.white
  },
  segmentDate: {
    paddingTop: 7,
    paddingBottom: 7
  },
  segmentButton: {
    padding: 0
  },
  button: {
    borderRadius: 0,
    border: "none",
    boxShadow: "none",
    background: "initial",
    color: COLORS.blue
  },
  icon: {
    paddingRight: 20
  }
};
export default withTranslation()(PosShiftSummaryHeader);
