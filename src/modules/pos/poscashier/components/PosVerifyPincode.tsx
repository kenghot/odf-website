import { inject, observer } from "mobx-react";
import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
  SemanticCOLORS
} from "semantic-ui-react";
import { ErrorMessage } from "../../../../components/common";
import { Loading } from "../../../../components/common/loading";
import { IAuthModel } from "../../../auth/AuthModel";
import { IPosModel } from "../../PosModel";

export interface IPosVerifyPincode
  extends WithTranslation,
    RouteComponentProps {
  pos: IPosModel;
  authStore?: IAuthModel;
  color?: SemanticCOLORS;
  posId?: string;
  posCode?: string;
}

@inject("authStore")
@observer
class PosVerifyPincode extends React.Component<IPosVerifyPincode> {
  public state = {
    pin1: "",
    pin2: "",
    pin3: "",
    pin4: ""
  };
  private refKeys: any = [];

  public render() {
    const { pos } = this.props;
    return (
      <React.Fragment>
        <Loading active={pos.loading} />
        <ErrorMessage errorobj={pos.error} float timeout={5000} />
        <Grid columns="equal" centered>
          <Grid.Row only="tablet computer">
            <Grid.Column style={styles.gridColumn}></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column only="tablet computer" />
            <Grid.Column computer="7" tablet="9" mobile="16">
              <Segment padded="very">
                {this.renderHeader()}
                {this.renderFormInput()}
              </Segment>
            </Grid.Column>
            <Grid.Column only="tablet computer" />
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }

  private renderHeader() {
    const { color, t, posCode } = this.props;
    return (
      <Header size="medium">
        <Button color={color || "orange"} style={styles.headerButton}>
          {posCode || "-"}
        </Button>
        <Header.Content style={styles.headerContent}>
          {t("module.pos.posVerifyPincode.header")}
          <Header.Subheader>
            {t("module.pos.posVerifyPincode.sunHeader")}
          </Header.Subheader>
        </Header.Content>
      </Header>
    );
  }

  private renderFormInput() {
    const { t, authStore } = this.props;
    return (
      <Form loading={authStore!.loading} onSubmit={this.onSubmitPinCode}>
        <Form.Group widths="equal" style={styles.formGroup}>
          <input
            id={"form-input-pin-1"}
            required
            type="password"
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
            type="password"
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
            type="password"
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
            type="password"
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
        </Form.Group>
        <ErrorMessage errorobj={authStore!.error} />
        <Grid>
          <Grid.Row
            style={styles.buttonMarginStyle}
            columns="equal"
            verticalAlign="middle"
          >
            <Grid.Column>
              <Form.Button
                id={"btn-back"}
                floated="left"
                type="button"
                color="brown"
                basic
                onClick={() => this.navigationToPosListPage()}
              >
                {t("canceled")}
              </Form.Button>
            </Grid.Column>
            <Grid.Column>
              <Form.Button
                id={"btn-submit-pin-code"}
                color="brown"
                floated="right"
                type="submit"
              >
                {t("continue")}
              </Form.Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }

  public onSubmitPinCode = async () => {
    const { authStore, pos, posId } = this.props;
    const { pin1, pin2, pin3, pin4 } = this.state;
    if (pin1 && pin2 && pin3 && pin4) {
      try {
        const pin = pin1 + pin2 + pin3 + pin4;
        await pos.posLogin(authStore!.userProfile.id, pin, posId);
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

  private navigationToPosListPage = async () => {
    const { history } = this.props;
    history.push(`/pos/cashier`);
  };

  private onChangeKeyUp = async (e: any, nextIndex: number) => {
    const DELETEKEY = 8;
    const TAPKEY = 9;
    if (e.keyCode !== DELETEKEY && e.keyCode !== TAPKEY) {
      if (nextIndex <= 3) {
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
  formGroup: {
    justifyContent: "center"
  },
  headerButton: {
    borderRadius: 10,
    height: 55,
    width: 55,
    textAlign: "center",
    paddingLeft: 0,
    paddingRight: 0,
    marginRight: 14
  },
  headerContent: {
    width: "80%"
  },

  pinInputCustomStyle: {
    height: "120px",
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
  gridColumn: {
    padding: 60
  }
};

export default withRouter(withTranslation()(PosVerifyPincode));
