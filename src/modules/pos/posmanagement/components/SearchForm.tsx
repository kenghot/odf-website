import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Icon, Segment } from "semantic-ui-react";
import { Link } from "../../../../components/common";
import { POS_ACTIVE, POS_ONLINE } from "../../../../constants";
import { OrganizationDDL } from "../../../admin/organization/components";
import { OrgListModel } from "../../../admin/organization/OrgListModel";
import { IPosListModel } from "../../PosListModel";

interface ISearchForm extends WithTranslation {
  posListStore: IPosListModel;
}

@observer
class SearchForm extends React.Component<ISearchForm> {
  private orgList = OrgListModel.create({});
  public render() {
    const { t, posListStore } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t("module.pos.searchForm.contentHeader")}
          subheader={t("module.pos.searchForm.subHeader")}
          style={styles.header}
        />
        <Form size="mini">
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label={t("module.pos.searchForm.posCode")}
              placeholder={t("module.pos.searchForm.placeholderPosCode")}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                this.onChangeInputField("filterPosCode", data.value)
              }
              value={posListStore.filterPosCode}
            />
            <Form.Field
              id="form-input-ddl-organization"
              label={t("module.pos.searchForm.organizationId")}
              control={OrganizationDDL}
              orgList={this.orgList}
              onChange={this.onChangeOrganizationDDL}
              value={posListStore.filterOrganizationId}
            />
            <Form.Select
              fluid
              clearable
              label={t("module.pos.searchForm.active")}
              options={POS_ACTIVE}
              placeholder={t("module.pos.searchForm.placeholderActive")}
              onChange={(event, data) =>
                this.onChangeInputField("filterActive", data.value)
              }
              value={posListStore.filterActive}
            />
            <Form.Select
              fluid
              clearable
              label={t("module.pos.searchForm.isOnline")}
              options={POS_ONLINE}
              placeholder={t("module.pos.searchForm.placeholderIsOnline")}
              onChange={(event, data) =>
                this.onChangeInputField("filterIsOnline", data.value)
              }
              value={posListStore.filterIsOnline}
            />
          </Form.Group>
        </Form>
        <Grid columns="equal">
          <Grid.Row verticalAlign="middle">
            <Grid.Column textAlign="right">
              <Link
                shade={5}
                style={styles.link}
                onClick={() => this.resetFilter()}
              >
                {t("cancelAllFilters")}
              </Link>
              <Button
                icon
                labelPosition="left"
                color="blue"
                style={styles.button}
                onClick={() => {
                  posListStore.setField({
                    fieldname: "currentPage",
                    value: 1
                  });
                  posListStore.load_data();
                }}
              >
                {t("searching")}
                <Icon name="search" />
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }

  private onChangeOrganizationDDL = (value: string) => {
    const { posListStore } = this.props;
    posListStore.setField({ fieldname: "filterOrganizationId", value });
  };

  private resetFilter = async () => {
    const { posListStore } = this.props;
    await posListStore.resetFilter();
    await posListStore.load_data();
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { posListStore } = this.props;
    posListStore.setField({ fieldname, value });
  };
}

const styles: any = {
  link: {
    cursor: "pointer"
  },
  button: {
    marginRight: 0,
    marginLeft: 14
  },
  header: {
    marginBottom: 28
  }
};

export default withTranslation()(SearchForm);
