import { inject, observer } from "mobx-react";
import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Container, Form, Header, Segment, List } from "semantic-ui-react";
import { Link, Text } from "../../components/common";
import { ErrorMessage } from "../../components/common/error";
import { Logo } from "../../components/project";
import { IAuthModel } from "./AuthModel";
import {
  M001RegisterInstructionModal,
  M002DeactivateUserInstruction
} from "../../modals";

export interface ILoginFormStaff extends WithTranslation, RouteComponentProps {
  onChangeStep: (stepName: string) => void;
  authStore?: IAuthModel;
}

@inject("authStore")
@observer
class LoginFormStaff extends React.Component<ILoginFormStaff> {
  public render() {
    const { t, authStore, onChangeStep } = this.props;
    return (
      <Segment padded="very">
        <Logo />
        <Header size="medium" textAlign="left" style={styles.headerSubStyle}>
          {t("page.loginPage.logIn") + "(" + t("page.loginPage.buttonStaff") + ")"}
          <Header.Subheader>
            {t("module.auth.loginForm.inOrderToAccessProfessionalLoanService")}
          </Header.Subheader>
        </Header>
        <Form loading={authStore!.loading} onSubmit={this.onSignIn}>
          <Form.Input
            id="form-input-username"
            required
            label={t("page.loginPage.username")}
            icon="user"
            iconPosition="left"
            placeholder={t("page.loginPage.username")}
            style={styles.textInputStyle}
            value={authStore!.username}
            width="16"
            // onChange={this.onUsernameChange}
            onChange={(e: any, data: any) => {
              this.onUsernameChange(e, data);
              e.target.setCustomValidity("");
            }}
            onInvalid={(e: any, data: any) =>
              e.target.setCustomValidity(
                t("module.auth.loginForm.pleaseEnterYourUsername")
              )
            }
          />
          <Form.Input
            id="form-input-password"
            required
            label={t("page.loginPage.password")}
            icon="lock"
            iconPosition="left"
            placeholder={t("page.loginPage.password")}
            style={styles.textInputStyle}
            value={authStore!.password}
            // onChange={this.onPasswordChange}
            onChange={(e: any, data: any) => {
              this.onPasswordChange(e, data);
              e.target.setCustomValidity("");
            }}
            onInvalid={(e: any, data: any) =>
              e.target.setCustomValidity(
                t("module.auth.loginForm.pleaseEnterYourPassword")
              )
            }
            type="password"
            width="16"
          />
          <ErrorMessage id={"error-message-login"} errorobj={authStore!.error} />
          <Form.Button
            id="form-button-login"
            fluid
            style={styles.buttonMarginStyle}
            type="submit"
            color="brown"
          >
            {t("page.loginPage.confirm")}
          </Form.Button>
        </Form>
        <Container textAlign="center" style={styles.forgetPasswordStyle}>
          <Link
            id={"link-forget-password"}
            size="medium"
            shade={5}
            onClick={() => onChangeStep("ForgetPasswordForm")}
          >
            {t("page.loginPage.forgetPassword")}
          </Link>
        </Container>
        <Container textAlign="center" style={styles.forgetPasswordStyle}>
          <M001RegisterInstructionModal
            trigger={
              <Text id={"link-label-m001"} shade={5} underline size="medium" style={styles.link}>
                {t("page.loginPage.notRegisterYet")}
              </Text>
            }
          />
        </Container>
        <Container textAlign="center" style={styles.forgetPasswordStyle}>
          <M002DeactivateUserInstruction
            trigger={
              <Text id={"link-label-m002"} shade={5} underline size="medium" style={styles.link}>
                {t("page.loginPage.cancelAccount")}
              </Text>
            }
          />
        </Container>
      </Segment>
    );
  }
  private onSignIn = async () => {
    const { history, authStore } = this.props;
    try {
      await authStore!.sign_in();
      history.push("/loan/request");
    } catch (e) {
      console.log(e);
    }
  };
  private onUsernameChange = (event: any, data: any) => {
    this.props.authStore!.setField({
      fieldname: "username",
      value: data.value
    });
    this.props.authStore!.error.setField({ fieldname: "tigger", value: false });
  };
  private onPasswordChange = (event: any, data: any) => {
    this.props.authStore!.setField({
      fieldname: "password",
      value: data.value
    });
    this.props.authStore!.error.setField({ fieldname: "tigger", value: false });
  };
}

const styles: any = {
  subHeader: {
    textAlign: "left"
  },
  textInputStyle: {
    marginBottom: 14
  },
  buttonMarginStyle: {
    marginTop: 36
  },
  headerSubStyle: {
    marginTop: 28,
    marginBottom: 28
  },
  forgetPasswordStyle: {
    paddingTop: 32
  }
};

export default withRouter(withTranslation()(LoginFormStaff));
