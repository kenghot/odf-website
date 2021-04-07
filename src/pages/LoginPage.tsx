import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { Grid, Header, List } from "semantic-ui-react";
import { IAppModel, pageSizeSet } from "../AppModel";
import { Link, Text } from "../components/common";
import { COLORS, IMAGES } from "../constants";
import {
  M001RegisterInstructionModal,
  M002DeactivateUserInstruction
} from "../modals";
import authStore, { IAuthModel } from "../modules/auth/AuthModel";
import { ResetPassword } from "../modules/auth/components";
import ForgetPassword from "../modules/auth/ForgetPassword";
import LoginForm from "../modules/auth/LoginForm";
import VerifyPassword from "../modules/auth/VerifyPassword";
const { login_bg } = IMAGES;

interface ILoginPage extends WithTranslation, RouteComponentProps {
  appStore?: IAppModel;
  authStore?: IAuthModel;
}
@inject("appStore", "authStore")
@observer
class LoginPage extends Component<ILoginPage> {
  public state = {
    step: "LoginForm"
  };
  public render() {
    const { t } = this.props;
    return authStore.access_token ? (
      <Redirect to="/" />
    ) : (
      <Grid
        padded
        style={{
          height:
            this.props.appStore!.pageSize === pageSizeSet.small
              ? this.getBodyHeight()
              : "auto"
        }}
      >
        <Grid.Column
          computer="4"
          tablet="4"
          style={styles.leftSection}
          only="computer tablet"
        >
          {this.renderLeftSection()}
          <div style={{ ...styles.version, width: "24%" }}>
            {t("version", { version: process.env.REACT_APP_VERSION })}
          </div>
        </Grid.Column>
        <Grid.Column
          computer="12"
          tablet="12"
          mobile="16"
          style={styles.rightSection}
        >
          {this.renderRightSection()}
        </Grid.Column>
      </Grid>
    );
  }

  public onChangeStep = (stepName: string) => {
    this.setState({
      step: stepName
    });
  };

  private renderLeftSection() {
    const { t } = this.props;
    return (
      <Grid container padded>
        <Grid.Row>
          <Grid.Column>
            <Header size="huge" style={styles.textColor} inverted>
              {t("odf")}
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header size="medium" style={styles.textColor} inverted>
              {t("appName")}
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column style={styles.departmentGroupStyle}>
            <Header size="medium" style={styles.textColor} inverted>
              {t("page.loginPage.elderlyFund")}
            </Header>
          </Grid.Column>
          <Grid.Column style={styles.departmentGroupStyle}>
            <Header size="medium" style={styles.textColor} inverted>
              {t("page.loginPage.departmentElderlyAffairs")}
            </Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  private renderRightSection() {
    const { authStore } = this.props;
    return (
      <Grid columns="equal" style={styles.fluid} verticalAlign="middle" padded>
        <Grid.Row>
          <Grid.Column computer={4} mobile={16} />
          <Grid.Column computer={8} mobile={16}>
            <Grid columns={2}>
              <Grid.Row style={styles.nonePaddingRow}>
                <Grid.Column floated="left">
                  {this.renderChangingPageSizeLink()}
                </Grid.Column>
                <Grid.Column floated="right">
                  {this.renderChangingLangLink()}
                </Grid.Column>
              </Grid.Row>
            </Grid>
            {this.state.step === "LoginForm" ? (
              <LoginForm onChangeStep={this.onChangeStep} />
            ) : null}
            {this.state.step === "ForgetPasswordForm" ? (
              <ForgetPassword onChangeStep={this.onChangeStep} />
            ) : null}
            {this.state.step === "VerifyForm" ? (
              <VerifyPassword onChangeStep={this.onChangeStep} />
            ) : null}
            {this.state.step === "ResetPasswordForm" ? (
              <ResetPassword
                onChangeStep={this.onChangeStep}
                onChangeInputField={this.onChangeInputField}
                resetPassword={this.resetPassword}
                loading={authStore!.loading}
                error={authStore!.error}
                isPasswordMissMatch={authStore!.isPasswordMissMatch}
                isPasswordInCorrectFormat={authStore!.isPasswordInCorrectFormat}
              />
            ) : null}
            {this.renderRegisterSection()}
          </Grid.Column>
          <Grid.Column computer={4} mobile={16} />
        </Grid.Row>
      </Grid>
    );
  }

  private renderChangingLangLink() {
    const { i18n } = this.props;
    const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng);
    };
    return (
      <List divided verticalAlign="middle" horizontal floated="right">
        <List.Item>
          <Link
            shade={i18n.language === "th" ? 2 : 4}
            size={"large"}
            hideUnderline={i18n.language === "th" ? false : true}
            onClick={() => changeLanguage("th")}
          >
            ไทย
          </Link>
        </List.Item>
        <List.Item>
          <Link
            shade={i18n.language === "en" ? 2 : 4}
            size={"large"}
            hideUnderline={i18n.language === "en" ? false : true}
            onClick={() => changeLanguage("en")}
          >
            ENG
          </Link>
        </List.Item>
      </List>
    );
  }

