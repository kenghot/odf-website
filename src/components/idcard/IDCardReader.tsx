import { observer } from "mobx-react";
import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { AddressFormBody } from "../address";
import { LocationModel } from "../address/LocationModel";
import { InputLabel } from "../common";
import { ErrorMessage } from "../common/error";
import { TitleDDL } from "../project";
import { FormFieldCheckbox } from "./../common/formfield";
import { IIDCardModel } from "./IDCardModel";
interface IIDCardReader extends WithTranslation {
  idCardReadingStore: IIDCardModel;
  displayMode: "simple" | "full";

  calculateAgeDate?: string; // DDMMYYYY,
  noSegment?: boolean;
  onReadCard?: (value: IIDCardModel) => void;
  onChangeInputField: (value: IIDCardModel) => void;
}

@observer
class IDCardReader extends React.Component<IIDCardReader> {
  public idCard = this.props.idCardReadingStore;
  public locationStore = LocationModel.create({});

  public componentDidMount() {
    setTimeout(() => {
      this.locationStore.loadSubdistrict(this.idCard.address.subDistrict);
      this.locationStore.loadDistrict(this.idCard.address.district);
      this.locationStore.loadProvince(this.idCard.address.province);
    }, 2000);
  }
  public render() {
    return this.props.noSegment! ? (
      this.renderBody()
    ) : (
      <Segment padded="very">{this.renderBody()}</Segment>
    );
  }
  private renderBody() {
    const { onChangeInputField, t } = this.props;
    return (
      <React.Fragment>
        <ErrorMessage errorobj={this.idCard.error} />
        <Form.Group>
          <Form.Input
            id="form-input-id-card"
            label={t("component.idCardReader.iDCardNumber", {
              value: this.idCard.is_incorrect_format
                ? t("component.idCardReader.invalidCardNumber")
                : ""
            })}
            icon="id card"
            iconPosition="left"
            placeholder="0-0000-00000-00-0"
            width="14"
            maxLength="17"
            value={this.idCard.id_formated}
            onChange={(event, data) => {
              const dataFormated = data.value.replace(/\D/g, "");
              this.idCard.setField({
                fieldname: "id",
                value: dataFormated
              });
              onChangeInputField(this.idCard);
            }}
            // content={{
            //   content: "Please enter your first name",
            //   pointing: "below"
            // }}
            error={this.idCard.is_incorrect_format}
          />
          <Form.Button
            color="teal"
            type="submit"
            onClick={() => this.onClickButton()}
            loading={this.idCard.loading}
          >
            {t("component.idCardReader.retrieveIDCard")}
          </Form.Button>
        </Form.Group>
        {this.props.displayMode === "full" ? this.renderCardInfo() : null}
        {this.renderPersonInfo()}
        {this.props.displayMode === "full" ? this.renderAddress() : null}
      </React.Fragment>
    );
  }
  private renderCardInfo() {
    const { t, onChangeInputField } = this.props;
    return (
      <Form.Group widths="equal">
        <Form.Input
          label={t("component.idCardReader.out")}
          fluid
          placeholder={t("component.idCardReader.out")}
          value={this.idCard.issuer}
          onChange={(event: any, data: any) => {
            this.idCard.setField({
              fieldname: "issuer",
              value: data.value
            });
            onChangeInputField(this.idCard);
          }}
        />
        <Form.Input
          label={t("component.idCardReader.cardIssuanceDate")}
          fluid
          placeholder="DD/MM/YYYY"
          maxLength="10"
          value={this.idCard.issued_date_formated}
          onChange={(event: any, data: any) => {
            const dataFormated = data.value.replace(/\D/g, "");
            this.idCard.setField({
              fieldname: "issued_date",
              value: dataFormated
            });
            onChangeInputField(this.idCard);
          }}
        />
        <Form.Input
          label={t("component.idCardReader.expiredDate")}
          fluid
          placeholder="DD/MM/YYYY"
          maxLength="10"
          value={this.idCard.expired_date_formated}
          onChange={(event: any, data: any) => {
            const dataFormated = data.value.replace(/\D/g, "");
            this.idCard.setField({
              fieldname: "expired_date",
              value: dataFormated
            });
            onChangeInputField(this.idCard);
          }}
        />
        <FormFieldCheckbox
          label={t("module.loan.agreementFormInfoBorrower.cardType")}
          label_checkbox={t(
            "module.loan.agreementFormInfoBorrower.lifetimeCard"
          )}
          fieldName="idCardLifetime"
          onChangeInputField={(fieldname, value) => {
            const { onChangeInputField } = this.props;
            this.idCard.setField({ fieldname, value });
            onChangeInputField(this.idCard);
          }}
          checked={this.idCard.idCardLifetime}
        />
      </Form.Group>
    );
  }
  private renderPersonInfo() {
    const { onChangeInputField, t } = this.props;
    return (
      <React.Fragment>
        <Form.Group widths="equal">
          <TitleDDL
            placeholder={t("component.idCardReader.prefix")}
            label={t("component.idCardReader.title")}
            fluid
            width={4}
            value={this.idCard.title}
            onChange={(event: any, data: any) => {
              this.idCard.setField({
                fieldname: "title",
                value: data.value
              });
              onChangeInputField(this.idCard);
            }}
          />
          <Form.Input
            width={6}
            label={t("component.idCardReader.firstNames")}
            placeholder={t("component.idCardReader.firstNames")}
            value={this.idCard.firstname}
            fluid
            onChange={(event: any, data: any) => {
              this.idCard.setField({
                fieldname: "firstname",
                value: data.value
              });
              onChangeInputField(this.idCard);
            }}
          />
          <Form.Input
            width={6}
            label={t("component.idCardReader.lastNames")}
            placeholder={t("component.idCardReader.lastNames")}
            value={this.idCard.lastname}
            fluid
            onChange={(event: any, data: any) => {
              this.idCard.setField({
                fieldname: "lastname",
                value: data.value
              });
              onChangeInputField(this.idCard);
            }}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            label={t("component.idCardReader.dateBirth")}
            placeholder="DD/MM/YYYY"
            value={this.idCard.birthday_formated}
            width={10}
            maxLength="10"
            onChange={(event: any, data: any) => {
              this.idCard.setField({
                fieldname: "birthday",
                value: data.value.replace(/\D/g, "")
              });
              onChangeInputField(this.idCard);
            }}
          />
          <FormFieldCheckbox
            label={t("component.idCardReader.unknownDate")}
            label_checkbox={t("component.idCardReader.chooseOnlyYearBirth")}
          />
        </Form.Group>

        <Form.Field
          width={6}
          label={t("component.idCardReader.age")}
          control={InputLabel}
          labelText={t("component.idCardReader.year")}
          placeholder="-"
          readOnly
          value={this.idCard.age === 0 ? "-" : this.idCard.age}
          onChange={(event: any, data: any) => {
            this.idCard.setField({
              fieldname: "age",
              value: data.value ? parseInt(data.value) : 0
            });
            onChangeInputField(this.idCard);
          }}
        />
      </React.Fragment>
    );
  }

  private renderAddress() {
    const { t } = this.props;
    return (
      <Form.Field
        label={t("component.idCardReader.addressPerIDCard")}
        width={16}
        control={AddressFormBody}
        addressStore={this.idCard.address}
        locationStore={this.locationStore}
        onChangeInputField={this.onChangeAddress}
      />
    );
  }

  private onChangeAddress = () => {
    const { onChangeInputField } = this.props;
    onChangeInputField(this.idCard);
  };

  private async onClickButton() {
    const { onReadCard } = this.props;
    try {
      await this.idCard.getCardData();
      onReadCard!(this.idCard);
    } catch (e) {
      console.log(e);
    } finally {
      this.locationStore.loadSubdistrict(this.idCard.address.subDistrict);
      this.locationStore.loadDistrict(this.idCard.address.district);
      this.locationStore.loadProvince(this.idCard.address.province);
    }
  }
}
export default withTranslation()(IDCardReader);
