import { observer } from "mobx-react";
import moment from "moment";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Grid, Header, Icon, Segment, Statistic } from "semantic-ui-react";
import {
  M35401OpenShiftModal,
  M35402CloseShiftModal
} from "../../../../modals";
import { IPosModel } from "../../PosModel";

interface IPosShiftControl extends WithTranslation {
  pos: IPosModel;
}
@observer
class PosShiftControl extends React.Component<IPosShiftControl> {
  public state = {
    timeOnline: undefined,
    intervalId: undefined,
    showDay: false
  };
  public componentDidMount() {
    const intervalId = setInterval(this.onSetTime, 1000);
    this.setState({ intervalId });
  }
  public componentWillUnmount() {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }
  public render() {
    const { t, pos } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t("module.pos.posShiftControl.content")}
          subheader={t("module.pos.posShiftControl.onOffBt")}
          style={styles.header}
        />
        <Grid>
          <Grid.Row columns="equal" verticalAlign="middle">
            {pos.isOnline ? (
              <Grid.Column textAlign="center">
                <Statistic>
                  <Statistic.Label>
                    {t("module.pos.posShiftControl.subheader1")}
                  </Statistic.Label>
                  <Statistic.Value>
                    {this.state.timeOnline ? this.state.timeOnline : `  :  :  `}
                  </Statistic.Value>
                  <Statistic.Label>
                    {this.state.showDay
                      ? t("module.pos.posShiftControl.subheader2day")
                      : t("module.pos.posShiftControl.subheader2")}
                  </Statistic.Label>
                </Statistic>
              </Grid.Column>
            ) : null}
            <Grid.Column>
              {pos.isOnline ? this.renderIsOnline() : this.renderIsOffline()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }

  private renderIsOnline() {
    const { t, pos } = this.props;
    return (
      <M35402CloseShiftModal
        pos={pos}
        trigger={
          <Header size="medium" icon textAlign="center">
            <Icon name={"stop circle"} color={"red"} link />
            <Header.Subheader>
              {t("module.pos.posShiftControl.offline")}
            </Header.Subheader>
          </Header>
        }
      />
    );
  }
  private renderIsOffline() {
    const { t, pos } = this.props;
    return (
      <M35401OpenShiftModal
        pos={pos}
        trigger={
          <Header size="medium" icon textAlign="center">
            <Icon name={"play circle"} color={"green"} link />
            <Header.Subheader>
              {t("module.pos.posShiftControl.online")}
            </Header.Subheader>
          </Header>
        }
      />
    );
  }

  private onSetTime = () => {
    const { pos } = this.props;
    if (pos.lastestPosShift && pos.lastestPosShift.startedShift) {
      const before = moment(pos.lastestPosShift.startedShift);
      const now = moment();
      const diff = now.diff(before);
      const diffCheckDay = now.diff(before, "days");
      if (diffCheckDay > 0) {
        this.setState({
          timeOnline: `${diffCheckDay}:${moment.utc(diff).format("HH:mm:ss")}`
        });
        this.setState({
          showDay: true
        });
      } else {
        this.setState({ timeOnline: moment.utc(diff).format("HH:mm:ss") });
        this.setState({
          showDay: false
        });
      }
    }
  };
}

const styles: any = {
  header: {
    marginBottom: 28
  },
  row: {
    paddingTop: 0,
    paddingBottom: 0
  },
  column: {
    paddingTop: 14,
    paddingBottom: 14
  }
};

export default withTranslation()(PosShiftControl);
