import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Table } from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import { EmptyTableRow, TableFooter } from "../../../../components/common";
import { date_display_CE_TO_BE } from "../../../../utils";
import { currency } from "../../../../utils/format-helper";
import { IAccountReceivableListModel } from "../../../accountReceivable/AccountReceivableListModel";
import { IAccountReceivableModel } from "../../../accountReceivable/AccountReceivableModel";
import { IReceiptItem } from "../../../receipt/ReceiptModel";

interface IPosLoanPayBackSearchTable extends WithTranslation {
  receiptItem: IReceiptItem;
  accountReceivable: IAccountReceivableModel;
  accountReceivableList: IAccountReceivableListModel;
  appStore?: IAppModel;
  onCloseModal: () => void;
}
@inject("appStore")
@observer
class PosLoanPayBackSearchTable extends React.Component<
  IPosLoanPayBackSearchTable
> {
  public render() {
    return (
      <Table size="small" selectable style={styles.table}>
        {this.renderTableHeader()}
        {this.renderTableBody()}
        {this.renderTableFooter()}
      </Table>
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
          <Table.HeaderCell textAlign="center" width={1}>
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
          <Table.HeaderCell textAlign="center" width={2}>
            {t("module.accountReceivable.accountReceivableTable.accountStatus")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={1}>
            {t(
              "module.accountReceivable.accountReceivableTable.repaymentStatus"
            )}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const { appStore, t } = this.props;
    const dataTable: IAccountReceivableModel[] = this.props
      .accountReceivableList.list;
    return (
      <Table.Body>
        {dataTable.length > 0 ? (
          dataTable.map((data: IAccountReceivableModel, index: number) => {
            return (
              <Table.Row
                key={index}
                style={{ cursor: "pointer" }}
                onClick={() => this.onClickAddItem(data)}
              >
                <Table.Cell singleLine>
                  {this.checkEmptyText(data.documentNumber)}
                </Table.Cell>
                <Table.Cell>
                  {this.checkEmptyText(data.organization.orgCode)}
                </Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.name)}</Table.Cell>
                <Table.Cell textAlign="center">
                  {this.checkEmptyText(
                    date_display_CE_TO_BE(data.startDate, true)
                  )}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {this.checkEmptyText(
                    date_display_CE_TO_BE(data.endDate, true)
                  )}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {this.checkEmptyText(currency(data.loanAmount))}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {this.checkEmptyText(currency(data.totalPayment))}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {this.checkEmptyText(currency(data.outstandingDebtBalance))}
                </Table.Cell>
                <Table.Cell>
                  {appStore!.enumItemLabel(
                    "accountReceivableStatus",
                    data.status
                  )}
                </Table.Cell>
                <Table.Cell>
                  {data.control.status
                    ? appStore!.enumItemLabel(
                        "creditStatus",
                        data.control.status
                      )
                    : t("module.accountReceivable.arStatusIcon.waitingProcess")}
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
    const { accountReceivableList } = this.props;
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="11">
            <TableFooter
              currentPage={accountReceivableList.currentPage}
              totalPages={accountReceivableList.totalPages}
              total={accountReceivableList.total}
              perPage={accountReceivableList.perPage}
              onChangePerPage={this.onChangePerPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  private onChangePerPage = (value: number) => {
    const { accountReceivableList } = this.props;
    accountReceivableList.setPerPage(value);
    setTimeout(() => {
      accountReceivableList.setCurrentPage(1);
      accountReceivableList.load_data();
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };

  private onChangeCurrentPage = (value: number) => {
    const { accountReceivableList } = this.props;
    accountReceivableList.setCurrentPage(value);
    setTimeout(() => {
      accountReceivableList.load_data();
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };
  private checkEmptyText = (value: string) => {
    return value ? value : "-";
  };
  private onClickAddItem = async (item: IAccountReceivableModel) => {
    const {
      appStore,
      accountReceivable,
      receiptItem,
      onCloseModal
    } = this.props;
    try {
      await accountReceivable.setField({
        fieldname: "id",
        value: item.id
      });
      if (accountReceivable.id) {
        await accountReceivable.getAccountReceivableDetail();
      }
      await receiptItem.setReceiptItemByAr(
        appStore!.enumItemLabel("posRefType", "AR"),
        accountReceivable
      );
      await onCloseModal();
    } catch (e) {
      console.log(e);
    }
  };
}
const styles: any = {
  table: {
    fontSize: ".8em"
  }
};
export default withTranslation()(PosLoanPayBackSearchTable);
