import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Header, Icon, List, Popup, Table ,Checkbox,Button} from "semantic-ui-react";
import { DebtCollectionStepIcon } from ".";
import { IAppModel } from "../../../AppModel";
import {
  EmptyTableRow,
  SectionContainer,
  TableFooter
} from "../../../components/common";
import { PermissionControl } from "../../../components/permission";
import { ARStatusIcon } from "../../../components/project";
import { ConfirmModal,EnvelopsModal } from "../../../modals";
import {
  currency,
  date_display_CE_TO_BE,
  monthYear_display_CE_TO_BE
} from "../../../utils/format-helper";
import { IAccountReceivableModel } from "../../accountReceivable/AccountReceivableModel";
import { IDebtCollectionListModel } from "../DebtCollectionListModel";
import {
  DebtCollectionModel,
  IDebtCollectionModel
} from "../DebtCollectionModel";

interface IDebtCollectionTable extends WithTranslation, RouteComponentProps {
  searchDebtCollectionListPageStore: IDebtCollectionListModel;
  appStore?: IAppModel;
}
@inject("appStore")
@observer
class DebtCollectionTable extends React.Component<IDebtCollectionTable> {
  public render() {
    return (
      <React.Fragment>
        <br />
        <br />
        <SectionContainer id="searchTable" stretch fluid basic>
          <div style={styles.containerTable}>
            {this.renderMenuTableHeader()}
            <Table striped size="small" style={styles.table}>
              {this.renderTableHeader()}
              {this.renderTableBody()}
              {this.renderTableFooter()}
            </Table>
          </div>
        </SectionContainer>
      </React.Fragment>
    );
  }
  private renderTableHeaderStatus1() {
    const { t } = this.props;
    return (
      <List size="tiny" style={styles.list1}>
        <List.Item>
          <Header>
            {t("module.debtCollection.debtCollectionTable.dunningLevelNormal")}
          </Header>
        </List.Item>
        <List.Item>
          <List horizontal>
            <List.Item>
              <DebtCollectionStepIcon step={0} />
            </List.Item>
            <List.Item>
              {t("module.debtCollection.debtCollectionTable.pending")}
            </List.Item>
          </List>
        </List.Item>
        <List.Item>
          <List horizontal>
            <List.Item>
              <DebtCollectionStepIcon step={1} />
            </List.Item>
            <List.Item>
              {t("module.debtCollection.debtCollectionTable.makeDemandLetter")}
            </List.Item>
          </List>
        </List.Item>
        <List.Item>
          <List horizontal>
            <List.Item>
              <DebtCollectionStepIcon step={2} />
            </List.Item>
            <List.Item>
              {t("module.debtCollection.debtCollectionTable.followDomicile")}
            </List.Item>
          </List>
        </List.Item>
        <List.Item>
          <List horizontal>
            <List.Item>
              <DebtCollectionStepIcon step={3} />
            </List.Item>
            <List.Item>
              {t("module.debtCollection.debtCollectionTable.prosecute")}
            </List.Item>
          </List>
        </List.Item>
        <List.Item>
          <List horizontal>
            <List.Item>
              <br />
            </List.Item>
          </List>
        </List.Item>
      </List>
    );
  }
  private renderTableHeaderStatus2() {
    const { t } = this.props;
    return (
      <List size="tiny" style={styles.list2}>
        <List.Item>
          <Header>
            {t("module.debtCollection.debtCollectionTable.dunningLevelDies")}
          </Header>
        </List.Item>
        <List.Item>
          <List horizontal>
            <List.Item>
              <DebtCollectionStepIcon step={0} />
            </List.Item>
            <List.Item>
              {t("module.debtCollection.debtCollectionTable.pending")}
            </List.Item>
          </List>
        </List.Item>
        <List.Item>
          <List horizontal>
            <List.Item>
              <DebtCollectionStepIcon step={1} />
            </List.Item>
            <List.Item>
              {t("module.debtCollection.debtCollectionTable.investigateHeirs")}
            </List.Item>
          </List>
        </List.Item>
        <List.Item>
          <List horizontal>
            <List.Item>
              <DebtCollectionStepIcon step={2} />
            </List.Item>
            <List.Item>
              {t("module.debtCollection.debtCollectionTable.notifyStatutory")}
            </List.Item>
          </List>
        </List.Item>
        <List.Item>
          <List horizontal>
            <List.Item>
              <DebtCollectionStepIcon step={3} />
            </List.Item>
            <List.Item>
              {t("module.debtCollection.debtCollectionTable.prosecute")}
            </List.Item>
          </List>
        </List.Item>
      </List>
    );
  }
  private renderMenuTableHeader() {
    const { t, searchDebtCollectionListPageStore } = this.props;
    return (
      <>
      <Button
      color="blue"
      disabled={searchDebtCollectionListPageStore.statusMenu}
      content={t("module.report.reportCard.getReport")+"ออกเลขหนังสือ"}
      icon="print"
      labelPosition="left"
      onClick={searchDebtCollectionListPageStore.printReportDebtcollection}
    />
    <EnvelopsModal
            disabled={searchDebtCollectionListPageStore.statusMenu}
            trigger={
              <Button
                style={styles.buttonItem}
                disabled={searchDebtCollectionListPageStore.statusMenu}
                color="pink"
              >
              พิมพ์ซองจดหมายผู้กู้
              </Button>
            }
            onConfirm={searchDebtCollectionListPageStore.printEnvelopsDebtcollection}
          />
          <EnvelopsModal
            disabled={searchDebtCollectionListPageStore.statusMenu}
            trigger={
              <Button
                style={styles.buttonItem}
                disabled={searchDebtCollectionListPageStore.statusMenu}
                color="brown"
              >
                พิมพ์ซองจดหมายผู้ค้ำ
              </Button>
            }
            onConfirm={searchDebtCollectionListPageStore.printEnvelopsGuarantorDebtcollection}
          />
      </>
    );
  }
  private renderTableHeader() {
    const { t,searchDebtCollectionListPageStore } = this.props;
    return (
      <Table.Header>
        <Table.Row>
        <Table.HeaderCell textAlign="center" width="1">
            <Checkbox
              checked={searchDebtCollectionListPageStore.selected_checkbox}
              onChange={(event, value) =>
                searchDebtCollectionListPageStore.selected_all(value.checked || false)
              }
            />
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine width={1}>
            {t(
              "module.accountReceivable.accountReceivableTable.agreementNumber"
            )}
            <br />
            {t(
              "module.accountReceivable.accountReceivableTable.accountReceivableNumber"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine width={2}>
            {t("module.debtCollection.debtCollectionTable.nameSurnameBorrower")}
            <br />
            {t("module.debtCollection.debtCollectionTable.groupName")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine width={1}>
            {t("module.debtCollection.debtCollectionTable.asOfDate1")}
            <br />
            {t("module.debtCollection.debtCollectionTable.asOfDate2")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine width={1}>
            {t("module.debtCollection.debtCollectionTable.loanAmount")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine width={1}>
            {t(
              "module.debtCollection.debtCollectionTable.outstandingDebtBalance1"
            )}
            <br />
            {t(
              "module.debtCollection.debtCollectionTable.outstandingDebtBalance2"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine width={1}>
            {t("module.debtCollection.debtCollectionTable.overDueBalance1")}
            <br />
            {t("module.debtCollection.debtCollectionTable.overDueBalance2")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine width={1}>
            {t("module.debtCollection.debtCollectionTable.paidRatioLabel1")}
            <br />
            {t("module.debtCollection.debtCollectionTable.paidRatioLabel2")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine width={1}>
            {t("module.debtCollection.debtCollectionTable.lastPaymentDate1")}

            <br />
            {t("module.debtCollection.debtCollectionTable.lastPaymentDate2")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine width={1}>
            {t("module.debtCollection.debtCollectionTable.startOverdueDate1")}
            <br />
            {t("module.debtCollection.debtCollectionTable.startOverdueDate2")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine width={1}>
            {t(
              "module.debtCollection.debtCollectionTable.startOverdueDateNormal1"
            )}
            <br />
            {t(
              "module.debtCollection.debtCollectionTable.startOverdueDateNormal2"
            )}
          </Table.HeaderCell>
          <Popup
            size="tiny"
            trigger={
              <Table.HeaderCell textAlign="center" singleLine width={1}>
                {t("module.debtCollection.debtCollectionTable.status1")}
                <br />
                {t("module.debtCollection.debtCollectionTable.status2")}
                <Icon color="teal" name="question circle" style={styles.icon} />
              </Table.HeaderCell>
            }
          >
            <Popup.Header>
              {t(
                "module.accountReceivable.accountReceivableTable.accountStatus"
              )}
            </Popup.Header>
            <Popup.Content>{this.renderContentPopupARStatus()}</Popup.Content>
          </Popup>
          <Popup
            wide="very"
            size="tiny"
            position="left center"
            trigger={
              <Table.HeaderCell textAlign="center" singleLine width={1}>
                {t("module.debtCollection.debtCollectionTable.controlStatus1")}
                <br />
                {t("module.debtCollection.debtCollectionTable.controlStatus2")}
                <Icon color="teal" name="question circle" style={styles.icon} />
              </Table.HeaderCell>
            }
          >
            <Popup.Header>
              {t("module.debtCollection.debtCollectionTable.repaymentStatus")}
            </Popup.Header>
            <Popup.Content>{this.renderContentPopup()}</Popup.Content>
          </Popup>
          <Table.HeaderCell textAlign="center" singleLine width={1}>
            {t("module.debtCollection.debtCollectionTable.isConfirm1")}
            <br />
            {t("module.debtCollection.debtCollectionTable.isConfirm2")}
          </Table.HeaderCell>
          <Popup
            size="tiny"
            wide="very"
            position="left center"
            trigger={
              <Table.HeaderCell textAlign="center" singleLine width={1}>
                {t("module.debtCollection.debtCollectionTable.collectionStep1")}
                <br />
                {t("module.debtCollection.debtCollectionTable.collectionStep2")}
                <Icon color="teal" name="question circle" style={styles.icon} />
              </Table.HeaderCell>
            }
          >
            <Popup.Content>
              {this.renderTableHeaderStatus1()}
              {this.renderTableHeaderStatus2()}
            </Popup.Content>
          </Popup>
          <Table.HeaderCell textAlign="center" singleLine width={1} />
        </Table.Row>
      </Table.Header>
    );
  }

  private renderContentPopup() {
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

  private renderContentPopupARStatus() {
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

  private renderTableBody() {
    const { t, searchDebtCollectionListPageStore } = this.props;
    const dataTable = searchDebtCollectionListPageStore.list;
    return (
      <Table.Body>
        {dataTable.length > 0 ? (
          dataTable.map((data: IAccountReceivableModel, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell textAlign="center">
                  <Checkbox
                    checked={data.isSelected}
                    onChange={(event, value) =>
                      data.setField({
                        fieldname: "isSelected",
                        value: value.checked,
                      })
                    }
                  />
                </Table.Cell>
                <Table.Cell singleLine>
                  {this.checkEmptyText(data.documentNumber)}
                </Table.Cell>
                <Table.Cell singleLine>
                  {this.checkEmptyText(data.name)}
                </Table.Cell>
                <Table.Cell singleLine>
                  {this.checkEmptyText(
                    monthYear_display_CE_TO_BE(data.control.asOfDate, true)
                  )}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {this.checkEmptyText(currency(data.loanAmount, 2))}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {this.checkEmptyText(
                    currency(data.outstandingDebtBalance, 2)
                  )}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {this.checkEmptyText(
                    currency(data.control.overDueBalance, 2)
                  )}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {data.control.paidRatioLabel}
                </Table.Cell>
                <Table.Cell singleLine>
                  {data.control.sourceARTLastPaidDate
                    ? date_display_CE_TO_BE(
                        data.control.sourceARTLastPaidDate,
                        true
                      )
                    : t(
                        "module.accountReceivable.accountReceivableControlTable.notSourceARTLastPaidDate"
                      )}
                </Table.Cell>
                <Table.Cell singleLine>
                  {this.checkEmptyText(
                    date_display_CE_TO_BE(data.startOverdueDate, true)
                  )}
                </Table.Cell>
                <Table.Cell singleLine>
                  {this.checkEmptyText(
                    date_display_CE_TO_BE(data.caseExpirationDate, true)
                  )}
                </Table.Cell>
                <Table.Cell textAlign="center">{data.status || "-"}</Table.Cell>
                <Table.Cell textAlign="center">
                  <ARStatusIcon value={data.control.status} />
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {data.collection && data.collection.deathNotification
                    ? data.collection.deathNotification.isConfirm
                      ? t("module.debtCollection.debtCollectionTable.adnormal")
                      : t("module.debtCollection.debtCollectionTable.normal")
                    : "-"}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {data.collection ? (
                    <DebtCollectionStepIcon step={data.collection.step} />
                  ) : (
                    "-"
                  )}
                </Table.Cell>
                <Table.Cell>
                  <List horizontal verticalAlign="middle" style={styles.list}>
                    <PermissionControl codes={["DEBTCOLLECTION.CREATE"]}>
                      {data.collection && data.collection.id ? null : (
                        <List.Item style={styles.listItem}>
                          <ConfirmModal
                            title={t(
                              "module.debtCollection.debtCollectionTable.wantStartProcessTrackingConfirm"
                            )}
                            trigger={
                              <Popup
                                position="left center"
                                content={t(
                                  "module.debtCollection.debtCollectionTable.iconPlay"
                                )}
                                trigger={
                                  <Icon
                                    circular
                                    inverted
                                    link
                                    color="teal"
                                    name="play"
                                  />
                                }
                              />
                            }
                            onConfirm={() =>
                              this.onCreateDebtCollection(data, "view")
                            }
                          />
                        </List.Item>
                      )}
                    </PermissionControl>
                    <PermissionControl codes={["DEBTCOLLECTION.VIEW"]}>
                      {data.collection && data.collection.id ? (
                        <List.Item style={styles.listItem}>
                          <Icon
                            circular
                            inverted
                            link
                            color="blue"
                            name="eye"
                            onClick={() =>
                              this.navigationToDebtCollectionDetailPage(
                                data.collection
                              )
                            }
                          />
                        </List.Item>
                      ) : null}
                    </PermissionControl>
                    <PermissionControl codes={["DEBTCOLLECTION.EDIT"]}>
                      {data.collection && data.collection.id ? (
                        <List.Item style={styles.listItem}>
                          <Icon
                            circular
                            inverted
                            link
                            color="olive"
                            name="edit outline"
                            onClick={() =>
                              this.navigationToDebtCollectionEditPage(
                                data.collection
                              )
                            }
                          />
                        </List.Item>
                      ) : null}
                    </PermissionControl>
                  </List>
                </Table.Cell>
              </Table.Row>
            );
          })
        ) : (
          <EmptyTableRow colSpan={16} />
        )}
      </Table.Body>
    );
  }

  private renderTableFooter() {
    const { searchDebtCollectionListPageStore } = this.props;
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="16">
            <TableFooter
              currentPage={searchDebtCollectionListPageStore.currentPage}
              totalPages={searchDebtCollectionListPageStore.totalPages}
              total={searchDebtCollectionListPageStore.total}
              perPage={searchDebtCollectionListPageStore.perPage}
              onChangePerPage={this.onChangePerPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  private onChangePerPage = (value: number) => {
    const { searchDebtCollectionListPageStore } = this.props;
    searchDebtCollectionListPageStore.setPerPage(value);
    setTimeout(() => {
      searchDebtCollectionListPageStore.setCurrentPage(1);
      searchDebtCollectionListPageStore.load_data();
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };

  private onChangeCurrentPage = (value: number) => {
    const { searchDebtCollectionListPageStore } = this.props;
    searchDebtCollectionListPageStore.setCurrentPage(value);
    setTimeout(() => {
      searchDebtCollectionListPageStore.load_data();
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };

  private navigationToDebtCollectionDetailPage = async (
    debtCollection: IDebtCollectionModel
  ) => {
    const { history } = this.props;
    if (debtCollection.id) {
      history.push(`/debtCollection/view/${debtCollection.id}`);
    }
  };
  private checkEmptyText = (value: any) => {
    return value || value === 0 ? value : "-";
  };
  private navigationToDebtCollectionEditPage = async (
    debtCollection: IDebtCollectionModel
  ) => {
    const { history } = this.props;
    if (debtCollection && debtCollection.id) {
      history.push(`/debtCollection/edit/${debtCollection.id}`);
    }
  };

  private onCreateDebtCollection = async (
    AccountReceivable: IAccountReceivableModel,
    mode: "view" | "edit"
  ) => {
    const { history, searchDebtCollectionListPageStore } = this.props;
    try {
      searchDebtCollectionListPageStore.setField({
        fieldname: "loading",
        value: true
      });
      const debtCollection = AccountReceivable.collection;
      if (debtCollection && AccountReceivable.id) {
        await debtCollection.createDebtCollection();
        if (debtCollection.id) {
          history.push(`/debtCollection/${mode}/${debtCollection.id}`);
        }
      } else {
        const debtCollectionCreate = DebtCollectionModel.create({});
        await debtCollectionCreate.createDebtCollection(AccountReceivable.id);
        if (debtCollectionCreate.id) {
          history.push(`/debtCollection/${mode}/${debtCollectionCreate.id}`);
        }
      }
      searchDebtCollectionListPageStore.error.setField({
        fieldname: "tigger",
        value: false
      });
    } catch (e) {
      searchDebtCollectionListPageStore.error.setField({
        fieldname: "tigger",
        value: true
      });
      searchDebtCollectionListPageStore.error.setField({
        fieldname: "code",
        value: e.code
      });
      searchDebtCollectionListPageStore.error.setField({
        fieldname: "title",
        value: e.name
      });
      searchDebtCollectionListPageStore.error.setField({
        fieldname: "message",
        value: e.message
      });
      searchDebtCollectionListPageStore.error.setField({
        fieldname: "technical_stack",
        value: e.technical_stack
      });
      console.log(e);
    } finally {
      searchDebtCollectionListPageStore.setField({
        fieldname: "loading",
        value: false
      });
    }
  };
}

const styles: any = {
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
  containerTable: {
    overflowX: "auto",
    overflowY: "hidden"
  },
  icon: {
    marginRight: 0,
    marginLeft: 4
  },
  list1: {
    marginBottom: 0
  },
  list2: {
    marginTop: 0,
    marginBottom: 24
  }
};

export default withRouter(withTranslation()(DebtCollectionTable));
