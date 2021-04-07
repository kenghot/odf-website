import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Icon, Label, List, Table } from "semantic-ui-react";
import {
  EmptyTableRow,
  SectionContainer,
  TableFooter
} from "../../../../components/common";
import { PermissionControl } from "../../../../components/permission";
import { TimeRangeLabel } from "../../../../components/project";
import { DeleteModal } from "../../../../modals";
import { hasPermission } from "../../../../utils/render-by-permission";
import { IPosListModel } from "../../PosListModel";
import { IPosModel } from "../../PosModel";

interface IPosTable extends WithTranslation, RouteComponentProps {
  posListStore: IPosListModel;
}
@observer
class PosTable extends React.Component<IPosTable> {
  public render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        {hasPermission("POS.CREATE") ? null : <br />}
        <SectionContainer
          id="searchTable"
          stretch
          fluid
          basic
          linkRouterLabel={
            hasPermission("POS.CREATE")
              ? t("module.pos.posTable.linkRouterLabel")
              : undefined
          }
          linkRouterPathName={
            hasPermission("POS.CREATE") ? "/pos/management/create" : undefined
          }
          iconName={hasPermission("POS.CREATE") ? "plus circle" : undefined}
        >
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
            {t("module.pos.posTable.posCode")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.pos.posTable.posName")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine width="1">
            {t("module.pos.posTable.orgCode")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine width="1">
            {t("module.pos.posTable.activeLabel")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.pos.posTable.isOnlineLabel")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine width="2">
            {t("module.pos.posTable.timeShift")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.pos.posTable.managerName")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.pos.posTable.currentCashier")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2" />
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const dataTable = this.props.posListStore.list;
    const { t } = this.props;

    return (
      <Table.Body>
        {this.props.posListStore.list.length > 0 ? (
          dataTable.map((data: IPosModel, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>{data.posCode || "-"}</Table.Cell>
                <Table.Cell>{data.posName || "-"}</Table.Cell>
                <Table.Cell>{data.organization.orgCode || "-"}</Table.Cell>
                <Table.Cell>{data.activeLabel}</Table.Cell>
                <Table.Cell singleLine>
                  <Icon name="circle" color={data.isOnline ? "green" : "red"} />
                  {data.isOnlineLabel}
                </Table.Cell>
                <Table.Cell singleLine>
                  <TimeRangeLabel
                    started={data.lastestPosShift.startedShift}
                    ended={data.lastestPosShift.endedShift}
                    showDateTime={true}
                  />
                  {/* {data.lastestPosShiftTimeStartedShift || "-"}
                  {data.lastestPosShiftTimeStartedShift ? (
                    <React.Fragment>
                      {data.lastestPosShiftTimeEndShift ? (
                        data.lastestPosShiftTimeEndShift
                      ) : (
                        <Label size={"mini"} color="blue">
                          {t("module.pos.posStatusHeader.startedisOnlineShift")}
                        </Label>
                      )}
                    </React.Fragment>
                  ) : null} */}
                </Table.Cell>
                <Table.Cell>
                  {data.lastestPosShift.onDutymanager
                    ? data.lastestPosShift.onDutymanager.fullname ||
                    data.manager.fullname
                    : "-"}
                </Table.Cell>
                <Table.Cell>
                  {data.lastestPosShift.currentCashier.fullname || "-"}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <List horizontal verticalAlign="middle" style={styles.list}>
                    <PermissionControl codes={["POS.EDIT"]}>
                      <List.Item style={styles.listItem}>
                        <Icon
                          circular
                          inverted
                          link
                          color="olive"
                          name="edit outline"
                          onClick={() =>
                            this.navigationToPosDetailManagement(data.id)
                          }
                        />
                      </List.Item>
                    </PermissionControl>
                    <PermissionControl codes={["POS.DEL"]}>
                      <DeleteModal
                        trigger={
                          <List.Item style={styles.listItem}>
                            <Icon
                              circular
                              inverted
                              link
                              color="red"
                              name="trash alternate outline"
                            />
                          </List.Item>
                        }
                        onConfirmDelete={() => this.deletePos(data)}
                      />
                    </PermissionControl>
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
    const { posListStore } = this.props;
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="9">
            <TableFooter
              currentPage={posListStore.currentPage}
              totalPages={posListStore.totalPages}
              total={posListStore.total}
              perPage={posListStore.perPage}
              onChangePerPage={this.onChangePerPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  private onChangePerPage = (value: number) => {
    const { posListStore } = this.props;
    posListStore.setPerPage(value);
    setTimeout(() => {
      posListStore.setCurrentPage(1);
      posListStore.load_data();
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };
  private onChangeCurrentPage = (value: number) => {
    const { posListStore } = this.props;
    posListStore.setCurrentPage(value);
    setTimeout(() => {
      posListStore.load_data();
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };

  private deletePos = async (item: IPosModel) => {
    const { posListStore } = this.props;
    try {
      await item.deletePos();
      await posListStore.load_data();
    } catch (e) {
      posListStore.error.setErrorMessage(e);
      console.log(e);
    }
  };

  private navigationToPosDetailManagement = async (id: string) => {
    const { history } = this.props;
    history.push(`/pos/management/edit/${id}`);
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
export default withRouter(withTranslation()(PosTable));
