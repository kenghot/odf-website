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
import { IAppModel, IEnumItemModel } from "../../../../AppModel";
import { FormDisplay } from "../../../../components/common";
import { StatusBlock } from "../../../../components/common/block";
import { PermissionControl } from "../../../../components/permission";
import { M113AgreeementCancelation } from "../../../../modals";
import { date_display_CE_TO_BE } from "../../../../utils";
import { hasPermission } from "../../../../utils/render-by-permission";
import { GuaranteeModel } from "../../guarantee/GuaranteeModel";
import { IAgreementModel } from "../AgreementModel";

interface IAgreementHeader extends WithTranslation, RouteComponentProps {
  agreement: IAgreementModel;
  disableEditBtn?: boolean;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class AgreementHeader extends React.Component<IAgreementHeader> {
  public state = { openheader: false };
  public render() {
    return (
      <Grid columns="equal" style={styles.header}>
        <Grid.Row verticalAlign="top">{this.renerTitleRow()}</Grid.Row>
        <Grid.Row>{this.renderHeaderRow()}</Grid.Row>
        <Grid.Row>{this.renderPrintButtonRow()}</Grid.Row>
      </Grid>
    );
  }
  private renerTitleRow() {
    const { t, agreement, appStore } = this.props;
    return (
      <React.Fragment>
        <Grid.Column>
          <Header
            size="medium"
            content={t("module.loan.agreementCardInfo.agreementIDCard", {
              idCard: agreement.fullname || "-"
            })}
            subheader={t("module.loan.agreementCardInfo.agreementNumber", {
              agreementNumber: agreement.documentNumber
            })}
          />
        </Grid.Column>
        <Grid.Column floated="right" textAlign="right">
          <StatusBlock
            label={appStore!.enumItemLabel("agreementStatus", agreement.status)}
            color={this.getStatusColor()}
          />
        </Grid.Column>
      </React.Fragment>
    );
  }
  private renderHeaderRow() {
    const { t, agreement, appStore } = this.props;
    return (
      <Grid.Column>
        <Segment padded>
          <Form>
            <Form.Group widths="equal">
              <FormDisplay
                title={t("module.loan.agreementCardInfo.byOrganization")}
                value={agreement.organization.orgName || "-"}
                width={8}
              />
              <FormDisplay
                title={t("module.loan.agreementDetail.contractSpecifiedDate")}
                value={date_display_CE_TO_BE(agreement.documentDate) || "-"}
                width={4}
              />
              <FormDisplay
                title={t("module.loan.agreementCardInfo.category")}
                value={
                  appStore!.enumItemLabel(
                    "loanType",
                    agreement.agreementType
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
                  title={t("module.loan.agreementCardInfo.madeBy")}
                  value={agreement.createdByName || "-"}
                />
                <FormDisplay
                  title={t("module.loan.agreementCardInfo.createdWhen")}
                  value={date_display_CE_TO_BE(agreement.createdDate) || "-"}
                />
                <FormDisplay
                  title={t("module.loan.agreementCardInfo.lastEditedBy")}
                  value={agreement.updatedByName || "-"}
                />
                <FormDisplay
                  title={t("module.loan.agreementCardInfo.editWhen")}
                  value={date_display_CE_TO_BE(agreement.updatedDate) || "-"}
                />
              </Form.Group>
            ) : null}
          </Form>
          {this.renderActionButtons()}
          {agreement.agreementCancelReason ? (
            <Segment basic style={styles.segment}>
              <Message negative>
                <Message.Header>
                  {t(
                    "module.loan.agreementDetail.reasonsImproveContractStatus"
                  )}
                </Message.Header>
                {agreement.agreementCancelReason}
              </Message>
            </Segment>
          ) : null}
        </Segment>
      </Grid.Column>
    );
  }
  private renderPrintButtonRow() {
    const { t, agreement } = this.props;
    return (
      <Grid.Column>
        {agreement.guaranteeId ? (
          <Button
            width={7}
            floated="right"
            color="orange"
            onClick={this.onPrintGuarantee}
          >
            <Icon name="print" />
            {t("module.loan.agreementCardInfo.printGuarantee")}
          </Button>
        ) : null}

        <Button
          width={7}
          floated="right"
          color="purple"
          onClick={this.onPrintAgreement}
        >
          <Icon name="print" />
          {t("module.loan.agreementCardInfo.printLoanAgreement")}
        </Button>
      </Grid.Column>
    );
  }
  private renderActionButtons() {
    const { t, agreement, disableEditBtn, appStore } = this.props;
    const statusList = ["DC", "CL"];
    return (
      <React.Fragment>
        <div style={styles.cancelBtn}>
          {agreement.status && !statusList.includes(agreement.status) ? (
            <PermissionControl codes={["AGREEMENT.CANCEL"]}>
              <M113AgreeementCancelation
                trigger={
                  <Form.Button basic color="red" type="button">
                    {t("module.loan.agreementDetail.agreementStatusUpdates")}
                  </Form.Button>
                }
                title={t("module.loan.agreementDetail.agreementStatusUpdates")}
                onClick={this.onContractCancel}
                fieldName="agreementCancelReason"
                valueInput={agreement.agreementCancelReason}
                onChangeInputField={this.onChangeInputField}
                selectList={appStore!
                  .enumItems("agreementStatus")
                  .filter((item: IEnumItemModel) =>
                    statusList.includes(item.value!.toString())
                  )}
                style={styles.m113Style}
              />
            </PermissionControl>
          ) : null}
        </div>
        {!disableEditBtn &&
        (["NW"].includes(agreement.status) ||
          hasPermission("DATA.ALL.EDIT")) ? (
          <PermissionControl
            somePermission
            codes={["AGREEMENT.EDIT", "DATA.ALL.EDIT"]}
          >
            <Link
              to={`/loan/agreement/edit/${agreement.id}/${agreement.documentNumber}`}
            >
              <Button width={5} floated="right" color="blue">
                {t("module.loan.agreementCardInfo.amendContract")}
              </Button>
            </Link>
          </PermissionControl>
        ) : null}
      </React.Fragment>
    );
  }
  private navigationToAgreementViewPage = async (
    id: string,
    username: string
  ) => {
    const { history } = this.props;
    history.push(`/loan/agreement/view/${id}/${username}`);
  };
  private onContractCancel = async (value: any) => {
    const { agreement } = this.props;
    try {
      await agreement.updateAgreementStatus(value);
      await agreement.getAgreementDetail();
      await this.navigationToAgreementViewPage(
        agreement.id,
        agreement.documentNumber
      );
    } catch (e) {
      throw e;
    }
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { agreement } = this.props;
    agreement!.setField({ fieldname, value });
  };

  private onPrintAgreement = async () => {
    const { agreement } = this.props;
    try {
      await agreement.printAgreement();
    } catch (e) {
      throw e;
    }
  };
  private onPrintGuarantee = async () => {
    const { agreement } = this.props;
    try {
      await agreement.setField({ fieldname: "loading", value: true });
      if (agreement.guaranteeId) {
        const guarantee = GuaranteeModel.create({});
        await guarantee.setField({
          fieldname: "id",
          value: agreement.guaranteeId
        });
        await guarantee.printGuarantee();
      }
    } catch (e) {
      throw e;
    } finally {
      console.log("onPrintGuarantee==finally=>", agreement.loading);
      await agreement.setField({ fieldname: "loading", value: false });
    }
  };
  // สถานะสัญญา
  // new = "NW",  เตรียมทำสัญญา
  // duringPayment = "DP", รอโอนเงิน
  // failPayment = "FP", โอนเงินไม่สำเร็จ
  // done = "DN",  ทำสัญญาแล้ว  // วันที่ทำสัญญาจะตรงกับ documentDate
  // disclaim = "DC", สละสิทธิ์
  // cancel = "CL", ยกเลิก
  // close = "CS", ปิด
  // adjusted = "AJ" ปรับสภาพหนี้
  private getStatusColor(): SemanticCOLORS {
    const { agreement } = this.props;
    switch (agreement.status) {
      case "NW":
        return "blue";
      case "AJ":
        return "orange";
      case "DP":
        return "olive";
      case "DN":
        return "green";
      case "FP":
        return "red";
      case "DC":
        return "red";
      case "CL":
        return "red";
      case "CS":
        return "grey";
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
  button: {
    cursor: "pointer"
  },
  segment: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0
  },
  m113Style: {
    display: "inline"
  }
};
export default withRouter(withTranslation()(AgreementHeader));
