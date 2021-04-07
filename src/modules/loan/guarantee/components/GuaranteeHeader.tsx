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
  Message,
  Segment,
  SemanticCOLORS
} from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import { FormDisplay } from "../../../../components/common";
import { StatusBlock } from "../../../../components/common/block";
import { PermissionControl } from "../../../../components/permission";
import { M113AgreeementCancelation } from "../../../../modals";
import { date_display_CE_TO_BE } from "../../../../utils";
import { hasPermission } from "../../../../utils/render-by-permission";
import { IGuaranteeModel } from "../GuaranteeModel";

interface IGuaranteeHeader extends WithTranslation, RouteComponentProps {
  guarantee: IGuaranteeModel;
  disableEditBtn?: boolean;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class GuaranteeHeader extends React.Component<IGuaranteeHeader> {
  public state = { openheader: false };
  public render() {
    return (
      <React.Fragment>
        <Grid columns="equal" style={styles.header}>
          <Grid.Row verticalAlign="top">{this.renderTitleRow()}</Grid.Row>
          <Grid.Row>{this.renderHeaderRow()}</Grid.Row>
          <Grid.Row>{this.renderPrintButtonRow()}</Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
  private renderTitleRow() {
    const { t, guarantee, appStore } = this.props;
    return (
      <React.Fragment>
        <Grid.Column>
          <Header
            size="medium"
            content={t("module.loan.guaranteeCardInfo.guaranteeIDCard", {
              idCard: guarantee.fullname || "-"
            })}
            subheader={t("module.loan.guaranteeCardInfo.guaranteeNumber", {
              guaranteeNumber: guarantee.documentNumber || "-"
            })}
          />
        </Grid.Column>
        <Grid.Column floated="right" textAlign="right">
          <StatusBlock
            label={appStore!.enumItemLabel("guaranteeStatus", guarantee.status)}
            color={this.getStatusColor()}
          />
        </Grid.Column>
      </React.Fragment>
    );
  }
  private renderHeaderRow() {
    const { t, guarantee, appStore } = this.props;
    return (
      <Grid.Column>
        <Segment padded>
          <Form>
            <Form.Group widths="equal">
              <FormDisplay
                title={t("module.loan.guaranteeCardInfo.byOrganization")}
                value={guarantee.organization.orgName || "-"}
                width={8}
              />
              <FormDisplay
                title={t("module.loan.guaranteeDetail.contractSpecifiedDate")}
                value={date_display_CE_TO_BE(guarantee.documentDate) || "-"}
                width={4}
              />
              <FormDisplay
                title={t("module.loan.guaranteeCardInfo.category")}
                value={
                  appStore!.enumItemLabel(
                    "loanType",
                    guarantee.guaranteeType
                  ) || "-"
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
                  title={t("module.loan.guaranteeCardInfo.madeBy")}
                  value={guarantee.createdByName || "-"}
                />
                <FormDisplay
                  title={t("module.loan.agreementCardInfo.createdWhen")}
                  value={date_display_CE_TO_BE(guarantee.createdDate) || "-"}
                />
                <FormDisplay
                  title={t("module.loan.guaranteeCardInfo.lastEditedBy")}
                  value={guarantee.updatedByName || "-"}
                />
                <FormDisplay
                  title={t("module.loan.guaranteeCardInfo.editWhen")}
                  value={date_display_CE_TO_BE(guarantee.updatedDate) || "-"}
                />
              </Form.Group>
            ) : null}
            {this.renderActionButtons()}
            {guarantee.status === "CL" ? (
              <Segment basic style={styles.segment}>
                <Message negative>
                  <Message.Header>
                    {t(
                      "module.loan.guaranteeDetail.reasonsTerminatingContract"
                    )}
                  </Message.Header>
                  {guarantee.guaranteeCancelReason}
                </Message>
              </Segment>
            ) : null}
          </Form>
        </Segment>
      </Grid.Column>
    );
  }
  private renderActionButtons() {
    const { t, guarantee, disableEditBtn } = this.props;
    return (
      <React.Fragment>
        <div style={styles.cancelBtn}>
          {guarantee.status && guarantee.status !== "CL" ? (
            <PermissionControl codes={["GUANRANTEE.CANCEL"]}>
              <M113AgreeementCancelation
                onClick={this.onContractCancel}
                trigger={
                  <Form.Button basic color="red">
                    {t("module.loan.agreementCardInfo.contractTermination")}
                  </Form.Button>
                }
                title={t("module.loan.guaranteeDetail.contractTermination")}
                fieldName="guaranteeCancelReason"
                valueInput={guarantee.guaranteeCancelReason}
                onChangeInputField={this.onChangeInputField}
                style={{ display: "inline" }}
              />
            </PermissionControl>
          ) : null}
        </div>
        {!disableEditBtn &&
        (["NW"].includes(guarantee.status) ||
          hasPermission("DATA.ALL.EDIT")) ? (
          <PermissionControl
            somePermission
            codes={["GUANRANTEE.EDIT", "DATA.ALL.EDIT"]}
          >
            <Link
              to={`/loan/guarantee/edit/${guarantee.id}/${guarantee.documentNumber}`}
            >
              <Button
                width={5}
                floated="right"
                color="blue"
                disabled={disableEditBtn}
              >
                {t("module.loan.guaranteeCardInfo.amendContract")}
              </Button>
            </Link>
          </PermissionControl>
        ) : null}
      </React.Fragment>
    );
  }
  private renderPrintButtonRow() {
    const { t } = this.props;
    return (
      <Grid.Column>
        <Button
          width={7}
          floated="right"
          color="orange"
          onClick={this.onPrintGuarantee}
        >
          <Icon name="print" />
          {t("module.loan.guaranteeCardInfo.printGuarantee")}
        </Button>
      </Grid.Column>
    );
  }
  private onPrintGuarantee = async () => {
    const { guarantee } = this.props;
    try {
      await guarantee.printGuarantee();
    } catch (e) {
      throw e;
    }
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { guarantee } = this.props;
    guarantee.setField({ fieldname, value });
  };
  private navigationToGuaranteeViewPage = async (
    id: string,
    username: string
  ) => {
    const { history } = this.props;
    history.push(`/loan/guarantee/view/${id}/${username}`);
  };
  private onContractCancel = async () => {
    const { guarantee } = this.props;
    try {
      await guarantee.updateGuaranteeCancelReason();
      await guarantee.getGuaranteeDetail();
      await this.navigationToGuaranteeViewPage(
        guarantee.id,
        guarantee.documentNumber
      );
    } catch (e) {
      throw e;
    }
  };

  private getStatusColor(): SemanticCOLORS {
    const { guarantee } = this.props;
    switch (guarantee.status) {
      case "NW":
        return "blue";
      case "NM":
        return "green";
      case "CL":
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
    display: "inline-flex"
  },
  segment: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0
  }
};
export default withRouter(withTranslation()(GuaranteeHeader));
