import { observer } from "mobx-react";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { TitleDDL } from "../../../components/project";
import { IDonationDirectModel } from "../DonationDirectModel";

interface IDonationDirectFormDonatorInfo extends WithTranslation {
  donationDirect: IDonationDirectModel;
}

@observer
class DonationDirectFormDonatorInfo extends React.Component<IDonationDirectFormDonatorInfo> {
  public render() {
    const { t, donationDirect } = this.props;
    return (
      <Segment padded>
        <Form.Input
          fluid
          label={t("component.idCardReader.iDCardNumber")}
          placeholder={"กรุณาระบุหมายเลขบัตรประชาชน"}
          value={donationDirect.donatorIdCardNo}
          onChange={(event: any, data: any) => {
            donationDirect.setField({
              fieldname: "donatorIdCardNo",
              value: data.value,
            });
          }}
        />
        <Form.Group widths="equal">
          <TitleDDL
            id={`form-input-ddl-title-donatorTitle`}
            placeholder={t("component.idCardReader.prefix")}
            label={t("component.idCardReader.title")}
            fluid
            width={5}
            value={donationDirect.donatorTitle}
            onChange={(event: any, data: any) => {
              donationDirect.setField({
                fieldname: "donatorTitle",
                value: data.value,
              });
            }}
          />
          <Form.Input
            id={`form-input-firstname-donatorFirstname`}
            label={t("component.idCardReader.firstNames")}
            placeholder={t("component.idCardReader.firstNames")}
            value={donationDirect.donatorFirstname}
            fluid
            onChange={(event: any, data: any) => {
              donationDirect.setField({
                fieldname: "donatorFirstname",
                value: data.value,
              });
            }}
          />
          <Form.Input
            id={`form-input-lastname-donatorLastname`}
            label={t("component.idCardReader.lastNames")}
            placeholder={t("component.idCardReader.lastNames")}
            value={donationDirect.donatorLastname}
            fluid
            onChange={(event: any, data: any) => {
              donationDirect.setField({
                fieldname: "donatorLastname",
                value: data.value,
              });
            }}
          />
        </Form.Group>
        <Form.Input
          fluid
          label={"ที่อยู่ผู้บริจาค"}
          placeholder={"กรุณาระบุที่อยู่ผู้บริจาค"}
          value={donationDirect.donatorAddress}
          onChange={(event: any, data: any) => {
            donationDirect.setField({
              fieldname: "donatorAddress",
              value: data.value,
            });
          }}
        />
        <Form.Input
          fluid
          label={"ที่อยู่จัดส่งเอกสาร"}
          placeholder={"กรุณาระบุที่อยู่จัดส่งเอกสาร"}
          value={donationDirect.deliveryAddress}
          onChange={(event: any, data: any) => {
            donationDirect.setField({
              fieldname: "deliveryAddress",
              value: data.value,
            });
          }}
        />
      </Segment>
    );
  }
}

export default withTranslation()(DonationDirectFormDonatorInfo);
