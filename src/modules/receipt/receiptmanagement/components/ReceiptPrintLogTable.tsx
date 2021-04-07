import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Grid, Header, Segment, Table } from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import { EmptyTableRow } from "../../../../components/common";
import { dateTime_display_CE_TO_BE } from "../../../../utils";
import { IReceiptModel, IReceiptPrintLog } from "../../ReceiptModel";

interface IReceiptPrintLogTable extends WithTranslation {
  receipt: IReceiptModel;
  appStore?: IAppModel;
  notPaddedVery?: boolean;
  onReceiptPrint?: () => void;
}

@inject("appStore")
@observer
class ReceiptPrintLogTable extends React.Component<IReceiptPrintLogTable> {
  public render() {
    const { t, notPaddedVery, onReceiptPrint } = this.props;
    return (
      <Segment padded={notPaddedVery ? true : "very"}>
        <Header
          floated="left"
          size="medium"
          content={t("module.receipt.receiptPrintLogTable.content")}
          subheader={t("module.receipt.receiptPrintLogTable.subheader")}
          style={styles.header}
        />
        {onReceiptPrint ? (
          <Header size="medium" floated="right">
            <Button color="teal" type="button" onClick={onReceiptPrint}>
              {t("module.receipt.receiptPrintLogTable.recieptPrint")}
            </Button>
          </Header>
        ) : null}

        <Table striped size="small">
          {this.renderTableHeader()}
          {this.renderTableBody()}
        </Table>
      </Segment>
    );
  }
  private renderTableHeader() {
    const { t } = this.props;
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center">
            {t("module.receipt.receiptPrintLogTable.no")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t("module.receipt.receiptPrintLogTable.printedDatetime")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t("module.receipt.receiptPrintLogTable.manageByName")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t("module.receipt.receiptPrintLogTable.manageByPosition")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center">
            {t("module.receipt.receiptPrintLogTable.recieptPrintType")}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const { receipt, appStore } = this.props;
    return (
      <Table.Body>
        {receipt.receiptPrintLogs.length > 0 ? (
          receipt.receiptPrintLogs.map(
            (data: IReceiptPrintLog, index: number) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {dateTime_display_CE_TO_BE(data.printedDatetime)}
                  </Table.Cell>
                  <Table.Cell>{data.manageByName || "-"}</Table.Cell>
                  <Table.Cell>{data.manageByPosition || "-"}</Table.Cell>
                  <Table.Cell>
                    {appStore!.enumItemLabel(
                      "recieptPrintType",
                      data.recieptPrintType
                    )}
                  </Table.Cell>
                </Table.Row>
              );
            }
          )
        ) : (
          <EmptyTableRow colSpan={6} />
        )}
      </Table.Body>
    );
  }
}

const styles: any = {
  header: {
    marginBottom: 28,
  },
};

export default withTranslation()(ReceiptPrintLogTable);
