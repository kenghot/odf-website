import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Header, Icon, List, Segment, Table } from "semantic-ui-react";
import {
  EmptyTableRow,
  ErrorMessage,
  TableFooter
} from "../../../../components/common";
import { Loading } from "../../../../components/common/loading";
import { M364PosShiftModal } from "../../../../modals";
import { date_display_CE_TO_BE, date_To_Time } from "../../../../utils";
import { currency } from "../../../../utils/format-helper";
import { IPosShiftModel } from "../../PosModel";
import { IPosShiftListModel } from "../../PosShiftListModel";
import { TimeRangeLabel } from "../../../../components/project";

interface IPosManagementPaymentRoundTable extends WithTranslation {
  posShiftList: IPosShiftListModel;
  posId: string;
}
@observer
class PosManagementPaymentRoundTable extends React.Component<
IPosManagementPaymentRoundTable
> {
  public render() {
    const { t, posShiftList } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t("module.pos.posManagementPaymentRoundTable.contentHeader")}
          subheader={t("module.pos.posManagementPaymentRoundTable.subHeader")}
          style={styles.header}
        />
        <Loading active={posShiftList.loading} />
        <ErrorMessage
          errorobj={posShiftList.error}
          float={true}
          timeout={10000}
        />
        <Table striped size="small">
          {this.renderTableHeader()}
          {this.renderTableBody()}
          {this.renderTableFooter()}
        </Table>
      </Segment>
    );
  }
  private renderTableHeader() {
    const { t } = this.props;
    return (
      <Table.Header>
        <Table.Row>

          <Table.HeaderCell textAlign="center">
            {t("module.pos.posManagementPaymentRoundTable.startedEendedShift")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={3}>
            {t("module.pos.posManagementPaymentRoundTable.onDutymanager")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={3}>
            {t("module.pos.posManagementPaymentRoundTable.currentCashier")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t("module.pos.posManagementPaymentRoundTable.openingAmount")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t(
              "module.pos.posManagementPaymentRoundTable.expectedDrawerAmount"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t("module.pos.posManagementPaymentRoundTable.drawerAmount")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={1} />
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    return (
      <Table.Body>
        {this.props.posShiftList.list.length > 0 ? (
          this.props.posShiftList.list.map(
            (data: IPosShiftModel, index: number) => {
              return (
                <Table.Row key={index}>

                  <Table.Cell singleLine>
                    <TimeRangeLabel
                      started={data.startedShift}
                      ended={data.endedShift}
                      showDateTime={true}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {data.onDutymanager
                      ? data.onDutymanager.fullname || "-"
                      : "-"}
                  </Table.Cell>
                  <Table.Cell>{data.currentCashier.fullname || "-"}</Table.Cell>
                  <Table.Cell textAlign="right">
                    {currency(data.openingAmount)}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {currency(data.expectedDrawerAmount)}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {currency(data.drawerAmount)}
                  </Table.Cell>
                  <Table.Cell>
                    <List horizontal verticalAlign="middle" style={styles.list}>
                      <M364PosShiftModal
                        id={data.id}
                        trigger={
                          <List.Item style={styles.listItem}>
                            <Icon
                              id="btn-icon-pos-management-payment-round-table-eye"
                              circular
                              inverted
                              link
                              color="blue"
                              name="eye"
                            />
                          </List.Item>
                        }
                      />
                    </List>
                  </Table.Cell>
                </Table.Row>
              );
            }
          )
        ) : (
            <EmptyTableRow colSpan={8} />
          )}
      </Table.Body>
    );
  }

  private renderTableFooter() {
    const { posShiftList } = this.props;
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="8">
            <TableFooter
              currentPage={posShiftList.currentPage}
              totalPages={posShiftList.totalPages}
              total={posShiftList.total}
              perPage={posShiftList.perPage}
              onChangePerPage={this.onChangePerPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  private onChangePerPage = (value: number) => {
    const { posShiftList, posId } = this.props;
    posShiftList.setPerPage(value);
    setTimeout(() => {
      posShiftList.setCurrentPage(1);
      posShiftList.load_data(posId);
    }, 1500);
  };

  private onChangeCurrentPage = (value: number) => {
    const { posShiftList, posId } = this.props;
    posShiftList.setCurrentPage(value);
    setTimeout(() => {
      posShiftList.load_data(posId);
    }, 1500);
  };
}

const styles: any = {
  header: {
    marginBottom: 28
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

export default withTranslation()(PosManagementPaymentRoundTable);
