import { inject, observer } from "mobx-react";
import { clone } from "mobx-state-tree";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  Button,
  Checkbox,
  Grid,
  Icon,
  List,
  Segment,
  Table,
} from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import {
  EmptyTableRow,
  LinkRouter,
  TableFooter,
} from "../../../components/common";
import { ErrorModel } from "../../../components/common/error";
import { MessageModel } from "../../../components/common/message";
import { COLORS } from "../../../constants";
import {
  ConfirmModal,
  DeleteModal,
  DonationInfoAttachedFileModal,
  EnvelopsModal,
  OwnerModal,
  ReceiptModal,
  ThankyouLettersModal,
} from "../../../modals";
import { currency, date_display_CE_TO_BE } from "../../../utils/format-helper";
import { IAuthModel } from "../../auth/AuthModel";
import { connectPrinter, printReceipt } from "../../pos/Receipt";
import { IDonationAllowanceListModel } from "../DonationAllowanceListModel";
import { IDonationAllowanceModel } from "../DonationAllowanceModel";

interface IDonationElderlyLivingListTable
  extends WithTranslation,
    RouteComponentProps {
  donationAllowanceListStore: IDonationAllowanceListModel;
  appStore?: IAppModel;
  authStore?: IAuthModel;
}

@inject("appStore", "authStore")
@observer
class DonationAllowanceListTable extends React.Component<IDonationElderlyLivingListTable> {
  public state = { open: false };
  public open = () => this.setState({ open: true });
  public close = () => this.setState({ open: false });
  private alertMessageObj = MessageModel.create({});
  private errorObj = ErrorModel.create({});

