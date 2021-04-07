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
import { IAppModel } from "../../../../AppModel";
import {
  DateInput,
  EmptyTableRow,
  MenuButton,
  SectionContainer,
  TableFooter
} from "../../../../components/common";
import { PermissionControl } from "../../../../components/permission";
import { VoucherDetailModal } from "../../../../modals";
import {
  currency,
  date_display_CE_TO_BE
} from "../../../../utils/format-helper";
import { hasPermission } from "../../../../utils/render-by-permission";
import { IVoucherListModel } from "../VoucherListModel";
import { IVoucherModel, VoucherModel } from "../VoucherModel";

interface IVoucherListTable extends WithTranslation, RouteComponentProps {
  voucherListStore: IVoucherListModel;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class VoucherListTable extends React.Component<IVoucherListTable> {
  public state = { open: false };
  public open = () => this.setState({ open: true });
  public close = () => this.setState({ open: false });
  public render() {
    const { t, voucherListStore } = this.props;
    return (
      <SectionContainer
        stretch
        fluid
        basic
        id="voucherListTable"
        titleComponent={
          hasPermission("VOUCHER.GEN.KTB.PAYMENT") ? (
            <MenuButton>
              <Button
                onClick={(event, data) => voucherListStore.createKTBFile()}
                color="purple"
              >
                {t("module.finance.VoucherListTable.createKTBFile")}
              </Button>
              {/* {this.renderButtomCreateKTBFile()} */}
            </MenuButton>
          ) : (
            <div />
          )
        }
      >
        <Table striped size="small">
          {this.renderTableHeader()}
          {this.renderTableBody()}
          {this.renderTableFooter()}
        </Table>
      </SectionContainer>
    );
  }

  private renderTableHeader() {
    const { t, voucherListStore } = this.props;
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell rowSpan={2} textAlign="center">
            <Checkbox
              checked={voucherListStore.selected_checkbox}
              onChange={(event, value) =>
                voucherListStore.selected_all(value.checked || false)
              }
            />
          </Table.HeaderCell>
          <Table.HeaderCell rowSpan={2} textAlign="center" width={1}>
            {t("module.finance.VoucherListTable.voucherNumber")}
          </Table.HeaderCell>
          <Table.HeaderCell rowSpan={2} textAlign="center" width={2}>
            {t("module.finance.VoucherListTable.organizationCode")}
          </Table.HeaderCell>
          <Table.HeaderCell colSpan={2} textAlign="center" width={4}>
            {t("module.finance.VoucherListTable.reference")}
          </Table.HeaderCell>
          <Table.HeaderCell colSpan={3} textAlign="center" width={2}>
            {t("module.finance.VoucherListTable.duePayment")}
          </Table.HeaderCell>

          <Table.HeaderCell colSpan={2} textAlign="center" width={2}>
            {t("module.finance.VoucherListTable.payment")}
          </Table.HeaderCell>

          <Table.HeaderCell rowSpan={2} textAlign="center" width={1}>
            {t("module.finance.VoucherListTable.status")}
          </Table.HeaderCell>
          <Table.HeaderCell rowSpan={2} textAlign="center" width={2} />
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell textAlign="center">
            {t("module.finance.VoucherListTable.category")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t("module.finance.VoucherListTable.documentNumber")}
          </Table.HeaderCell>
          <Table.HeaderCell rowSpan={2} textAlign="center" width={2}>
            {t("module.finance.VoucherListTable.date")}
          </Table.HeaderCell>
          <Table.HeaderCell rowSpan={2} textAlign="center" width={2}>
            {t("module.finance.VoucherListTable.payee")}
          </Table.HeaderCell>
          <Table.HeaderCell rowSpan={2} textAlign="center" width={1}>
            {t("module.finance.VoucherListTable.number")}
          </Table.HeaderCell>
          <Table.HeaderCell rowSpan={2} textAlign="center" width={2}>
            {t("module.finance.VoucherListTable.date")}
          </Table.HeaderCell>
          <Table.HeaderCell rowSpan={2} textAlign="center" width={1}>
            {t("module.finance.VoucherListTable.number")}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const { appStore, t } = this.props;
    const dataTable: IVoucherModel[] = this.props.voucherListStore.list;
    return (
      <Table.Body>
        {dataTable.length > 0 ? (
          dataTable.map((data: IVoucherModel, index: number) => {
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
                <Table.Cell>{data.organization.orgCode}</Table.Cell>
                <Table.Cell>
                  {appStore!.enumItemLabel("voucherRefType", data.refType)}
                </Table.Cell>
                <Table.Cell>
                  {data.refDocument && data.refDocument.documentNumber
                    ? data.refDocument.documentNumber
                    : "-"}
                </Table.Cell>
                <Table.Cell>
                  {date_display_CE_TO_BE(data.dueDate, true)}
                </Table.Cell>
                <Table.Cell>{data.partnerName}</Table.Cell>
                <Table.Cell>{currency(data.totalAmount)}</Table.Cell>
                <Table.Cell>
                  {date_display_CE_TO_BE(data.paidDate, true)}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {currency(data.paidAmount)}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {appStore!.enumItemLabel("voucherStatus", data.status)}
                </Table.Cell>
                <Table.Cell>
                  <List horizontal verticalAlign="middle" style={styles.list}>
                    <List.Item style={styles.listItem}>
                      <Icon
                        circular
                        inverted
                        link
                        color="orange"
                        name="print"
                        onClick={() => this.onPrintReceipt(data.id)}
                      />
                    </List.Item>
                    <PermissionControl codes={["VOUCHER.VIEW"]}>
                      <List.Item style={styles.listItem}>
                        <VoucherDetailModal
                          viewMode
                          voucher={data}
                          trigger={
                            <Icon
                              id="btn-icon-view"
                              circular
                              inverted
                              link
                              color="blue"
                              name="eye"
                            />
                          }
                        />
                      </List.Item>
                    </PermissionControl>
                    <PermissionControl
                      somePermission
                      codes={["VOUCHER.EDIT", "DATA.ALL.EDIT"]}
                    >
                      {["WT"].includes(data.status) ||
                      hasPermission("DATA.ALL.EDIT") ? (
                        <List.Item style={styles.listItem}>
                          <VoucherDetailModal
                            voucher={data}
                            trigger={
                              <Icon
                                id="btn-icon-edit"
                                circular
                                inverted
                                link
                                color="olive"
                                name="edit outline"
                              />
                            }
                          />
                        </List.Item>
                      ) : null}
                    </PermissionControl>
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

  private renderButtomCreateKTBFile() {
    const { voucherListStore, t } = this.props;
    return (
      <Modal
        open={this.state.open}
        onOpen={this.open}
        onClose={this.close}
        trigger={
          <Button
            // disabled={voucherListStore.statusMenu}
            style={styles.button}
            color="purple"
            onClick={this.setCurrentDate}
          >
            {t("module.finance.VoucherListTable.createKTBFile")}
          </Button>
        }
        size={"tiny"}
      >
        <Modal.Content>
          <Segment basic style={styles.segment}>
            <Header textAlign={"center"} size="large">
              {t("module.loan.requestTable.contractDate")}
            </Header>
            <Form onSubmit={this.onClickCreateVouchers}>
              <Form.Field
                required
                control={DateInput}
                value={voucherListStore.documentDate || undefined}
                fieldName="documentDate"
                onChangeInputField={this.onChangeInputField}
              />
              {/* {this.renderRequestCheckList()} */}
              <Form.Button fluid color="purple" type="submit">
                {t("module.loan.requestTable.sendContract")}
              </Form.Button>
            </Form>
          </Segment>
        </Modal.Content>
      </Modal>
    );
  }

  private onPrintReceipt = async (id: string) => {
    const { voucherListStore } = this.props;
    try {
      if (id) {
        voucherListStore.setField({
          fieldname: "loading",
          value: true
        });
        const voucher = VoucherModel.create({});
        await voucher.setField({
          fieldname: "id",
          value: id
        });
        await voucher.printReceipt();
      }
    } catch (e) {
      voucherListStore.error.setField({ fieldname: "tigger", value: true });
      voucherListStore.error.setField({ fieldname: "code", value: e.code });
      voucherListStore.error.setField({ fieldname: "title", value: e.name });
      voucherListStore.error.setField({
        fieldname: "message",
        value: e.message
      });
      voucherListStore.error.setField({
        fieldname: "technical_stack",
        value: e.technical_stack
      });
      console.log(e);
    } finally {
      voucherListStore.setField({
        fieldname: "loading",
        value: false
      });
    }
  };
  private setCurrentDate = () => {
    this.props.voucherListStore.setField({
      fieldname: "documentDate",
      value: new Date().toISOString().substring(0, 10)
    });
  };
  private onClickCreateVouchers = async () => {
    const { voucherListStore } = this.props;
    try {
      await voucherListStore.createKTBFile();
    } catch (e) {
      console.log(e);
    } finally {
      this.close();
    }
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { voucherListStore } = this.props;
    voucherListStore.setField({ fieldname, value });
  };

  private renderTableFooter() {
    const { voucherListStore } = this.props;
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="12">
            <TableFooter
              currentPage={voucherListStore.currentPage}
              totalPages={voucherListStore.totalPages}
              total={voucherListStore.total}
              perPage={voucherListStore.perPage}
              onChangePerPage={this.onChangePerPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }
  private onChangePerPage = (value: number) => {
    const { voucherListStore } = this.props;
    voucherListStore.setPerPage(value);
    setTimeout(() => {
      voucherListStore.setCurrentPage(1);
      voucherListStore.onSeachVoucherList();
      const elmnt = document.getElementById("voucherListTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };

  private onChangeCurrentPage = (value: number) => {
    const { voucherListStore } = this.props;
    voucherListStore.setCurrentPage(value);
    setTimeout(() => {
      voucherListStore.onSeachVoucherList();
      const elmnt = document.getElementById("searchTable");
      if (elmnt) elmnt.scrollIntoView();
    }, 1500);
  };
}

const styles: any = {
  segment: {
    paddingTop: 28
  },
  button: {
    zIndex: 100
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
export default withRouter(withTranslation()(VoucherListTable));
