import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Header, Modal, Table } from "semantic-ui-react";
import { IAppModel } from "../AppModel";
import {
  EmptyTableRow,
  ErrorMessage,
  SectionContainer
} from "../components/common";
import { Loading } from "../components/common/loading";
import { CounterServiceListModel } from "../modules/counterService/CounterServiceListModel";
import { ICounterServiceModel } from "../modules/counterService/CounterServiceModel";
import { dateTime_display_CE_TO_BE } from "../utils";

interface ICounterServiceTransactionModal extends WithTranslation {
  trigger?: any;
  paymentReferenceNo: string;
  status: string;
  appStore?: IAppModel;
}

@inject("appStore")
@observer
class CounterServiceTransactionModal extends React.Component<
  ICounterServiceTransactionModal
> {
  public state = { open: false };
  public counterServiceList = CounterServiceListModel.create({});
  public close = () => {
    this.setState({ open: false });
    this.counterServiceList.resetAll();
  };
  public open = async () => {
    await this.setState({ open: true });
    const { paymentReferenceNo, status } = this.props;
    if (paymentReferenceNo && status) {
      this.counterServiceList.load_data(status, paymentReferenceNo);
    }
  };
  public render() {
    const { trigger } = this.props;
    const { open } = this.state;
    return (
      <Modal
        trigger={trigger}
        onOpen={this.open}
        open={open}
        closeIcon
        onClose={this.close}
        size={"fullscreen"}
        className={"no-action"}
      >
        <Modal.Header>
          <Header textAlign="center">{"Counter Service Transaction"}</Header>
        </Modal.Header>
        <Modal.Content scrolling>
          <Loading active={this.counterServiceList.loading} />
          <ErrorMessage
            errorobj={this.counterServiceList.error}
            float={true}
            timeout={10000}
          />
          <SectionContainer id="searchTable" stretch fluid basic>
            <div style={styles.containerTable}>
              <Table striped size="small" style={styles.table}>
                {this.renderTableHeader()}
                {this.renderTableBody()}
              </Table>
            </div>
          </SectionContainer>
        </Modal.Content>
      </Modal>
    );
  }

  private renderTableHeader() {
    const { t } = this.props;
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center" singleLine>
            {t("modal.AccountReceivableTransactionModal.createdDate")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            {t("modal.AccountReceivableTransactionModal.type")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            {"Operation"}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            TX_ID
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            LOG_ID
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            VENDOR_ID
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            SERVICE_ID
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            METHOD
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            COUNTER_NO
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            TERM_NO
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            POS_TAX_ID
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            SERVICE_RUN_NO
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            RECORD_STATUS
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            CLIENT_SERVICE_RUNNO
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            AMOUNT_RECEIVED
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            VAT_AMOUNT
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            BILL_TYPE
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            REFERENCE_1
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            REFERENCE_2
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            REFERENCE_3
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            REFERENCE_4
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            CUSTOMER_NAME
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            CUSTOMER_ADDR_1
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            CUSTOMER_ADDR_2
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            CUSTOMER_ADDR_3
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            CUSTOMER_TEL_NO
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            ZONE
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            R_SERVICE_RUNNO
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            CANCEL_OPERATING
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            OPERATE_BY_STAFF
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            SYSTEM_DATE_TIME
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            SUCCESS
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            CODE
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            DESC
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            RETURN_1
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            RETURN_2
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            RETURN_3
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            PRINT_SLIP
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const dataTable = this.counterServiceList.list;
    return (
      <Table.Body>
        {dataTable.length > 0 ? (
          dataTable.map((data: ICounterServiceModel, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell singleLine>
                  {this.checkEmptyText(
                    dateTime_display_CE_TO_BE(data.createdDate, true)
                  )}
                </Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.type)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.csMethod)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.TX_ID)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.LOG_ID)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.VENDOR_ID)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.SERVICE_ID)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.METHOD)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.COUNTER_NO)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.TERM_NO)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.POS_TAX_ID)}</Table.Cell>
                <Table.Cell>
                  {this.checkEmptyText(data.SERVICE_RUN_NO)}
                </Table.Cell>
                <Table.Cell>
                  {this.checkEmptyText(data.RECORD_STATUS)}
                </Table.Cell>
                <Table.Cell>
                  {this.checkEmptyText(data.CLIENT_SERVICE_RUNNO)}
                </Table.Cell>
                <Table.Cell>
                  {this.checkEmptyText(data.AMOUNT_RECEIVED)}
                </Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.VAT_AMOUNT)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.BILL_TYPE)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.REFERENCE_1)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.REFERENCE_2)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.REFERENCE_3)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.REFERENCE_4)}</Table.Cell>
                <Table.Cell>
                  {this.checkEmptyText(data.CUSTOMER_NAME)}
                </Table.Cell>
                <Table.Cell>
                  {this.checkEmptyText(data.CUSTOMER_ADDR_1)}
                </Table.Cell>
                <Table.Cell>
                  {this.checkEmptyText(data.CUSTOMER_ADDR_2)}
                </Table.Cell>
                <Table.Cell>
                  {this.checkEmptyText(data.CUSTOMER_ADDR_3)}
                </Table.Cell>
                <Table.Cell>
                  {this.checkEmptyText(data.CUSTOMER_TEL_NO)}
                </Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.ZONE)}</Table.Cell>
                <Table.Cell>
                  {this.checkEmptyText(data.R_SERVICE_RUNNO)}
                </Table.Cell>
                <Table.Cell>
                  {this.checkEmptyText(data.CANCEL_OPERATING)}
                </Table.Cell>
                <Table.Cell>
                  {this.checkEmptyText(data.OPERATE_BY_STAFF)}
                </Table.Cell>
                <Table.Cell>
                  {this.checkEmptyText(data.SYSTEM_DATE_TIME)}
                </Table.Cell>
                <Table.Cell>
                  {this.checkEmptyText(
                    data.SUCCESS === null || data.SUCCESS === undefined
                      ? "-"
                      : data.SUCCESS.toString()
                  )}
                </Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.CODE)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.DESC)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.RETURN1)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.RETURN2)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.RETURN3)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.PRINT_SLIP)}</Table.Cell>
              </Table.Row>
            );
          })
        ) : (
          <EmptyTableRow colSpan={38} />
        )}
      </Table.Body>
    );
  }

  private checkEmptyText = (value: string) => {
    return value ? value : "-";
  };
}
const styles: any = {
  containerTable: {
    overflowX: "auto"
  },
  table: {
    fontSize: ".7em"
  }
};
export default withTranslation()(CounterServiceTransactionModal);
