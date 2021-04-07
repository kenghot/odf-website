import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Header, Icon, List, Table } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { EmptyTableRow, SectionContainer } from "../../../components/common";
import {
  NoPermissionMessage,
  PermissionControl
} from "../../../components/permission";
import { DeleteModal, M221DebtCollectionVisitFormModal } from "../../../modals";
import { date_display_CE_TO_BE } from "../../../utils";
import {
  hasPermission,
  hasPermissionMode
} from "../../../utils/render-by-permission";
import {
  IDebtCollectionModel,
  IDebtCollectionVisitModel
} from "../DebtCollectionModel";

interface IDebtCollectionVisitTable
  extends WithTranslation,
    RouteComponentProps {
  debtCollection: IDebtCollectionModel;
  editMode?: boolean;
  appStore?: IAppModel;
}
@inject("appStore")
@observer
class DebtCollectionVisitTable extends React.Component<
  IDebtCollectionVisitTable
> {
  public render() {
    const { debtCollection, editMode, t } = this.props;
    return (
      <React.Fragment>
        <SectionContainer
          id="searchTable"
          stretch
          fluid
          basic
          titleComponent={
            <Header
              size="medium"
              content={t(
                "module.debtCollection.debtCollectionVisitTable.visitingBorrowerGuarantor"
              )}
              subheader={t(
                "module.debtCollection.debtCollectionVisitTable.recordingVisitsTrackCalls"
              )}
            />
          }
          linkModalLabel={
            hasPermission("DEBTCOLLECTION.VISIT.CREATE") && editMode
              ? t(
                  "module.debtCollection.debtCollectionVisitTable.createVisitreport"
                )
              : ""
          }
          linkModalComponent={
            hasPermission("DEBTCOLLECTION.VISIT.CREATE") && editMode ? (
              <M221DebtCollectionVisitFormModal
                debtCollection={debtCollection}
                editMode={editMode}
              />
            ) : (
              undefined
            )
          }
          iconName={
            hasPermission("DEBTCOLLECTION.VISIT.CREATE") && editMode
              ? "plus circle"
              : undefined
          }
        >
          {hasPermissionMode(
            "DEBTCOLLECTION.VISIT.VIEW",
            "DEBTCOLLECTION.VISIT.EDIT",
            editMode
          ) ? (
            <Table striped size="small" structured>
              {this.renderTableHeader()}
              {this.renderTableBody()}
            </Table>
          ) : (
            <NoPermissionMessage />
          )}
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
            {t("module.debtCollection.debtCollectionVisitTable.time")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t("module.debtCollection.debtCollectionVisitTable.visitingDay")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t("module.debtCollection.debtCollectionVisitTable.destination")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t("module.debtCollection.debtCollectionVisitTable.foundNotfound")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={3}>
            {t("module.debtCollection.debtCollectionVisitTable.causeNotfound")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t(
              "module.debtCollection.debtCollectionVisitTable.reasonsForNonPayment"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t("module.debtCollection.debtCollectionVisitTable.guest")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2} />
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const { debtCollection, editMode, appStore } = this.props;
    const dataTable = debtCollection.visits;
    return (
      <Table.Body>
        {dataTable.length > 0 ? (
          dataTable.map((data: IDebtCollectionVisitModel, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                <Table.Cell textAlign="center">
                  {date_display_CE_TO_BE(data.visitDate, true)}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {appStore!.enumItemLabel("visitType", data.visitType)}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <Icon
                    name={data.isMeetTarget ? "check" : "x"}
                    color={data.isMeetTarget ? "green" : "red"}
                  />
                </Table.Cell>
                <Table.Cell>
                  {data.dismissReason && !data.isMeetTarget
                    ? data.dismissReason
                    : "-"}
                </Table.Cell>
                <Table.Cell>
                  {data.overdueReasons ? data.overdueReasons : "-"}
                </Table.Cell>

                <Table.Cell>
                  {data.visitorName ? data.visitorName : "-"}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <List horizontal verticalAlign="middle" style={styles.list}>
                    <List.Item style={styles.listItem}>
                      <Icon
                        circular
                        inverted
                        link
                        color="teal"
                        name="print"
                        onClick={() => this.printVisit(data)}
                      />
                    </List.Item>
                    <PermissionControl codes={["DEBTCOLLECTION.VISIT.VIEW"]}>
                      <M221DebtCollectionVisitFormModal
                        debtCollection={debtCollection}
                        visit={data}
                        trigger={
                          <List.Item style={styles.listItem}>
                            <Icon
                              circular
                              inverted
                              link
                              color="blue"
                              name="eye"
                            />
                          </List.Item>
                        }
                      />
                    </PermissionControl>

                    <PermissionControl codes={["DEBTCOLLECTION.VISIT.EDIT"]}>
                      {editMode ? (
                        <M221DebtCollectionVisitFormModal
                          debtCollection={debtCollection}
                          visit={data}
                          editMode={editMode}
                          trigger={
                            <List.Item style={styles.listItem}>
                              <Icon
                                circular
                                inverted
                                link
                                color="olive"
                                name="edit outline"
                              />
                            </List.Item>
                          }
                        />
                      ) : null}
                    </PermissionControl>

                    <PermissionControl codes={["DEBTCOLLECTION.VISIT.DEL"]}>
                      {editMode ? (
                        <DeleteModal
                          trigger={
                            <List.Item style={styles.listLastItem}>
                              <Icon
                                circular
                                inverted
                                link
                                color="red"
                                name="trash alternate outline"
                              />
                            </List.Item>
                          }
                          onConfirmDelete={() => this.deleteVisit(data)}
                        />
                      ) : null}
                    </PermissionControl>
                  </List>
                </Table.Cell>
              </Table.Row>
            );
          })
        ) : (
          <EmptyTableRow colSpan={8} />
        )}
      </Table.Body>
    );
  }

  private deleteVisit = async (data: IDebtCollectionVisitModel) => {
    const { debtCollection, t } = this.props;
    try {
      debtCollection.setField({ fieldname: "loading", value: true });
      await data.deleteVisit();
      await debtCollection.error.setField({
        fieldname: "tigger",
        value: false
      });
      await debtCollection.alert.setAlertMessage(
        "บันทึกสำเร็จค่ะ",
        "เอกสารถูกลบเรียบร้อยแล้ว"
      );
      await debtCollection.getDebtCollectionDetail(true);
    } catch (e) {
      await debtCollection.error.setErrorMessage(e);
    } finally {
      debtCollection.setField({ fieldname: "loading", value: false });
    }
  };

  private printVisit = async (data: IDebtCollectionVisitModel) => {
    const { debtCollection } = this.props;
    try {
      debtCollection.setField({ fieldname: "loading", value: true });
      await data.printVisit();
    } catch (e) {
      await debtCollection.error.setErrorMessage(e);
    } finally {
      debtCollection.setField({ fieldname: "loading", value: false });
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
  }
};

export default withRouter(withTranslation()(DebtCollectionVisitTable));
