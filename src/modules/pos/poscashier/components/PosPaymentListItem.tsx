import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  // Checkbox,
  // Grid,
  // Header,
  // Icon,
  Item,
  Message,
  Segment
} from "semantic-ui-react";
import { PosPaymentItem } from ".";
// import { Text } from "../../../../components/common";
// import { CurrencyInput } from "../../../../components/common/input";
// import { currency } from "../../../../utils/format-helper";
import { IReceiptItem, IReceiptModel } from "../../../receipt/ReceiptModel";

interface IPosPaymentListItem extends WithTranslation {
  receipt: IReceiptModel;
  editMode?: boolean;
  // overflowItem?: boolean;
  style?: any;
}

@observer
class PosPaymentListItem extends React.Component<IPosPaymentListItem> {
  public render() {
    const {
      t,
      receipt,
      //  overflowItem,
      editMode,
      style
    } = this.props;
    // const overflowItemStyle = overflowItem ? styles.segmentOverflow : {};
    return (
      <Segment
        // style={{ ...overflowItemStyle }}
        style={{ ...style }}
      >
        <Item.Group divided>
          {receipt.receiptItems.length > 0 ? (
            receipt.receiptItems.map((data: IReceiptItem, index: number) => {
              return (
                <PosPaymentItem
                  editMode={editMode}
                  key={index}
                  receiptItem={data}
                  onDeleteItem={() => receipt.deleteReceiptItems(index)}
                />
              );
            })
          ) : (
            <Item style={{ height: "100%" }}>
              <Item.Content>
                <Segment
                  basic
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    height: "100%"
                  }}
                  textAlign="center"
                >
                  <Message
                    icon="inbox"
                    header={t("module.pos.posPaymentListItem.emptyMessage")}
                  />
                </Segment>
              </Item.Content>
            </Item>
          )}
          {/* {receipt.receiptItems.length > 0 ? <Item></Item> : null} */}
        </Item.Group>
        {/* {receipt.receiptItems.length > 0 ? (
          <Grid>
            <Grid.Row>
              <Grid.Column
                computer={4}
                tablet={undefined}
                mobile={undefined}
              ></Grid.Column>
              <Grid.Column computer={12} tablet={16} mobile={16}>
                <Item.Group divided>
                  <Item>{this.renderDiscount()}</Item>
                  <Item>{this.renderTax()}</Item>
                </Item.Group>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        ) : null} */}
      </Segment>
    );
  }

  // private renderDiscount() {
  //   const { t, receipt, editMode } = this.props;

  //   return (
  //     <Item.Group style={styles.itemGroup}>
  //       <Item>
  //         <Item.Content>
  //           <Item.Meta style={styles.itemMeta}>
  //             <Text size="small">
  //               {t("module.pos.posPaymentListItem.subtotalLabel")}
  //             </Text>
  //           </Item.Meta>
  //         </Item.Content>
  //         <Item.Content>
  //           <Item.Meta style={styles.itemMetaRight}>
  //             <Text size="small">
  //               {currency(
  //                 editMode ? receipt.subtotalLabel : receipt.subtotal,
  //                 2
  //               )}
  //             </Text>
  //           </Item.Meta>
  //         </Item.Content>
  //       </Item>

  //       <Item>
  //         <Item.Content>
  //           <Item.Meta style={styles.itemMeta}>
  //             <Text size="small">
  //               {editMode
  //                 ? t("module.pos.posPaymentListItem.discountFactor")
  //                 : `${t(
  //                     "module.pos.posPaymentListItem.discountFactor"
  //                   )} ${receipt.discountFactor || 0}%`}
  //             </Text>
  //             {editMode ? (
  //               <CurrencyInput
  //                 id={`input-pos-PosPaymentListItem-discountFactor`}
  //                 style={styles.currencyInput}
  //                 placeholder={"0"}
  //                 value={receipt.discountFactor}
  //                 onChangeInputField={this.onChangeInputFieldDiscountFactor}
  //                 fieldName={"discountFactor"}
  //                 labelText={"%"}
  //               />
  //             ) : null}
  //           </Item.Meta>
  //         </Item.Content>
  //         <Item.Content>
  //           <Item.Meta
  //             style={
  //               editMode ? styles.itemMetaRightInput : styles.itemMetaRight
  //             }
  //           >
  //             <Text size="small">
  //               {currency(
  //                 editMode ? receipt.discountLabel : receipt.discount,
  //                 2
  //               )}
  //             </Text>
  //           </Item.Meta>
  //         </Item.Content>
  //       </Item>

  //       <Item>
  //         <Item.Content>
  //           <Item.Meta style={styles.itemMeta}>
  //             <Text size="small">
  //               {t("module.pos.posPaymentListItem.amountAfterDiscount")}
  //             </Text>
  //           </Item.Meta>
  //         </Item.Content>
  //         <Item.Content>
  //           <Item.Meta style={styles.itemMetaRight}>
  //             <Text size="small">
  //               {currency(receipt.amountAfterDiscountLabel, 2)}
  //             </Text>
  //           </Item.Meta>
  //         </Item.Content>
  //       </Item>
  //     </Item.Group>
  //   );
  // }

  // private renderTax() {
  //   const { t, receipt, editMode } = this.props;
  //   return (
  //     <Item.Group style={styles.itemGroup}>
  //       <Item>
  //         <Item.Content>
  //           <Item.Meta style={styles.itemMeta}>
  //             <Checkbox
  //               disabled={!editMode}
  //               id="check-box-receipt-vat-included"
  //               toggle
  //               checked={receipt.vatIncluded}
  //               onChange={(e: any, data: any) =>
  //                 receipt.setField({
  //                   fieldname: "vatIncluded",
  //                   value: data.checked
  //                 })
  //               }
  //               size="small"
  //             />
  //             <Text style={styles.vatLabel} size="small">
  //               {t("module.pos.posPaymentListItem.vatLabel")}
  //             </Text>
  //           </Item.Meta>
  //         </Item.Content>
  //         <Item.Content>
  //           <Item.Meta style={styles.itemMetaRight}>
  //             <Text size="small">
  //               {currency(editMode ? receipt.vatLabel : receipt.vat, 2)}
  //             </Text>
  //           </Item.Meta>
  //         </Item.Content>
  //       </Item>
  //       <Item>
  //         <Item.Content>
  //           <Item.Meta style={styles.itemMeta}>
  //             <Text size="small">
  //               {t("module.pos.posPaymentListItem.excludeVatLabel")}
  //             </Text>
  //           </Item.Meta>
  //         </Item.Content>
  //         <Item.Content>
  //           <Item.Meta style={styles.itemMetaRight}>
  //             <Text size="small">
  //               {currency(
  //                 editMode
  //                   ? receipt.amountAfterDiscountLabel
  //                   : receipt.excludeVat,
  //                 2
  //               )}
  //             </Text>
  //           </Item.Meta>
  //         </Item.Content>
  //       </Item>
  //     </Item.Group>
  //   );
  // }

  // private onChangeInputFieldDiscountFactor = (
  //   fieldname: string,
  //   value: any
  // ) => {
  //   const { receipt } = this.props;
  //   if (+value > 100) {
  //     receipt.setField({ fieldname, value: "100" });
  //   } else if (+value < 0) {
  //     receipt.setField({ fieldname, value: "" });
  //   } else {
  //     receipt.setField({ fieldname, value });
  //   }
  // };
}
const styles: any = {
  segmentOverflow: {
    maxHeight: "325px",
    overflowY: "scroll"
  },
  itemMeta: {
    marginTop: 0,
    marginBottom: 5
  },
  itemMetaRight: {
    marginTop: 0,
    marginBottom: 5,
    textAlign: "right"
  },
  itemMetaRightInput: {
    marginTop: 11,
    marginBottom: 5,
    textAlign: "right"
  },
  itemGroup: {
    width: "100%"
  },
  currencyInput: {
    width: 80,
    marginLeft: 14
  },
  vatLabel: {
    verticalAlign: 7
  }
};
export default withTranslation()(PosPaymentListItem);