  public render() {
    const { t } = this.props;
    return (
      <Grid id={"donationAllowanceListTable"}>
        <Grid.Row verticalAlign="middle">
          <Grid.Column
            floated="left"
            textAlign="left"
            mobile={8}
            tablet={10}
            computer={12}
          >
            {this.renderMenuTableHeader()}
          </Grid.Column>
          <Grid.Column
            floated="right"
            textAlign="right"
            mobile={8}
            tablet={6}
            computer={4}
          >
            <LinkRouter
              shade={5}
              size="large"
              path={"/donation/allowances/create"}
            >
              {t("module.donation.DonationAllowanceListTable.linkRouter")}
              <Icon
                size="large"
                link
                name={"plus circle"}
                className="primary"
                style={{ ...styles.icon }}
              />
            </LinkRouter>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Segment>
              <Table striped size="small">
                {this.renderTableHeader()}
                {this.renderTableBody()}
                {this.renderTableFooter()}
              </Table>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  private renderMenuTableHeader() {
    const { t, donationAllowanceListStore } = this.props;
    return (
      <>
        <DonationInfoAttachedFileModal
          donationAllowanceListStore={donationAllowanceListStore}
          trigger={
            <Button color="teal" style={styles.buttonItem}>
              {t("module.donation.DonationAllowanceListTable.menuItem1")}
            </Button>
          }
        />
        <Button
          style={styles.buttonItem}
          disabled={donationAllowanceListStore.statusMenu}
          onClick={this.printReceiptList}
          color="blue"
        >
          {t("module.donation.DonationAllowanceListTable.menuItem2")}
        </Button>
        <ThankyouLettersModal
          disabled={donationAllowanceListStore.statusMenu}
          trigger={
            <Button
              style={styles.buttonItem}
              disabled={donationAllowanceListStore.statusMenu}
              color="yellow"
            >
              {t("module.donation.DonationAllowanceListTable.menuItem3")}
            </Button>
          }
          onConfirm={donationAllowanceListStore.printThankyouLetters}
        />
        <EnvelopsModal
          disabled={donationAllowanceListStore.statusMenu}
          trigger={
            <Button
              style={styles.buttonItem}
              disabled={donationAllowanceListStore.statusMenu}
              color="pink"
            >
              {t("module.donation.DonationAllowanceListTable.menuItem4")}
            </Button>
          }
          onConfirm={donationAllowanceListStore.printEnvelops}
        />
        <OwnerModal
          disabled={donationAllowanceListStore.statusMenu}
          trigger={
            <Button
              style={styles.buttonItem}
              disabled={donationAllowanceListStore.statusMenu}
              color="orange"
            >
              {t("module.donation.DonationAllowanceListTable.printOwner")}
            </Button>
          }
          onConfirm={donationAllowanceListStore.printOwner}
        />
      </>
    );
  }

  private renderTableHeader() {
    const { t, donationAllowanceListStore } = this.props;
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center" width="1">
            <Checkbox
              checked={donationAllowanceListStore.selected_checkbox}
              onChange={(event, value) =>
                donationAllowanceListStore.selected_all(value.checked || false)
              }
            />
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.donation.DonationAllowanceListTable.headerCell1")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.donation.DonationAllowanceListTable.headerCell2")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.donation.DonationAllowanceListTable.headerCell3")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.donation.DonationAllowanceListTable.headerCell4")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.donation.DonationAllowanceListTable.headerCell5")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="1">
            {t("module.donation.DonationAllowanceListTable.headerCell6")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.donation.DonationAllowanceListTable.headerCell7")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="1">
            {t("module.donation.DonationAllowanceListTable.headerCell8")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="1" />
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const { t } = this.props;
    const dataTable: IDonationAllowanceModel[] = this.props
      .donationAllowanceListStore.list;
    return (
      <Table.Body>
        {dataTable.length > 0 ? (
          dataTable.map((data: IDonationAllowanceModel, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell textAlign="center">
                  <Checkbox
                    checked={data.isSelected}
                    onChange={(event, value) =>
                      data.setField({
                        fieldname: "isSelected",
                        value: value.checked,
                      })
                    }
                  />
                </Table.Cell>
                <Table.Cell>
                  {date_display_CE_TO_BE(data.donationDate, true)}
                </Table.Cell>
                <Table.Cell>{data.donator.idCardNo}</Table.Cell>
                <Table.Cell>{data.donator.fullname}</Table.Cell>
                <Table.Cell>{data.receiptOrganization}</Table.Cell>
                <Table.Cell>
                  {date_display_CE_TO_BE(data.receiptDate, true)}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {currency(data.paidAmount)}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {data.organization.orgCode}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {this.renderLinkPaymentReferenceNo(data)}
                </Table.Cell>
                <Table.Cell>
                  <List horizontal verticalAlign="middle" style={styles.list}>
                    {data.receipt.id ? null : (
                      <List.Item style={styles.listItem}>
                        <ConfirmModal
                          iconNameHeader="clipboard list"
                          title={t(
                            "module.donation.DonationAllowanceListTable.createReceipt"
                          )}
                          trigger={
                            <Icon
                              id="btn-icon-clipboard list"
                              circular
                              inverted
                              link
                              color="violet"
                              name="clipboard list"
                            />
                          }
                          onConfirm={() => this.createReceipt(data)}
                        />
                      </List.Item>
                    )}

                    <List.Item style={styles.listItem}>
                      <Icon
                        id="btn-icon-usertable-edit"
                        circular
                        inverted
                        link
                        color="olive"
                        name="edit outline"
                        onClick={() =>
                          this.navigationToDonationElderlyLivingDetailEditPage(
                            data.id,
                            data.posId || "-"
                          )
                        }
                      />
                    </List.Item>
                    {data.receipt.id ? null : (
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
                    )}
                  </List>
                </Table.Cell>
              </Table.Row>
            );
          })
        ) : (
          <EmptyTableRow colSpan={12} />
        )}
      </Table.Body>
    );
  }

  private renderLinkPaymentReferenceNo(data: IDonationAllowanceModel) {
    if (data.receipt.id && data.receipt.documentNumber) {
      return (
        <ReceiptModal
          receiptId={data.receipt.id || ""}
          receipt={data.receipt}
          trigger={<a style={styles.link}>{data.receipt.documentNumber}</a>}
        />
      );
    } else {
      return this.checkEmptyText(data.receipt.documentNumber);
    }
  }

  private navigationToDonationElderlyLivingDetailEditPage = async (
    id: string,
    refNo: string
  ) => {
    const { history } = this.props;
    history.push(`/donation/allowances/edit/${id}/${refNo}`);
  };
  private onAfterSubmit = async () => {
    const { donationAllowanceListStore } = this.props;
    try {
      await donationAllowanceListStore.load_data();
    } catch (e) {
      throw e;
    }
  };
  private onDeleteData = async (item: IDonationAllowanceModel) => {
    const { t } = this.props;
    try {
      await item.delete_data();
      await this.onAfterSubmit();
      this.alertMessageObj.setAlertMessage(
        t("module.donation.DonationAllowanceListTable.alertMessage1"),
        t("module.donation.DonationAllowanceListTable.alertMessage2")
      );
    } catch (e) {
      this.errorObj.setErrorMessage(e);
    }
  };

  private renderTableFooter() {
    const { donationAllowanceListStore } = this.props;
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="12">
            <TableFooter
              currentPage={donationAllowanceListStore.currentPage}
              totalPages={donationAllowanceListStore.totalPages}
              total={donationAllowanceListStore.total}
              perPage={donationAllowanceListStore.perPage}
              onChangePerPage={this.onChangePerPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }
  private onChangePerPage = (value: number) => {
    const { donationAllowanceListStore } = this.props;
    donationAllowanceListStore.setPerPage(value);
    setTimeout(() => {
      donationAllowanceListStore.setCurrentPage(1);
      donationAllowanceListStore.load_data();
      const elmnt = document.getElementById("donationAllowanceListTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };

  private onChangeCurrentPage = (value: number) => {
    const { donationAllowanceListStore } = this.props;
    donationAllowanceListStore.setCurrentPage(value);
    setTimeout(() => {
      donationAllowanceListStore.load_data();
      const elmnt = document.getElementById("donationAllowanceListTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };
  private checkEmptyText = (value: string) => {
    return value ? value : "-";
  };
  private createReceipt = async (data: IDonationAllowanceModel) => {
    const { t, donationAllowanceListStore } = this.props;
    try {
      await donationAllowanceListStore.setField({
        fieldname: "loading",
        value: true,
      });
      await data.createDonationAllowanceReceipts();
    } catch (error) {
      donationAllowanceListStore.error.setErrorMessage(error);
    } finally {
      await donationAllowanceListStore.setField({
        fieldname: "loading",
        value: false,
      });
    }
  };
  private printReceiptList = async () => {
    const { t, appStore, donationAllowanceListStore, authStore } = this.props;
    const list = donationAllowanceListStore.donation_list_is_selected;
    try {
      if (list && list.length) {
        await donationAllowanceListStore.setField({
          fieldname: "loading",
          value: true,
        });
        for (const item of list) {
          if (!item.receiptId) {
            await item.createDonationAllowanceReceipts();
          }
          await item.receipt.setField({
            fieldname: "organization",
            value: clone(item.organization),
          });
          if (!item.receipt.posShift.currentCashier.id) {
            await item.receipt.posShift.setField({
              fieldname: "currentCashier",
              value: clone(authStore!.userProfile),
            });
          }
          await item.pos.setField({
            fieldname: "lastestPosShift",
            value: clone(item.receipt.posShift),
          });
          await connectPrinter(item.pos, item.receipt);
          await printReceipt(item.receipt, item.pos, appStore, t);
        }
      }
    } catch (error) {
      donationAllowanceListStore.error.setField({
        fieldname: "tigger",
        value: true,
      });
      donationAllowanceListStore.error.setField({
        fieldname: "code",
        value: "",
      });
      donationAllowanceListStore.error.setField({
        fieldname: "title",
        value: "",
      });
      donationAllowanceListStore.error.setField({
        fieldname: "message",
        value: t("module.pos.posPayer.confirmPrinterError"),
      });
      donationAllowanceListStore.error.setField({
        fieldname: "technical_stack",
        value: "",
      });
    } finally {
      await donationAllowanceListStore.setField({
        fieldname: "loading",
        value: false,
      });
    }
  };
}

const styles: any = {
  segment: {
    paddingTop: 28,
  },
  button: {
    zIndex: 100,
  },
  divRequestTableMessage: {
    maxHeight: "60vh",
    overflow: "auto",
    marginBottom: 14,
  },
  list: {
    display: "flex",
    flexWrap: "wrap",
  },
  listItem: {
    marginLeft: 0,
    marginRight: 7,
  },
  listLastItem: {
    marginLeft: 0,
  },
  icon: {
    marginLeft: 8,
    marginRight: 0,
    textDecoration: "none",
    color: COLORS.blue,
  },
  link: {
    textDecoration: "underline",
    cursor: "pointer",
  },
  buttonItem: {
    marginTop: 7,
  },
};
export default withRouter(withTranslation()(DonationAllowanceListTable));
