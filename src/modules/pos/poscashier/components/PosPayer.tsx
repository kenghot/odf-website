import { inject, observer } from "mobx-react";
import moment from "moment";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Button,
  Confirm,
  Form,
  Grid,
  Header,
  Icon,
  Responsive,
  Segment
} from "semantic-ui-react";
import { PosPayerSection } from ".";
import { IAppModel } from "../../../../AppModel";
import { AlertMessage } from "../../../../components/common";
import { Loading } from "../../../../components/common/loading";
import { COLORS } from "../../../../constants";
import { IReceiptModel } from "../../../receipt/ReceiptModel";
import { IPosModel } from "../../PosModel";
import { connectPrinter, printFromTemplate } from "../../Receipt";

interface IPosPayer extends WithTranslation {
  appStore?: IAppModel;
  receipt: IReceiptModel;
  style?: any;
  pos: IPosModel;
}

@inject("appStore")
@observer
class PosPayer extends React.Component<IPosPayer> {
  public state = {
    confirm: false,
    confirmModalPrinter: false,
    confirmPrinter: false
  };
  public openConfirmModalPrinter = () =>
    this.setState({ confirmModalPrinter: true });
  public closeConfirmModalPrinter = () =>
    this.setState({ confirmModalPrinter: false });
  public open = () => this.setState({ confirm: true });
  public close = () => this.setState({ confirm: false });
  public render() {
    const { receipt, t } = this.props;
    return (
      <Segment id="PosPayer" style={{ ...styles.segment, ...this.props.style }}>
        <Form onSubmit={this.open} size={"mini"}>
          <Grid stackable>
            <Grid.Row divided>
              <Grid.Column computer={12} tablet={16}>
                <PosPayerSection receipt={receipt} />
              </Grid.Column>
              <Grid.Column
                computer={4}
                tablet={16}
                textAlign="center"
                verticalAlign="middle"
                style={styles.column}
              >
                {this.renderComputerView()}
                {this.renderMobileView()}
                <AlertMessage
                  float={true}
                  messageobj={receipt.alert}
                  timeout={20000}
                />
                <Confirm
                  closeOnDimmerClick={false}
                  content={
                    <div className="content">
                      {t("module.pos.posPayer.confirmContent")}
                      <Loading active={receipt.loading} />
                    </div>
                  }
                  size="mini"
                  open={this.state.confirm}
                  onCancel={this.close}
                  onConfirm={this.onSubmit}
                  cancelButton={t("module.pos.posPayer.cancelButton")}
                  confirmButton={t("module.pos.posPayer.confirmButton")}
                />
                <Confirm
                  closeOnDimmerClick={false}
                  content={
                    <div className="content">
                      {t("module.pos.posPayer.confirmPrinter")}
                      <Loading active={receipt.loading} />
                    </div>
                  }
                  size="mini"
                  open={this.state.confirmModalPrinter}
                  onCancel={this.closeConfirmModalPrinter}
                  onConfirm={this.onSubmitNoCheck}
                  cancelButton={t("module.pos.posPayer.cancelButton")}
                  confirmButton={t("module.pos.posPayer.confirmButton")}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Segment>
    );
  }

  private renderComputerView() {
    const { t, receipt } = this.props;
    return (
      <Responsive minWidth={767}>
        <Button
          id="btn-form-submit-computer"
          fluid
          style={styles.button}
          disabled={receipt.receiptCreateButton}
        >
          <Segment style={styles.buttonSegmentComputerView}>
            <Header icon size="small">
              <Icon circular inverted color="blue" name="angle right" />
              {t("module.pos.posPayer.payment")}
            </Header>
          </Segment>
        </Button>
      </Responsive>
    );
  }

  private renderMobileView() {
    const { t, receipt } = this.props;
    return (
      <Responsive maxWidth={766}>
        <Button
          id="btn-form-submit-mobile"
          fluid
          color="blue"
          size="large"
          icon
          disabled={receipt.receiptCreateButton}
        >
          {t("module.pos.posPayer.payment")}
          <Icon name="angle right" />
        </Button>
      </Responsive>
    );
  }

  public onSubmitNoCheck = async () => {
    await this.setState({ confirmPrinter: true });
    await this.onSubmit();
  };

  private onSubmit = async () => {
    const { receipt, pos, appStore } = this.props;
    try {
      let recieveByName = "";
      if (pos.lastestPosShift && pos.lastestPosShift.onDutymanager) {
        recieveByName = pos.lastestPosShift.onDutymanager.fullname;
      }

      if (!this.state.confirmPrinter) {
        await connectPrinter(pos, receipt);
      }
      await receipt.setOrganizationName(pos.organization);
      await receipt.setOrganizationAddress(pos.organization.address);
      await receipt.createReceipt(
        pos.id,
        pos.organizationId,
        pos.organization,
        recieveByName
      );
      let printedDatetime = moment().format();

      if (!this.state.confirmPrinter) {
        printedDatetime = await printFromTemplate(
          pos,
          receipt,
          "PD",
          appStore!
        );
        //printออก2ใบใน1รายการ
        await printFromTemplate(
          pos,
          receipt,
          "PD",
          appStore!
        );
      }
      await receipt.createReceiptPrintLog(printedDatetime);
      receipt.setField({ fieldname: "loading", value: true });
      await setTimeout(() => {
        receipt.resetAll();
        this.close();
      }, 5000);
      await this.setState({ confirmPrinter: false });
      await this.setState({ confirmModalPrinter: false });
    } catch (error) {

      if (!this.state.confirmPrinter) {
        this.close();
        this.openConfirmModalPrinter();

      } else {
        await this.setState({ confirmPrinter: false });
        if (receipt.id === null || typeof receipt.id === 'undefined') {
          this.closeConfirmModalPrinter();
        }
      }

    }
  };
}
const styles: any = {
  segment: {
    background: COLORS.contentGrey
  },
  column: {
    padding: 0
  },
  button: {
    padding: 0
  },
  buttonSegment: {
    borderWidth: 0
  },
  buttonSegmentComputerView: {
    borderWidth: 0,
    background: COLORS.contentGrey,
    boxShadow: "none",
    border: "none"
  }
};
export default withTranslation()(PosPayer);
