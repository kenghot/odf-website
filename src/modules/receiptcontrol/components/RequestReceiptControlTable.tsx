import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Icon, List, Segment, Table } from "semantic-ui-react";
import { RequestReceiptSearchForm } from ".";
import { IAppModel } from "../../../AppModel";
import {
  AlertMessage,
  EmptyTableRow,
  ErrorMessage,
  // Link,
  TableFooter
} from "../../../components/common";
import { ErrorModel } from "../../../components/common/error";
// import { IAttachedFileModel } from "../../../components/common/fileupload/AttachedFileModel";
import { MessageModel } from "../../../components/common/message";
import { DeleteModal, M382ReceiptControlApproval } from "../../../modals";
import { currency, date_display_CE_TO_BE } from "../../../utils/format-helper";
import { IPosListModel } from "../../pos/PosListModel";
import { IReceiptControlLogListModel } from "../ReceiptControlLogListModel";
import {
  IReceiptControlLogModel,
  receiveControlLogStatusEnum
} from "../ReceiptControlLogModel";

interface IRequestReceiptControlTable
  extends WithTranslation,
    RouteComponentProps {
  receiptControlLogListStore: IReceiptControlLogListModel;
  posesReceiptControlListStore: IPosListModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class RequestReceiptControlTable extends React.Component<
  IRequestReceiptControlTable
> {
  private errorObj = ErrorModel.create({});
  private alertMessageObj = MessageModel.create({});

  public render() {
    const { receiptControlLogListStore } = this.props;
    return (
      <Segment padded={"very"} loading={receiptControlLogListStore.loading}>
        <RequestReceiptSearchForm
          searchReceiptControlLogListStore={receiptControlLogListStore}
        />
        <Table
          striped
          size="small"
          id={"RequestReceiptControlTable"}
          style={styles.tableStyle}
        >
          {this.renderTableHeader()}
          {this.renderTableBody()}
          {this.renderTableFooter()}
        </Table>
        <AlertMessage
          messageobj={this.alertMessageObj}
          float={true}
          timeout={3000}
        />
        <ErrorMessage float timeout={5000} errorobj={this.errorObj} />
      </Segment>
    );
  }

  private renderTableHeader() {
    const { t } = this.props;
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.receipt.receiptControlTable.recieptDate")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.receipt.receiptControlTable.orgName")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.receipt.receiptControlTable.pos")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.receipt.receiptControlTable.withdrawal")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.receipt.receiptControlTable.approvers")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.receipt.receiptControlTable.requestQuantity")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.receipt.receiptControlTable.approveQuantity")}
          </Table.HeaderCell>
          {/* <Table.HeaderCell textAlign="center" width="2">
            {t("module.receipt.receiptControlTable.requestAttachedFile")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.receipt.receiptControlTable.approveAttachedhFile")}
          </Table.HeaderCell> */}
          <Table.HeaderCell textAlign="center" width="1">
            {t("module.receipt.receiptControlTable.status")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="1" />
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const { receiptControlLogListStore, appStore } = this.props;

    return (
      <Table.Body>
        {receiptControlLogListStore.list.length > 0 ? (
          receiptControlLogListStore.sort_by_createdDate.map(
            (data: IReceiptControlLogModel, index: number) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell textAlign="left" singleLine>
                    {date_display_CE_TO_BE(data.documentDate, false)}
                  </Table.Cell>
                  <Table.Cell textAlign="left">
                    {data.pos.organization.orgName || "-"}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {`${data.pos.posCode || "-"} ${
                      data.pos.posCode && data.pos.posName ? " : " : ""
                    }${data.pos.posName}`}
                  </Table.Cell>
                  <Table.Cell textAlign="left" singleLine>
                    {data.user.fullname || "-"}
                  </Table.Cell>
                  <Table.Cell textAlign="left" singleLine>
                    {data.onDutymanager.fullname || "-"}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {currency(data.requestQuantity)}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {currency(data.approveQuantity)}
                  </Table.Cell>
                  {/* <Table.Cell textAlign={"left"}>
                    {data.requestAttachedFiles.length > 0 ? (
                      <List bulleted>
                        {data.requestAttachedFiles.map(
                          (
                            attachedFile: IAttachedFileModel,
                            fileIndex: number
                          ) => {
                            const file: any = attachedFile.file;
                            return (
                              <List.Item
                                key={fileIndex}
                                style={styles.listLinkStyle}
                              >
                                <a
                                  href={`${process.env.REACT_APP_STATIC_ENDPOINT}/${file.path}`}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {`${file.name || file.originalname}`}
                                </a>
                              </List.Item>
                            );
                          }
                        )}
                      </List>
                    ) : (
                      t(
                        "module.receipt.receiptControlTable.noRequestAttachedFile"
                      )
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="left">
                    {data.approveAttachedFiles.length > 0 ? (
                      <List bulleted>
                        {data.approveAttachedFiles.map(
                          (
                            attachedFile: IAttachedFileModel,
                            fileIndex: number
                          ) => {
                            const file: any = attachedFile.file;
                            return (
                              <List.Item
                                key={fileIndex}
                                style={styles.listLinkStyle}
                              >
                                <a
                                  href={`${process.env.REACT_APP_STATIC_ENDPOINT}/${file.path}`}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {file.name || file.originalname}
                                </a>
                              </List.Item>
                            );
                          }
                        )}
                      </List>
                    ) : (
                      t(
                        "module.receipt.receiptControlTable.noApproveAttachedhFile"
                      )
                    )}
                  </Table.Cell> */}
                  <Table.Cell textAlign="center">
                    {appStore!.enumItemLabel(
                      "receiptControlLogStatus",
                      data.status
                    ) || "-"}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <List horizontal verticalAlign="middle" style={styles.list}>
                      {data.status !== receiveControlLogStatusEnum.waiting ? (
                        <List.Item style={styles.listItem}>
                          <M382ReceiptControlApproval
                            receiptControlLog={data}
                            onAfterSubmit={this.onAfterSubmit}
                            trigger={
                              <Icon
                                circular
                                inverted
                                link
                                color="blue"
                                name="eye"
                              />
                            }
                            viewMode
                          />
                        </List.Item>
                      ) : null}
                      {data.status === receiveControlLogStatusEnum.waiting ? (
                        <List.Item style={styles.listItem}>
                          <M382ReceiptControlApproval
                            receiptControlLog={data}
                            onAfterSubmit={this.onAfterSubmit}
                            trigger={
                              <Icon
                                circular
                                inverted
                                link
                                color="violet"
                                name="check circle"
                              />
                            }
                          />
                        </List.Item>
                      ) : null}
                      {data.status === receiveControlLogStatusEnum.waiting ? (
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
          <EmptyTableRow colSpan={9} />
        )}
      </Table.Body>
    );
  }

  private renderTableFooter() {
    const { receiptControlLogListStore } = this.props;
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="9">
            <TableFooter
              currentPage={receiptControlLogListStore.currentPage}
              totalPages={receiptControlLogListStore.totalPages}
              total={receiptControlLogListStore.total}
              perPage={receiptControlLogListStore.perPage}
              onChangePerPage={this.onChangePerPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  private onChangePerPage = (value: number) => {
    const { receiptControlLogListStore } = this.props;
    receiptControlLogListStore.setPerPage(value);
    setTimeout(() => {
      receiptControlLogListStore.setCurrentPage(1);
      receiptControlLogListStore.load_data();
      const elmnt = document.getElementById("RequestReceiptControlTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };

  private onChangeCurrentPage = (value: number) => {
    const { receiptControlLogListStore } = this.props;
    receiptControlLogListStore.setCurrentPage(value);
    setTimeout(() => {
      receiptControlLogListStore.load_data();
      const elmnt = document.getElementById("RequestReceiptControlTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };

  private onDeleteData = async (receiptControlLog: IReceiptControlLogModel) => {
    try {
      await receiptControlLog.delete_data();
      await this.onAfterSubmit();
      this.alertMessageObj.setAlertMessage(
        "บันทึกสำเร็จค่ะ",
        "ลบรายการเบิกจ่ายใบเสร็จเรียบร้อยแล้ว"
      );
    } catch (e) {
      this.errorObj.setErrorMessage(e);
    }
  };

  private onAfterSubmit = async () => {
    const {
      receiptControlLogListStore,
      posesReceiptControlListStore
    } = this.props;
    try {
      await Promise.all([
        receiptControlLogListStore.load_data(),
        posesReceiptControlListStore.load_poses_receipt_control_data()
      ]);
    } catch (e) {
      throw e;
    }
  };
}
const styles: any = {
  tableStyle: {
    marginTop: 25,
    fontSize: ".8em"
  },
  list: {
    display: "flex",
    flexWrap: "wrap"
  },
  listItem: {
    marginLeft: 0,
    marginRight: 7
  },
  header: {
    marginBottom: 28
  },
  link: {
    cursor: "pointer"
  },
  listLinkStyle: {
    wordBreak: "break-all"
  }
};
export default withRouter(withTranslation()(RequestReceiptControlTable));
