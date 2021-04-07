import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Icon, Segment } from "semantic-ui-react";
import { Link } from "../../../../components/common";
import { STATUS_USER } from "../../../../constants/SELECTOR";
import { OrganizationDDL } from "../../organization/components";
import { OrgListModel } from "../../organization/OrgListModel";
import { RoleDDL } from "../../role/components";
import { RoleListModel } from "../../role/RoleListModel";
import { IUserListModel } from "../UserListModel";

interface ISearchForm extends WithTranslation {
  userlistStore: IUserListModel;
}

@observer
class SearchForm extends React.Component<ISearchForm> {
  private orgList = OrgListModel.create({});
  private roleList = RoleListModel.create({});
  public render() {
    const { t, userlistStore } = this.props;
    const statusOptions = STATUS_USER;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t("module.admin.searchForm.searchUserInformation")}
          subheader={t("module.admin.searchForm.browseInformation")}
          style={styles.header}
        />
        <Form size="mini">
          <Form.Group widths="equal">
            <Form.Input
              id="form-input-searchform-firstname"
              fluid
              label={t("module.admin.searchForm.firstName")}
              placeholder={t("module.admin.searchForm.firstName")}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                this.onChangeInputField("filterFirstname", data.value)
              }
              value={userlistStore.filterFirstname}
            />
            <Form.Input
              id="form-input-searchform-lastname"
              fluid
              label={t("module.admin.searchForm.lastNames")}
              placeholder={t("module.admin.searchForm.lastNames")}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                this.onChangeInputField("filterLastname", data.value)
              }
              value={userlistStore.filterLastname}
            />
            <Form.Input
              id="form-input-searchform-username"
              fluid
              label={t("module.admin.searchForm.userID")}
              placeholder={t("module.admin.searchForm.userID")}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                this.onChangeInputField("filterUsername", data.value)
              }
              value={userlistStore.filterUsername}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              id="form-input-ddl-searchform-organization"
              label={t("module.admin.searchForm.underDepartment")}
              control={OrganizationDDL}
              value={userlistStore.filterOrgId}
              orgList={this.orgList}
              onChange={this.onChangeOrganizationDDL}
            />
            <Form.Field
              id="form-input-ddl-searchform-role"
              label={t("module.admin.searchForm.userGroup")}
              control={RoleDDL}
              value={userlistStore.filterRoleId}
              roleList={this.roleList}
              onChange={this.onChangeRoleDDL}
              clearable
            />
            <Form.Select
              id="form-input-ddl-searchform-status"
              search
              fluid
              label={t("module.admin.searchForm.status")}
              options={statusOptions}
              placeholder={t("module.admin.searchForm.pleaseSelectStatus")}
              onChange={(event, data) =>
                this.onChangeInputField("filterStatus", data.value)
              }
              value={userlistStore.filterStatus}
              clearable
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
                  userlistStore.setField({
                    fieldname: "currentPage",
                    value: 1
                  });
                  userlistStore.load_data();
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
    const { userlistStore } = this.props;
    await userlistStore.resetFilter();
    await userlistStore.load_data();
    await this.orgList.setField({
      fieldname: "filterName",
      value: ""
    });
    await this.orgList.load_data();
  };

  private onChangeOrganizationDDL = (value: string) => {
    const { userlistStore } = this.props;
    userlistStore.setField({ fieldname: "filterOrgId", value });
  };
  private onChangeRoleDDL = (value: string) => {
    const { userlistStore } = this.props;
    userlistStore.setField({ fieldname: "filterRoleId", value });
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { userlistStore } = this.props;
    userlistStore.setField({ fieldname, value });
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
