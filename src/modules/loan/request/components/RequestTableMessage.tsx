import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Table } from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import { date_display_CE_TO_BE } from "../../../../utils";
import { IRequestModel } from "../RequestModel";

interface IRequestTableMessage extends WithTranslation {
  requestList: IRequestModel[];
  appStore?: IAppModel;
  staus?: "success" | "failed";
}
@inject("appStore")
@observer
class RequestTableMessage extends React.Component<IRequestTableMessage> {
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
          <Table.HeaderCell textAlign="center" style={styles.headerCell}>
            {t("module.loan.requestTable.petitionNumber")}
          </Table.HeaderCell>
          <Table.HeaderCell
            width="2"
            textAlign="center"
            style={styles.headerCell}
          >
            {t("module.loan.requestTable.organizationAcceptsRequest")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" style={styles.headerCell}>
            {t("module.loan.requestTable.category")}
          </Table.HeaderCell>
          <Table.HeaderCell
            width="2"
            textAlign="center"
            style={styles.headerCell}
          >
            {t("module.loan.requestTable.nameBorrowerGroupName")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" style={styles.headerCell}>
            {t("module.loan.requestTable.date")}
          </Table.HeaderCell>
          <Table.HeaderCell
            width="2"
            textAlign="center"
            style={styles.headerCell}
          >
            {t("module.loan.requestTable.status")}
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
        return null;
      case "failed":
        return (
          <Table.HeaderCell
            textAlign="center"
            width="2"
            style={styles.headerCell}
          >
            {t("module.loan.requestTable.note")}
          </Table.HeaderCell>
        );
      default:
        return null;
    }
  }
  private renderTableBody() {
    const { appStore, requestList, staus } = this.props;
    return (
      <Table.Body>
        {requestList.map((data: IRequestModel, index: number) => {
          return (
            <Table.Row key={index}>
              <Table.Cell>{data.documentNumber}</Table.Cell>
              <Table.Cell>{data.organization.orgName}</Table.Cell>
              <Table.Cell>
                {appStore!.enumItemLabel("loanType", data.requestType)}
              </Table.Cell>
              <Table.Cell>{data.name}</Table.Cell>
              <Table.Cell textAlign="center">
                {date_display_CE_TO_BE(data.documentDate, true)}
              </Table.Cell>
              <Table.Cell>
                {appStore!.enumItemLabel("requestStatus", data.status)}
              </Table.Cell>
              {staus && staus === "failed" ? (
                <Table.Cell>{data.error.message}</Table.Cell>
              ) : null}
            </Table.Row>
          );
        })}
      </Table.Body>
    );
  }
}
const styles: any = {
  headerCell: {
    background: "transparent"
  }
};

export default withTranslation()(RequestTableMessage);
