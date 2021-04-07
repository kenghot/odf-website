import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Icon, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { Link } from "../../../components/common";
import { SearchByTargetInfoForm } from "../../../components/search";
import { OrganizationDDL } from "../../admin/organization/components";
import { OrgListModel } from "../../admin/organization/OrgListModel";

import { SearchDateRange } from "../../receipt/receiptmanagement/components";
import { IDonationAllowanceListModel } from "../DonationAllowanceListModel";

interface IDonationAllowancesSearchForm extends WithTranslation {
  donationAllowanceListStore: IDonationAllowanceListModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class DonationAllowancesSearchForm extends React.Component<IDonationAllowancesSearchForm> {
  public state = { openheader: false };
  private orgList = OrgListModel.create({});
  public render() {
    const { t } = this.props;
    return (
      <Segment padded>
        {this.renderHeader()}
        <Form size="mini">
          {this.state.openheader
            ? this.renderOpenHeader()
            : this.renderHideHeader()}
        </Form>
        <Grid columns="equal" style={styles.gridButtom}>
          <Grid.Row verticalAlign="middle">
            <Grid.Column textAlign="right">
              <Link shade={5} onClick={() => this.resetFilter()}>
                {t(
                  "module.donation.DonationAllowancesSearchForm.cancelAllFilters"
                )}
              </Link>
              <Button
                icon
                labelPosition="left"
                color="blue"
                style={styles.button}
                onClick={this.onSearch}
              >
                {t("module.donation.DonationAllowancesSearchForm.searching")}
                <Icon name="search" />
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }

  private renderHeader() {
    const { t } = this.props;
    return (
      <Grid columns={2}>
        <Grid.Row verticalAlign="top">
          <Grid.Column width={10}>
            <Header
              size="medium"
              content={t(
                "module.donation.DonationAllowancesSearchForm.searchingHeader"
              )}
              subheader={t(
                "module.donation.DonationAllowancesSearchForm.searchingSubHeader"
              )}
              style={styles.header}
            />
          </Grid.Column>
          <Grid.Column floated="right" textAlign="right" width={6}>
            <Link
              size="tiny"
              shade={5}
              onClick={() =>
                this.setState({ openheader: !this.state.openheader })
              }
            >
              {this.state.openheader
                ? t("hideAdvancedSearch")
                : t("advancedSearch")}
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  private renderHideHeader() {
    const { t, donationAllowanceListStore, appStore } = this.props;
    return (
      <Form.Group widths="equal">
        <Form.Input
          fluid
          label={t(
            "module.donation.DonationAllowancesSearchForm.documentNumber"
          )}
          placeholder={t(
            "module.donation.DonationAllowancesSearchForm.documentNumberPlaceholder"
          )}
          onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
            this.onChangeInputField("filterDocumentNumber", data.value)
          }
          value={donationAllowanceListStore.filterDocumentNumber}
        />
        <Form.Input
          fluid
          label={t("module.donation.DonationAllowancesSearchForm.orgName")}
          placeholder={t(
            "module.donation.DonationAllowancesSearchForm.orgNamePlaceholder"
          )}
          onChange={(event, data) =>
            this.onChangeInputField("filterOrgName", data.value)
          }
          value={donationAllowanceListStore.filterOrgName}
        />
        <Form.Field
          label={t(
            "module.donation.DonationAllowancesSearchForm.organizationName"
          )}
          placeholder={t(
            "module.donation.DonationAllowancesSearchForm.organizationNamePlaceholder"
          )}
          control={OrganizationDDL}
          value={donationAllowanceListStore.filterOrganizationId}
          orgList={this.orgList}
          onChange={this.onChangeOrganizationDDL}
        />
      </Form.Group>
    );
  }
  private renderOpenHeader() {
    const { t, donationAllowanceListStore } = this.props;
    return (
      <React.Fragment>
        {this.renderHideHeader()}
        <Form.Field
          label={t(
            "module.donation.DonationAllowancesSearchForm.sponsorHeader"
          )}
          width={16}
          control={SearchByTargetInfoForm}
          onChangeInputField={this.onChangeInputField}
          inputFieldNameIdCard="filterSponsorIdCardNo"
          inputFieldNameFirstname="filterSponsorFirstname"
          inputFieldNameLastname="filterSponsorLastname"
          valueFieldNameIdCard={
            donationAllowanceListStore.filterSponsorIdCardNo
          }
          valueFieldNameFirstname={
            donationAllowanceListStore.filterSponsorFirstname
          }
          valueFieldNameLastname={
            donationAllowanceListStore.filterSponsorLastname
          }
          size="mini"
        />

        <Form.Field
          label={t(
            "module.donation.DonationAllowancesSearchForm.dateDonationHeader"
          )}
          width={16}
          control={SearchDateRange}
          onChangeInputField={this.onChangeInputField}
          inputFieldNameStartDate="filterStartDate"
          inputFieldNameEndDate="filterEndDate"
          valueFieldNameStartDate={donationAllowanceListStore.filterStartDate}
          valueFieldNameEndDate={donationAllowanceListStore.filterEndDate}
          size="mini"
        />
      </React.Fragment>
    );
  }

  private onSearch = async () => {
    const { donationAllowanceListStore } = this.props;
    await donationAllowanceListStore.setField({
      fieldname: "currentPage",
      value: 1,
    });
    await donationAllowanceListStore.load_data();
    const elmnt = document.getElementById("donationAllowanceListTable");
    if (elmnt) elmnt.scrollIntoView();
  };

  private resetFilter = async () => {
    const { donationAllowanceListStore } = this.props;
    await donationAllowanceListStore.resetFilter();
    await donationAllowanceListStore.load_data();
    await this.orgList.setField({
      fieldname: "filterName",
      value: "",
    });
    await this.orgList.load_data();
  };

  private onChangeOrganizationDDL = (value: string) => {
    const { donationAllowanceListStore } = this.props;
    donationAllowanceListStore.setField({
      fieldname: "filterOrganizationId",
      value,
    });
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { donationAllowanceListStore } = this.props;
    donationAllowanceListStore.setField({ fieldname, value });
  };
}

const styles: any = {
  button: {
    marginRight: 0,
    marginLeft: 14,
  },
  header: {
    marginBottom: 28,
  },
  gridButtom: {
    paddingTop: 28,
  },
};

export default withTranslation()(DonationAllowancesSearchForm);
