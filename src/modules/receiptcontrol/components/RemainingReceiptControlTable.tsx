import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Header, Segment, Table } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import {
  EmptyTableRow,
  ErrorMessage,
  TableFooter
} from "../../../components/common";
import { currency } from "../../../utils/format-helper";
import { IPosListModel } from "../../pos/PosListModel";
import { IPosModel } from "../../pos/PosModel";

interface IRemainingReceiptControlTable
  extends WithTranslation,
    RouteComponentProps {
  posesReceiptControlListStore: IPosListModel;
  style?: any;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class RemainingReceiptControlTable extends React.Component<
  IRemainingReceiptControlTable
> {
  public render() {
    const { posesReceiptControlListStore, style, t } = this.props;
    return (
      <Segment
        padded={"very"}
        style={style}
        loading={posesReceiptControlListStore.loading}
      >
        <Header
          size="medium"
          content={t(
            "module.receipt.remainingReceiptControlTable.pendingRequest"
          )}
          subheader={t(
            "module.receipt.remainingReceiptControlTable.pendingRequestDetail"
          )}
          style={styles.header}
        />
        <Table striped size="small" id={"RemainingReceiptControlTable"}>
          {this.renderTableHeader()}
          {this.renderTableBody()}
          {this.renderTableFooter()}
        </Table>
        <ErrorMessage
          float
          timeout={5000}
          errorobj={posesReceiptControlListStore.error}
        />
      </Segment>
    );
  }

  private renderTableHeader() {
    const { t } = this.props;
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center" width="4">
            {t("module.receipt.remainingReceiptControlTable.orgName")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="4">
            {t("module.receipt.remainingReceiptControlTable.pos")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="4">
            {t("module.receipt.remainingReceiptControlTable.pendingQuantity")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="4">
            {t("module.receipt.remainingReceiptControlTable.pendingApprovals")}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const { posesReceiptControlListStore } = this.props;
    return (
      <Table.Body>
        {posesReceiptControlListStore.list.length > 0 ? (
          posesReceiptControlListStore.list.map(
            (data: IPosModel, index: number) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>{data.orgName || "-"}</Table.Cell>
                  <Table.Cell>
                    {`${data.posCode || "-"} ${
                      data.posCode && data.posName ? " : " : ""
                    }${data.posName}`}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {currency(data.onhandReceipt)}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {currency(data.requestReceipt)}
                  </Table.Cell>
                </Table.Row>
              );
            }
          )
        ) : (
          <EmptyTableRow colSpan={9} />
        )}
      </Table.Body>
    );
  }

  private renderTableFooter() {
    const { posesReceiptControlListStore } = this.props;
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="4">
            <TableFooter
              currentPage={posesReceiptControlListStore.currentPage}
              totalPages={posesReceiptControlListStore.totalPages}
              total={posesReceiptControlListStore.total}
              perPage={posesReceiptControlListStore.perPage}
              onChangePerPage={this.onChangePerPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  private onChangePerPage = (value: number) => {
    const { posesReceiptControlListStore } = this.props;
    posesReceiptControlListStore.setPerPage(value);
    setTimeout(() => {
      posesReceiptControlListStore.setCurrentPage(1);
      posesReceiptControlListStore.load_poses_receipt_control_data();
      const elmnt = document.getElementById("RemainingReceiptControlTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };

  private onChangeCurrentPage = (value: number) => {
    const { posesReceiptControlListStore } = this.props;
    posesReceiptControlListStore.setCurrentPage(value);
    setTimeout(() => {
      posesReceiptControlListStore.load_poses_receipt_control_data();
      const elmnt = document.getElementById("RemainingReceiptControlTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };
}
const styles: any = {
  list: {
    display: "flex",
    flexWrap: "wrap"
  },
  header: {
    marginBottom: 28
  }
};
export default withRouter(withTranslation()(RemainingReceiptControlTable));
