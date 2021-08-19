import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  Button,
  Checkbox,
  Form,
  Header,
  Icon,
  List,
  Modal,
  Segment,
  Table
} from "semantic-ui-react";
import { RequestTableMessage } from ".";
import { IAppModel } from "../../../../AppModel";
import {
  AlertMessage,
  DateInput,
  EmptyTableRow,
  MenuButton,
  SectionContainer,
  TableFooter
} from "../../../../components/common";
import { Loading } from "../../../../components/common/loading";
import { PermissionControl } from "../../../../components/permission";
import { DeleteModal, M106RequestValidate } from "../../../../modals";
import { date_display_CE_TO_BE } from "../../../../utils";
import { hasPermission } from "../../../../utils/render-by-permission";
import { IRequestListModel } from "../RequestListModel";
import { IRequestModel } from "../RequestModel";

interface IRequestTable extends WithTranslation, RouteComponentProps {
  requestlistStore: IRequestListModel;
  appStore?: IAppModel;
  documentStatusPage?: string;
}
@inject("appStore")
@observer
class RequestTable extends React.Component<IRequestTable> {
  public componentDidMount() {
    this.setCurrentDate();
  }
  public state = { openCommittee: false, openGenerateAgreement: false };
  public openCommittee = () => this.setState({ openCommittee: true });
  public openGenerateAgreement = () =>
    this.setState({ openGenerateAgreement: true });
  public closeCommittee = () => this.setState({ openCommittee: false });
  public closeGenerateAgreement = () =>
    this.setState({ openGenerateAgreement: false });

  public render() {
    const { t } = this.props;
    return (
      <SectionContainer
        id="searchTable"
        idLink="request-create-link"
        stretch
        fluid
        basic
        titleComponent={
          hasPermission("REQUEST.ONLINE.ACCESS") ?
            null
            :
            <MenuButton>{this.renderMultiActionButtons()}</MenuButton>
        }
        linkModalLabel={
          hasPermission("REQUEST.CREATE") || hasPermission("REQUEST.ONLINE.CREATE")
            ? t("module.loan.requestDetail.createRequest")
            : undefined
        }
        linkModalComponent={<M106RequestValidate />}
        iconName={hasPermission("REQUEST.CREATE") || hasPermission("REQUEST.ONLINE.CREATE") ? "plus circle" : undefined}
      >
        <AlertMessage
          messageobj={this.props.requestlistStore.alert}
          float={true}
          timeout={3000}
        />
        <Table striped size="small">
          {this.renderTableHeader()}
          {this.renderTableBody()}
          {this.renderTableFooter()}
        </Table>
      </SectionContainer>
    );
  }

