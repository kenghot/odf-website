import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Form, Grid, Header, Icon, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { FormDisplay } from "../../../components/common";
import { date_display_CE_TO_BE } from "../../../utils";
import { IDonationAllowanceModel } from "../DonationAllowanceModel";

interface IDonationElderlyLivingHeader
  extends WithTranslation,
    RouteComponentProps {
  donationAllowance: IDonationAllowanceModel;
  disableEditBtn?: boolean;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class DonationnAllowanceHeader extends React.Component<IDonationElderlyLivingHeader> {
  public state = { openheader: false };
  public render() {
    return (
      <React.Fragment>
        <Grid columns="equal" style={styles.header}>
          <Grid.Row verticalAlign="top">{this.renderTitleRow()}</Grid.Row>
          <Grid.Row>{this.renderHeaderRow()}</Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
  private renderTitleRow() {
    const { t, donationAllowance } = this.props;
    return (
      <React.Fragment>
        <Grid.Column>
          <Header
            size="medium"
            content={t("module.donation.DonationnAllowanceHeader.header", {
              name: donationAllowance.donator.fullname || "-",
            })}
            subheader={t("module.donation.DonationnAllowanceHeader.subheader", {
              idCard: donationAllowance.donator.idCardNo || "-",
            })}
          />
        </Grid.Column>
      </React.Fragment>
    );
  }
  private renderHeaderRow() {
    const { t, donationAllowance, appStore } = this.props;
    return (
      <Grid.Column>
        <Segment padded>
          <Form>
            <Form.Group widths="equal">
              <FormDisplay
                title={t(
                  "module.donation.DonationnAllowanceHeader.headerDisplay2"
                )}
                value={donationAllowance.receiptOrganization || "-"}
                width={12}
              />
              <FormDisplay
                title={t(
                  "module.donation.DonationnAllowanceHeader.headerDisplay3"
                )}
                value={
                  date_display_CE_TO_BE(donationAllowance.createdDate) || "-"
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
                  value={donationAllowance.createdByName || "-"}
                />
                <FormDisplay
                  title={t("module.loan.agreementCardInfo.createdWhen")}
                  value={
                    date_display_CE_TO_BE(donationAllowance.createdDate) || "-"
                  }
                />
                <FormDisplay
                  title={t("module.loan.guaranteeCardInfo.lastEditedBy")}
                  value={donationAllowance.updatedByName || "-"}
                />
                <FormDisplay
                  title={t("module.loan.guaranteeCardInfo.editWhen")}
                  value={
                    date_display_CE_TO_BE(donationAllowance.updatedDate) || "-"
                  }
                />
              </Form.Group>
            ) : null}
          </Form>
        </Segment>
      </Grid.Column>
    );
  }
}

const styles: any = {
  header: {
    marginBottom: 14,
  },
  icon: {
    cursor: "default",
  },
  cancelBtn: {
    display: "inline-flex",
  },
  segment: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
  },
};
export default withRouter(withTranslation()(DonationnAllowanceHeader));
