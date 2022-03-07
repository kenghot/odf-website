import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form } from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import { SubSectionContainer } from "../../../../components/common";
import { TitleDDL } from "../../../../components/project";
import { IReceiptModel } from "../../../receipt/ReceiptModel";
import { ProfileModel } from "../../../share/profile/ProfileModel";

interface IPosPayerSection extends WithTranslation {
  appStore?: IAppModel;
  receipt: IReceiptModel;
}

@inject("appStore")
@observer
class PosPayerSection extends React.Component<IPosPayerSection> {
  public idCardProfile = ProfileModel.create({});
  public render() {
    const { appStore, t, receipt } = this.props;
    return (
      <SubSectionContainer
        idLink="link-read-id-card"
        stretch
        fluid
        basic
        title={t("module.pos.posPayer.subSectionTitle")}
        linkLabel={
          receipt.clientType === "C"
            ? undefined
            : t("module.pos.posPayer.subSectionLinkLabel")
        }
        iconName={
          receipt.clientType === "C" ? undefined : "address card outline"
        }
        onClick={() =>
          receipt.clientType === "C" ? undefined : this.onReadIDcard()
        }
      >
        <Form.Group widths="equal" className="ui mini form">
          <Form.Select
            id="form-input-client-type"
            fluid
            width={receipt.clientType === "C" ? 8 : undefined}
            placeholder={t("module.pos.posPayer.placeholderClientType")}
            options={appStore!.enumItems("clientType")}
            onChange={(event: any, data: any) => {
              this.onChangeInputFieldClientType("clientType", data.value);
            }}
            value={receipt.clientType}
          />
          <Form.Input
            id="form-input-id-card"
            fluid
            required
            placeholder={
              receipt.clientType === "C"
                ? t("module.pos.posPayer.taxID")
                : t("module.pos.posPayer.idCard")
            }
            value={receipt.clientTaxNumber}
            onChange={(event: any, data: any) => {
              this.onChangeInputField("clientTaxNumber", data.value);
            }}
          />
        </Form.Group>
        {receipt.clientType === "C" ? null : (
          <Form.Group widths="equal" className="ui mini form">
            <Form.Select
              fluid
              placeholder={t("component.idCardReader.prefix")}
              width={4}
              options={appStore!.enumItems("titleType")}
              onChange={(event, data) =>{
                this.onChangeInputField("clientTitle", data.value);
                this.onChangeClientNameField();
              }}
              value={receipt.clientTitle}
            />
            <Form.Input
              id="form-input-clientFirstname"
              required
              width={6}
              placeholder={t("module.pos.posPayer.clientFirstname")}
              value={receipt.clientFirstname}
              onChange={(event: any, data: any) => {
                this.onChangeInputField("clientFirstname", data.value);
                this.onChangeClientNameField();
              }}
            />
            <Form.Input
              id="form-input-clientLastname"
              required
              width={6}
              placeholder={t("module.pos.posPayer.clientLastname")}
              value={receipt.clientLastname}
              onChange={(event: any, data: any) => {
                this.onChangeInputField("clientLastname", data.value);
                this.onChangeClientNameField();
              }}
            />
          </Form.Group>
        )}
        {receipt.clientType === "C" ? (
          <Form.Group widths="equal" className="ui mini form">
            <Form.Input
              id="form-input-name"
              required
              placeholder={t("module.pos.posPayer.nameC")}
              value={receipt.clientName}
              onChange={(event: any, data: any) => {
                this.onChangeInputField("clientName", data.value);
                this.onChangeInputField("clientFirstname", data.value);
              }}
            />
            <Form.Input
              id="form-input-client-branch"
              required
              width={8}
              placeholder={t("module.pos.posPayer.clientBranch")}
              value={receipt.clientBranch}
              onChange={(event: any, data: any) => {
                this.onChangeInputField("clientBranch", data.value);
              }}
            />
          </Form.Group>
        ) : null}
        <Form.Group widths="equal" className="ui mini form">
          <Form.Input
            id="form-input-telephone"
            width={8}
            placeholder={t("module.pos.posPayer.telephoneNumber")}
            value={receipt.clientTelephone}
            onChange={(event: any, data: any) => {
              this.onChangeInputField("clientTelephone", data.value);
            }}
          />

          <Form.Input
            id="form-input-address"
            placeholder={t("module.pos.posPayer.address")}
            value={receipt.clientAddress}
            onChange={(event: any, data: any) => {
              this.onChangeInputField("clientAddress", data.value);
            }}
          />
        </Form.Group>
      </SubSectionContainer>
    );
  }
  private onReadIDcard = async () => {
    const { receipt } = this.props;
    try {
      await this.idCardProfile.getCardData();
      await receipt.setField({
        fieldname: "clientTaxNumber",
        value: this.idCardProfile.idCardNo,
      });
      const name = `${this.idCardProfile.title || ""}${
        this.idCardProfile.firstname || ""
      }${" "}${this.idCardProfile.lastname || ""}`;
      await receipt.setField({ fieldname: "clientName", value: name });
      await receipt.setField({
        fieldname: "clientTitle",
        value: this.idCardProfile.title || "",
      });
      await receipt.setField({
        fieldname: "clientFirstname",
        value: this.idCardProfile.firstname || "",
      });
      await receipt.setField({
        fieldname: "clientLastname",
        value: this.idCardProfile.lastname || "",
      });
      const address = `${this.idCardProfile.idCardAddress.line1}${this.idCardProfile.idCardAddress.line2}${this.idCardProfile.idCardAddress.line3}${this.idCardProfile.idCardAddress.line4}`;
      await receipt.setField({ fieldname: "clientAddress", value: address });
    } catch (e) {
      await receipt.error.setField({ fieldname: "tigger", value: true });
      await receipt.error.setField({
        fieldname: "title",
        value: "ไม่พบอุปกรณ์",
      });
      await receipt.error.setField({
        fieldname: "message",
        value:
          "กรุณาติดต่อผู้ดูแลระบบเพื่อเชื่อมต่ออุปกรณ์และลงโปรแกรมสำหรับอ่านบัตรประชาชนค่ะ",
      });
    }
  };

  private onChangeInputFieldClientType = (fieldname: string, value: any) => {
    const { receipt } = this.props;
    if (value !== "C") {
      receipt.setField({ fieldname, value });
      receipt.setField({ fieldname: "clientBranch", value: "" });
    } else {
      receipt.setField({ fieldname, value });
    }
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { receipt } = this.props;
    receipt.setField({ fieldname, value });
  };
  private onChangeClientNameField = () => {
    const { receipt } = this.props;
    const name = `${receipt.clientTitle || ""}${
    receipt.clientFirstname || ""
    }${" "}${receipt.clientLastname || ""}`;
    if(receipt.clientType !== "C"){
      receipt.setField({ fieldname: "clientName", value: name });
    }
  };
}

export default withTranslation()(PosPayerSection);
