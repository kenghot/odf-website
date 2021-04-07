import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Icon, Segment } from "semantic-ui-react";
import { OrganizationDDL } from ".";
import { LocationModel } from "../../../../components/address";
import ProvinceDDL from "../../../../components/address/ProvinceDDL";
import { Link } from "../../../../components/common";
import { IOrgListModel, OrgListModel } from "../OrgListModel";

interface ISearchForm extends WithTranslation {
  orglistStore: IOrgListModel;
}

@observer
class SearchForm extends React.Component<ISearchForm> {
  public locationStore = LocationModel.create({});
  private orgList = OrgListModel.create({});
  public render() {
    const { t, orglistStore } = this.props;
    const options = [
      { key: "0", text: t("module.admin.orgModel.disable"), value: "0" },
      { key: "1", text: t("module.admin.orgModel.enable"), value: "1" }
    ];
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t("module.admin.searchForm.searchOrg")}
          subheader={t("module.admin.searchForm.browseOrgnIformation")}
          style={styles.header}
        />
        <Form size="mini">
          <Form.Group widths="equal">
            <Form.Input
              fluid
              id="form-input-searchform-org-name"
              label={t("module.admin.searchForm.organizationName")}
              placeholder={t("module.admin.searchForm.name")}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                this.onChangeInputField("filterName", data.value)
              }
              value={orglistStore.filterName}
            />
            <Form.Field
              id="form-input-searchform-org-province"
              label={t("module.admin.searchForm.province")}
              placeholder={t("module.admin.searchForm.pleaseSelectProvince")}
              control={ProvinceDDL}
              selectedValue={orglistStore.filterProvinceCode}
              locationStore={this.locationStore}
              onChange={this.onChangeProvinceDDL}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              id="form-input-searchform-org-reference-code"
              fluid
              label={t("module.admin.searchForm.referenceCode")}
              placeholder={t("module.admin.searchForm.specifyReferenceCode")}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                this.onChangeInputField("filterOrgCode", data.value)
              }
              value={orglistStore.filterOrgCode}
            />
            <Form.Select
              id="form-input-searchform-org-status"
              search
              fluid
              clearable
              label={t("module.admin.searchForm.status")}
              placeholder={t("module.admin.searchForm.pleaseSelectStatus")}
              options={options}
              onChange={(event, data) =>
                this.onChangeInputField("filterStatus", data.value)
              }
              value={orglistStore.filterStatus}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              id="form-input-ddl-organization"
              label={t("module.admin.searchForm.agency")}
              control={OrganizationDDL}
              orgList={this.orgList}
              onChange={this.onChangeOrganizationDDL}
              value={orglistStore.filterParentId}
              inActive={true}
            />
          </Form.Group>
        </Form>
        <Grid columns="equal">
          <Grid.Row verticalAlign="middle">
            <Grid.Column textAlign="right">
              <Link
                id="btn-reset-filters"
                shade={5}
                onClick={() => this.resetFilter()}
              >
                {t("module.admin.searchForm.cancelAllFilters")}
              </Link>
              <Button
                id="btn-search-filters"
                icon
                labelPosition="left"
                color="blue"
                style={styles.button}
                onClick={() => {
                  orglistStore.setField({
                    fieldname: "currentPage",
                    value: 1
                  });
                  orglistStore.load_data_list();
                }}
              >
                {t("module.admin.searchForm.searching")}
                <Icon name="search" />
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }

  private resetFilter = async () => {
    const { orglistStore } = this.props;
    await orglistStore.resetFilter();
    await orglistStore.load_data_list();
    await this.orgList!.setField({
      fieldname: "filterName",
      value: ""
    });
    await this.orgList!.load_data_list();
  };

  private onChangeOrganizationDDL = (value: string) => {
    const { orglistStore } = this.props;
    orglistStore!.setField({ fieldname: "filterParentId", value });
  };

  private onChangeProvinceDDL = (value: any) => {
    const { orglistStore } = this.props;
    orglistStore!.setField({
      fieldname: "filterProvinceCode",
      value
    });
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { orglistStore } = this.props;
    orglistStore!.setField({ fieldname, value });
  };
}

const styles: any = {
  button: {
    marginRight: 0,
    marginLeft: 14
  },
  header: {
    marginBottom: 28
  }
};

export default withTranslation()(SearchForm);
