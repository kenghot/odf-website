import { observer } from "mobx-react";
import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Grid, Header, Message, Segment } from "semantic-ui-react";
import { ErrorMessage, Link } from "../../../components/common";
import { IErrorModel } from "../../../components/common/error/ErrorModel";
import { Logo } from "../../../components/project";

export interface IRegisterPassword extends WithTranslation {
  onChangeStep?: (stepName: string) => void;
  onChangeInputField: (fieldName: string, value: any) => void;
  resetPassword: (e?: any) => void;
  loading?: boolean;
  error: IErrorModel;
  isPasswordMissMatch: boolean;
  isPasswordInCorrectFormat: boolean;
  labelSubmit?: string;
}
@observer
class RegisterPassword extends React.Component<IRegisterPassword> {
  public render() {
    const {
      t,
      onChangeInputField,
      onChangeStep,
      resetPassword,
      loading,
      isPasswordMissMatch,
      isPasswordInCorrectFormat,
      error,
      labelSubmit
    } = this.props;
    return (
      <Segment padded="very">
        {labelSubmit ? null : <Logo />}
        <Header size="medium" textAlign="left" style={styles.headerSubStyle}>
          {t("page.loginPage.specifyNewPassword")}
          <Header.Subheader>
            {t("page.loginPage.pleaseUseCharacters")}
          </Header.Subheader>
        </Header>
        <Form
          error={
            isPasswordMissMatch || isPasswordInCorrectFormat || error.tigger
          }
          loading={loading}
          onSubmit={resetPassword}
        >
          <Form.Input
            id="form-input-new-password"
            required
            icon="lock"
            iconPosition="left"
            style={styles.textInputStyle}
            width="16"
            onChange={(event: any, data: any) =>
              onChangeInputField("password", data.value)
            }
            type="password"
            label={t("page.loginPage.newPassword")}
            error={isPasswordInCorrectFormat}
          />

          <Form.Input
            id="form-input-confirm-password"
            required
            icon="lock"
            iconPosition="left"
            style={styles.textInputStyle}
            width="16"
            onChange={(event: any, data: any) =>
              onChangeInputField("confirmPassword", data.value)
            }
            type="password"
            label={t("page.loginPage.confirmPassword")}
            error={isPasswordMissMatch}
          />

          <Message error>
            <Message.Header>
              {t("module.auth.resetPassword.errorTitle")}
            </Message.Header>
            <Message.List>
              {isPasswordInCorrectFormat ? (
                <Message.Item>
                  {t("module.auth.resetPassword.error1")}
                </Message.Item>
              ) : null}
              {isPasswordMissMatch ? (
                <Message.Item>
                  {t("module.auth.resetPassword.error2")}
                </Message.Item>
              ) : null}
            </Message.List>
          </Message>
          <ErrorMessage errorobj={this.props.error} />
          <Grid style={styles.buttonMarginStyle}>
            <Grid.Row columns="equal" verticalAlign="middle">
              <Grid.Column>
                {labelSubmit ? null : (
                  <Link
                    size="medium"
                    hideUnderline
                    onClick={() => onChangeStep!("VerifyIdentityForm")}
                  >
                    {t("canceled")}
                  </Link>
                )}
              </Grid.Column>
              <Grid.Column>
                <Form.Button
                  id="form-button-submit-new-password"
                  primary
                  floated="right"
                  type="submit"
                  disabled={isPasswordMissMatch || isPasswordInCorrectFormat}
                >
                  {labelSubmit ? labelSubmit : t("continue")}
                </Form.Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Segment>
    );
  }
}

const styles: any = {
  subHeader: {
    textAlign: "left"
  },
  textInputStyle: {
    marginBottom: 14
  },
  buttonMarginStyle: {
    marginTop: 22
  },
  headerSubStyle: {
    marginTop: 28,
    marginBottom: 28
  }
};

export default withTranslation()(RegisterPassword);
