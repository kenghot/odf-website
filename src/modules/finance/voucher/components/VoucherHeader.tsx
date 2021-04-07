import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import {
  Form,
  Grid,
  Header,
  Icon,
  Segment,
  SemanticCOLORS
} from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import { FormDisplay } from "../../../../components/common";
import { StatusBlock } from "../../../../components/common/block";
import { PermissionControl } from "../../../../components/permission";
import { date_display_CE_TO_BE } from "../../../../utils";
import { IVoucherModel } from "../VoucherModel";

interface IVoucherHeader extends WithTranslation, RouteComponentProps {
  voucher: IVoucherModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class VoucherHeader extends React.Component<IVoucherHeader> {
  public state = { openheader: false };
  public render() {
    return (
      <Grid columns="equal" style={styles.header}>
        <Grid.Row verticalAlign="top">{this.renerTitleRow()}</Grid.Row>
        <Grid.Row>{this.renderHeaderRow()}</Grid.Row>
      </Grid>
    );
  }
  private renerTitleRow() {
    const { t, appStore, voucher } = this.props;
    return (
      <React.Fragment>
        <Grid.Column>
          <Header
            size="medium"
            content={appStore!.enumItemLabel(
              "voucherType",
              voucher.voucherType
            )}
            subheader={t("module.finance.VoucherHeader.subheader", {
              documentNumber: voucher.documentNumber
            })}
          />
        </Grid.Column>
        <Grid.Column floated="right" textAlign="right">
          <StatusBlock
            label={appStore!.enumItemLabel("voucherStatus", voucher.status)}
            color={this.getStatusColor()}
          />
        </Grid.Column>
      </React.Fragment>
    );
  }
  private renderHeaderRow() {
    const { t, voucher, appStore } = this.props;
    return (
      <Grid.Column>
        <Segment padded>
          <Form.Group widths="equal">
            <FormDisplay
              title={t("module.loan.agreementCardInfo.byOrganization")}
              value={voucher.organization.orgName || "-"}
              width={8}
            />
            <FormDisplay
              title={t("module.loan.agreementDetail.contractSpecifiedDate")}
              value={date_display_CE_TO_BE(voucher.documentDate) || "-"}
              width={4}
            />
            <PermissionControl codes={["AGREEMENT.VIEW"]}>
              <Form.Field width={3}>
                <label>{t("module.finance.VoucherHeader.refType")}</label>
                <p>
                  <Link
                    to={`/loan/agreement/view/${voucher.refDocument.id}/${voucher.refDocument.documentNumber}`}
                  >{`${appStore!.enumItemLabel(
                    "voucherRefType",
                    voucher.refType
                  )}${" "}${voucher.refDocument.documentNumber}`}</Link>
                </p>
              </Form.Field>
            </PermissionControl>
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
                value={voucher.createdByName || "-"}
              />
              <FormDisplay
                title={t("module.loan.agreementCardInfo.createdWhen")}
                value={date_display_CE_TO_BE(voucher.createdDate) || "-"}
              />
              <FormDisplay
                title={t("module.loan.agreementCardInfo.lastEditedBy")}
                value={voucher.updatedByName || "-"}
              />
              <FormDisplay
                title={t("module.loan.agreementCardInfo.editWhen")}
                value={date_display_CE_TO_BE(voucher.updatedDate) || "-"}
              />
            </Form.Group>
          ) : null}
        </Segment>
      </Grid.Column>
    );
  }

  private getStatusColor(): SemanticCOLORS {
    const { voucher } = this.props;
    switch (voucher.status) {
      case "WT":
        return "yellow";
      case "PD":
        return "green";
      case "CL":
        return "red";
      default:
        return "grey";
    }
  }
}

const styles: any = {
  header: {
    marginBottom: 14
  },
  button: {
    cursor: "pointer"
  }
};
export default withRouter(withTranslation()(VoucherHeader));
