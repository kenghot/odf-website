import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Radio, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../AppModel";
import { AddressBody, AddressFormBody } from "../../../components/address";
import { ILocationModel } from "../../../components/address/LocationModel";
import { DateInput, FormDisplay, InputLabel } from "../../../components/common";
import { FormFieldCheckbox } from "../../../components/common/formfield";
import { TitleDDL } from "../../../components/project";
import { date_display_CE_TO_BE } from "../../../utils";
import { CurrentOccupationType } from "../../loan/components";
import { IDebtCollectionMemoModel } from "../DebtCollectionModel";

interface IDebtCollectionMemoInformerForm extends WithTranslation {
  memo: IDebtCollectionMemoModel;
  locationStore: ILocationModel;
  appStore?: IAppModel;
  editMode?: boolean;
}

@inject("appStore")
@observer
class DebtCollectionMemoInformerForm extends React.Component<
  IDebtCollectionMemoInformerForm
> {
  public render() {
    const { t, memo, locationStore, editMode } = this.props;
    return (
      <Segment padded>
        {this.renderPersonInfo()}
        {memo.memoInformer === "BW" || memo.memoInformer === "GW"
          ? this.renderMemoInformerRelationshipType()
          : null}
        <Form.Field
          label={t(
            "module.debtCollection.debtCollectionMemoInformerForm.currentOccupation"
          )}
          width={16}
          control={CurrentOccupationType}
          readOnly={!editMode}
          ocupationType={this.onChangeOcupationType()}
          isWorking={memo.isWorking}
          inputFieldIsWorking={"isWorking"}
          occupation={memo.occupation}
          onChangeInputField={this.onChangeInputField}
        />
        {editMode ? (
          <Form.Field
            label={t(
              "module.debtCollection.debtCollectionMemoInformerForm.currentAddress"
            )}
            width={16}
            control={AddressFormBody}
            notDidMount={true}
            addressStore={memo.currentAddress}
            locationStore={locationStore}
          />
        ) : (
          <Form.Field
            label={t(
              "module.debtCollection.debtCollectionMemoInformerForm.currentAddress"
            )}
            width={16}
            control={AddressBody}
            addressStore={memo.currentAddress}
          />
        )}
        {editMode ? (
          <Form.Input
            fluid
            label={t(
              "module.debtCollection.debtCollectionMemoInformerForm.mobilePhoneNumber"
            )}
            placeholder={t(
              "module.debtCollection.debtCollectionMemoInformerForm.mobilePhoneNumber"
            )}
            value={memo.mobilePhone}
            onChange={(event: any, data: any) =>
              memo.setField({
                fieldname: "mobilePhone",
                value: data.value
              })
            }
          />
        ) : (
          <FormDisplay
            title={t(
              "module.debtCollection.debtCollectionMemoInformerForm.mobilePhoneNumber"
            )}
            value={memo.mobilePhone || "-"}
          />
        )}
      </Segment>
    );
  }
  private renderPersonInfo() {
    const { memo, t, editMode } = this.props;
    return (
      <React.Fragment>
        <Form.Group widths="equal">
          {editMode ? (
            <React.Fragment>
              <TitleDDL
                placeholder={t("component.idCardReader.prefix")}
                label={t("component.idCardReader.title")}
                fluid
                width={5}
                value={memo.title}
                onChange={(event: any, data: any) => {
                  memo.setField({
                    fieldname: "title",
                    value: data.value
                  });
                }}
              />
              <Form.Input
                label={t("component.idCardReader.firstNames")}
                placeholder={t("component.idCardReader.firstNames")}
                value={memo.firstname}
                fluid
                onChange={(event: any, data: any) => {
                  memo.setField({
                    fieldname: "firstname",
                    value: data.value
                  });
                }}
              />
              <Form.Input
                label={t("component.idCardReader.lastNames")}
                placeholder={t("component.idCardReader.lastNames")}
                value={memo.lastname}
                fluid
                onChange={(event: any, data: any) => {
                  memo.setField({
                    fieldname: "lastname",
                    value: data.value
                  });
                }}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <FormDisplay
                width={5}
                title={t("component.idCardReader.prefix")}
                value={memo.title}
              />
              <FormDisplay
                title={t("component.idCardReader.firstNames")}
                value={memo.firstname}
              />
              <FormDisplay
                title={t("component.idCardReader.lastNames")}
                value={memo.lastname}
              />
            </React.Fragment>
          )}
        </Form.Group>
        <Form.Group widths="equal">
          {editMode ? (
            <React.Fragment>
              <div
                className="twelve wide field"
                style={{
                  display: !memo.isOnlyBirthYear ? "none" : "block",
                  paddingLeft: 0
                }}
              >
                <Form.Field
                  required
                  width={12}
                  label={t("component.idCardReader.yearBirth")}
                  control={DateInput}
                  formatdate="YYYY"
                  value={memo.birthDate || undefined}
                  fieldName="birthDate"
                  id={`birthDate_year`}
                  onChangeInputField={this.onChangeInputFieldBirthDate}
                  type="year"
                  style={{ display: memo.isOnlyBirthYear ? "none" : "block" }}
                />
              </div>
              <div
                className="twelve wide field"
                style={{
                  display: memo.isOnlyBirthYear ? "none" : "block",
                  paddingLeft: 0
                }}
              >
                <Form.Field
                  required
                  width={12}
                  label={t("component.idCardReader.dateBirth")}
                  control={DateInput}
                  value={memo.birthDate || undefined}
                  fieldName="birthDate"
                  id={`birthDate_birthDate`}
                  type="date"
                  onChangeInputField={this.onChangeInputFieldBirthDate}
                />
              </div>
              <FormFieldCheckbox
                label={t("component.idCardReader.unknownDate")}
                label_checkbox={t("component.idCardReader.chooseOnlyYearBirth")}
                onChangeInputField={this.onChangeIsOnlyBirthYearInputField}
                fieldName="isOnlyBirthYear"
                checked={memo.isOnlyBirthYear}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <FormDisplay
                title={t("component.idCardReader.dateBirth")}
                value={date_display_CE_TO_BE(memo.birthDate) || "-"}
              />

              <FormFieldCheckbox
                disabled
                label={t("component.idCardReader.unknownDate")}
                label_checkbox={t("component.idCardReader.chooseOnlyYearBirth")}
                checked={memo.isOnlyBirthYear}
              />
            </React.Fragment>
          )}
        </Form.Group>
        <Form.Field
          label={t("component.idCardReader.age")}
          control={InputLabel}
          labelText={t("component.idCardReader.year")}
          placeholder="-"
          readOnly
          value={memo.ageDisplay}
        />
      </React.Fragment>
    );
  }

  private renderMemoInformerRelationshipType() {
    const { t, memo, appStore, editMode } = this.props;
    return (
      <Form.Field>
        <label>
          {t(
            "module.debtCollection.debtCollectionMemoInformerForm.relationshipBorrowerGuarantor"
          )}
        </label>
        <Segment padded>
          <div className="inline fields" style={styles.formGroup}>
            {appStore!
              .enumItems("guarantorBorrowerRelationship")
              .map((item: any, index: number) => (
                <Form.Field
                  key={index}
                  control={Radio}
                  label={item.text}
                  readOnly={!editMode}
                  value={item.value}
                  onChange={(
                    event: React.SyntheticEvent<HTMLElement>,
                    data: any
                  ) =>
                    this.onChangeInputField(
                      "memoInformerRelationship",
                      data.value
                    )
                  }
                  checked={memo.memoInformerRelationship === item.value}
                />
              ))}
          </div>
        </Segment>
      </Form.Field>
    );
  }
  private onChangeOcupationType = () => {
    const { memo } = this.props;
    switch (memo.memoInformer) {
      case "B":
        return "borrow";
      case "G":
        return "guarantee";
      case "BW":
        return "";
      case "GW":
        return "";
      default:
        return "";
    }
  };

  private onChangeIsOnlyBirthYearInputField = (
    fieldname: string,
    value: any
  ) => {
    const { memo } = this.props;
    memo.setField({ fieldname, value });
    if (value && memo.birthDate) {
      memo.setField({
        fieldname: "birthDate",
        value: memo.birthDate.substring(0, 4) + "-01-01"
      });
    }
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { memo } = this.props;
    memo.setField({ fieldname, value });
  };
  private onChangeInputFieldBirthDate = (fieldname: string, value: any) => {
    const { memo } = this.props;
    memo.setField({ fieldname, value });
    memo.setField({
      fieldname: "age",
      value: memo.ageDisplay === "-" ? 0 : memo.ageDisplay
    });
  };
}

const styles: any = {
  button: {
    float: "left"
  },
  infoGrid: {
    marginBottom: 14
  },
  radioButton: {
    paddingBottom: 7
  },
  formGroup: {
    flexWrap: "wrap",
    flexDirection: "initial",
    marginBottom: 0
  }
};

export default withTranslation()(DebtCollectionMemoInformerForm);
