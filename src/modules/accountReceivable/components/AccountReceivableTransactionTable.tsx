import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Icon, List, Table } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { EmptyTableRow, SubSectionContainer } from "../../../components/common";
import {
  AccountReceivableTransactionModal,
  CounterServiceTransactionModal,
  DeleteModal,
  KTBTransactionModal,
  M371ReceiptModal,
} from "../../../modals";
import { date_display_CE_TO_BE } from "../../../utils";
import { currency } from "../../../utils/format-helper";
import { ReceiptModel } from "../../receipt/ReceiptModel";
import {
  IAccountReceivableModel,
  IAccountReceivableTransactionsModel,
} from "../AccountReceivableModel";

interface IAccountReceivableTransactionTable
  extends WithTranslation,
    RouteComponentProps {
  accountReceivable: IAccountReceivableModel;
  appStore?: IAppModel;
}
@inject("appStore")
@observer
class AccountReceivableTransactionTable extends React.Component<IAccountReceivableTransactionTable> {
  public render() {
    const { t, accountReceivable } = this.props;
    return (
      <SubSectionContainer
        stretch
        fluid
        basic
        title={t(
          "module.accountReceivable.accountReceivableTransactionTable.loanPaymentHistory"
        )}
        style={styles.container}
        linkModalLabel={t(
          "module.accountReceivable.accountReceivableTransactionTable.linkModalLabel"
        )}
        iconName="plus circle"
        linkModalComponent={
          <AccountReceivableTransactionModal
            accountReceivable={accountReceivable}
          />
        }
      >
        <Table striped size="small" role="grid" aria-labelledby="header">
          {this.renderTableHeader()}
          {this.renderTableBody()}
        </Table>
      </SubSectionContainer>
    );
  }

  private renderTableHeader() {
    const { t } = this.props;
    return (
      <Table.Header style={styles.tableHeader}>
        <Table.Row style={styles.tableRow}>
          <Table.HeaderCell textAlign="center">
            {t(
              "module.accountReceivable.accountReceivableTransactionTable.time"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t(
              "module.accountReceivable.accountReceivableTransactionTable.paymentDate"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t(
              "module.accountReceivable.accountReceivableTransactionTable.paidDate"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t(
              "module.accountReceivable.accountReceivableTransactionTable.paymentType"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t(
              "module.accountReceivable.accountReceivableTransactionTable.paymentMethods"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t(
              "module.accountReceivable.accountReceivableTransactionTable.payments"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t(
              "module.accountReceivable.accountReceivableTransactionTable.balance"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t(
              "module.accountReceivable.accountReceivableTransactionTable.status"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t(
              "module.accountReceivable.accountReceivableTransactionTable.referencePaymentNumber"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" />
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const { accountReceivable, appStore } = this.props;
    const dataTable = accountReceivable.transactions;
    return (
      <Table.Body style={styles.tableBody}>
        {dataTable.length > 0 ? (
          dataTable.map(
            (data: IAccountReceivableTransactionsModel, index: number) => {
              return (
                <Table.Row key={index} style={styles.tableRow}>
                  <Table.Cell textAlign="center">
                    {(+dataTable.length - index).toString()}
                  </Table.Cell>
                  <Table.Cell>
                    {this.checkEmptyText(
                      date_display_CE_TO_BE(data.createdDate, true)
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {this.checkEmptyText(
                      date_display_CE_TO_BE(data.paidDate, true)
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {this.checkEmptyText(data.paymentType)}
                  </Table.Cell>

                  <Table.Cell textAlign="center">
                    {appStore!.enumItemLabel(
                      "paymentMethod",
                      data.paymentMethod
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {this.checkEmptyText(currency(data.paidAmount, 2))}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {this.checkEmptyText(
                      currency(data.outstandingDebtBalance, 2)
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {appStore!.enumItemLabel(
                      "arTransactionStatus",
                      data.status
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {this.renderLinkPaymentReferenceNo(data)}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <List horizontal verticalAlign="middle">
                      {data.paymentType === "OFFICE-M" ? (
                        <List.Item style={styles.listItem}>
                          <AccountReceivableTransactionModal
                            accountReceivable={accountReceivable}
                            trigger={
                              <Icon
                                id="btn-icon-usertable-edit"
                                circular
                                inverted
                                link
                                color="olive"
                                name="edit outline"
                              />
                            }
                            arTransactionsItem={data}
                          />
                        </List.Item>
                      ) : null}
                      {data.paymentType === "OFFICE-M" ? (
                        <List.Item style={styles.listItem}>
                          <DeleteModal
                            trigger={
                              <Icon
                                circular
                                inverted
                                link
                                color="red"
                                name="trash alternate outline"
                              />
                            }
                            onConfirmDelete={() => this.onDeleteData(data)}
                          />
                        </List.Item>
                      ) : null}
                    </List>
                  </Table.Cell>
                </Table.Row>
              );
            }
          )
        ) : (
          <EmptyTableRow style={styles.tableRow} />
        )}
      </Table.Body>
    );
  }

  private onDeleteData = async (item: IAccountReceivableTransactionsModel) => {
    const { t, accountReceivable } = this.props;
    try {
      await item.delete_data();
      // this.alertMessageObj.setAlertMessage(
      //   t("module.donation.DonationElderlyLivingListTable.alertMessage1"),
      //   t("module.donation.DonationElderlyLivingListTable.alertMessage2")
      // );
      await accountReceivable.getAccountReceivableDetail();
    } catch (e) {
      throw e;
      // accountReceivable.setErrorMessage(e);
    }
  };

  private checkEmptyText = (value: string) => {
    return value ? value : "-";
  };
  private renderLinkPaymentReferenceNo(
    data: IAccountReceivableTransactionsModel
  ) {
    if (
      data.paymentId &&
      data.paymentType === "CS" &&
      data.status &&
      data.paymentReferenceNo
    ) {
      return (
        <CounterServiceTransactionModal
          trigger={<a style={styles.link}>{data.paymentReferenceNo}</a>}
          paymentReferenceNo={data.paymentReferenceNo}
          status={data.status}
        />
      );
    } else if (
      data.paymentId &&
      data.paymentType === "KTB" &&
      data.status &&
      data.paymentReferenceNo
    ) {
      return (
        <KTBTransactionModal
          trigger={<a style={styles.link}>{data.paymentReferenceNo}</a>}
          paymentReferenceNo={data.paymentReferenceNo}
          status={data.status}
        />
      );
    } else if (
      data.paymentId &&
      data.paymentType === "OFFICE" &&
      data.paymentReferenceNo
    ) {
      const receiptTemp = ReceiptModel.create({ id: data.paymentId });
      return (
        <M371ReceiptModal
          receiptId={receiptTemp.id || ""}
          onGetDetail
          receipt={receiptTemp}
          trigger={<a style={styles.link}>{data.paymentReferenceNo}</a>}
        />
      );
    } else {
      return this.checkEmptyText(data.paymentReferenceNo);
    }
  }
}
const styles: any = {
  container: {
    marginTop: 7,
    display: "block",
  },
  link: {
    textDecoration: "underline",
    cursor: "pointer",
  },
  tableHeader: {
    display: "table",
    width: "100%",
    tableLayout: "fixed",
  },
  tableRow: {
    display: "table",
    width: "100%",
    tableLayout: "fixed",
  },
  tableBody: {
    display: "block",
    maxHeight: 380,
    overflow: "auto",
    width: "100%",
    tableLayout: "fixed",
  },
  listItem: {
    marginLeft: 0,
    marginRight: 7,
  },
};
export default withRouter(withTranslation()(AccountReceivableTransactionTable));
