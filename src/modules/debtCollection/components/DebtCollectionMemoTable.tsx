import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Header, Icon, List, Table,Button,Grid } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { EmptyTableRow, SectionContainer } from "../../../components/common";
import {
  NoPermissionMessage,
  PermissionControl
} from "../../../components/permission";
import { DeleteModal, M231MemoFormModal } from "../../../modals";
import { date_display_CE_TO_BE } from "../../../utils";
import {
  hasPermission,
  hasPermissionMode
} from "../../../utils/render-by-permission";
import {
  IDebtCollectionMemoModel,
  IDebtCollectionModel
} from "../DebtCollectionModel";

interface IDebtCollectionMemoTable
  extends WithTranslation,
    RouteComponentProps {
  debtCollection: IDebtCollectionModel;
  editMode?: boolean;
  appStore?: IAppModel;
}
@inject("appStore")
@observer
class DebtCollectionMemoTable extends React.Component<
  IDebtCollectionMemoTable
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
              content={t("module.debtCollection.debtCollectionMemoTable.memo")}
              subheader={t(
                "module.debtCollection.debtCollectionMemoTable.recordingWordsTracking"
              )}
            />
          }
          linkModalLabel={
            hasPermission("DEBTCOLLECTION.MEMO.CREATE") && editMode
              ? t("module.debtCollection.debtCollectionMemoTable.createMemo")
              : ""
          }
          linkModalComponent={
            hasPermission("DEBTCOLLECTION.MEMO.CREATE") && editMode ? (
              <M231MemoFormModal
                debtCollection={debtCollection}
                editMode={editMode}
              />
            ) : (
              undefined
            )
          }
          iconName={
            hasPermission("DEBTCOLLECTION.MEMO.CREATE") && editMode
              ? "plus circle"
              : undefined
          }
        >
           {hasPermissionMode(
            "DEBTCOLLECTION.MEMO.VIEW",
            "DEBTCOLLECTION.MEMO.EDIT",
            editMode
          ) ? 
          (
         
          <Grid>
          <Grid.Column floated='left' width={4}>
          <Button
            color="blue"
            fluid
            size='small'
            type="button"
            icon="print"
            content={t("modal.M231MemoFormModal.printMemoForm")}
            onClick={this.printFromMemo}
            style={styles.buttonTop}
          />
          </Grid.Column>
        </Grid>
          ) : (
            <NoPermissionMessage />
          )}
          {hasPermissionMode(
            "DEBTCOLLECTION.MEMO.VIEW",
            "DEBTCOLLECTION.MEMO.EDIT",
            editMode
          ) ? 
          (
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
            {t("module.debtCollection.debtCollectionMemoTable.time")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t("module.debtCollection.debtCollectionMemoTable.memoDay")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t("module.debtCollection.debtCollectionMemoTable.infoBy")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t(
              "module.debtCollection.debtCollectionMemoTable.personGaveWordswas"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t("module.debtCollection.debtCollectionMemoTable.surname")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={1}>
            {t("module.debtCollection.debtCollectionMemoTable.age")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t("module.debtCollection.debtCollectionMemoTable.phone")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t("module.debtCollection.debtCollectionMemoTable.recorderBy")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2} />
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const { debtCollection, editMode, appStore } = this.props;
    const dataTable = debtCollection.memos;
    return (
      <Table.Body>
        {dataTable.length > 0 ? (
          dataTable.map((data: IDebtCollectionMemoModel, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                <Table.Cell textAlign="center">
                  {date_display_CE_TO_BE(data.documentDate, true)}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {appStore!.enumItemLabel(
                    "memoInformerType",
                    data.memoInformer
                  )}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {appStore!.enumItemLabel(
                    "guarantorBorrowerRelationship",
                    data.memoInformerRelationship
                  )}
                </Table.Cell>
                <Table.Cell>{data.fullname ? data.fullname : "-"}</Table.Cell>
                <Table.Cell>{data.age ? data.age : "-"}</Table.Cell>
                <Table.Cell>
                  {data.mobilePhone ? data.mobilePhone : "-"}
                </Table.Cell>
                <Table.Cell>
                  {data.createdByName ? data.createdByName : "-"}
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
                        onClick={() => this.printMemo(data)}
                      />
                    </List.Item>
                    <PermissionControl codes={["DEBTCOLLECTION.MEMO.VIEW"]}>
                      <M231MemoFormModal
                        debtCollection={debtCollection}
                        memo={data}
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
                    <PermissionControl codes={["DEBTCOLLECTION.MEMO.EDIT"]}>
                      {editMode ? (
                        <M231MemoFormModal
                          debtCollection={debtCollection}
                          memo={data}
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
                    <PermissionControl codes={["DEBTCOLLECTION.MEMO.DEL"]}>
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
                          onConfirmDelete={() => this.deleteMemo(data)}
                        />
                      ) : null}
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

  private deleteMemo = async (data: IDebtCollectionMemoModel) => {
    const { debtCollection, t } = this.props;
    try {
      debtCollection.setField({ fieldname: "loading", value: true });
      await data.deleteMemo();
      await debtCollection.deleteMemoFromList(data);
      debtCollection.error.setField({ fieldname: "tigger", value: false });
      debtCollection.alert.setField({ fieldname: "tigger", value: true });
      debtCollection.alert.setField({
        fieldname: "title",
        value: t(
          "module.debtCollection.debtCollectionDemandLetterTable.successfullySaved"
        )
      });
      debtCollection.alert.setField({
        fieldname: "message",
        value: t(
          "module.debtCollection.debtCollectionDemandLetterTable.documentSavedSuccessfully"
        )
      });
    } catch (e) {
      debtCollection.error.setField({ fieldname: "tigger", value: true });
      debtCollection.error.setField({ fieldname: "code", value: e.code });
      debtCollection.error.setField({ fieldname: "title", value: e.name });
      debtCollection.error.setField({ fieldname: "message", value: e.message });
      debtCollection.error.setField({
        fieldname: "technical_stack",
        value: e.technical_stack
      });
    } finally {
      debtCollection.setField({ fieldname: "loading", value: false });
    }
  };

  private printMemo = async (data: IDebtCollectionMemoModel) => {
    const { debtCollection } = this.props;
    try {
      debtCollection.setField({ fieldname: "loading", value: true });
      await data.printMemo();
    } catch (e) {
      debtCollection.error.setField({ fieldname: "tigger", value: true });
      debtCollection.error.setField({ fieldname: "code", value: e.code });
      debtCollection.error.setField({ fieldname: "title", value: e.name });
      debtCollection.error.setField({ fieldname: "message", value: e.message });
      debtCollection.error.setField({
        fieldname: "technical_stack",
        value: e.technical_stack
      });
    } finally {
      debtCollection.setField({ fieldname: "loading", value: false });
    }
  };
  private printFromMemo = async () => {
    const { debtCollection } = this.props;
    try {
      await debtCollection.printFormMemo();
    } catch (e) {
      console.log(e);
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

export default withRouter(withTranslation()(DebtCollectionMemoTable));
