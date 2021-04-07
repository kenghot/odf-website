import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Header, Segment, Table } from "semantic-ui-react";
import {
  EmptyTableRow,
  ErrorMessage,
  TableFooter
} from "../../../../components/common";
import { Loading } from "../../../../components/common/loading";
import { TimeRangeLabel } from "../../../../components/project";
import { date_display_CE_TO_BE, date_To_Time } from "../../../../utils";
import { currency } from "../../../../utils/format-helper";
import { IPosModel, IPosShiftModel } from "../../PosModel";
import { IPosShiftListModel } from "../../PosShiftListModel";
import { IPosShiftLogListModel } from "../../PosShiftLogListModel";

interface IPosShiftHistoryTable extends WithTranslation {
  pos: IPosModel;
  posShiftList: IPosShiftListModel;
  targetPosShift?: IPosShiftModel;
  targetPosShiftLogList?: IPosShiftLogListModel;
}

@inject("targetPosShift", "targetPosShiftLogList")
@observer
class PosShiftHistoryTable extends React.Component<IPosShiftHistoryTable> {
  public render() {
    const { t, posShiftList } = this.props;
    return (
      <Segment padded>
        <Header
          size="medium"
          content={t("module.pos.posShiftHistoryTable.content")}
          subheader={t("module.pos.posShiftHistoryTable.subheader")}
          style={styles.header}
        />
        <Loading active={posShiftList.loading} />
        <ErrorMessage
          errorobj={posShiftList.error}
          float={true}
          timeout={10000}
        />
        <Table size="small" selectable>
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
            {t("module.pos.posManagementPaymentRoundTable.startedShift")}
          </Table.HeaderCell>
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
            {t(
              "module.pos.posManagementPaymentRoundTable.expectedDrawerAmount"
            )}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const { targetPosShift } = this.props;
    return (
      <Table.Body>
        {this.props.posShiftList.list.length > 0 ? (
          this.props.posShiftList.list.map(
            (data: IPosShiftModel, index: number) => {
              return (
                <Table.Row
                  key={index}
                  style={styles.row}
                  onClick={() => this.onClickItem(data)}
                  active={data.id === targetPosShift!.id ? true : false}
                >
                  <Table.Cell singleLine>
                    {date_display_CE_TO_BE(data.startedShift, true)}
                  </Table.Cell>
                  <Table.Cell singleLine>
                    <TimeRangeLabel
                      started={data.startedShift}
                      ended={data.endedShift}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {data.onDutymanager
                      ? data.onDutymanager.fullname || "-"
                      : "-"}
                  </Table.Cell>
                  <Table.Cell>{data.currentCashier.fullname || "-"}</Table.Cell>
                  <Table.Cell textAlign="right">
                    {currency(data.expectedDrawerAmount)}
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
    const { posShiftList, pos } = this.props;
    posShiftList.setPerPage(value);
    setTimeout(() => {
      posShiftList.setCurrentPage(1);
      posShiftList.load_data(pos.id);
    }, 1500);
  };

  private onChangeCurrentPage = (value: number) => {
    const { posShiftList, pos } = this.props;
    posShiftList.setCurrentPage(value);
    setTimeout(() => {
      posShiftList.load_data(pos.id);
    }, 1500);
  };
  private onClickItem = async (item: IPosShiftModel) => {
    const { targetPosShift, targetPosShiftLogList } = this.props;
    try {
      await targetPosShift!.setField({ fieldname: "id", value: item.id });
      await targetPosShift!.getPosShiftDetail();
      await targetPosShiftLogList!.setField({
        fieldname: "posShiftId",
        value: item.id
      });
      await targetPosShiftLogList!.load_data();
    } catch (e) {
      console.log(e);
    }
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
  },
  row: {
    cursor: "pointer"
  }
};

export default withTranslation()(PosShiftHistoryTable);
