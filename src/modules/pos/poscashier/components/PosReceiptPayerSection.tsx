import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form } from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import {
  FormDisplay,
  SubSectionContainer
} from "../../../../components/common";
import { IReceiptModel } from "../../../receipt/ReceiptModel";

interface IPosReceiptPayerSection extends WithTranslation {
  appStore?: IAppModel;
  previousReceipt: IReceiptModel;
  style?: any;
}

@inject("appStore")
@observer
class PosReceiptPayerSection extends React.Component<IPosReceiptPayerSection> {
  public render() {
    const { appStore, t, previousReceipt } = this.props;
    return (
      <SubSectionContainer
        stretch
        fluid
        basic
        title={t("module.pos.posReceiptPayer.title")}
        // เว้นไว้ให้ icon แสดง
        linkLabel={" "}
        iconName="address card outline"
      >
        <Form.Group widths="equal" className="ui mini form">
          <FormDisplay
            width={previousReceipt.clientType === "C" ? 8 : undefined}
            title={t("module.pos.posReceiptPayer.clientType")}
            value={
              appStore!.enumItemLabel(
                "clientType",
                previousReceipt.clientType
              ) || "-"
            }
          />
          <FormDisplay
            title={
              previousReceipt.clientType === "C"
                ? t("module.pos.posPayer.taxID")
                : t("module.pos.posPayer.idCard")
            }
            value={previousReceipt.clientTaxNumber || "-"}
          />
          {previousReceipt.clientType === "C" ? null : (
            <FormDisplay
              title={t("module.pos.posReceiptPayer.clientName")}
              value={previousReceipt.clientName || "-"}
            />
          )}
        </Form.Group>
        {previousReceipt.clientType === "C" ? (
          <Form.Group widths="equal" className="ui mini form">
            <FormDisplay
              title={t("module.pos.posPayer.nameC")}
              value={previousReceipt.clientName || "-"}
            />
            <FormDisplay
              title={t("module.pos.posPayer.clientBranch")}
              value={previousReceipt.clientBranch || "-"}
            />
          </Form.Group>
        ) : null}
        <Form.Group widths="equal" className="ui mini form">
          <FormDisplay
            width={8}
            title={t("module.pos.posReceiptPayer.clientTelephone")}
            value={previousReceipt.clientTelephone || "-"}
          />
          <FormDisplay
            title={t("module.pos.posReceiptPayer.clientAddress")}
            value={previousReceipt.clientAddress || "-"}
          />
        </Form.Group>
      </SubSectionContainer>
    );
  }
}

export default withTranslation()(PosReceiptPayerSection);
