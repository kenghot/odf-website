import { inject, observer } from "mobx-react";
import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Grid, Header, Segment } from "semantic-ui-react";
import { ErrorMessage, Link } from "../../components/common";
import { Logo } from "../../components/project";
import { IAuthModel } from "./AuthModel";

export interface IVerifyPassword extends WithTranslation {
  onChangeStep: (stepName: string) => void;
  authStore?: IAuthModel;
}

@inject("authStore")
@observer
class VerifyPassword extends React.Component<IVerifyPassword> {
  public state = {
    pin1: "",
    pin2: "",
    pin3: "",
    pin4: "",
    pin5: "",
    pin6: ""
  };
  private refKeys: any = [];
  public render() {
    const { t, authStore, onChangeStep } = this.props;
    return (
      <Segment padded="very">
        <Logo />
        <Header size="medium" textAlign="left" style={styles.headerSubStyle}>
          {t("page.loginPage.verifyIdentity")}
          <Header.Subheader>
            {t("page.loginPage.specifyPinMobile", {
              email: authStore!.userProfile.telephone
            })}
          </Header.Subheader>
        </Header>
        <Form loading={authStore!.loading} onSubmit={this.requestNewPassword}>
          <Form.Group widths="equal">
            <input
              id={"form-input-pin-1"}
              required
              type="text"
              maxLength={1}
              value={this.state.pin1}
              onChange={(e) => {
                this.onChangeFieldName(e, "pin1");
                e.target.setCustomValidity("");
              }}
              onInvalid={(e: any) =>
                e.target.setCustomValidity(
                  t("page.loginPage.pleaseSpecifyDigitAt", { value: 1 })
                )
              }
              style={styles.pinInputCustomStyle}
              onKeyUp={(e: any) => this.onChangeKeyUp(e, 1)}
              ref={(ref: any) => (this.refKeys[0] = ref)}
            />
            <input
              id={"form-input-pin-2"}
              required
              type="text"
              maxLength={1}
              value={this.state.pin2}
              onChange={(e) => {
                this.onChangeFieldName(e, "pin2");
                e.target.setCustomValidity("");
              }}
              onInvalid={(e: any) =>
                e.target.setCustomValidity(
                  t("page.loginPage.pleaseSpecifyDigitAt", { value: 2 })
                )
              }
              style={styles.pinInputCustomStyle}
              onKeyUp={(e: any) => this.onChangeKeyUp(e, 2)}
              ref={(ref: any) => (this.refKeys[1] = ref)}
            />
            <input
              id={"form-input-pin-3"}
              required
              type="text"
              maxLength={1}
              value={this.state.pin3}
              onChange={(e) => {
                this.onChangeFieldName(e, "pin3");
                e.target.setCustomValidity("");
              }}
              onInvalid={(e: any) =>
                e.target.setCustomValidity(
                  t("page.loginPage.pleaseSpecifyDigitAt", { value: 3 })
                )
              }
              style={styles.pinInputCustomStyle}
              onKeyUp={(e: any) => this.onChangeKeyUp(e, 3)}
              ref={(ref: any) => (this.refKeys[2] = ref)}
            />

            <input
              id={"form-input-pin-4"}
              required
              type="text"
              maxLength={1}
              value={this.state.pin4}
              onChange={(e) => {
                this.onChangeFieldName(e, "pin4");
                e.target.setCustomValidity("");
              }}
              onInvalid={(e: any) =>
                e.target.setCustomValidity(
                  t("page.loginPage.pleaseSpecifyDigitAt", { value: 4 })
                )
              }
              style={styles.pinInputCustomStyle}
              onKeyUp={(e: any) => this.onChangeKeyUp(e, 4)}
              ref={(ref: any) => (this.refKeys[3] = ref)}
            />
            <input
              id={"form-input-pin-5"}
              required
              type="text"
              maxLength={1}
              value={this.state.pin5}
              onChange={(e) => {
                this.onChangeFieldName(e, "pin5");
                e.target.setCustomValidity("");
              }}
              onInvalid={(e: any) =>
                e.target.setCustomValidity(
                  t("page.loginPage.pleaseSpecifyDigitAt", { value: 5 })
                )
              }
              style={styles.pinInputCustomStyle}
              onKeyUp={(e: any) => this.onChangeKeyUp(e, 5)}
              ref={(ref: any) => (this.refKeys[4] = ref)}
            />
            <input
              id={"form-input-pin-6"}
              required
              type="text"
              maxLength={1}
              value={this.state.pin6}
              onChange={(e) => {
                this.onChangeFieldName(e, "pin6");
                e.target.setCustomValidity("");
              }}
              onInvalid={(e: any) =>
                e.target.setCustomValidity(
                  t("page.loginPage.pleaseSpecifyDigitAt", { value: 6 })
                )
              }
              style={styles.pinInputCustomStyle}
              onKeyUp={(e: any) => this.onChangeKeyUp(e, 6)}
              ref={(ref: any) => (this.refKeys[5] = ref)}
            />
          </Form.Group>
          <ErrorMessage errorobj={authStore!.error} />
          <Grid style={styles.buttonMarginStyle}>
            <Grid.Row columns="equal" verticalAlign="middle">
              <Grid.Column>
                <Link
                  size="medium"
                  hideUnderline
                  onClick={() => onChangeStep("ForgetPasswordForm")}
                >
                  {t("canceled")}
                </Link>
              </Grid.Column>
              <Grid.Column>
                <Form.Button id={"btn-submit-pin-code"} primary floated="right" type="submit">
                  {t("continue")}
                </Form.Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Segment>
    );
  }
  public requestNewPassword = async () => {
    const { authStore, onChangeStep } = this.props;
    const { pin1, pin2, pin3, pin4, pin5, pin6 } = this.state;
    if (pin1 && pin2 && pin3 && pin4 && pin5 && pin6) {
      try {
        await authStore!.setField({
          fieldname: "resetPasswordToken",
          value: pin1 + pin2 + pin3 + pin4 + pin5 + pin6
        });
        await authStore!.confirm_password_token();
        onChangeStep("ResetPasswordForm");
      } catch (e) {
        console.log(e);
      }
    }
  };

  private onChangeFieldName = (value: any, fieldName: string) => {
    this.setState({
      [fieldName]: value.target.value
    });
  };

  private onChangeKeyUp = async (e: any, nextIndex: number) => {
    const DELETEKEY = 8;
    const TAPKEY = 9;
    if (e.keyCode !== DELETEKEY && e.keyCode !== TAPKEY) {
      if (nextIndex <= 5) {
        await this.refKeys[nextIndex].focus();
      }
    } else if (e.keyCode === DELETEKEY && e.keyCode !== TAPKEY) {
      if (nextIndex - 2 >= 0) {
        await this.refKeys[nextIndex - 2].focus();
      }
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
  pinInputCustomStyle: {
    height: "90px",
    paddingLeft: "1px",
    paddingRight: "1px",
    textAlign: "center",
    paddingBottom: "4px",
    minWidth: "40px",
    maxWidth: "80px",
    fontSize: "24px",
    margin: "2px"
  },
  buttonMarginStyle: {
    marginTop: 36
  },
  headerSubStyle: {
    marginTop: 28,
    marginBottom: 28
  }
};

export default withTranslation()(VerifyPassword);
