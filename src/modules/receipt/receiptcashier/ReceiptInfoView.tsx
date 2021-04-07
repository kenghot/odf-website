import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Form,
  Grid,
  Header,
  Segment,
  SemanticCOLORS,
  Responsive
} from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { FormDisplay } from "../../../components/common";
import { StatusBlock } from "../../../components/common/block";
import { IReceiptModel } from "../ReceiptModel";
import { ReceiptInfoManager } from ".";
import { PermissionControl } from "../../../components/permission";

interface IReceiptInfoView extends WithTranslation {
  receipt: IReceiptModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class ReceiptInfoView extends React.Component<IReceiptInfoView> {
  public state = {
    maxHeightSegmentGroup: 0
  };
  public async componentDidMount() {
    try {
      await this.handleOnUpdate();
    } catch (e) {
      console.log(e);
    }
  }
  public render() {
    const { t, receipt, appStore } = this.props;
    return (
      <React.Fragment>
        <Responsive onUpdate={this.handleOnUpdate} />
        <Form>
          <Segment
            padded
            style={{
              overflowY: appStore!.tabletMode ? "initial" : "auto",
              maxHeight: appStore!.tabletMode
                ? "initial"
                : this.state.maxHeightSegmentGroup,
              minHeight: appStore!.tabletMode
                ? "initial"
                : this.state.maxHeightSegmentGroup
            }}
          >
            {this.renderHeader()}
            <Form.Group widths="equal">
              <FormDisplay
                title={t("module.receipt.receiptInfoEdit.orgName")}
                value={receipt.organization.orgName}
              />
              <FormDisplay
                title={t("module.receipt.receiptInfoEdit.posName")}
                value={`${receipt.pos.posName}${
                  receipt.pos.posCode ? ` : ${receipt.pos.posCode}` : ""
                }`}
              />
            </Form.Group>

            <FormDisplay
              title={t("module.receipt.receiptInfoEdit.organizationName")}
              value={receipt.organizationName}
            />
            {this.renderAddress()}
            <PermissionControl codes={["POS.EDIT.VAT"]}>
              {this.renderInfo()}
            </PermissionControl>
            {this.renderRef()}
            {this.renderNote()}
          </Segment>
          <ReceiptInfoManager receipt={receipt} />
        </Form>
      </React.Fragment>
    );
  }

  private renderHeader() {
    const { t, receipt, appStore } = this.props;
    return (
      <React.Fragment>
        <Grid columns="equal">
          <Grid.Row verticalAlign="top">
            <Grid.Column>
              <Header
                style={styles.header}
                size="medium"
                content={t("module.receipt.receiptInfoEdit.content")}
                subheader={t("module.receipt.receiptInfoEdit.subheader")}
              />
            </Grid.Column>
            <Grid.Column floated="right" textAlign="right">
              <StatusBlock
                label={appStore!.enumItemLabel("receiptStatus", receipt.status)}
                color={this.getStatusColor()}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }

  private renderAddress() {
    const { t, receipt } = this.props;
    return (
      <Form.Field>
        <label>
          {t("module.receipt.receiptInfoEdit.organizationAddressLine")}
        </label>
        <Segment>
          <FormDisplay title={" "} value={receipt.organizationAddressLine1} />
          {receipt.organizationAddressLine2 ? (
            <FormDisplay title={" "} value={receipt.organizationAddressLine2} />
          ) : null}
          {receipt.organizationAddressLine3 ? (
            <FormDisplay title={" "} value={receipt.organizationAddressLine3} />
          ) : null}
          {receipt.organizationAddressLine4 ? (
            <FormDisplay title={" "} value={receipt.organizationAddressLine4} />
          ) : null}
        </Segment>
      </Form.Field>
    );
  }

  private renderInfo() {
    const { t, receipt } = this.props;
    return (
      <Form.Field>
        <label>{t("module.receipt.receiptInfoEdit.taxInfo")}</label>
        <Segment>
          <FormDisplay
            title={t("module.receipt.receiptInfoEdit.organizationTaxNo")}
            value={receipt.organizationTaxNo}
          />
          <FormDisplay
            title={t("module.receipt.receiptInfoEdit.POSVATCode")}
            value={receipt.POSVATCode}
          />
        </Segment>
      </Form.Field>
    );
  }

  private renderRef() {
    const { t, receipt } = this.props;
    return (
      <React.Fragment>
        <br />
        <Form.Field>
          <label>{t("module.receipt.receiptInfoEdit.refNumber")}</label>
          <Segment>
            <Form.Group widths="equal">
              <FormDisplay
                title={t("module.receipt.receiptInfoEdit.internalRef1")}
                value={receipt.internalRef1}
              />
              <FormDisplay
                title={t("module.receipt.receiptInfoEdit.internalRef2")}
                value={receipt.internalRef2}
              />
            </Form.Group>
            <FormDisplay
              title={t("module.receipt.receiptInfoEdit.exteranalRef")}
              value={receipt.exteranalRef}
            />
          </Segment>
        </Form.Field>
      </React.Fragment>
    );
  }

  private renderNote() {
    const { t, receipt } = this.props;
    return (
      <React.Fragment>
        <br />
        <Form.Field>
          <label>{t("module.receipt.receiptInfoEdit.note")}</label>
          <Segment>
            <FormDisplay
              title={t("module.receipt.receiptInfoEdit.note")}
              value={receipt.documentNote}
            />
            <FormDisplay
              title={t("module.receipt.receiptInfoEdit.internalNote")}
              value={receipt.internalNote}
            />
          </Segment>
        </Form.Field>
      </React.Fragment>
    );
  }

  private getStatusColor(): SemanticCOLORS {
    const { receipt } = this.props;
    switch (receipt.status) {
      case "CL":
        return "red";
      case "PD":
        return "green";
      default:
        return "grey";
    }
  }
  private getHeightElement = (id: string) => {
    this.forceUpdate();
    const height = document.getElementById(id)
      ? document.getElementById(id)!.clientHeight
      : 0;
    return height;
  };

  private handleOnUpdate = async () => {
    const padding = 42;
    const body = this.getHeightElement("ReceiptModal-Content");
    const segmentInfoManager = this.getHeightElement("Segment-Info-Manager");
    const cal = body - padding - segmentInfoManager;
    if (cal > 0) {
      await this.setState({
        maxHeightSegmentGroup: cal
      });
    } else {
      await this.setState({
        maxHeightSegmentGroup: 0
      });
    }
  };
}

const styles: any = {
  header: {
    marginBottom: 28
  },
  row: {
    paddingTop: 0,
    paddingBottom: 0
  },
  column: {
    paddingTop: 14,
    paddingBottom: 14
  }
};

export default withTranslation()(ReceiptInfoView);
