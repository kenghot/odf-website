import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Message, Table } from "semantic-ui-react";

interface IEmptyTableRow extends WithTranslation {
  header?: string;
  content?: string;
  colSpan?: number;
  style?: any;
}

class EmptyTableRow extends React.Component<IEmptyTableRow> {
  public render() {
    const { header, content, colSpan, style, t } = this.props;
    return (
      <Table.Row style={{ ...style }}>
        <Table.Cell textAlign="center" colSpan={colSpan || 10}>
          <Message
            icon="inbox"
            header={header || t("component.emptyTableRow.header")}
            content={content || t("component.emptyTableRow.content")}
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}
export default withTranslation()(EmptyTableRow);
