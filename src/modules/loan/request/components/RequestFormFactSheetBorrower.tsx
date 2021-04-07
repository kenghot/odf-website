import { observer } from "mobx-react";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { AddressFormBody, LocationModel } from "../../../../components/address";
import { DateInput, InputLabel } from "../../../../components/common";
import { FormFieldCheckbox } from "../../../../components/common/formfield";
import { TitleDDL } from "../../../../components/project";
import { RegistedAddressCurrentType, ResidenceWith } from "../../components";
import { IFactSheetModel } from "../FactSheetModel";

interface IRequestFormFactSheetBorrower extends WithTranslation {
  factSheet: IFactSheetModel;
  calculateAgeDate?: string; // DDMMYYYY,
}

@observer
class RequestFormFactSheetBorrower extends React.Component<
  IRequestFormFactSheetBorrower
> {
  public _isMounted = false;
  public locationCurrentAddressStore = LocationModel.create({});
  public componentDidMount() {
    this._isMounted = true;
    setTimeout(() => {
      if (this._isMounted) {
        this.locationCurrentAddressStore.loadSubdistrict(
          this.props.factSheet.currentAddress.subDistrict
        );
        this.locationCurrentAddressStore.loadDistrict(
          this.props.factSheet.currentAddress.district
        );
        this.locationCurrentAddressStore.loadProvince(
          this.props.factSheet.currentAddress.province
        );
      }
    }, 2000);
  }
  public componentWillUnmount() {
    this._isMounted = false;
  }
  public render() {
    const { factSheet, calculateAgeDate, t } = this.props;
    const profile = factSheet.borrower;
    return (
      <Segment>
        <Form.Group widths="equal">
          <TitleDDL
            placeholder={t("component.idCardReader.prefix")}
            label={t("component.idCardReader.title")}
            fluid
            width={5}
            value={profile.title}
            onChange={(event: any, data: any) => {
              profile.setField({
                fieldname: "title",
                value: data.value
              });
            }}
          />
          <Form.Input
            label={t("component.idCardReader.firstNames")}
            placeholder={t("component.idCardReader.firstNames")}
            value={profile.firstname}
            fluid
            onChange={(event: any, data: any) => {
              profile.setField({
                fieldname: "firstname",
                value: data.value
              });
            }}
          />
          <Form.Input
            label={t("component.idCardReader.lastNames")}
            placeholder={t("component.idCardReader.lastNames")}
            value={profile.lastname}
            fluid
            onChange={(event: any, data: any) => {
              profile.setField({
                fieldname: "lastname",
                value: data.value
              });
            }}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <div
            className="twelve wide field"
            style={{ display: !profile.isOnlyBirthYear ? "none" : "block" }}
          >
            <Form.Field
              required
              width={12}
              label={t("component.idCardReader.yearBirth")}
              control={DateInput}
              formatdate="YYYY"
              value={profile.birthDate || undefined}
              fieldName="birthDate"
              id={`isOnlyBirthYear_year`}
              onChangeInputField={this.onChangeProfileInputField}
              type="year"
              style={{ display: profile.isOnlyBirthYear ? "none" : "block" }}
            />
          </div>
          <div
            className="twelve wide field"
            style={{ display: profile.isOnlyBirthYear ? "none" : "block" }}
          >
            <Form.Field
              required
              width={12}
              label={t("component.idCardReader.dateBirth")}
              control={DateInput}
              id={"factSheet_borrower_birthDate"}
              value={profile.birthdateFormated || undefined}
              fieldName="birthDate"
              type="date"
              onChangeInputField={this.onChangeProfileInputField}
            />
          </div>
          <FormFieldCheckbox
            label={t("component.idCardReader.unknownDate")}
            label_checkbox={t("component.idCardReader.chooseOnlyYearBirth")}
            onChangeInputField={this.onChangeIsOnlyBirthYearInputField}
            fieldName="isOnlyBirthYear"
            checked={profile.isOnlyBirthYear}
          />
        </Form.Group>
        <Form.Field
          label={t("component.idCardReader.age")}
          control={InputLabel}
          labelText={t("component.idCardReader.year")}
          placeholder="-"
          readOnly
          value={profile.ageDisplay(calculateAgeDate)}
        />
        <Form.Field
          label={t("module.loan.requestDetail.livingStatus")}
          width={16}
          control={ResidenceWith}
          inputFieldResidenceWith="residenceWith"
          valueFieldResidenceWith={factSheet.residenceWith}
          inputFieldDescription="residenceWithDescription"
          valueFieldDescription={factSheet.residenceWithDescription}
          onChangeInputField={this.onChangeInputFieldBorrower}
        />
        <Form.Group widths="equal">
          <Form.Field
            label={t("module.loan.requestDetail.haveChildren")}
            id={"input-factSheet-numberOfChildren"}
            fluid={true}
            control={InputLabel}
            labelText={t("module.loan.requestDetail.person")}
            placeholder="0"
            type="number"
            value={factSheet.numberOfChildren}
            onChangeInputField={this.onChangeInputFieldBorrower}
            fieldName={"numberOfChildren"}
          />
          <Form.Field
            label={t("module.loan.requestDetail.haveChildWhoProfessional")}
            id={"input-factSheet-numberOfWorkingChildren"}
            fluid={true}
            control={InputLabel}
            labelText={t("module.loan.requestDetail.person")}
            placeholder="0"
            type="number"
            value={factSheet.numberOfWorkingChildren}
            onChangeInputField={this.onChangeInputFieldBorrower}
            fieldName={"numberOfWorkingChildren"}
          />
          <Form.Field
            label={t("module.loan.requestDetail.therePeopleWhoNeedSupport")}
            id={"input-factSheet-numberOfParentingChildren"}
            fluid={true}
            control={InputLabel}
            labelText={t("module.loan.requestDetail.person")}
            placeholder="0"
            type="number"
            value={factSheet.numberOfParentingChildren}
            onChangeInputField={this.onChangeInputFieldBorrower}
            fieldName={"numberOfParentingChildren"}
          />
        </Form.Group>
        <Form.Field
          label={t("module.loan.requestDetail.currentAddress")}
          width={16}
          control={RegistedAddressCurrentType}
          inputFieldCurrentAddressType="currentAddressType"
          valueFieldCurrentAddressType={factSheet.currentAddressType}
          onChangeInputField={this.onChangeInputFieldBorrower}
          address={factSheet.currentAddress}
        />
        {factSheet.currentAddressType === 99 ? (
          <Form.Field
            label={t("module.loan.requestDetail.currentAddressDetails")}
            width={16}
            control={AddressFormBody}
            addressStore={factSheet.currentAddress}
            locationStore={this.locationCurrentAddressStore}
          />
        ) : null}
      </Segment>
    );
  }
  private onChangeIsOnlyBirthYearInputField = (
    fieldname: string,
    value: any
  ) => {
    const { factSheet } = this.props;
    const profile = factSheet.borrower;
    profile.setField({ fieldname, value });
    if (value && profile.birthDate) {
      profile.setField({
        fieldname: "birthDate",
        value: profile.birthDate.substring(0, 4) + "-01-01"
      });
    }
  };
  private onChangeInputFieldBorrower = (fieldname: string, value: any) => {
    const { factSheet } = this.props;
    factSheet.setField({ fieldname, value });
  };
  private onChangeProfileInputField = (fieldname: string, value: any) => {
    const { factSheet } = this.props;
    const profile = factSheet.borrower;
    profile.setField({ fieldname, value });
  };
}

export default withTranslation()(RequestFormFactSheetBorrower);
