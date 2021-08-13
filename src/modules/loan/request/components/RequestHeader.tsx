import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Modal,
  Segment,
  SemanticCOLORS
} from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import { DateInput, FormDisplay } from "../../../../components/common";
import { StatusBlock } from "../../../../components/common/block";
import { PermissionControl } from "../../../../components/permission";
import { DeleteModal } from "../../../../modals";
import { date_display_CE_TO_BE } from "../../../../utils";
import { hasPermission } from "../../../../utils/render-by-permission";
import { IRequestModel } from "../RequestModel";

interface IRequestHeader extends WithTranslation, RouteComponentProps<any> {
  request: IRequestModel;
  hideBtn?: boolean;
  mode: "edit" | "view";
  appStore?: IAppModel;
}
@inject("appStore")
@observer
class RequestHeader extends React.Component<IRequestHeader> {
  public componentDidMount() {
    this.props.request.setField({
      fieldname: "documentDateAgreement",
      value: new Date().toISOString().substring(0, 10)
    });
  }
  public state = { openheader: false, open: false };
  public open = () => this.setState({ open: true });
  public close = () => this.setState({ open: false });
  public render() {
    return (
      <Grid columns="equal" style={styles.header} id="headerElement">
        <Grid.Row verticalAlign="top">{this.renerTitleRow()}</Grid.Row>
        <Grid.Row>{this.renderHeaderRow()}</Grid.Row>
        {this.props.hideBtn ? null : (
          <Grid.Row>{this.renderPrintButtonRow()}</Grid.Row>
        )}
      </Grid>
    );
  }
  private renerTitleRow() {
    const { request, appStore, t } = this.props;
    return (
      <React.Fragment>
        {request.status && (request.status !== "DF" || "DFO") ? (
          <Grid.Column>
            <Header
              size="medium"
              content={t("module.loan.requestDetail.requestIDCard", {
                idCard: request.full_name_id_card || "-"
              })}
              subheader={t("module.loan.requestDetail.requestNumber", {
                documentNumber: request.documentNumber
              })}
            />
          </Grid.Column>
        ) : null}

        <Grid.Column floated="right" textAlign="right">
          <StatusBlock
            label={appStore!.enumItemLabel("requestStatus", request.status)}
            color={this.getStatusColor()}
          />
        </Grid.Column>
      </React.Fragment>
    );
  }
  private renderHeaderRow() {
    const { t, request, appStore } = this.props;
    return (
      <Grid.Column>
        <Segment padded>
          <Form>
            <Form.Group widths="equal">
              <FormDisplay
                title={t("module.loan.agreementCardInfo.byOrganization")}
                value={request.organization.orgName || "-"}
                width={8}
              />
              {this.renderDocumentDate()}
              <FormDisplay
                title={t("module.loan.agreementCardInfo.category")}
                value={
                  appStore!.enumItemLabel("loanType", request.requestType) ||
                  "-"
                }
                width={3}
              />
              <Form.Field width={1}>
                <Icon
                  name={this.state.openheader ? "angle up" : "angle down"}
                  style={styles.button}
                  onClick={() => {
                    this.setState({ openheader: !this.state.openheader });
                  }}
                />
              </Form.Field>
            </Form.Group>
            {this.state.openheader ? (
              <Form.Group widths="equal">
                <FormDisplay
                  title={t("module.loan.agreementCardInfo.madeBy")}
                  value={request.createdByName || "-"}
                />
                <FormDisplay
                  title={t("module.loan.agreementCardInfo.createdWhen")}
                  value={date_display_CE_TO_BE(request.createdDate) || "-"}
                />
                <FormDisplay
                  title={t("module.loan.agreementCardInfo.lastEditedBy")}
                  value={request.updatedByName || "-"}
                />
                <FormDisplay
                  title={t("module.loan.agreementCardInfo.editWhen")}
                  value={date_display_CE_TO_BE(request.updatedDate) || "-"}
                />
              </Form.Group>
            ) : null}
            <Form.Group widths="equal" style={styles.buttonRow}>
              {this.props.hideBtn ? null : this.renderActionButtons()}
            </Form.Group>
          </Form>
        </Segment>
      </Grid.Column>
    );
  }

  private renderDocumentDate() {
    const { t, request, mode } = this.props;
    if (hasPermission("REQUEST.EDIT.DOCUMENTDATE") && mode === "edit") {
      return (
        <Form.Field
          width={4}
          label={t("module.loan.requestDetail.dateRequestReceived")}
          control={DateInput}
          id={"documentDate_edit"}
          value={request.documentDate || undefined}
          fieldName="documentDate"
          onChangeInputField={this.onChangeInputField}
        />
      );
    } else {
      return (
        <FormDisplay
          title={t("module.loan.requestDetail.dateRequestReceived")}
          value={date_display_CE_TO_BE(request.documentDate) || "-"}
          width={4}
        />
      );
    }
  }

