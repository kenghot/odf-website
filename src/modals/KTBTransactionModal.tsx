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
import { KTBListModel } from "../modules/ktb/KTBListModel";
import { IKTBModel } from "../modules/ktb/KTBModel";
import { dateTime_display_CE_TO_BE } from "../utils";
import { currency, date_display_CE_TO_BE } from "../utils/format-helper";

interface IKTBTransactionModal extends WithTranslation {
  trigger?: any;
  paymentReferenceNo: string;
  appStore?: IAppModel;
  status: string;
}

@inject("appStore")
@observer
class KTBTransactionModal extends React.Component<IKTBTransactionModal> {
  public state = { open: false };
  public KTBListTransaction = KTBListModel.create({});
  public close = () => {
    this.setState({ open: false });
    this.KTBListTransaction.resetAll();
  };
  public open = async () => {
    await this.setState({ open: true });
    const { paymentReferenceNo, status } = this.props;
    if (paymentReferenceNo) {
      this.KTBListTransaction.load_data(status, paymentReferenceNo);
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
          <Header textAlign="center">{"KTB Transaction"}</Header>
        </Modal.Header>
        <Modal.Content scrolling>
          <Loading active={this.KTBListTransaction.loading} />
          <ErrorMessage
            errorobj={this.KTBListTransaction.error}
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
            {t("modal.KTBTransactionModal.createdDate")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            {t("modal.KTBTransactionModal.type")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            comCode
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            prodCode
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            command
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            bankCode
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            bankRef
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            dateTime
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            effDate
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            channel
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            ref1
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            ref2
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            ref3
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            ref4
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            tranxId
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            amount
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            cusName
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            respCode
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            respMsg
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            balance
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            print1
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            print2
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            print3
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            print4
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            print5
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            print6
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            print7
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" singleLine>
            info
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const dataTable = this.KTBListTransaction.list;
    return (
      <Table.Body>
        {dataTable.length > 0 ? (
          dataTable.map((data: IKTBModel, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell singleLine>
                  {this.checkEmptyText(
                    dateTime_display_CE_TO_BE(data.createdDate, true)
                  )}
                </Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.type)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.comCode)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.prodCode)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.command)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.bankCode)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.bankRef)}</Table.Cell>
                <Table.Cell singleLine>
                  {this.checkEmptyText(data.dateTime)}
                </Table.Cell>
                <Table.Cell singleLine>
                  {this.checkEmptyText(
                    date_display_CE_TO_BE(data.effDate, true)
                  )}
                </Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.channel)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.ref1)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.ref2)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.ref3)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.ref4)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.tranxId)}</Table.Cell>
                {/* // */}
                <Table.Cell>{currency(data.amount, 2)}</Table.Cell>
                {/*  */}
                <Table.Cell singleLine>
                  {this.checkEmptyText(data.cusName)}
                </Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.respCode)}</Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.respMsg)}</Table.Cell>
                {/* // */}
                <Table.Cell>{currency(data.balance, 2)}</Table.Cell>
                {/*  */}
                <Table.Cell singleLine>
                  {this.checkEmptyText(data.print1)}
                </Table.Cell>
                <Table.Cell singleLine>
                  {this.checkEmptyText(data.print2)}
                </Table.Cell>
                <Table.Cell singleLine>
                  {this.checkEmptyText(data.print3)}
                </Table.Cell>
                <Table.Cell singleLine>
                  {this.checkEmptyText(data.print4)}
                </Table.Cell>
                <Table.Cell singleLine>
                  {this.checkEmptyText(data.print5)}
                </Table.Cell>
                <Table.Cell singleLine>
                  {this.checkEmptyText(data.print6)}
                </Table.Cell>
                <Table.Cell singleLine>
                  {this.checkEmptyText(data.print7)}
                </Table.Cell>
                <Table.Cell>{this.checkEmptyText(data.info)}</Table.Cell>
              </Table.Row>
            );
          })
        ) : (
          <EmptyTableRow colSpan={28} />
        )}
      </Table.Body>
    );
  }

  private checkEmptyText = (value: string | number) => {
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
export default withTranslation()(KTBTransactionModal);
