import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  Button,
  Confirm,
  Grid,
  Header,
  Icon,
  Item,
  Responsive,
  Segment,
  SemanticCOLORS
} from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import { Text } from "../../../../components/common";
import { TimeRangeLabel } from "../../../../components/project";
import { COLORS } from "../../../../constants";
import { date_display_CE_TO_BE } from "../../../../utils";
import { currency } from "../../../../utils/format-helper";
import { IAuthModel } from "../../../auth/AuthModel";
import { IPosModel } from "../../PosModel";

interface IPosDetailSummary extends WithTranslation, RouteComponentProps {
  pos: IPosModel;
  color?: SemanticCOLORS;
  authStore?: IAuthModel;
  hideHeader?: boolean;
  headerLabel1?: string;
  headerLabel2?: string;
  childrenRightheader?: any;
  headerColor?: string;
  children?: any;
  appStore?: IAppModel;
}
@inject("authStore", "appStore")
@observer
class PosDetailSummary extends React.Component<IPosDetailSummary> {
  public state = {
    maxHeightSegmentGroup: 0,
    confirm: false
  };
  public open = () => this.setState({ confirm: true });
  public close = () => this.setState({ confirm: false });
  public async componentDidMount() {
    try {
      await this.handleOnUpdate();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  public componentDidUpdate(prevProps: any) {
    if (this.props.hideHeader !== prevProps.hideHeader) {
      this.handleOnUpdate();
    }
  }
  public render() {
    const { children, appStore, hideHeader } = this.props;
    return (
      <React.Fragment>
        <Responsive onUpdate={this.handleOnUpdate} />
        {hideHeader ? null : this.renderHeader()}
        {this.renderHeaderContent()}
        <Segment.Group
          id="Pos-Detail-Summary-Segment-Group-Body"
          style={{
            margin: 0,
            border: 0,
            boxShadow: "none",
            overflowY: appStore!.tabletMode ? "initial" : "auto",
            maxHeight: appStore!.tabletMode
              ? "initial"
              : this.state.maxHeightSegmentGroup,
            minHeight: appStore!.tabletMode
              ? "initial"
              : this.state.maxHeightSegmentGroup
          }}
        >
          {children}
        </Segment.Group>
      </React.Fragment>
    );
  }

  private renderHeader() {
    const { t, pos, color, authStore } = this.props;
    return (
      <Segment padded id="PosDetailSummary" style={styles.posDetailSummary}>
        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column>
              <Item.Group>
                <Item>
                  <Button color={color || "orange"} style={styles.button}>
                    {pos.posCode}
                  </Button>
                  <Item.Content>
                    <Item.Meta style={styles.itemMeta}>
                      <Text size="small">
                        <Icon
                          style={styles.icon}
                          name="circle"
                          color={pos.isOnline ? "green" : "red"}
                        />
                        {t("module.pos.posStatusHeader.isOnline", {
                          isOnline: pos.isOnlineLabel
                        })}
                      </Text>
                    </Item.Meta>
                    <Item.Meta style={styles.itemMeta}>
                      {pos.isOnline ? (
                        <Text size="small">
                          <Icon name="calendar alternate" style={styles.icon} />
                          {t("module.pos.posStatusHeader.startedShift", {
                            startedShift: date_display_CE_TO_BE(
                              pos.lastestPosShift.startedShift
                            )
                          })}
                        </Text>
                      ) : null}
                    </Item.Meta>
                    <Item.Meta style={styles.itemMeta}>
                      {pos.isOnline ? (
                        <Text size="small">
                          <Icon name="clock" style={styles.icon} />
                          {t("module.pos.posStatusHeader.startedEndedShift")}
                          <TimeRangeLabel
                            started={pos.lastestPosShift.startedShift}
                            ended={pos.lastestPosShift.endedShift}
                          />
                        </Text>
                      ) : null}
                    </Item.Meta>
                    <Item.Meta style={styles.itemMeta}>
                      {pos.isOnline ? (
                        <Text size="small">
                          <Icon
                            name="money bill alternate"
                            style={styles.icon}
                          />
                          {t("module.pos.posStatusHeader.transactionAmount", {
                            transactionAmount: currency(
                              pos.lastestPosShift.transactionAmount
                            )
                          })}
                        </Text>
                      ) : null}
                    </Item.Meta>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Grid.Column>
            <Grid.Column textAlign="right">
              <Item.Group>
                <Item>
                  <Item.Content>
                    <Item.Meta style={styles.itemMeta}>
                      <Text size="small">
                        {t("module.pos.posStatusHeader.orgName", {
                          orgName: pos.organization.orgName || "-"
                        })}
                      </Text>
                    </Item.Meta>
                    <Item.Meta style={styles.itemMeta}>
                      <Text size="small">
                        {t("module.pos.posStatusHeader.currentCashier", {
                          currentCashier:
                          pos.lastestPosShift.currentCashier.fullname ||
                          authStore!.userProfile.fullname
                        })}
                      </Text>
                    </Item.Meta>
                    <Item.Meta style={styles.itemMeta}>
                      <Text size="small">
                        {t("module.pos.posStatusHeader.onDutymanager", {
                          onDutymanager:
                          pos.lastestPosShift.onDutymanager.fullname ||
                            pos.manager.fullname
                        })}
                      </Text>
                    </Item.Meta>
                    <Item.Meta style={styles.itemMeta}>
                      <Button
                        basic
                        size="mini"
                        floated="right"
                        color="blue"
                        onClick={this.open}
                      >
                        <Icon name="lock open" />
                        {t("module.pos.posStatusHeader.buttonLogout")}
                      </Button>
                      <Confirm
                        content={t("module.pos.posStatusHeader.confirmContent")}
                        size="mini"
                        open={this.state.confirm}
                        onCancel={this.close}
                        onConfirm={this.onLogOut}
                        cancelButton={t(
                          "module.pos.posStatusHeader.cancelButton"
                        )}
                        confirmButton={t(
                          "module.pos.posStatusHeader.confirmButton"
                        )}
                      />
                    </Item.Meta>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }

  private renderHeaderContent() {
    const {
      headerLabel1,
      headerLabel2,
      childrenRightheader,
      headerColor
    } = this.props;
    return (
      <Segment
        padded
        id="PosDetailSummaryHeaderContent"
        style={{ background: headerColor, paddingBottom: 10, paddingTop: 10 }}
      >
        <Grid>
          <Grid.Row columns="equal">
            <Grid.Column>
              <Header size="medium">
                <Header.Content style={styles.header}>
                  {headerLabel1}
                  <Header.Subheader style={styles.header}>
                    {headerLabel2}
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Column>
            {childrenRightheader ? childrenRightheader : null}
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }

  private navigationToPosCashierListPage = async () => {
    const { history } = this.props;
    history.push(`/pos/cashier`);
  };

  private onLogOut = async () => {
    const { pos } = this.props;
    try {
      await pos.posLogOut();
      await this.navigationToPosCashierListPage();
    } catch (error) {
      console.log(error);
    }
  };

  private getHeightElement = (id: string) => {
    this.forceUpdate();
    const height = document.getElementById(id)
      ? document.getElementById(id)!.clientHeight
      : 0;
    return height;
  };

  private handleOnUpdate = async () => {
    const { appStore } = this.props;
    const posDetailSummary = this.getHeightElement("PosDetailSummary");
    const posDetailSummaryHeaderContent = this.getHeightElement(
      "PosDetailSummaryHeaderContent"
    );
    const cal =
      +appStore!.screenHeight -
      posDetailSummary -
      posDetailSummaryHeaderContent;
    if (cal > 0) {
      await this.setState({
        maxHeightSegmentGroup: cal
      });
    } else {
      await this.setState({
        maxHeightSegmentGroup: 0
      });
    }
  };
}
const styles: any = {
  button: {
    borderRadius: 10,
    height: 55,
    width: 55,
    textAlign: "center",
    paddingLeft: 0,
    paddingRight: 0,
    marginRight: 14
  },
  itemMeta: {
    marginTop: 0,
    marginBottom: 5
  },
  icon: {
    marginRight: 4
  },
  header: {
    color: COLORS.white
  },
  posDetailSummary: {
    paddingBottom: 10
  }
};
export default withRouter(withTranslation()(PosDetailSummary));
