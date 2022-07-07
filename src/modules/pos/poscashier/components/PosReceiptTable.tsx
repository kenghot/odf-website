import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Icon, List, Table } from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import {
  EmptyTableRow,
  ErrorMessage,
  SectionContainer,
  TableFooter
} from "../../../../components/common";
import { Loading } from "../../../../components/common/loading";
import {
  currency,
  date_display_CE_TO_BE
} from "../../../../utils/format-helper";
import { IReceiptListModel } from "../../../receipt/ReceiptListModel";
import { IReceiptModel } from "../../../receipt/ReceiptModel";
import { IPosModel } from "../../PosModel";

interface IPosReceiptTable extends WithTranslation, RouteComponentProps {
  pos: IPosModel;
  receiptList: IReceiptListModel;
  previousReceipt: IReceiptModel;
  appStore?: IAppModel;
}
@inject("appStore")
@observer
class PosReceiptTable extends React.Component<IPosReceiptTable> {
  public render() {
    const { receiptList } = this.props;
    return (
      <React.Fragment>
        <br />
        <br />
        <SectionContainer id="searchTable" stretch fluid basic>
          <Loading active={receiptList.loading} />
          <ErrorMessage errorobj={receiptList.error} float timeout={5000} />
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
          <Table.HeaderCell textAlign="center" width="3">
            {t("module.pos.posReceiptTable.documentNumber")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="3">
            {t("module.pos.posReceiptTable.documentDate")}
          </Table.HeaderCell>

          <Table.HeaderCell textAlign="center" width="3">
            {t("module.pos.posReceiptTable.clientName")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="3">
            {t("module.pos.posReceiptTable.total")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.pos.posReceiptTable.status")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2" />
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const { receiptList, appStore } = this.props;
    const dataTable = receiptList.list;
    return (
      <Table.Body>
        {receiptList.list.length > 0 ? (
          dataTable.map((data: IReceiptModel, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>{data.documentNumber || "-"}</Table.Cell>
                <Table.Cell>
                  {date_display_CE_TO_BE(data.paidDate, true)}
                </Table.Cell>
                <Table.Cell>{data.clientName || "-"}</Table.Cell>
                <Table.Cell textAlign="right">
                  {currency(data.total,2) || "-"}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {appStore!.enumItemLabel("receiptStatus", data.status)}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <List horizontal verticalAlign="middle" style={styles.list}>
                    <List.Item style={styles.listItem}>
                      <Icon
                        circular
                        inverted
                        link
                        color="blue"
                        name="eye"
                        onClick={() => this.getReceiptDetail(data.id || "")}
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
    const { receiptList } = this.props;
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="9">
            <TableFooter
              currentPage={receiptList.currentPage}
              totalPages={receiptList.totalPages}
              total={receiptList.total}
              perPage={receiptList.perPage}
              onChangePerPage={this.onChangePerPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  private onChangePerPage = (value: number) => {
    const { receiptList, pos } = this.props;
    receiptList.setPerPage(value);
    setTimeout(() => {
      receiptList.setCurrentPage(1);
      receiptList.load_data(pos.id, true);
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };
  private onChangeCurrentPage = (value: number) => {
    const { receiptList, pos } = this.props;
    receiptList.setCurrentPage(value);
    setTimeout(() => {
      receiptList.load_data(pos.id, true);
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };

  private getReceiptDetail = async (id: string) => {
    const { previousReceipt, pos } = this.props;

    try {
      await previousReceipt.setField({ fieldname: "id", value: id });
      await previousReceipt.getReceiptCashierDetail(pos.id);
    } catch (error) {
      console.log(error);
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
  }
};
export default withRouter(withTranslation()(PosReceiptTable));
