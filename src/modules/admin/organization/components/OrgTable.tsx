import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Icon, List, Table } from "semantic-ui-react";
import {
  EmptyTableRow,
  SectionContainer,
  TableFooter
} from "../../../../components/common";
import { PermissionControl } from "../../../../components/permission";
import { DeleteModal } from "../../../../modals";
import { hasPermission } from "../../../../utils/render-by-permission";
import { IOrgListModel } from "../OrgListModel";
import { IOrgModel } from "../OrgModel";

interface IOrgTable extends WithTranslation, RouteComponentProps {
  orglistStore: IOrgListModel;
}
@observer
class OrgTable extends React.Component<IOrgTable> {
  public render() {
    const { t } = this.props;
    return (
      <SectionContainer
        idLink="org-create-link"
        stretch
        fluid
        basic
        linkRouterLabel={
          hasPermission("ORG.CREATE")
            ? t("module.admin.orgTable.addOrganization")
            : undefined
        }
        linkRouterPathName={
          hasPermission("ORG.CREATE")
            ? "/admin/org_management/create"
            : undefined
        }
        iconName="plus circle"
        style={styles.sectionContainer}
      >
        <Table striped size="small">
          {this.renderTableHeader()}
          {this.renderTableBody()}
          {this.renderTableFooter()}
        </Table>
      </SectionContainer>
    );
  }

  private renderTableHeader() {
    const { t } = this.props;
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center" width={1}>
            {t("module.admin.orgTable.referenceCode")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={4}>
            {t("module.admin.orgTable.organizationName")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={3}>
            {t("module.admin.orgTable.province")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={4}>
            {t("module.admin.orgTable.agency")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t("module.admin.orgTable.status")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2} />
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const dataTable = this.props.orglistStore.list;
    return (
      <Table.Body>
        {this.props.orglistStore.list.length > 0 ? (
          dataTable.map((data: IOrgModel, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>{data.orgCode}</Table.Cell>
                <Table.Cell>{data.orgName}</Table.Cell>
                <Table.Cell>{data.address.province}</Table.Cell>
                <Table.Cell>{data.parentname}</Table.Cell>
                <Table.Cell>{data.status}</Table.Cell>
                <Table.Cell>
                  <List horizontal verticalAlign="middle" style={styles.list}>
                    <PermissionControl codes={["ORG.EDIT"]}>
                      <List.Item style={styles.listItem}>
                        <Icon
                          id="btn-icon-orgtable-edit"
                          circular
                          inverted
                          link
                          color="olive"
                          name="edit outline"
                          onClick={() =>
                            this.navigationToUserFormPage(data.id, data.orgName)
                          }
                        />
                      </List.Item>
                    </PermissionControl>
                    <PermissionControl codes={["ORG.DEL"]}>
                      <DeleteModal
                        onConfirmDelete={() => {
                          this.deleteOrg(data);
                        }}
                        trigger={
                          <List.Item style={styles.listLastItem}>
                            <Icon
                              id="btn-icon-orgtable-delete"
                              circular
                              inverted
                              link
                              color="red"
                              name="trash alternate outline"
                            />
                          </List.Item>
                        }
                      />
                    </PermissionControl>
                  </List>
                </Table.Cell>
              </Table.Row>
            );
          })
        ) : (
          <EmptyTableRow />
        )}
      </Table.Body>
    );
  }

  private renderTableFooter() {
    const { orglistStore } = this.props;

    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="8">
            <TableFooter
              currentPage={orglistStore.currentPage}
              totalPages={orglistStore.totalPages}
              total={orglistStore.total}
              perPage={orglistStore.perPage}
              onChangePerPage={this.onChangePerPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  private deleteOrg = async (item: IOrgModel) => {
    try {
      await item.deleteOrg();
      await this.props.orglistStore.load_data_list();
    } catch (e) {
      console.log(e);
    }
  };

  private onChangePerPage = (value: number) => {
    const { orglistStore } = this.props;
    orglistStore.setPerPage(value);
    setTimeout(() => {
      orglistStore.setCurrentPage(1);
      orglistStore.load_data_list();
    }, 1500);
  };

  private onChangeCurrentPage = (value: number) => {
    const { orglistStore } = this.props;
    orglistStore.setCurrentPage(value);
    setTimeout(() => {
      orglistStore.load_data_list();
    }, 1500);
  };

  private navigationToUserFormPage = async (id: string, username: string) => {
    const { history } = this.props;
    history.push(`/admin/org_management/edit/${id}/${username}`);
  };
}

const styles: any = {
  sectionContainer: {
    marginTop: 7
  },
  list: {
    display: "flex",
    flexWrap: "wrap"
  },
  listItem: {
    marginLeft: 0,
    marginRight: 7
  },
  listLastItem: {
    marginLeft: 0
  }
};
export default withRouter(withTranslation()(OrgTable));
