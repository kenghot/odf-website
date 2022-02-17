import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Header, Icon, List, Table } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { EmptyTableRow, SectionContainer } from "../../../components/common";
import { NoPermissionMessage } from "../../../components/permission";
import {
  DeleteModal,
  M211DebtCollectionLetterFormModal
} from "../../../modals";
import { date_display_CE_TO_BE } from "../../../utils";
import {
  IDebtCollectionLetterModel,
  IDebtCollectionModel
} from "../DebtCollectionModel";

interface IDebtCollectionLetterTable
  extends WithTranslation,
    RouteComponentProps {
  debtCollection: IDebtCollectionModel;
  letterList: IDebtCollectionLetterModel[];
  headerTitle: string;
  subHeaderTitle: string;
  letterType: string;
  linkModalLabel: string;
  editMode?: boolean;
  hidePrintButton?: boolean;
  appStore?: IAppModel;
  hasPermissionView: boolean;
  hasPermissionEdit: boolean;
  hasPermissionCreate: boolean;
  hasPermissionDelete?: boolean;
  createBtnLabel: string;
  permissionLabel1?: string;
  permissionLabel2?: string;
}
@inject("appStore")
@observer
class DebtCollectionLetterTable extends React.Component<
  IDebtCollectionLetterTable
> {
  public render() {
    const {
      headerTitle,
      subHeaderTitle,
      linkModalLabel,
      letterType,
      debtCollection,
      hidePrintButton,
      hasPermissionView,
      hasPermissionCreate,
      createBtnLabel,
      editMode
    } = this.props;
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
              content={headerTitle}
              subheader={subHeaderTitle}
            />
          }
          linkModalLabel={hasPermissionCreate && editMode ? linkModalLabel : ""}
          linkModalComponent={
            hasPermissionCreate && editMode ? (
              <M211DebtCollectionLetterFormModal
                createBtnLabel={createBtnLabel}
                hidePrintButton={hidePrintButton}
                headerTitle={headerTitle}
                letterType={letterType}
                debtCollection={debtCollection}
              />
            ) : (
              undefined
            )
          }
          iconName={hasPermissionCreate && editMode ? "plus circle" : undefined}
        >
          {hasPermissionView ? (
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
          <Table.HeaderCell textAlign="center" rowSpan="2" width={1}>
            {t("module.debtCollection.debtCollectionDemandLetterTable.time")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" rowSpan="2" width={2}>
            {t(
              "module.debtCollection.debtCollectionDemandLetterTable.documentNumber"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" rowSpan="2" width={2}>
            {t(
              "module.debtCollection.debtCollectionDemandLetterTable.dateMakingBook"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" rowSpan="2" width={3}>
            {t(
              "module.debtCollection.debtCollectionDemandLetterTable.dateNotificationSent"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" rowSpan="2" width={4}>
            {t(
              "module.debtCollection.debtCollectionDemandLetterTable.document"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" colSpan="2" width={4}>
            {t(
              "module.debtCollection.debtCollectionDemandLetterTable.resultRequestSubmission"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" rowSpan="2" width={2} />
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell textAlign="center">
            {t(
              "module.debtCollection.debtCollectionDemandLetterTable.toReceiver"
            )}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t(
              "module.debtCollection.debtCollectionDemandLetterTable.receivedPayment"
            )}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const {
      letterList,
      debtCollection,
      editMode,
      hidePrintButton,
      appStore,
      headerTitle,
      linkModalLabel,
      hasPermissionEdit,
      hasPermissionDelete
    } = this.props;

    const dataTable = letterList;
    return (
      <Table.Body>
        {dataTable.length > 0 ? (
          dataTable.map((data: IDebtCollectionLetterModel, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                <Table.Cell textAlign="center">
                  {data.documentNumber?data.documentNumber:"-"}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {date_display_CE_TO_BE(data.documentDate, true)}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {date_display_CE_TO_BE(data.postDate, true)}
                </Table.Cell>
                <Table.Cell>
                  {data.attachedFiles.map((item: any, i: number) => {
                    return (
                      <React.Fragment key={i}>
                        <a
                          href={`${process.env.REACT_APP_STATIC_ENDPOINT}/${item.file.path}`}
                          download
                          target="_blank"
                        >
                          {item.file.name || item.file.originalname}
                        </a>
                        <br />
                      </React.Fragment>
                    );
                  })}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {data.isSentBack === null ? (
                    "-"
                  ) : (
                    <React.Fragment>
                      <Icon
                        name={data.isSentBack ? "x" : "check"}
                        color={data.isSentBack ? "red" : "green"}
                      />
                      {data.isSentBack && data.sentBackReasonType !== 99 ? (
                        <React.Fragment>
                          <br />
                          {`(${appStore!.enumItemLabel(
                            "letterSentBackReasonType",
                            data.sentBackReasonType
                          )})`}
                        </React.Fragment>
                      ) : null}
                      {data.isSentBack && data.sentBackReasonType === 99 ? (
                        <React.Fragment>
                          <br />
                          {`(${data.sentBackReasonTypeDescription})`}
                        </React.Fragment>
                      ) : null}
                    </React.Fragment>
                  )}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {data.isCollectable === null ? (
                    "-"
                  ) : (
                    <React.Fragment>
                      <Icon
                        name={data.isCollectable ? "check" : "x"}
                        color={data.isCollectable ? "green" : "red"}
                      />
                      {data.isSentBack && data.sentBackReasonType !== 99 ? (
                        <React.Fragment>
                          <br />
                          <br />
                        </React.Fragment>
                      ) : null}
                      {data.isSentBack && data.sentBackReasonType === 99 ? (
                        <React.Fragment>
                          <br />
                          <br />
                        </React.Fragment>
                      ) : null}
                    </React.Fragment>
                  )}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <List horizontal verticalAlign="middle" style={styles.list}>
                    {hidePrintButton ? null : (
                      <List.Item style={styles.listItem}>
                        <Icon
                          circular
                          inverted
                          link
                          color="teal"
                          name="print"
                          onClick={() => this.printLetter(data)}
                        />
                      </List.Item>
                    )}
                    {hasPermissionEdit && editMode ? (
                      <M211DebtCollectionLetterFormModal
                        createBtnLabel={linkModalLabel}
                        hidePrintButton={hidePrintButton}
                        headerTitle={headerTitle}
                        debtCollection={debtCollection}
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
                        letter={data}
                      />
                    ) : null}
                    {hasPermissionDelete && editMode ? (
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
                        onConfirmDelete={() => this.deleteDemandLetter(data)}
                      />
                    ) : null}
                  </List>
                </Table.Cell>
              </Table.Row>
            );
          })
        ) : (
          <EmptyTableRow colSpan={7} />
        )}
      </Table.Body>
    );
  }

  private deleteDemandLetter = async (data: IDebtCollectionLetterModel) => {
    const { debtCollection, t } = this.props;
    try {
      debtCollection.setField({ fieldname: "loading", value: true });
      await data.deleteLetter();
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

  private printLetter = async (data: IDebtCollectionLetterModel) => {
    const { debtCollection } = this.props;
    try {
      debtCollection.setField({ fieldname: "loading", value: true });
      await data.printLetter();
    } catch (e) {
      debtCollection.error.setErrorMessage(e);
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

export default withRouter(withTranslation()(DebtCollectionLetterTable));
