import { inject, observer } from "mobx-react";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { Button, Container, Icon, Responsive } from "semantic-ui-react";
import { IAppModel } from "../../AppModel";
import { Loading } from "../../components/common/loading";
import { IAuthModel } from "../../modules/auth/AuthModel";
import PageLayout from "./PageLayout";
import FallBack from "./partials/FallBack";
import MainSidebarMenus from "./partials/MainSidebarMenus";

interface IMainLayout extends WithTranslation {
  location?: any;
  children: any;
  authStore?: IAuthModel;
  appStore?: IAppModel;
}
@inject("authStore", "appStore")
@observer
class MainLayout extends React.Component<IMainLayout, any> {
  public PADDING_HEADER_AND_CONTENT_MOBILE = 0;
  public PADDING_HEADER_AND_CONTENT_COMP = 0;
  constructor(props: any) {
    super(props);
    if (this.props.authStore!.userProfile.id === "") {
      this.props.authStore!.getUserProfile();
    }
  }
  public state = {
    expanded: true,
    mobile: false
  };

  public async componentDidUpdate(prevProps: any, prevState: any) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  public async componentDidMount() {
    try {
      await this.props.appStore!.setScreenHeight();
      await this.props.appStore!.setScreenMode();
      await this.props.appStore!.getEnumset();
      await this.handleOnUpdate();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public render() {
    const { expanded, mobile } = this.state;
    const { t } = this.props;
    return this.props.authStore!.access_token !== "" ||
      window.localStorage.getItem("access_token") ? (
      <div style={styles.pageWrapper}>
        <Responsive onUpdate={this.handleOnUpdate} />
        <div style={{ ...styles.left, width: expanded ? "18em" : "5em" }}>
          <FallBack>
            <MainSidebarMenus expanded={expanded} onToggle={this.onToggle} />
            {/* {this.checkActive("loan") && expanded ? (
              <LoanShortCutMenu expanded={expanded} />
            ) : null} */}
            <Container padding={2} style={styles.signoutButton}>
              {expanded ? (
                <Button
                  basic
                  fluid
                  color="grey"
                  onClick={this.props.authStore!.sign_out}
                >
                  {t("signOut")}
                </Button>
              ) : (
                <Icon
                  name="sign-out"
                  color="grey"
                  size="large"
                  style={styles.signoutIcon}
                  onClick={this.props.authStore!.sign_out}
                />
              )}
            </Container>
            <br />
            {expanded ? (
              <div style={{ ...styles.version, width: "18em" }}>
                {t("version", { version: process.env.REACT_APP_VERSION })}
              </div>
            ) : null}
          </FallBack>
        </div>
        <div
          style={{
            ...styles.right,
            paddingTop:
              this.props.appStore!.headerHeight + // ความสูงของ Header
              (mobile
                ? this.PADDING_HEADER_AND_CONTENT_MOBILE
                : this.PADDING_HEADER_AND_CONTENT_COMP), // ระยะห่างระหว่าง Header กับ Content
            paddingLeft: expanded ? "18em" : "5em"
          }}
        >
          <PageLayout paddingLeft={expanded ? "18em" : "5em"}>
            <Loading active={this.props.appStore!.loading} />
            <FallBack inverted>{this.props.children}</FallBack>
          </PageLayout>
        </div>
      </div>
    ) : (
      <Redirect to="/login" />
    );
  }
  private checkActive = (groupName: string) => {
    // เช็คว่า path slash แรก มีค่าตรงกับ groupName ไหม เช่น /admin/role_permission จะเช็ค admin กับ groupName
    return this.props.appStore!.pageHeader === groupName;
  };

  private onToggle = async (expanded: boolean) => {
    await this.setState({ expanded });
  };

  private handleOnUpdate = async () => {
    await this.setState({
      expanded: window.innerWidth >= 767,
      mobile: window.innerWidth < 767
    });
    await this.props.appStore!.setHeaderHeight();
    await this.props.appStore!.setScreenHeight();
    await this.props.appStore!.setScreenMode();
  };
}
const styles: any = {
  pageWrapper: { width: "100%", height: "100%", margin: 0, padding: 0 },
  left: {
    position: "fixed",
    top: 0,
    height: "100vh",
    backgroundColor: "#1b1c1d",
    overflowY: "scroll"
  },
  right: {
    // marginTop: 120,
    // paddingLeft: "18em",
    background: "#F2F3F5",
    overflowY: "scroll",
    overflowX: "hidden"
  },
  top: {
    position: "fixed",
    top: 0,
    left: 250,
    right: 0,
    height: 54,
    zIndex: 1000,
    background: "#ff0",
    border: "2px solid red"
  },
  sidebarColumn: { padding: 0, background: "#1A1B1C" },
  contentColumn: {
    background: "#F2F3F5",
    margin: 0,
    padding: 0,
    height: "100vh",
    overflowY: "auto",
    overflowX: "hidden"
  },
  signoutButton: {
    padding: "10px",
    textAlign: "center"
  },
  signoutIcon: { cursor: "pointer" },
  pageHeaderElementStyle: {
    marginTop: -20
  },
  version: {
    textAlign: "center",
    color: "gray",
    position: "fixed",
    bottom: 0,
    left: 0,
    background: "#1A1B1C",
    padding: " 10px 0px"
  }
};

export default withTranslation()(MainLayout);
