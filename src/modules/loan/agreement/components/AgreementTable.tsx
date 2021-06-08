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
import { AgreementTableMessage } from ".";
import { IAppModel } from "../../../../AppModel";
import {
  DateInput,
  EmptyTableRow,
  MenuButton,
  SectionContainer,
  TableFooter
} from "../../../../components/common";
import { PermissionControl } from "../../../../components/permission";
import { DeleteModal } from "../../../../modals";
import {
  currency,
  date_display_CE_TO_BE
} from "../../../../utils/format-helper";
import { hasPermission } from "../../../../utils/render-by-permission";
import { IAgreementListModel } from "../AgreementListModel";
import { IAgreementModel } from "../AgreementModel";

interface IAgreementTable extends WithTranslation, RouteComponentProps {
  agreementListStore: IAgreementListModel;
  appStore?: IAppModel;
  documentStatusPage?: string;
}

@inject("appStore")
@observer
class AgreementTable extends React.Component<IAgreementTable> {
  public state = { open: false };
  public open = () => this.setState({ open: true });
  public close = () => this.setState({ open: false });

  public render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        {hasPermission("AGREEMENT.CREATE") ? null : <br />}
        <SectionContainer
          id="searchTable"
          stretch
          fluid
          basic
          titleComponent={
            hasPermission("AGREEMENT.GENERATE.VOUCHER") ? (
              <MenuButton>{this.renderButtonCreateVoucher()}</MenuButton>
            ) : (
              undefined
            )
          }
          linkRouterLabel={
            hasPermission("AGREEMENT.CREATE")
              ? t("module.loan.agreementDetail.createAgreement")
              : undefined
          }
          linkRouterPathName={
            hasPermission("AGREEMENT.CREATE")
              ? "/loan/agreement/create"
              : undefined
          }
          iconName={
            hasPermission("AGREEMENT.CREATE") ? "plus circle" : undefined
          }
        >
          <Table striped size="small">
            {this.renderTableHeader()}
            {this.renderTableBody()}
            {this.renderTableFooter()}
          </Table>
        </SectionContainer>
      </React.Fragment>
    );
  }

  private renderTableHeader() {
    const { t, agreementListStore } = this.props;
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center">
            <Checkbox
              checked={agreementListStore.selected_checkbox}
              onChange={(event, value) =>
                agreementListStore.selected_all(value.checked || false)
              }
            />
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={1}>
            {t("module.loan.agreementTable.contractNumber")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={4}>
            {t("module.loan.agreementTable.organizationAcceptsRequest")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={1}>
            {t("module.loan.agreementTable.category")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={3}>
            {t("module.loan.agreementTable.nameBorrowerGroupName")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={1}>
            {t("module.loan.agreementTable.contractDate")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={1}>
            {t("module.loan.agreementDetail.contractEndDate")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={1}>
            {t("module.loan.agreementTable.limit")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            {t("module.loan.agreementTable.status")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2} />
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const { appStore } = this.props;
    const dataTable: IAgreementModel[] = this.props.agreementListStore.list;
    return (
      <Table.Body>
        {dataTable.length > 0 ? (
          dataTable.map((data: IAgreementModel, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell textAlign="center">
                  <Checkbox
                    checked={data.isSelected}
                    onChange={(event, value) =>
                      data.setField({
                        fieldname: "isSelected",
                        value: value.checked
                      })
                    }
                  />
                </Table.Cell>
                <Table.Cell>{data.documentNumber}</Table.Cell>
                <Table.Cell>{data.organization.orgName}</Table.Cell>
                <Table.Cell singleLine>
                  {appStore!.enumItemLabel("loanType", data.agreementType)}
                </Table.Cell>
                <Table.Cell>{data.name}</Table.Cell>
                <Table.Cell singleLine textAlign="center">
                  {date_display_CE_TO_BE(data.documentDate, true)}
                </Table.Cell>
                <Table.Cell singleLine textAlign="center">
                  {date_display_CE_TO_BE(data.endDate, true)}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {currency(data.loanAmount)}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {appStore!.enumItemLabel("agreementStatus", data.status)}
                </Table.Cell>
                <Table.Cell>
                  <List horizontal verticalAlign="middle" style={styles.list}>
                    <PermissionControl
                      somePermission
                      codes={["AGREEMENT.VIEW", "DATA.ALL.EDIT"]}
                    >
                      <List.Item style={styles.listItem}>
                        <Icon
                          circular
                          inverted
                          link
                          color="blue"
                          name="eye"
                          onClick={() =>
                            this.navigationToAgreementViewPage(
                              data.id,
                              data.documentNumber
                            )
                          }
                        />
                      </List.Item>
                    </PermissionControl>
                    <PermissionControl
                      somePermission
                      codes={["AGREEMENT.EDIT", "DATA.ALL.EDIT"]}
                    >
                      {["NW"].includes(data.status) ||
                      hasPermission("DATA.ALL.EDIT") ? (
                        <List.Item style={styles.listItem}>
                          <Icon
                            circular
                            inverted
                            link
                            color="olive"
                            name="edit outline"
                            onClick={() =>
                              this.navigationToAgreementEditPage(
                                data.id,
                                data.documentNumber
                              )
                            }
                          />
                        </List.Item>
                      ) : null}
                    </PermissionControl>
                    {["NW"].includes(data.status) ? (
                      <PermissionControl codes={["AGREEMENT.DEL"]}>
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
                          onConfirmDelete={() => this.deleteAgreement(data)}
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

  private renderButtonCreateVoucher() {
    const { agreementListStore, t, documentStatusPage } = this.props;
    return (
      <PermissionControl codes={["AGREEMENT.GENERATE.VOUCHER"]}>
        {agreementListStore.filterStatus === "NW" &&
        documentStatusPage === "NW" ? (
          <Modal
            open={this.state.open}
            onOpen={this.open}
            onClose={this.close}
            trigger={
              <Button
                disabled={agreementListStore.statusMenu}
                style={styles.button}
                color="purple"
                onClick={this.setCurrentDate}
              >
                {t("module.loan.agreementTable.createVoucher")}
              </Button>
            }
          >
            <Modal.Content>
              <Segment basic style={styles.segment}>
                <Header textAlign={"center"} size="large">
                  {t(
                    "module.loan.agreementDetail.listOfContractsThatRequirePaymentVouchers"
                  )}
                </Header>
                <Form>
                  <Form.Field
                    required
                    control={DateInput}
                    value={agreementListStore.documentDate || undefined}
                    fieldName="documentDate"
                    id={"documentDate"}
                    label={t(
                      "module.loan.agreementTable.paymentDueDateInvoice"
                    )}
                    onChangeInputField={this.onChangeInputField}
                  />
                  {this.renderAgreementCheckList()}
                  <Form.Button fluid color="purple" type="submit" onDoubleClick={this.onClickCreateVouchers}>
                    {t(
                      "module.loan.agreementDetail.submitVoucherSubstituteReceipt"
                    )}
                  </Form.Button>
                </Form>
              </Segment>
            </Modal.Content>
          </Modal>
        ) : null}
      </PermissionControl>
    );
  }

  private setCurrentDate = () => {
    this.props.agreementListStore.setField({
      fieldname: "documentDate",
      value: new Date().toISOString().substring(0, 10)
    });
  };
  private onClickCreateVouchers = async () => {
    const { agreementListStore } = this.props;
    try {
      await agreementListStore.createVouchersByIds();
      await agreementListStore.load_data();
    } catch (e) {
      console.log(e);
    } finally {
      this.close();
    }
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { agreementListStore } = this.props;
    agreementListStore.setField({ fieldname, value });
  };

  private renderTableFooter() {
    const { agreementListStore } = this.props;

    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="10">
            <TableFooter
              currentPage={agreementListStore.currentPage}
              totalPages={agreementListStore.totalPages}
              total={agreementListStore.total}
              perPage={agreementListStore.perPage}
              onChangePerPage={this.onChangePerPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }
  private onChangePerPage = (value: number) => {
    const { agreementListStore } = this.props;
    agreementListStore.setPerPage(value);
    setTimeout(() => {
      agreementListStore.setCurrentPage(1);
      agreementListStore.load_data();
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };
  private onChangeCurrentPage = (value: number) => {
    const { agreementListStore } = this.props;
    agreementListStore.setCurrentPage(value);
    setTimeout(() => {
      agreementListStore.load_data();
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };
  private navigationToAgreementEditPage = async (
    id: string,
    username: string
  ) => {
    const { history } = this.props;
    history.push(`/loan/agreement/edit/${id}/${username}`);
  };
  private navigationToAgreementViewPage = async (
    id: string,
    username: string
  ) => {
    const { history } = this.props;
    history.push(`/loan/agreement/view/${id}/${username}`);
  };
  private renderAgreementCheckList() {
    const { agreementListStore } = this.props;
    if (agreementListStore.agreement_list_check.length) {
      return (
        <div style={styles.divRequestTableMessage}>
          <AgreementTableMessage
            agreementList={agreementListStore.agreement_list_check}
          />
        </div>
      );
    } else {
      return null;
    }
  }
  private deleteAgreement = async (item: IAgreementModel) => {
    const { agreementListStore } = this.props;
    try {
      await item.delete_data();
      await agreementListStore.load_data();
    } catch (e) {
      console.log(e);
    }
  };
}
const styles: any = {
  segment: {
    paddingTop: 28
  },
  button: {
    zIndex: 2,
    paddingLeft: 10
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

export default withRouter(withTranslation()(AgreementTable));
