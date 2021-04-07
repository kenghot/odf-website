import { inject, observer } from "mobx-react";
import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Grid, Header, Segment } from "semantic-ui-react";
import { ErrorMessage, Link } from "../../components/common";
import { Logo } from "../../components/project";
import { IAuthModel } from "./AuthModel";

export interface IForgetPassword extends WithTranslation {
  onChangeStep: (stepName: string) => void;
  authStore?: IAuthModel;
}

@inject("authStore")
@observer
class ForgetPassword extends React.Component<IForgetPassword> {
  public render() {
    const { t, onChangeStep, authStore } = this.props;
    return (
      <Segment padded="very">
        <Logo />
        <Header size="medium" textAlign="left" style={styles.headerSubStyle}>
          {t("page.loginPage.forgetPassword") + "?"}
          <Header.Subheader>
            {t("page.loginPage.specifyUsername")}
          </Header.Subheader>
        </Header>
        <Form loading={authStore!.loading} onSubmit={this.requestNewPassword}>
          <Form.Input
            id="form-input-username"
            required
            label={t("page.loginPage.username")}
            icon="user"
            iconPosition="left"
            placeholder={t("page.loginPage.username")}
            style={styles.textInputStyle}
            width="16"
            onChange={(event: any, data: any) =>
              authStore!.userProfile.setField({
                fieldname: "email",
                value: data.value
              })
            }
            value={authStore!.userProfile.email || ""}
          />

          <ErrorMessage errorobj={authStore!.error} />
          <Grid style={styles.buttonMarginStyle}>
            <Grid.Row columns="equal" verticalAlign="middle">
              <Grid.Column>
                <Link
                  size="medium"
                  hideUnderline
                  onClick={() => onChangeStep("LoginForm")}
                >
                  {t("canceled")}
                </Link>
              </Grid.Column>
              <Grid.Column>
                <Form.Button
                  id={"btn-submit-forget-password"}
                  primary
                  floated="right"
                  type="submit"
                >
                  {t("continue")}
                </Form.Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Segment>
    );
  }
  private requestNewPassword = async () => {
    const { authStore, onChangeStep } = this.props;
    try {
      await authStore!.new_password_request();
      onChangeStep("VerifyForm");
    } catch (e) {
      console.log(e);
    }
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
    marginTop: 21
  },
  headerSubStyle: {
    marginTop: 28,
    marginBottom: 28
  }
};

export default withTranslation()(ForgetPassword);
