import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Icon, List, Table } from "semantic-ui-react";
import {
  EmptyTableRow,
  SectionContainer,
  TableFooter
} from "../../../../components/common";
import { PermissionControl } from "../../../../components/permission";
import { DeleteModal } from "../../../../modals";
import { hasPermission } from "../../../../utils/render-by-permission";
import { ISequenceListModel } from "../../sequence/SequenceListModel";
import { ISequenceModel } from "../../sequence/SequenceModel";

interface IDocumentTable extends WithTranslation, RouteComponentProps {
  sequenceListStore: ISequenceListModel;
}
@observer
class DocumentTable extends React.Component<IDocumentTable> {
  public render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        {hasPermission("DOC.CREATE") ? null : <br />}
        <SectionContainer
          idLink="document-create-link"
          stretch
          fluid
          basic
          linkRouterLabel={
            hasPermission("DOC.CREATE")
              ? t("module.admin.documentTable.addDocumentNumberManagement")
              : undefined
          }
          linkRouterPathName={
            hasPermission("DOC.CREATE")
              ? "/admin/doc_control/create"
              : undefined
          }
          iconName="plus circle"
        >
          <Table striped size="small" padded="very">
            {this.renderTableHeader()}
            {this.renderTableBody()}
            {this.renderTableFooter()}
          </Table>
        </SectionContainer>
      </React.Fragment>
    );
  }

  private renderTableHeader() {
    const { t } = this.props;
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={3}>
            {t("module.admin.documentTable.sequenceTypeName")}
          </Table.HeaderCell>
          <Table.HeaderCell width={2}>
            {t("module.admin.documentTable.shortcode")}
          </Table.HeaderCell>
          <Table.HeaderCell width={4}>
            {t("module.admin.documentTable.fiscalYear")}
          </Table.HeaderCell>
          <Table.HeaderCell width={4}>
            {t("module.admin.documentTable.latestDocumentNumber")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={3} />
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    const dataTable = this.props.sequenceListStore.list;
    return (
      <Table.Body>
        {this.props.sequenceListStore.list.length > 0 ? (
          dataTable.map((data: ISequenceModel, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>{data.sequenceTypeName}</Table.Cell>
                <Table.Cell>{data.prefixCode}</Table.Cell>
                <Table.Cell>{data.prefixYear}</Table.Cell>
                <Table.Cell>{data.runningNumber}</Table.Cell>
                <Table.Cell textAlign="right">
                  <List horizontal verticalAlign="middle">
                    <PermissionControl codes={["DOC.EDIT"]}>
                      <List.Item>
                        <Icon
                          id="btn-icon-documenttable-edit"
                          circular
                          inverted
                          link
                          color="olive"
                          name="edit outline"
                          onClick={() =>
                            this.navigationToUserFormPage(
                              data.id,
                              this.props.sequenceListStore.filterSequenceType
                            )
                          }
                        />
                      </List.Item>
                    </PermissionControl>
                    <PermissionControl codes={["DOC.DEL"]}>
                      <DeleteModal
                        trigger={
                          <List.Item>
                            <Icon
                              id="btn-icon-documenttable-delete"
                              circular
                              inverted
                              link
                              color="red"
                              name="trash alternate outline"
                            />
                          </List.Item>
                        }
                        onConfirmDelete={() => this.deleteSequence(data)}
                      />
                    </PermissionControl>
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
    const { sequenceListStore } = this.props;

    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="5">
            <TableFooter
              currentPage={sequenceListStore.currentPage}
              totalPages={sequenceListStore.totalPages}
              total={sequenceListStore.total}
              perPage={sequenceListStore.perPage}
              onChangePerPage={this.onChangePerPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  private onChangePerPage = (value: number) => {
    const { sequenceListStore } = this.props;
    sequenceListStore.setPerPage(value);
    setTimeout(() => {
      sequenceListStore.setCurrentPage(1);
      sequenceListStore.load_data();
    }, 1500);
  };

  private onChangeCurrentPage = (value: number) => {
    const { sequenceListStore } = this.props;
    sequenceListStore.setCurrentPage(value);
    setTimeout(() => {
      sequenceListStore.load_data();
    }, 1500);
  };

  private deleteSequence = async (item: ISequenceModel) => {
    const { sequenceListStore } = this.props;

    try {
      await item.setField({
        fieldname: "sequenceType",
        value: sequenceListStore.filterSequenceType
      });
      await item.deleteSequence();
      await sequenceListStore.load_data();
    } catch (e) {
      sequenceListStore.error.setField({ fieldname: "tigger", value: true });
      sequenceListStore.error.setField({ fieldname: "code", value: e.code });
      sequenceListStore.error.setField({ fieldname: "title", value: e.name });
      sequenceListStore.error.setField({
        fieldname: "message",
        value: e.message
      });
      sequenceListStore.error.setField({
        fieldname: "technical_stack",
        value: e.technical_stack
      });
      console.log(e);
    }
  };

  private navigationToUserFormPage = async (
    id: string,
    sequenceType: string
  ) => {
    const { history } = this.props;
    history.push(`/admin/doc_control/edit/${id}/${sequenceType}`);
  };
}

export default withRouter(withTranslation()(DocumentTable));