  private renderTableHeader() {
    const { t, requestlistStore } = this.props;
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center">
            {
              hasPermission("REQUEST.ONLINE.ACCESS") ?
                null
                :
                <Checkbox
                  checked={requestlistStore.selected_checkbox}
                  onChange={(event, value) =>
                    requestlistStore.selected_all(value.checked || false)
                  }
                />
            }
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t("module.loan.requestDetail.requestOfNumber")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={4}>
            {t("module.loan.requestTable.organizationAcceptsRequest")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={1}>
            {t("module.loan.requestTable.category")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={3}>
            {t("module.loan.requestTable.nameBorrowerGroupName")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t("module.loan.requestDetail.dateRequest")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t("module.loan.requestTable.status")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2} />
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const { appStore } = this.props;
    const dataTable: IRequestModel[] = this.props.requestlistStore.list;
    return (
      <Table.Body>
        {dataTable.length > 0 ? (
          dataTable.map((data: IRequestModel, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell textAlign="center">
                  {
                    hasPermission("REQUEST.ONLINE.ACCESS") ?
                      null
                      :
                      <Checkbox
                        checked={data.isSelected}
                        onChange={(event, value) =>
                          data.setField({
                            fieldname: "isSelected",
                            value: value.checked
                          })
                        }
                      />
                  }
                </Table.Cell>
                <Table.Cell>{data.documentNumber}</Table.Cell>
                <Table.Cell>{data.organization.orgName}</Table.Cell>
                <Table.Cell singleLine>
                  {appStore!.enumItemLabel("loanType", data.requestType)}
                </Table.Cell>
                <Table.Cell>{data.name}</Table.Cell>
                <Table.Cell textAlign="center">
                  {date_display_CE_TO_BE(data.documentDate, true)}
                </Table.Cell>
                <Table.Cell>
                  {appStore!.enumItemLabel("requestStatus", data.status)}
                </Table.Cell>
                <Table.Cell>
                  <List horizontal verticalAlign="middle" style={styles.list}>
                    <PermissionControl
                      somePermission
                      codes={["REQUEST.VIEW", "REQUEST.ONLINE.VIEW", "DATA.ALL.EDIT"]}
                    >
                      <List.Item style={styles.listItem}>
                        <Icon
                          id="btn-icon-requesttable-eye"
                          circular
                          inverted
                          link
                          color="blue"
                          name="eye"
                          onClick={() =>
                            this.navigationToRequestViewPage(
                              data.id!,
                              data.requestType
                            )
                          }
                        />
                      </List.Item>
                    </PermissionControl>
                    {["DN", "CL", "DQF"].includes(data.status) &&
                      !hasPermission("DATA.ALL.EDIT") ? null : (
                      <PermissionControl
                        somePermission
                        codes={["REQUEST.EDIT", "REQUEST.ONLINE.EDIT", "DATA.ALL.EDIT"]}
                      >
                        <List.Item style={styles.listItem}>
                          <Icon
                            id="btn-icon-requesttable-edit"
                            circular
                            inverted
                            link
                            color="olive"
                            name="edit outline"
                            onClick={() =>
                              this.navigationToRequestEditPage(
                                data.id!,
                                data.requestType
                              )
                            }
                          />
                        </List.Item>
                      </PermissionControl>
                    )}

                    {["DF"].includes(data.status) || ["DFO"].includes(data.status) ? (
                      <PermissionControl codes={["REQUEST.DEL"]}>
                        <DeleteModal
                          trigger={
                            <List.Item style={styles.listLastItem}>
                              <Icon
                                id="btn-icon-requesttable-delete"
                                circular
                                inverted
                                link
                                color="red"
                                name="trash alternate outline"
                              />
                            </List.Item>
                          }
                          onConfirmDelete={() => this.deleteRequest(data)}
                        />
                      </PermissionControl>
                    ) : null}
                  </List>
                </Table.Cell>
              </Table.Row>
            );
          })
        ) : (
          <EmptyTableRow />
        )}
      </Table.Body>
    );
  }

  private renderTableFooter() {
    const { requestlistStore } = this.props;
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="10">
            <TableFooter
              currentPage={requestlistStore.currentPage}
              totalPages={requestlistStore.totalPages}
              total={requestlistStore.total}
              perPage={requestlistStore.perPage}
              onChangePerPage={this.onChangePerPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }
  private onChangePerPage = (value: number) => {
    const { requestlistStore } = this.props;
    requestlistStore.setPerPage(value);
    setTimeout(() => {
      requestlistStore.setCurrentPage(1);
      requestlistStore.load_data();
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };

  private setCurrentDate = () => {
    this.props.requestlistStore.setField({
      fieldname: "documentDate",
      value: new Date().toISOString().substring(0, 10)
    });
  };

  private onChangeCurrentPage = (value: number) => {
    const { requestlistStore } = this.props;
    requestlistStore.setCurrentPage(value);
    setTimeout(() => {
      requestlistStore.load_data();
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };

  private renderMultiActionButtons() {
    const { requestlistStore, t, documentStatusPage, appStore } = this.props;
    return (
      <React.Fragment>
        <PermissionControl codes={["REQUEST.REPORT.COMMITTEE"]}>
          <Modal
            open={this.state.openCommittee}
            onOpen={this.openCommittee}
            onClose={this.closeCommittee}
            trigger={
              <Button disabled={requestlistStore.statusMenu} color="teal">
                {t("module.loan.requestTable.createBoardConsider")}
              </Button>
            }
          >
            <Modal.Content>
              <Loading active={requestlistStore.loading} />
              <Segment basic style={styles.segment}>
                <Header textAlign={"center"} size="large">
                  {t("module.loan.requestDetail.createReviewFaculty")}
                </Header>
                <Form onSubmit={this.onClickCommitteeReport}>
                  <Form.Select
                    clearable
                    options={appStore!.enumItems("committee")}
                    placeholder={t("module.loan.requestDetail.selectCommittee")}
                    label={t("module.loan.requestDetail.board")}
                    fluid
                    width={16}
                    value={requestlistStore.committeeName}
                    onChange={(event: any, data: any) => {
                      requestlistStore.setField({
                        fieldname: "committeeName",
                        value: data.value
                      });
                    }}
                  />
                  <Form.Field
                    required
                    control={DateInput}
                    value={requestlistStore.meetingDate || undefined}
                    fieldName="meetingDate"
                    id={"request_table_meetingDate"}
                    onChangeInputField={this.onChangeInputField}
                    label={t("module.loan.requestDetail.meetingDate")}
                  />

                  <Form.Button fluid color="purple" type="submit">
                    {t("module.loan.requestDetail.createConsiderationSheet")}
                  </Form.Button>
                </Form>
              </Segment>
            </Modal.Content>
          </Modal>
        </PermissionControl>

        <PermissionControl codes={["REQUEST.GENERATE.AGREEMENT"]}>
          {requestlistStore.filterStatus === "AP3" &&
            documentStatusPage === "AP3" ? (
            <Modal
              open={this.state.openGenerateAgreement}
              onOpen={this.openGenerateAgreement}
              onClose={this.closeGenerateAgreement}
              trigger={
                <Button
                  disabled={requestlistStore.statusMenu}
                  style={styles.button}
                  color="purple"
                  onClick={this.setCurrentDate}
                >
                  {t("module.loan.requestTable.sendContract")}
                </Button>
              }
            >
              <Modal.Content>
                <Segment basic style={styles.segment}>
                  <Header textAlign={"center"} size="large">
                    {t(
                      "module.loan.requestDetail.listRequestsSubmittedContracted"
                    )}
                  </Header>
                  <Form onSubmit={this.onClickContract}>
                    <Form.Field
                      required
                      control={DateInput}
                      value={requestlistStore.documentDate || undefined}
                      fieldName="documentDate"
                      id={"request_table_documentDate"}
                      onChangeInputField={this.onChangeInputField}
                      label={t(
                        "module.loan.requestDetail.contractSpecifiedDate"
                      )}
                    />
                    {this.renderRequestCheckList()}
                    <Form.Button fluid color="purple" type="submit">
                      {t("module.loan.requestTable.sendContract")}
                    </Form.Button>
                  </Form>
                </Segment>
              </Modal.Content>
            </Modal>
          ) : null}
        </PermissionControl>
      </React.Fragment>
    );
  }

  private onClickContract = async () => {
    const { requestlistStore } = this.props;
    try {
      await requestlistStore.createContract();
      await requestlistStore.load_data();
    } catch (e) {
      console.log(e);
    } finally {
      this.closeGenerateAgreement();
    }
  };

  private onClickCommitteeReport = async () => {
    const { requestlistStore } = this.props;
    try {
      await requestlistStore.getRequestCommitteeReport();
    } catch (e) {
      console.log(e);
    } finally {
      this.closeCommittee();
    }
  };

  private renderRequestCheckList() {
    const { requestlistStore } = this.props;
    if (requestlistStore.request_list_check.length) {
      return (
        <div style={styles.divRequestTableMessage}>
          <RequestTableMessage
            requestList={requestlistStore.request_list_check}
          />
        </div>
      );
    } else {
      return null;
    }
  }

  private deleteRequest = async (item: IRequestModel) => {
    const { requestlistStore } = this.props;
    try {
      await item.delete_data();
      await requestlistStore.load_data();
    } catch (e) {
      console.log(e);
    }
  };

  private onChangeInputField = (fieldname: string, value: any) => {
    const { requestlistStore } = this.props;
    requestlistStore.setField({ fieldname, value });
  };
  private navigationToRequestEditPage = async (
    id: string,
    username: string
  ) => {
    const { history } = this.props;
    history.push(`/loan/request/edit/${id}/${username}`);
  };
  private navigationToRequestViewPage = async (
    id: string,
    username: string
  ) => {
    const { history } = this.props;
    history.push(`/loan/request/view/${id}/${username}`);
  };
}
const styles: any = {
  segment: {
    paddingTop: 28
  },
  button: {
    zIndex: 5,
    marginLeft: 10
  },
  divRequestTableMessage: {
    maxHeight: "60vh",
    overflow: "auto",
    marginBottom: 14
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

export default withRouter(withTranslation()(RequestTable));
