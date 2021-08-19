import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Confirm, Divider, Grid, Header, Icon, Label, List } from "semantic-ui-react";
import { Link } from "../../../../components/common";
import { IRequestModel } from "../RequestModel";
import { hasPermission } from "../../../../utils/render-by-permission";
import {
  ClickLinkModal
} from "../../../../modals";

interface IRequestStepIcon extends WithTranslation {
  step: number;
  onNextStep?: () => void;
  onPreviousStep?: () => void;
  onClickStep: (index: number) => void;
  onCreate?: () => void;
  onSave?: () => void;
  hideSubmitButton?: boolean;
  viewMode?: boolean;
  positionBottom?: boolean;
  isInvalid?: boolean;
}
@observer
class RequestStepIcon extends React.Component<IRequestStepIcon> {
  public state = { open: false };
  public open = () => {
    this.setState({ open: true });
  };
  public close = () => this.setState({ open: false });
  public render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <Grid columns="equal" verticalAlign="middle" stackable>
          <Grid.Row>
            <Grid.Column textAlign="left" style={styles.column}>
              {this.props.step !== 1 ? (
                <React.Fragment>
                  <Icon link name="angle left" onClick={this.onPreviousStep} color="blue" />
                  <Link shade={5} onClick={this.onPreviousStep}>
                    {t("module.loan.requestDetail.back")}
                  </Link>
                </React.Fragment>
              ) : null}
            </Grid.Column>
            <Grid.Column width={10} style={styles.column}>
              <Grid columns="equal" verticalAlign="middle" centered stackable>
                <Grid.Row>
                  <Grid.Column style={styles.column}>
                    <Link onClick={() => this.onClickStep(1)} style={styles.step}>
                      <Header
                        textAlign="center"
                        content={
                          <Label circular color={[1, 2, 3].includes(this.props.step) ? "blue" : "grey"}>
                            1
                          </Label>
                        }
                        subheader={t("module.loan.requestDetail.InfoBorrowersSupporters")}
                      />
                    </Link>
                  </Grid.Column>
                  <Grid.Column width={8} style={styles.column}>
                    <Divider horizontal>
                      <Link onClick={() => this.onClickStep(2)} style={styles.step}>
                        <Header
                          textAlign="center"
                          content={
                            <Label circular color={[2, 3].includes(this.props.step) ? "blue" : "grey"}>
                              2
                            </Label>
                          }
                          subheader={t("module.loan.requestDetail.detailsLoan")}
                        />
                      </Link>
                    </Divider>
                  </Grid.Column>
                  <Grid.Column style={styles.column}>
                    <Link onClick={() => this.onClickStep(3)} style={styles.step}>
                      <Header
                        textAlign="center"
                        onClick={() => this.setState({ step: 3 })}
                        content={
                          <Label circular color={this.props.step === 3 ? "blue" : "grey"}>
                            3
                          </Label>
                        }
                        subheader={t("module.loan.requestDetail.attachment")}
                      />
                    </Link>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column textAlign="right" style={styles.column}>
              {this.renderCheckStepButton()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
  private renderNextStepButton() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <Link shade={5} onClick={this.onNextStep}>
          {this.props.viewMode ? t("module.loan.requestDetail.next") : t("module.loan.requestDetail.saveContinue")}
        </Link>
        <Icon link name="angle right" color="blue" onClick={this.onNextStep} />
      </React.Fragment>
    );
  }
  private renderLastStepButton() {
    const { hideSubmitButton, t, isInvalid } = this.props;
    return (
      <List style={styles.sendButtom}>
        <List.Item>
          {
            hasPermission("REQUEST.ONLINE.CREATE") ?
              <ClickLinkModal
                trigger={
                  <Button fluid color="brown" onClick={this.onSave} disabled={isInvalid}>
                    {t("module.loan.requestDetail.saveRequestOnline")}
                  </Button>
                }
              />
              :
              <Button fluid color="blue" basic={!hideSubmitButton} onClick={this.onSave}>
                {t("module.loan.requestDetail.save")}
              </Button>
          }

        </List.Item>
        {!hideSubmitButton ? (
          <List.Item>
            {hasPermission("REQUEST.ONLINE.CREATE") ?
              null :
              <Button fluid color="blue" disabled={isInvalid} onClick={this.open}>
                {t("module.loan.requestDetail.createRequest")}
              </Button>
            }
            <Confirm
              size="tiny"
              content={t("module.loan.requestDetail.pleaseConfirmCreationRequestForm")}
              cancelButton={t("module.loan.requestDetail.cancel")}
              confirmButton={t("module.loan.requestDetail.confirm")}
              open={this.state.open}
              onCancel={this.close}
              onConfirm={this.onCreate}
            />
          </List.Item>
        ) : null}
      </List>
    );
  }
  private renderCheckStepButton() {
    if (this.props.step === 3) {
      return this.props.viewMode ? null : this.renderLastStepButton();
    } else {
      return hasPermission("REQUEST.ONLINE.CREATE") ? null : this.renderNextStepButton();
    }
  }

  private onNextStep = () => {
    const { onNextStep, positionBottom } = this.props;
    if (typeof onNextStep !== "undefined") {
      onNextStep();
      if (positionBottom) {
        this.onScrollToTop();
      }
    }
  };
  private onPreviousStep = () => {
    const { onPreviousStep, positionBottom } = this.props;
    if (typeof onPreviousStep !== "undefined") {
      onPreviousStep();
      if (positionBottom) {
        this.onScrollToTop();
      }
    }
  };
  private onClickStep = (index: number) => {
    const { onClickStep, positionBottom } = this.props;
    if (hasPermission("REQUEST.ONLINE.CREATE") && this.props.viewMode == undefined) {
      // console.log("requestonline")
    } else {
      if (typeof onClickStep !== "undefined") {
        onClickStep(index);
        if (positionBottom) {
          this.onScrollToTop();
        }
      }
    }
  };
  private onCreate = () => {
    const { onCreate, positionBottom } = this.props;
    if (typeof onCreate !== "undefined") {
      onCreate();
      if (positionBottom) {
        this.onScrollToTop();
      }
    }
  };
  private onSave = () => {
    const { onSave, positionBottom } = this.props;
    if (typeof onSave !== "undefined") {
      onSave();
      if (positionBottom) {
        this.onScrollToTop();
      }
    }
  };
  private onScrollToTop = () => {
    const headerElement = document.getElementById("headerElement");
    headerElement!.scrollIntoView();
    // window.scrollTo(0, 0);
  };
}

const styles: any = {
  column: {
    paddingRight: 0,
    paddingLeft: 0,
  },
  sendButtom: {
    marginTop: 32,
    marginBottom: 7,
  },
  step: {
    textDecoration: "none",
  },
};

export default withTranslation()(RequestStepIcon);
