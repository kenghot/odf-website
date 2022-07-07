import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Icon, Item } from "semantic-ui-react";
import { Text } from "../../../../components/common";
import { currency } from "../../../../utils/format-helper";
import { IReceiptItem } from "../../../receipt/ReceiptModel";

interface IPosPaymentItem extends WithTranslation {
  receiptItem: IReceiptItem;
  editMode?: boolean;
  onDeleteItem: () => void;
}

@observer
class PosPaymentItem extends React.Component<IPosPaymentItem> {
  public render() {
    const { receiptItem, onDeleteItem, editMode } = this.props;
    return (
      <Item>
        <Item.Content>
          <Item.Header style={styles.itemHeader}>
            {receiptItem.name || "-"}
          </Item.Header>
          {receiptItem.refType === "D" ? (
            <>
              {receiptItem.description2 ? (
                <Item.Meta style={styles.itemMeta}>
                  <Text size="small">
                    {this.renderCheckRef(receiptItem.description2, "")}
                  </Text>
                </Item.Meta>
              ) : null}
            </>
          ) : (
            <>
              {receiptItem.description1 || receiptItem.ref1 ? (
                <Item.Meta style={styles.itemMeta}>
                  <Text size="small">
                    {this.renderCheckRef(
                      receiptItem.description1,
                      receiptItem.ref1
                    )}
                  </Text>
                </Item.Meta>
              ) : null}

              {receiptItem.description2 || receiptItem.ref2 ? (
                <Item.Meta style={styles.itemMeta}>
                  <Text size="small">
                    {this.renderCheckRef(
                      receiptItem.description2,
                      receiptItem.ref2
                    )}
                  </Text>
                </Item.Meta>
              ) : null}
              {receiptItem.description3 || receiptItem.ref3 ? (
                <Item.Meta style={styles.itemMeta}>
                  <Text size="small">
                    {this.renderCheckRef(
                      receiptItem.description3,
                      receiptItem.ref3
                    )}
                  </Text>
                </Item.Meta>
              ) : null}
              {receiptItem.description4 || receiptItem.ref4 ? (
                <Item.Meta style={styles.itemMeta}>
                  <Text size="small">
                    {this.renderCheckRef(
                      receiptItem.description4,
                      receiptItem.ref4
                    )}
                  </Text>
                </Item.Meta>
              ) : null}
            </>
          )}
        </Item.Content>
        <Item.Content style={styles.itemContent}>
          <Item.Header style={styles.itemHeaderIcon}>
            {currency(receiptItem.subtotal,2)}
            {editMode ? (
              <Icon
                onClick={onDeleteItem}
                style={styles.icon}
                circular
                inverted
                link
                color="red"
                name="trash alternate outline"
              />
            ) : null}
          </Item.Header>
        </Item.Content>
      </Item>
    );
  }
  private renderCheckRef(description: string, ref: string) {
    if (ref) {
      if (description) {
        return `${description}: ${ref}`;
      } else {
        return `${ref}`;
      }
    } else {
      return `${description}`;
    }
  }
}
const styles: any = {
  itemHeader: {
    fontSize: "1em",
    marginTop: 4,
  },
  itemContent: {
    textAlign: "right",
  },
  itemHeaderIcon: {
    fontSize: "1em",
    textAlign: "right",
    marginTop: 0,
  },
  icon: {
    marginLeft: 7,
  },
  itemMeta: {
    marginTop: 0,
    marginBottom: 5,
  },
};
export default withTranslation()(PosPaymentItem);
