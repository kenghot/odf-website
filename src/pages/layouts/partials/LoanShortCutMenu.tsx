import { inject, observer } from "mobx-react";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Grid, Header, Icon, Menu } from "semantic-ui-react";
import { Text } from "../../../components/common";
import { COLORS } from "../../../constants";
import { M106RequestValidate } from "../../../modals";
import { IAgreementListModel } from "../../../modules/loan/agreement/AgreementListModel";
import { IRequestListModel } from "../../../modules/loan/request/RequestListModel";
import { hasPermission } from "../../../utils/render-by-permission";
import SideMenu from "./SideMenu";

interface IMainSidebarMenus extends RouteComponentProps<any>, WithTranslation {
  expanded: boolean;
  searchRequestListStore?: IRequestListModel;
  searchAgreementListStore?: IAgreementListModel;
}

@inject("appStore", "searchRequestListStore", "searchAgreementListStore")
@observer
class LoanShortCutMenu extends React.Component<IMainSidebarMenus, any> {
  public state = { selected: "/UserManagment" };
  public componentDidUpdate(prevProps: any) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }
  public render() {
    const {  expanded, t } = this.props;
    return (
      <Menu vertical fluid style={styles.menu} inverted>
        <SideMenu
          name="loanShortcut"
          title={t("component.sidebar.shortcut")}
          iconName="share"
          // hasPermission={location.pathname.includes("/loan/")}
          hasPermission = {true}
          expanded={expanded}
          active={false}
        />
        {/* <SideMenu
          name="loanShortcut"
          pathname="/loan/request"
          title={t("component.sidebar.findingReq")}
          expanded={expanded}
          hasPermission={hasPermission("REQUEST.ACCESS")}
          active={false}
        />
        <SideMenu
          name="loanShortcut"
          pathname="/loan/agreement"
          title={t("component.sidebar.findingAgree")}
          expanded={expanded}
          hasPermission={hasPermission("AGREEMENT.ACCESS")}
          active={false}
        />
        <SideMenu
          name="loanShortcut"
          pathname="/loan/guarantee"
          title={t("component.sidebar.findingGua")}
          expanded={expanded}
          hasPermission={hasPermission("GUANRANTEE.ACCESS")}
          active={false}
        /> */}
        {hasPermission("REQUEST.CREATE") ? (
          <M106RequestValidate
            trigger={
              <Menu.Item
                active={false}
                name="loanShortcut"
                link
                as="div"
                style={styles.menuItem}
              >
                <Grid columns={"equal"}>
                  <Grid.Column
                    verticalAlign={"middle"}
                    textAlign={expanded ? "left" : "center"}
                  >
                    <Header size="tiny" style={styles.headerStyle} inverted>
                      <Icon name={undefined} size="mini" inverted={false} />
                      {expanded ? (
                        <Header.Content>
                          <Text style={styles.textColor}>
                            {t("component.sidebar.createReq")}
                          </Text>
                        </Header.Content>
                      ) : null}
                    </Header>
                  </Grid.Column>
                </Grid>
              </Menu.Item>
            }
          />
        ) : null}
        <SideMenu
          name="loanShortcut"
          pathname="/loan/agreement/create"
          title={t("component.sidebar.createAgree")}
          expanded={expanded}
          hasPermission={hasPermission("AGREEMENT.CREATE")}
          active={false}
        />
        {hasPermission("REQUEST.GENERATE.AGREEMENT") ? (
          <Menu.Item
            active={false}
            name="loanShortcut"
            link
            as="div"
            style={styles.menuItem}
            onClick={this.navigationToRequestPage}
          >
            <Grid columns={"equal"}>
              <Grid.Column
                verticalAlign={"middle"}
                textAlign={expanded ? "left" : "center"}
              >
                <Header
                  size="tiny"
                  className={"grey"}
                  style={styles.headerStyle}
                  inverted
                >
                  <Icon
                    name={undefined}
                    color="grey"
                    size="mini"
                    inverted={false}
                  />
                  {expanded ? (
                    <Header.Content>
                      <Text style={styles.textColor}>
                        {t("component.sidebar.sendAgreementRequest")}
                      </Text>
                    </Header.Content>
                  ) : null}
                </Header>
              </Grid.Column>
            </Grid>
          </Menu.Item>
        ) : null}
        {hasPermission("AGREEMENT.GENERATE.VOUCHER") ? (
          <Menu.Item
            active={false}
            name="loanShortcut"
            link
            as="div"
            style={styles.menuItem}
            onClick={this.navigationToAgreementPage}
          >
            <Grid columns={"equal"}>
              <Grid.Column
                verticalAlign={"middle"}
                textAlign={expanded ? "left" : "center"}
              >
                <Header
                  size="tiny"
                  className={"grey"}
                  style={styles.headerStyle}
                  inverted
                >
                  <Icon
                    name={undefined}
                    color="grey"
                    size="mini"
                    inverted={false}
                  />
                  {expanded ? (
                    <Header.Content>
                      <Text style={styles.textColor}>
                        {t("component.sidebar.sendAgreementVouchers")}
                      </Text>
                    </Header.Content>
                  ) : null}
                </Header>
              </Grid.Column>
            </Grid>
          </Menu.Item>
        ) : null}
      </Menu>
    );
  }

  private navigationToRequestPage = async () => {
    const { history, searchRequestListStore } = this.props;
    await searchRequestListStore!.setField({
      fieldname: "filterStatus",
      value: "AP3",
    });
    await searchRequestListStore!.load_data();
    history.push(`/loan/request`, { documentStatusPage: "AP3" });
  };
  private navigationToAgreementPage = async () => {
    const { history, searchAgreementListStore } = this.props;
    await searchAgreementListStore!.setField({
      fieldname: "filterStatus",
      value: "NW",
    });
    await searchAgreementListStore!.load_data();
    history.push(`/loan/agreement`, { documentStatusPage: "NW" });
  };
}
const styles: any = {
  menu: { borderRadius: 0 },
  toggleHeaderStyle: {
    lineHeight: "inherit",
    margin: 0,
  },
  iconToggleStyle: {
    verticalAlign: "middle",
  },
  menuItem: {
    paddingTop: "9px",
    paddingBottom: "9px",
  },
  headerStyle: {
    margin: 0,
  },
  textColor: {
    color: COLORS.greyOnBlack,
  },
};

export default withRouter(withTranslation()(LoanShortCutMenu));
