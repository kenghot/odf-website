import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Icon, List, Popup, Table } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import {
  EmptyTableRow,
  SectionContainer,
  TableFooter
} from "../../../components/common";
import { PermissionControl } from "../../../components/permission";
import { ARStatusIcon } from "../../../components/project";
import { COLORS } from "../../../constants";
import { date_display_CE_TO_BE } from "../../../utils";
import { currency } from "../../../utils/format-helper";
import { IAccountReceivableListModel } from "../AccountReceivableListModel";
import { IAccountReceivableModel } from "../AccountReceivableModel";
import { hasPermission } from "../../../utils/render-by-permission";

interface IAccountReceivableTable extends WithTranslation, RouteComponentProps {
  accountReceivableListStore: IAccountReceivableListModel;
  appStore?: IAppModel;
}
@inject("appStore")
@observer
class AccountReceivableTable extends React.Component<IAccountReceivableTable> {
  public render() {
    return (
      <React.Fragment>
        <br />
        <br />
        <SectionContainer id="searchTable" stretch fluid basic>
          <Table striped size="small" style={styles.table}>
            {this.renderTableHeader()}
            {this.renderTableBody()}
            {this.renderTableFooter()}
          </Table>
        </SectionContainer>
      </React.Fragment>
    );
  }

  private renderTableHeader() {
    const { t } = this.props;
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center" width={1}>
            {t(
              "module.accountReceivable.accountReceivableTable.agreementNumber"
            )}
            <br />
            {t(
              "module.accountReceivable.accountReceivableTable.accountReceivableNumber"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={1} singleLine>
            {t("module.accountReceivable.accountReceivableTable.orgCode")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={3}>
            {t(
              "module.accountReceivable.accountReceivableTable.nameBorrowerGroupName"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t(
              "module.accountReceivable.accountReceivableHeader.accountStartDate"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t(
              "module.accountReceivable.accountReceivableDetail.accountDueDate"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={1}>
            {t("module.accountReceivable.accountReceivableTable.principle")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={1}>
            {t("module.accountReceivable.accountReceivableTable.payments")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={1}>
            {t("module.accountReceivable.accountReceivableTable.balance")}
          </Table.HeaderCell>
          <Popup
            size="tiny"
            trigger={
              <Table.HeaderCell textAlign="center" width={2}>
                {t(
                  "module.accountReceivable.accountReceivableTable.accountStatus"
                )}
                <Icon color="teal" name="question circle" style={styles.icon} />
              </Table.HeaderCell>
            }
          >
            <Popup.Header>
              {t(
                "module.accountReceivable.accountReceivableTable.accountStatus"
              )}
            </Popup.Header>
            <Popup.Content>{this.renderContentPopup()}</Popup.Content>
          </Popup>
          <Popup
            wide="very"
            size="tiny"
            trigger={
              <Table.HeaderCell textAlign="center" singleLine>
                {t(
                  "module.accountReceivable.accountReceivableTable.repaymentStatus"
                )}
                <Icon color="teal" name="question circle" style={styles.icon} />
              </Table.HeaderCell>
            }
          >
            <Popup.Header>
              {t("module.debtCollection.debtCollectionTable.repaymentStatus")}
            </Popup.Header>
            <Popup.Content>
              {this.renderContentPopupCreditStatus()}
            </Popup.Content>
          </Popup>

          <Table.HeaderCell textAlign="center" width={1} />
        </Table.Row>
      </Table.Header>
    );
  }

  private renderContentPopup() {
    const { appStore } = this.props;
    const list = appStore!.enumItems("accountReceivableStatus");
    return list.length > 0 ? (
      <List bulleted>
        {list.map((data: any, index: number) => {
          return (
            <List.Item key={index}>{`${data.value}: ${data.text}`}</List.Item>
          );
        })}
      </List>
    ) : (
      "-"
    );
  }

  private renderContentPopupCreditStatus() {
    const { appStore } = this.props;
    const list = appStore!.enumItems("creditStatus");
    return list.length > 0 ? (
      <List size="tiny">
        {list.map((data: any, index: number) => {
          return (
            <List.Item key={index}>
              <List horizontal>
                <List.Item>
                  <ARStatusIcon size="tiny" value={`${data.value}`} />
                </List.Item>
                <List.Item>{`${data.text}`}</List.Item>
              </List>
            </List.Item>
          );
        })}
      </List>
    ) : (
      "-"
    );
  }

  private renderTableBody() {
    const dataTable: IAccountReceivableModel[] = this.props
      .accountReceivableListStore.list;
    return (
      <Table.Body>
        {dataTable.length > 0 ? (
          dataTable.map((data: IAccountReceivableModel, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell singleLine>
                  {this.checkEmptyText(data.documentNumber)}
                </Table.Cell>
                <Table.Cell>
                  {this.checkEmptyText(data.organization.orgCode)}
                </Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.name)}</Table.Cell>
                <Table.Cell>
                  {this.checkEmptyText(
                    date_display_CE_TO_BE(data.startDate, true)
                  )}
                </Table.Cell>
                <Table.Cell>
                  {this.checkEmptyText(
                    date_display_CE_TO_BE(data.endDate, true)
                  )}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {this.checkEmptyText(currency(data.loanAmount, 2))}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {this.checkEmptyText(currency(data.totalPayment, 2))}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {this.checkEmptyText(
                    currency(data.outstandingDebtBalance, 2)
                  )}
                </Table.Cell>
                <Table.Cell textAlign="center">{data.status}</Table.Cell>
                <Table.Cell textAlign="center">
                  <ARStatusIcon value={data.control.status} />
                </Table.Cell>
                <Table.Cell>
                  <List horizontal verticalAlign="middle" style={styles.list}>
                    <PermissionControl somePermission codes={["AR.VIEW", "REQUEST.ONLINE.ACCESS"]}>
                      <List.Item style={styles.listItem}>
                        <Icon
                          circular
                          inverted
                          link
                          color="blue"
                          name="eye"
                          onClick={() =>
                            this.navigationToAccountReceivableDetailPage(
                              data.id,
                              data.documentNumber
                            )
                          }
                        />
                      </List.Item>
                    </PermissionControl>
                  </List>
                </Table.Cell>
              </Table.Row>
            );
          })
        ) : (
          <EmptyTableRow colSpan={11} />
        )}
      </Table.Body>
    );
  }

  private renderTableFooter() {
    const { accountReceivableListStore } = this.props;
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="11">
            <TableFooter
              currentPage={accountReceivableListStore.currentPage}
              totalPages={accountReceivableListStore.totalPages}
              total={accountReceivableListStore.total}
              perPage={accountReceivableListStore.perPage}
              onChangePerPage={this.onChangePerPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  private onChangePerPage = (value: number) => {
    const { accountReceivableListStore } = this.props;
    accountReceivableListStore.setPerPage(value);
    setTimeout(() => {
      accountReceivableListStore.setCurrentPage(1);
      accountReceivableListStore.load_data();
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };

  private onChangeCurrentPage = (value: number) => {
    const { accountReceivableListStore } = this.props;
    accountReceivableListStore.setCurrentPage(value);
    setTimeout(() => {
      accountReceivableListStore.load_data();
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };

  private navigationToAccountReceivableDetailPage = async (
    id: string,
    username: string
  ) => {
    const { history } = this.props;
    history.push(`/account_receivable/view/${id}/${username}`);
  };
  private checkEmptyText = (value: string) => {
    return value ? value : "-";
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
  },
  table: {
    fontSize: ".7em"
  },
  icon: {
    marginRight: 0,
    marginLeft: 4
  }
};

export default withRouter(withTranslation()(AccountReceivableTable));
