import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Icon, List, Table } from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import {
  EmptyTableRow,
  SectionContainer,
  TableFooter
} from "../../../../components/common";
import { M371ReceiptModal } from "../../../../modals";
import { date_display_CE_TO_BE } from "../../../../utils";
import { currency } from "../../../../utils/format-helper";
import { IReceiptListModel } from "../../ReceiptListModel";
import { IReceiptModel } from "../../ReceiptModel";

interface IReceiptTable extends WithTranslation, RouteComponentProps {
  receiptListStore: IReceiptListModel;
  appStore?: IAppModel;
}
@inject("appStore")
@observer
class ReceiptTable extends React.Component<IReceiptTable> {
  public render() {
    const { t } = this.props;
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
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.receipt.receiptTable.documentNumber")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.receipt.receiptTable.posCode")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.receipt.receiptTable.orgCode")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.receipt.receiptTable.documentDate")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.receipt.receiptTable.clientType")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.receipt.receiptTable.clientName")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.receipt.receiptTable.total")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="1">
            {t("module.receipt.receiptTable.status")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="1" />
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const { receiptListStore, appStore } = this.props;
    const dataTable = receiptListStore.list;
    return (
      <Table.Body>
        {this.props.receiptListStore.list.length > 0 ? (
          dataTable.map((data: IReceiptModel, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>{data.documentNumber || "-"}</Table.Cell>
                <Table.Cell>{data.posText}</Table.Cell>
                <Table.Cell>{data.organization.orgCode || "-"}</Table.Cell>
                <Table.Cell>
                  {date_display_CE_TO_BE(data.paidDate, true)}
                </Table.Cell>
                <Table.Cell>
                  {appStore!.enumItemLabel("clientType", data.clientType)}
                </Table.Cell>
                <Table.Cell>{data.clientName || "-"}</Table.Cell>
                <Table.Cell textAlign="right">
                  {currency(data.total, 2) || "-"}
                </Table.Cell>
                <Table.Cell>
                  {appStore!.enumItemLabel("receiptStatus", data.status)}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <List horizontal verticalAlign="middle" style={styles.list}>
                    <List.Item style={styles.listItem}>
                      <M371ReceiptModal
                        receiptId={data.id || ""}
                        receipt={data}
                        trigger={
                          <Icon
                            circular
                            inverted
                            link
                            color="blue"
                            name="eye"
                          />
                        }
                      />
                    </List.Item>
                  </List>
                </Table.Cell>
              </Table.Row>
            );
          })
        ) : (
          <EmptyTableRow colSpan={9} />
        )}
      </Table.Body>
    );
  }

  private renderTableFooter() {
    const { receiptListStore } = this.props;
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="9">
            <TableFooter
              currentPage={receiptListStore.currentPage}
              totalPages={receiptListStore.totalPages}
              total={receiptListStore.total}
              perPage={receiptListStore.perPage}
              onChangePerPage={this.onChangePerPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  private onChangePerPage = (value: number) => {
    const { receiptListStore } = this.props;
    receiptListStore.setPerPage(value);
    setTimeout(() => {
      receiptListStore.setCurrentPage(1);
      receiptListStore.load_data();
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };
  private onChangeCurrentPage = (value: number) => {
    const { receiptListStore } = this.props;
    receiptListStore.setCurrentPage(value);
    setTimeout(() => {
      receiptListStore.load_data();
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
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
  }
};
export default withRouter(withTranslation()(ReceiptTable));