  private renderChangingPageSizeLink() {
    const { t } = this.props;
    const selectedPageSize = this.props.appStore!.pageSize;
    return (
      <List divided verticalAlign="middle" horizontal>
        <List.Item>
          <Link
            shade={selectedPageSize === pageSizeSet.small ? 2 : 4}
            size={"small"}
            hideUnderline={
              selectedPageSize === pageSizeSet.small ? false : true
            }
            onClick={() => this.props.appStore!.setPageSize(pageSizeSet.small)}
          >
            {t("pageSizeSmall")}
          </Link>
        </List.Item>
        <List.Item>
          <Link
            shade={selectedPageSize === pageSizeSet.regular ? 2 : 4}
            size={"medium"}
            hideUnderline={
              selectedPageSize === pageSizeSet.regular ? false : true
            }
            onClick={() =>
              this.props.appStore!.setPageSize(pageSizeSet.regular)
            }
          >
            {t("pageSizeRegular")}
          </Link>
        </List.Item>
        <List.Item>
          <Link
            shade={selectedPageSize === pageSizeSet.big ? 2 : 4}
            size={"big"}
            hideUnderline={selectedPageSize === pageSizeSet.big ? false : true}
            onClick={() => this.props.appStore!.setPageSize(pageSizeSet.big)}
          >
            {t("pageSizeBig")}
          </Link>
        </List.Item>
      </List>
    );
  }

  private renderRegisterSection = () => {
    const { t } = this.props;
    return (
      <List floated="right">
        <List.Item style={styles.textAlignRight}>
          <M001RegisterInstructionModal
            trigger={
              <Text id={"link-label-m001"} shade={5} underline size="medium" style={styles.link}>
                {t("page.loginPage.notRegisterYet")}
              </Text>
            }
          />
        </List.Item>
        <List.Item style={styles.textAlignRight}>
          <M002DeactivateUserInstruction
            trigger={
              <Text id={"link-label-m002"} shade={5} underline size="medium" style={styles.link}>
                {t("page.loginPage.cancelAccount")}
              </Text>
            }
          />
        </List.Item>
      </List>
    );
  };

  private getBodyHeight = () => {
    const body = document.body;
    const html = document.documentElement;
    const max = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    return max;
  };

  private onChangeInputField = (fieldname: string, value: string) => {
    const { authStore } = this.props;
    authStore!.setField({ fieldname, value });
  };

  private resetPassword = async () => {
    const { authStore } = this.props;
    try {
      await authStore!.reset_password();
      this.onChangeStep("LoginForm");
    } catch (e) {
      console.log(e);
    }
  };
}
const styles: any = {
  container: {
    minHeight: "100vh",
    backgroundColor: COLORS.lightBlue
  },
  leftSection: {
    minHeight: "100vh",
    backgroundSize: "cover",
    backgroundImage: `url(${login_bg})`
  },
  rightSection: {
    minHeight: "100vh",
    backgroundColor: COLORS.lightBlue
  },
  fluid: {
    height: "100%"
  },
  textAlignRight: {
    textAlign: "right"
  },
  nonePaddingRow: {
    padding: 0
  },
  departmentGroupStyle: {
    paddingTop: 7,
    paddingBottom: 7,
    width: "auto"
  },
  textColor: {
    color: COLORS.darkOrange
  },
  link: {
    cursor: "pointer"
  },
  version: {
    textAlign: "center",
    color: COLORS.white,
    position: "fixed",
    bottom: 0,
    left: 0,
    padding: " 10px 0px",
  },
};
export default withTranslation()(LoginPage);
