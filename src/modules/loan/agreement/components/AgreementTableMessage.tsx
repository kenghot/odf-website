import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Table } from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import { EmptyTableRow, Link } from "../../../../components/common";
import {
  currency,
  date_display_CE_TO_BE
} from "../../../../utils/format-helper";
import { IVoucherListModel } from "../../../finance/voucher/VoucherListModel";
import { IAgreementModel } from "../AgreementModel";

interface IAgreementTableMessage extends WithTranslation, RouteComponentProps {
  agreementList: IAgreementModel[];
  searchVoucherListStore?: IVoucherListModel;
  appStore?: IAppModel;
  staus?: "success" | "failed";
}

@inject("appStore", "searchVoucherListStore")
@observer
class AgreementTableMessage extends React.Component<IAgreementTableMessage> {
  public render() {
    return (
      <Table striped size="small" style={styles.headerCell}>
        {this.renderTableHeader()}
        {this.renderTableBody()}
      </Table>
    );
  }

  private renderTableHeader() {
    const { t } = this.props;
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell
            textAlign="center"
            width={1}
            style={styles.headerCell}
          >
            {t("module.loan.agreementTable.contractNumber")}
          </Table.HeaderCell>
          <Table.HeaderCell
            textAlign="center"
            width={4}
            style={styles.headerCell}
          >
            {t("module.loan.agreementTable.organizationAcceptsRequest")}
          </Table.HeaderCell>
          <Table.HeaderCell
            textAlign="center"
            width={1}
            style={styles.headerCell}
          >
            {t("module.loan.agreementTable.category")}
          </Table.HeaderCell>
          <Table.HeaderCell
            textAlign="center"
            width={3}
            style={styles.headerCell}
          >
            {t("module.loan.agreementTable.nameBorrowerGroupName")}
          </Table.HeaderCell>
          <Table.HeaderCell
            textAlign="center"
            width={1}
            style={styles.headerCell}
          >
            {t("module.loan.agreementTable.contractDate")}
          </Table.HeaderCell>
          <Table.HeaderCell
            textAlign="center"
            width={1}
            style={styles.headerCell}
          >
            {t("module.loan.agreementDetail.contractEndDate")}
          </Table.HeaderCell>
          <Table.HeaderCell
            textAlign="center"
            width={1}
            style={styles.headerCell}
          >
            {t("module.loan.agreementTable.limit")}
          </Table.HeaderCell>
          <Table.HeaderCell
            textAlign="center"
            width={2}
            style={styles.headerCell}
          >
            {t("module.loan.agreementTable.status")}
          </Table.HeaderCell>
          {this.renderStatusHeader()}
        </Table.Row>
      </Table.Header>
    );
  }
  private renderStatusHeader() {
    const { staus, t } = this.props;
    switch (staus) {
      case "success":
        return (
          <Table.HeaderCell
            textAlign="center"
            width={2}
            style={styles.headerCell}
          >
            {t("module.loan.agreementTable.voucherNumber")}
          </Table.HeaderCell>
        );
      case "failed":
        return (
          <Table.HeaderCell
            textAlign="center"
            width={2}
            style={styles.headerCell}
          >
            {t("module.loan.agreementTable.note")}
          </Table.HeaderCell>
        );
      default:
        return null;
    }
  }
  private renderTableBody() {
    const { appStore, staus } = this.props;
    const dataTable: IAgreementModel[] = this.props.agreementList;
    return (
      <Table.Body>
        {dataTable.length > 0 ? (
          dataTable.map((data: IAgreementModel, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>{data.documentNumber}</Table.Cell>
                <Table.Cell>{data.organization.orgName}</Table.Cell>
                <Table.Cell>
                  {appStore!.enumItemLabel("loanType", data.agreementType)}
                </Table.Cell>
                <Table.Cell>{data.name}</Table.Cell>
                <Table.Cell textAlign="center" singleLine>
                  {date_display_CE_TO_BE(data.documentDate, true)}
                </Table.Cell>
                <Table.Cell textAlign="center" singleLine>
                  {date_display_CE_TO_BE(data.endDate, true)}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {currency(data.loanAmount)}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {appStore!.enumItemLabel("agreementStatus", data.status)}
                </Table.Cell>

                {staus ? (
                  <Table.Cell>
                    {staus === "success" ? (
                      <Link
                        shade={5}
                        onClick={() =>
                          this.navigationToVoucherListPage(
                            data.voucher.documentNumber
                          )
                        }
                      >
                        {data.voucher.documentNumber}
                      </Link>
                    ) : (
                      data.error.message
                    )}
                  </Table.Cell>
                ) : null}
              </Table.Row>
            );
          })
        ) : (
          <EmptyTableRow />
        )}
      </Table.Body>
    );
  }
  private navigationToVoucherListPage = async (documentNumber: string) => {
    const { history, searchVoucherListStore } = this.props;
    await searchVoucherListStore!.setField({
      fieldname: "filterDocumentNumber",
      value: documentNumber
    });
    await searchVoucherListStore!.onSeachVoucherList();
    history.push(`/finance/loan_payment`);
  };
}
const styles: any = {
  headerCell: {
    background: "transparent"
  }
};

export default withRouter(withTranslation()(AgreementTableMessage));
