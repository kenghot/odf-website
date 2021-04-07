import { inject, observer } from "mobx-react";
import { clone } from "mobx-state-tree";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
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
import { EmptyTableRow, TableFooter } from "../../../components/common";
import { COLORS, FILES_PATH } from "../../../constants";
import {
  EnvelopsModal,
  ReceiptModal,
  ThankyouLettersModal,
} from "../../../modals";
import { currency, date_display_CE_TO_BE } from "../../../utils/format-helper";
import { IAuthModel } from "../../auth/AuthModel";
import { connectPrinter, printReceipt } from "../../pos/Receipt";
import { IDonationDirectListModel } from "../DonationDirectListModel";
import { IDonationDirectModel } from "../DonationDirectModel";

interface IDonationOlderFundListTable
  extends WithTranslation,
    RouteComponentProps {
  donationDirectListStore: IDonationDirectListModel;
  appStore?: IAppModel;
  authStore?: IAuthModel;
}

@inject("appStore", "authStore")
@observer
class DonationDirectListTable extends React.Component<IDonationOlderFundListTable> {
  public state = { open: false };
  public open = () => this.setState({ open: true });
  public close = () => this.setState({ open: false });

  public render() {
    return (
      <Grid id={"donationDirectListTable"}>
        <Grid.Row verticalAlign="middle">
          <Grid.Column floated="left" textAlign="left">
            {this.renderMenuTableHeader()}
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
    const { t, donationDirectListStore } = this.props;
    return (
      <>
        <Button
          disabled={donationDirectListStore.statusMenu}
          onClick={donationDirectListStore.generateEDonation}
          style={styles.buttonItem}
          color="teal"
        >
          {t("module.donation.DonationDirectListTable.menuItem1")}
        </Button>
        <Button
          style={styles.buttonItem}
          disabled={donationDirectListStore.statusMenu}
          onClick={this.printReceiptList}
          color="blue"
        >
          {t("module.donation.DonationAllowanceListTable.menuItem2")}
        </Button>
        <ThankyouLettersModal
          disabled={donationDirectListStore.statusMenu}
          trigger={
            <Button
              style={styles.buttonItem}
              disabled={donationDirectListStore.statusMenu}
              color="yellow"
            >
              {t("module.donation.DonationAllowanceListTable.menuItem3")}
            </Button>
          }
          onConfirm={donationDirectListStore.printThankyouLetters}
        />
        <EnvelopsModal
          disabled={donationDirectListStore.statusMenu}
          trigger={
            <Button
              style={styles.buttonItem}
              disabled={donationDirectListStore.statusMenu}
              color="pink"
            >
              {t("module.donation.DonationAllowanceListTable.menuItem4")}
            </Button>
          }
          onConfirm={donationDirectListStore.printEnvelops}
        />
      </>
    );
  }

  private renderTableHeader() {
    const { t, donationDirectListStore } = this.props;
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center" width="1">
            <Checkbox
              checked={donationDirectListStore.selected_checkbox}
              onChange={(event, value) =>
                donationDirectListStore.selected_all(value.checked || false)
              }
            />
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.donation.DonationDirectListTable.headerCell1")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.donation.DonationAllowanceListTable.headerCell2")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.donation.DonationAllowanceListTable.headerCell3")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="3">
            {t("module.donation.DonationDirectListTable.headerCell2")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.donation.DonationAllowanceListTable.headerCell6")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width="2">
            {t("module.donation.DonationDirectListTable.headerCell3")}
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
    const dataTable: IDonationDirectModel[] = this.props.donationDirectListStore
      .list;
    return (
      <Table.Body>
        {dataTable.length > 0 ? (
          dataTable.map((data: IDonationDirectModel, index: number) => {
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
                  {date_display_CE_TO_BE(data.receiptDate, true)}
                </Table.Cell>
                <Table.Cell>
                  {this.checkEmptyText(data.receipt.clientTaxNumber)}
                </Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.donatorName)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.name)}</Table.Cell>
                <Table.Cell textAlign="right">
                  {currency(data.paidAmount)}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {this.checkEmptyText(data.organization.orgCode)}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {this.renderLinkPaymentReferenceNo(data)}
                </Table.Cell>
                <Table.Cell>
                  <List horizontal verticalAlign="middle" style={styles.list}>
                    <List.Item style={styles.listItem}>
                      <Icon
                        id="btn-icon-usertable-edit"
                        circular
                        inverted
                        link
                        color="olive"
                        name="edit outline"
                        onClick={() =>
                          this.navigationToDonationDirectDetailEditPage(data.id)
                        }
                      />
                    </List.Item>
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

  private navigationToDonationDirectDetailEditPage = async (id: string) => {
    const { history } = this.props;
    history.push(`/donation/directs/edit/${id}`);
  };

  private renderLinkPaymentReferenceNo(data: IDonationDirectModel) {
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

  private renderTableFooter() {
    const { donationDirectListStore } = this.props;
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="12">
            <TableFooter
              currentPage={donationDirectListStore.currentPage}
              totalPages={donationDirectListStore.totalPages}
              total={donationDirectListStore.total}
              perPage={donationDirectListStore.perPage}
              onChangePerPage={this.onChangePerPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  private onChangePerPage = (value: number) => {
    const { donationDirectListStore } = this.props;
    donationDirectListStore.setPerPage(value);
    setTimeout(() => {
      donationDirectListStore.setCurrentPage(1);
      donationDirectListStore.load_data();
      const elmnt = document.getElementById("donationDirectListTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };

  private onChangeCurrentPage = (value: number) => {
    const { donationDirectListStore } = this.props;
    donationDirectListStore.setCurrentPage(value);
    setTimeout(() => {
      donationDirectListStore.load_data();
      const elmnt = document.getElementById("donationDirectListTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };

  private checkEmptyText = (value: string) => {
    return value ? value : "-";
  };

  private printReceiptList = async () => {
    const { t, appStore, donationDirectListStore, authStore } = this.props;
    const list = donationDirectListStore.donation_list_is_selected;

    try {
      if (list && list.length) {
        donationDirectListStore.setField({
          fieldname: "loading",
          value: true,
        });
        for (const item of list) {
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
          await item.receipt.pos.setField({
            fieldname: "lastestPosShift",
            value: clone(item.receipt.posShift),
          });
          await connectPrinter(item.receipt.pos, item.receipt);
          await printReceipt(item.receipt, item.receipt.pos, appStore, t);
        }
      }
    } catch (error) {
      donationDirectListStore.error.setField({
        fieldname: "tigger",
        value: true,
      });
      donationDirectListStore.error.setField({
        fieldname: "code",
        value: "",
      });
      donationDirectListStore.error.setField({
        fieldname: "title",
        value: "",
      });
      donationDirectListStore.error.setField({
        fieldname: "message",
        value: t("module.pos.posPayer.confirmPrinterError"),
      });
      donationDirectListStore.error.setField({
        fieldname: "technical_stack",
        value: "",
      });
      console.log(error);
    } finally {
      donationDirectListStore.setField({
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
export default withRouter(withTranslation()(DonationDirectListTable));
