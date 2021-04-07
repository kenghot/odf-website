import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Checkbox, Dropdown, Icon, List, Menu, Table } from "semantic-ui-react";
import {
  EmptyTableRow,
  SectionContainer,
  TableFooter
} from "../../../../components/common";
import { PermissionControl } from "../../../../components/permission";
import { COLORS } from "../../../../constants";
import { DeleteModal } from "../../../../modals";
import { hasPermission } from "../../../../utils/render-by-permission";
import { IUserListModel } from "../UserListModel";
import { IUserModel } from "../UserModel";

interface IUserTable extends WithTranslation, RouteComponentProps {
  userlistStore: IUserListModel;
}
@observer
class UserTable extends React.Component<IUserTable> {
  public render() {
    const { t, userlistStore } = this.props;
    const menuOptions = [
      {
        key: "1",
        text: t("module.admin.userTable.enable"),
        value: "setActive"
      },
      {
        key: "0",
        text: t("module.admin.userTable.disable"),
        value: "setInactive"
      }
    ];
    return (
      <React.Fragment>
        {[hasPermission("USER.EDIT"), hasPermission("USER.CREATE")].includes(
          true
        ) ? null : (
          <br />
        )}
        <SectionContainer
          idLink="user_create_link"
          stretch
          fluid
          basic
          titleComponent={
            hasPermission("USER.EDIT") ? (
              <Menu style={styles.menu}>
                <Dropdown
                  button
                  text={t("module.admin.userTable.chooseAll")}
                  options={menuOptions}
                  style={styles.dropdown}
                  clearable
                  disabled={userlistStore.statusMenu}
                  onChange={(event, data) =>
                    this.onChangeStatusField(data.value)
                  }
                />
              </Menu>
            ) : null
          }
          linkRouterLabel={
            hasPermission("USER.CREATE")
              ? t("module.admin.userTable.addUsers")
              : undefined
          }
          linkRouterPathName={
            hasPermission("USER.CREATE")
              ? "/admin/user_managment/create"
              : undefined
          }
          iconName="plus circle"
        >
          <Table striped size="small">
            {this.renderTableHeader()}
            {this.renderTableBody()}
            {this.renderTableFooter()}
          </Table>
        </SectionContainer>
      </React.Fragment>
    );
  }

  private renderTableHeader() {
    const { t, userlistStore } = this.props;
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center">
            <Checkbox
              checked={userlistStore.selected_checkbox}
              onChange={(event, value) =>
                userlistStore.selected_all(value.checked || false)
              }
            />
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t("module.admin.userTable.userID")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t("module.admin.userTable.firstName")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t("module.admin.userTable.lastNames")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={5}>
            {t("module.admin.userTable.under")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t("module.admin.userTable.lastLoginDate")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t("module.admin.userTable.status")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" />
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const dataTable: IUserModel[] = this.props.userlistStore.list;
    return (
      <Table.Body>
        {this.props.userlistStore.list.length > 0 ? (
          dataTable.map((data: IUserModel, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell textAlign="center">
                  <Checkbox
                    checked={data.isSelected}
                    onChange={(event, value) =>
                      data.setField({
                        fieldname: "isSelected",
                        value: value.checked
                      })
                    }
                  />
                </Table.Cell>
                <Table.Cell>{data.username}</Table.Cell>
                <Table.Cell>{data.firstname}</Table.Cell>
                <Table.Cell>{data.lastname}</Table.Cell>
                <Table.Cell>{data.organization.orgName}</Table.Cell>
                <Table.Cell textAlign="center">
                  {data.last_signin_date_formated}
                </Table.Cell>
                <Table.Cell>{data.status}</Table.Cell>
                <Table.Cell>
                  <List horizontal verticalAlign="middle" style={styles.list}>
                    <PermissionControl codes={["USER.VIEW"]}>
                      <List.Item style={styles.listItem}>
                        <Icon
                          id="btn-icon-usertable-eye"
                          circular
                          inverted
                          link
                          color="blue"
                          name="eye"
                          onClick={() =>
                            this.navigationToUserDetailPage(
                              data.id,
                              data.username
                            )
                          }
                        />
                      </List.Item>
                    </PermissionControl>
                    <PermissionControl codes={["USER.EDIT"]}>
                      <List.Item style={styles.listItem}>
                        <Icon
                          id="btn-icon-usertable-edit"
                          circular
                          inverted
                          link
                          color="olive"
                          name="edit outline"
                          onClick={() =>
                            this.navigationToUserFormPage(
                              data.id,
                              data.username
                            )
                          }
                        />
                      </List.Item>
                    </PermissionControl>
                    <PermissionControl codes={["USER.DEL"]}>
                      <DeleteModal
                        onConfirmDelete={() => {
                          this.deleteUser(data);
                        }}
                        trigger={
                          <List.Item style={styles.listItem}>
                            <Icon
                              id="btn-icon-usertable-delete"
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
    const { userlistStore } = this.props;

    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="10">
            <TableFooter
              currentPage={userlistStore.currentPage}
              totalPages={userlistStore.totalPages}
              total={userlistStore.total}
              perPage={userlistStore.perPage}
              onChangePerPage={this.onChangePerPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  private onChangePerPage = (value: number) => {
    const { userlistStore } = this.props;
    userlistStore.setPerPage(value);
    setTimeout(() => {
      userlistStore.setCurrentPage(1);
      userlistStore.load_data();
    }, 1500);
  };

  private deleteUser = async (item: IUserModel) => {
    const { userlistStore } = this.props;
    try {
      await item.delete_data();
      await userlistStore.load_data();
    } catch (e) {
      console.log(e);
    }
  };

  private onChangeCurrentPage = (value: number) => {
    const { userlistStore } = this.props;
    userlistStore.setCurrentPage(value);
    setTimeout(() => {
      userlistStore.load_data();
    }, 1500);
  };

  private onChangeStatusField = async (value: any) => {
    const { userlistStore } = this.props;
    await userlistStore.update_data_selected(value);
  };
  private navigationToUserFormPage = async (id: string, username: string) => {
    const { history } = this.props;
    history.push(`/admin/user_managment/edit/${id}/${username}`);
  };
  private navigationToUserDetailPage = async (id: string, username: string) => {
    const { history } = this.props;
    history.push(`/admin/user_managment/view/${id}/${username}`);
  };
}

const styles: any = {
  dropdown: {
    background: COLORS.teal,
    color: "white"
  },
  menu: {
    background: "transparent",
    border: "none",
    boxShadow: "none"
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

export default withRouter(withTranslation()(UserTable));