  private renderPrintButtonRow() {
    const { request, t } = this.props;
    return (
      <Grid.Column>
        {["AP3", "DN"].includes(request.status) ? (
          <React.Fragment>
            <Button
              width={7}
              floated="right"
              color="orange"
              onClick={this.onPrintGuarantee}
            >
              <Icon name="print" />
              {t("module.loan.requestDetail.exampleContractGuarantee")}
            </Button>
            <Button
              width={7}
              floated="right"
              color="purple"
              onClick={this.onPrintAgreement}
            >
              <Icon name="print" />
              {t("module.loan.requestDetail.exampleLoanAgreement")}
            </Button>
          </React.Fragment>
        ) : null}

        {["DF", ""].includes(request.status) || ["DFO"].includes(request.status) ? null : (
          <Button
            width={7}
            floated="right"
            color="pink"
            onClick={this.onPrintRequest}
          >
            <Icon name="print" />
            {t("module.loan.requestDetail.formRequest")}
          </Button>
        )}
      </Grid.Column>
    );
  }
  private renderActionButtons() {
    const { request, mode, t } = this.props;
    return (
      <React.Fragment>
        <PermissionControl codes={["REQUEST.CANCEL"]}>
          {mode === "edit" && request.status && request.status !== "CL" ? (
            <div style={styles.cancelBtn}>
              <DeleteModal
                title={t("module.loan.requestDetail.ifCancelPleaseConfirm")}
                trigger={
                  <Button basic color="red">
                    {t("module.loan.requestDetail.cancelRequest")}
                  </Button>
                }
                onConfirmDelete={this.onContractCancel}
              />
            </div>
          ) : null}
        </PermissionControl>
        <div style={styles.buttonRight}>
          {mode === "view" &&
            (["DF", "DFO", "NW", "NWO"].includes(request.status) ||
              hasPermission("DATA.ALL.EDIT")) ? (
            <PermissionControl
              somePermission
              codes={["REQUEST.EDIT", "DATA.ALL.EDIT"]}
            >
              <Link
                to={`/loan/request/edit/${request.id}/${request.requestType}`}
              >
                <Button floated="right" color="blue">
                  {t("module.loan.requestDetail.editRequestForm")}
                </Button>
              </Link>
            </PermissionControl>
          ) : null}

          {/* {request.status === "AP3" ? (
            this.renderButtomSendContract()
          ) : (
            <PermissionControl codes={["REQUEST.GENERATE.AGREEMENT"]}>
              <Button disabled floated="right" color="purple">
                ส่งทำสัญญา
              </Button>
            </PermissionControl>
          )} */}
        </div>
      </React.Fragment>
    );
  }
  private onContractCancel = async () => {
    const { request, history } = this.props;
    try {
      await request.deleteRequest();
      await history.push(`/loan/request`);
    } catch (e) {
      throw e;
    }
  };
  private onSendRequestAgreement = async () => {
    const { request, history } = this.props;
    try {
      await request.sendRequestAgreement();
      if (request.successRequest) {
        history.push(`/loan/request/view/${request.id}/${request.requestType}`);
      }
    } catch (e) {
      throw e;
    } finally {
      this.close();
    }
  };
  private onPrintRequest = async () => {
    const { request } = this.props;
    try {
      await request.printForm();
    } catch (e) {
      throw e;
    }
  };
  private onPrintAgreement = async () => {
    const { request } = this.props;
    try {
      await request.printForm("print_agreement_example");
    } catch (e) {
      throw e;
    }
  };
  private onPrintGuarantee = async () => {
    const { request } = this.props;
    try {
      await request.printForm("print_guarantee_example");
    } catch (e) {
      throw e;
    }
  };
  private renderButtomSendContract() {
    const { request, t } = this.props;
    return (
      <Modal
        size="tiny"
        open={this.state.open}
        onOpen={this.open}
        onClose={this.close}
        trigger={
          <Form.Button width={5} floated="right" color="purple">
            {t("module.loan.requestDetail.sendAgreement")}
          </Form.Button>
        }
      >
        <Modal.Content>
          <Segment basic style={styles.segment}>
            <Header textAlign={"center"} size="large">
              {t("module.loan.requestTable.contractDate")}
            </Header>
            <Form onSubmit={this.onSendRequestAgreement}>
              <Form.Field
                required
                control={DateInput}
                id={"request_header_documentDateAgreement"}
                value={request.documentDateAgreement || undefined}
                fieldName="documentDateAgreement"
                onChangeInputField={this.onChangeInputField}
              />

              <Form.Button fluid type="submit" color="purple">
                {t("module.loan.requestTable.sendContract")}
              </Form.Button>
            </Form>
          </Segment>
        </Modal.Content>
      </Modal>
    );
  }
  private onChangeInputField = (fieldname: string, value: any) => {
    const { request } = this.props;
    request.setField({ fieldname, value });
  };

  // draft = "DF",
  // new = "NW",
  // qualified = "QF",
  // approve1 = "AP1",
  // approve2 = "AP2",
  // approve3 = "AP3",
  // done = "DN",
  // cancel = "CL",
  // disqualified = "DQF",
  // reject = "RJ"
  private getStatusColor(): SemanticCOLORS {
    const { request } = this.props;
    switch (request.status) {
      case "DF":
      case "NW":
        return "blue";
      case "QF":
        return "orange";
      case "AP1":
      case "AP2":
      case "AP3":
        return "olive";
      case "DN":
        return "green";
      case "CL":
      case "DQF":
      case "RJ":
        return "red";
      default:
        return "blue";
    }
  }
}

const styles: any = {
  header: {
    marginBottom: 14
  },
  icon: {
    cursor: "default"
  },
  cancelBtn: {
    display: "inline-flex",
    width: "35%"
  },
  button: {
    cursor: "pointer"
  },
  buttonRow: {
    marginBottom: 0
  },
  buttonRight: { textAlign: "right", width: "100%", margin: "auto" }
};
export default withRouter(withTranslation()(RequestHeader));
