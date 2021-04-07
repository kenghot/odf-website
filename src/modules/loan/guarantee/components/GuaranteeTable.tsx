import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  // Checkbox, Dropdown,
  Icon,
  List,
  //  Menu,
  Table
} from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import {
  EmptyTableRow,
  SectionContainer,
  TableFooter
} from "../../../../components/common";
import { PermissionControl } from "../../../../components/permission";
import { COLORS } from "../../../../constants";
import { DeleteModal } from "../../../../modals";
import {
  currency,
  date_display_CE_TO_BE
} from "../../../../utils/format-helper";
import { hasPermission } from "../../../../utils/render-by-permission";
import { IGuaranteeListModel } from "../GuaranteeListModel";
import { IGuaranteeModel } from "../GuaranteeModel";

interface IGuaranteeTable extends WithTranslation, RouteComponentProps {
  guaranteeListStore: IGuaranteeListModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class GuaranteeTable extends React.Component<IGuaranteeTable> {
  public render() {
    const {
      t
      // , guaranteeListStore
    } = this.props;
    // const menuOptions = [
    //   {
    //     key: "0",
    //     text: t("module.loan.guaranteeTable.disable"),
    //     value: "setInactive"
    //   },
    //   {
    //     key: "1",
    //     text: t("module.loan.guaranteeTable.enable"),
    //     value: "setActive"
    //   }
    // ];
    return (
      <React.Fragment>
        {hasPermission("GUANRANTEE.CREATE") ? null : <br />}
        <SectionContainer
          id="searchTable"
          stretch
          fluid
          basic
          // titleComponent={
          //   <Menu style={styles.menu}>
          //     <Dropdown
          //       button
          //       text={t("module.loan.guaranteeTable.chooseAll")}
          //       options={menuOptions}
          //       style={styles.dropdown}
          //       clearable
          //       disabled={guaranteeListStore.statusMenu}
          //       onChange={(event, data) => this.onChangeStatusField(data.value)}
          //     />
          //   </Menu>
          // }
          linkRouterLabel={
            hasPermission("GUANRANTEE.CREATE")
              ? t("module.loan.guaranteeDetail.createLoanGuaranteeAgreement")
              : undefined
          }
          linkRouterPathName={
            hasPermission("GUANRANTEE.CREATE")
              ? "/loan/guarantee/create"
              : undefined
          }
          iconName={
            hasPermission("GUANRANTEE.CREATE") ? "plus circle" : undefined
          }
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
    const {
      t
      //  guaranteeListStore
    } = this.props;
    return (
      <Table.Header>
        <Table.Row>
          {/* <Table.HeaderCell textAlign="center">
            <Checkbox
              checked={guaranteeListStore.selected_checkbox}
              onChange={(event, value) =>
                guaranteeListStore!.selected_all(value.checked || false)
              }
            />
          </Table.HeaderCell> */}
          <Table.HeaderCell textAlign="center" width={1}>
            {t("module.loan.guaranteeDetail.contractNumber")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={4}>
            {t("module.loan.guaranteeTable.organizationAcceptsRequest")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={1}>
            {t("module.loan.guaranteeTable.category")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={3}>
            {t("module.loan.guaranteeTable.nameBorrowerGroupName")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={1}>
            {t("module.loan.guaranteeDetail.contractDate")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={1}>
            {t("module.loan.guaranteeDetail.contractEndDate")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t("module.loan.guaranteeDetail.creditLimit")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={1}>
            {t("module.loan.guaranteeTable.status")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2} />
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const { appStore } = this.props;
    const dataTable: IGuaranteeModel[] = this.props.guaranteeListStore.list;
    return (
      <Table.Body>
        {dataTable.length > 0 ? (
          dataTable.map((data: IGuaranteeModel, index: number) => {
            return (
              <Table.Row key={index} verticalAlign="top">
                {/* <Table.Cell textAlign="center">
                  <Checkbox
                    checked={data.isSelected}
                    onChange={(event, value) =>
                      data!.setField({
                        fieldname: "isSelected",
                        value: value.checked
                      })
                    }
                  />
                </Table.Cell> */}
                <Table.Cell>{data.documentNumber}</Table.Cell>
                <Table.Cell>{data.organization.orgName}</Table.Cell>
                <Table.Cell singleLine>
                  {appStore!.enumItemLabel("loanType", data.guaranteeType)}
                </Table.Cell>
                <Table.Cell>{data.name}</Table.Cell>
                <Table.Cell textAlign="center" singleLine>
                  {date_display_CE_TO_BE(data.documentDate, true)}
                </Table.Cell>
                <Table.Cell textAlign="center" singleLine>
                  {date_display_CE_TO_BE(data.endDate, true)}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {currency(data.loanAmount)}
                </Table.Cell>
                <Table.Cell>
                  {appStore!.enumItemLabel("guaranteeStatus", data.status)}
                </Table.Cell>
                <Table.Cell>
                  <List horizontal verticalAlign="middle" style={styles.list}>
                    <PermissionControl
                      somePermission
                      codes={["GUANRANTEE.VIEW", "DATA.ALL.EDIT"]}
                    >
                      <List.Item style={styles.listItem}>
                        <Icon
                          circular
                          inverted
                          link
                          color="blue"
                          name="eye"
                          onClick={() =>
                            this.navigationToGuaranteeViewPage(
                              data.id,
                              data.documentNumber
                            )
                          }
                        />
                      </List.Item>
                    </PermissionControl>
                    <PermissionControl
                      somePermission
                      codes={["GUANRANTEE.EDIT", "DATA.ALL.EDIT"]}
                    >
                      {["NW"].includes(data.status) ||
                      hasPermission("DATA.ALL.EDIT") ? (
                        <List.Item style={styles.listItem}>
                          <Icon
                            circular
                            inverted
                            link
                            color="olive"
                            name="edit outline"
                            onClick={() =>
                              this.navigationToGuaranteeEditPage(
                                data.id,
                                data.documentNumber
                              )
                            }
                          />
                        </List.Item>
                      ) : null}
                    </PermissionControl>
                    <PermissionControl codes={["GUANRANTEE.DEL"]}>
                      {data.status === "NW" ? (
                        <DeleteModal
                          trigger={
                            <List.Item style={styles.listLastItem}>
                              <Icon
                                circular
                                inverted
                                link
                                color="red"
                                name="trash alternate outline"
                              />
                            </List.Item>
                          }
                          onConfirmDelete={() => this.deleteGuarantee(data)}
                        />
                      ) : null}
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
    const { guaranteeListStore } = this.props;
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="10">
            <TableFooter
              currentPage={guaranteeListStore.currentPage}
              totalPages={guaranteeListStore.totalPages}
              total={guaranteeListStore.total}
              perPage={guaranteeListStore.perPage}
              onChangePerPage={this.onChangePerPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  private deleteGuarantee = async (item: IGuaranteeModel) => {
    const { guaranteeListStore } = this.props;
    try {
      await item.delete_data();
      await guaranteeListStore.load_data();
      guaranteeListStore.error.setField({ fieldname: "tigger", value: false });
    } catch (e) {
      guaranteeListStore.error.setField({ fieldname: "tigger", value: true });
      guaranteeListStore.error.setField({ fieldname: "code", value: e.code });
      guaranteeListStore.error.setField({ fieldname: "title", value: e.name });
      guaranteeListStore.error.setField({
        fieldname: "message",
        value: e.message
      });
      guaranteeListStore.error.setField({
        fieldname: "technical_stack",
        value: e.technical_stack
      });
      console.log(e);
    }
  };

  private onChangePerPage = (value: number) => {
    const { guaranteeListStore } = this.props;
    guaranteeListStore.setPerPage(value);
    setTimeout(() => {
      guaranteeListStore.setCurrentPage(1);
      guaranteeListStore.load_data();
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };

  private onChangeCurrentPage = (value: number) => {
    const { guaranteeListStore } = this.props;
    guaranteeListStore.setCurrentPage(value);
    setTimeout(() => {
      guaranteeListStore.load_data();
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };

  private onChangeStatusField = async (value: any) => {
    const { guaranteeListStore } = this.props;
    await guaranteeListStore.update_data_selected(value);
  };
  private navigationToGuaranteeEditPage = async (
    id: string,
    username: string
  ) => {
    const { history } = this.props;
    history.push(`/loan/guarantee/edit/${id}/${username}`);
  };
  private navigationToGuaranteeViewPage = async (
    id: string,
    username: string
  ) => {
    const { history } = this.props;
    history.push(`/loan/guarantee/view/${id}/${username}`);
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

export default withRouter(withTranslation()(GuaranteeTable));
