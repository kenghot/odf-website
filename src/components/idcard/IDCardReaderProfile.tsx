import { observer } from "mobx-react";
import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment, Header, Popup, Grid } from "semantic-ui-react";
import { IProfileModel } from "../../modules/share/profile/ProfileModel";
import { AddressFormBody, IAddressModel } from "../address";
import { LocationModel } from "../address/LocationModel";
import { InputLabel } from "../common";
import { ErrorMessage } from "../common/error";
import { DateInput } from "../common/input";
import { TitleDDL } from "../project";
import { FormFieldCheckbox } from "./../common/formfield";
import { IIDCardModel } from "./IDCardModel";
import { fetchNoService } from "../../utils/request-noservice";
import { hasPermission } from "../../utils/render-by-permission";

interface IIDCardReaderProfile extends WithTranslation {
  idCardReadingStore: IIDCardModel;
  fieldname?: string;
  profile: IProfileModel;
  address: IAddressModel;
  displayMode: "simple" | "full" | "mini";
  calculateAgeDate?: string; // DDMMYYYY,
  noSegment?: boolean;
  titleAddress?: string;
  notDidMount?: boolean;
}

@observer
class IDCardReaderProfile extends React.Component<IIDCardReaderProfile> {
  public state = {
    subDistrict: "",
    district: "",
    province: "",
  };
  public idCard = this.props.idCardReadingStore;
  public locationStore = LocationModel.create({});
  public _isMounted = false;
  public componentDidMount() {
    this._isMounted = true;
    if (!this.props.notDidMount) {
      setTimeout(() => {
        if (this._isMounted) {
          this.locationStore.loadSubdistrict(this.idCard.address.subDistrict);
          this.locationStore.loadDistrict(this.idCard.address.district);
          this.locationStore.loadProvince(this.idCard.address.province);
        }
      }, 2000);
    }
  }

  public async componentDidUpdate() {
    const { address } = this.props;
    if (address.subDistrict !== this.state.subDistrict) {
      await this.locationStore.loadSubdistrict(address.subDistrict);
      await this.locationStore.loadDistrict(address.district);
      await this.locationStore.loadProvince(address.province);
      await this.setState({
        subDistrict: address.subDistrict,
      });
      await this.setState({
        district: address.district,
      });
      await this.setState({
        province: address.province,
      });
      this.forceUpdate();
    }
  }

  public componentWillUnmount() {
    this._isMounted = false;
    this.setState({
      subDistrict: "",
    });
    this.setState({
      district: "",
    });
    this.setState({
      province: "",
    });
  }
  public render() {
    return this.props.noSegment! ? (
      this.renderBody()
    ) : (
      <Segment padded>{this.renderBody()}</Segment>
    );
  }
  private renderBody() {
    const { profile, t, fieldname } = this.props;
    return (
      <React.Fragment>
        <ErrorMessage errorobj={profile.error} />
        <Form.Group widths="equal">
          <Form.Input
            id={`form-input-id-card-${fieldname}`}
            label={t("component.idCardReader.iDCardNumber", {
              value: profile.idCardIsIncorrectFormat
                ? t("component.idCardReader.invalidCardNumber")
                : "",
            })}
            icon="id card"
            iconPosition="left"
            placeholder="0-0000-00000-00-0"
            width="14"
            maxLength="17"
            value={profile.idCardformated}
            onChange={(event, data) => {
              const dataFormated = data.value.replace(/\D/g, "");
              profile.setField({
                fieldname: "idCardNo",
                value: dataFormated,
              });
            }}
            error={profile.idCardIsIncorrectFormat}
          />
          {/* Beer07082021 */}
          <Popup trigger={
            <Form.Button
              width={3}
              style={styles.formButton}
              fluid
              color="teal"
              type="button"
            >
              {t("component.idCardReader.retrieveIDCard")}
            </Form.Button>
          } flowing hoverable>
            <Grid centered divided columns={2}>
              <Grid.Column textAlign='center'>
                <Header as='h4'>ดึงข้อมูลจากกรมการปกครองออนไลน์</Header>
                <Form.Input required
                  id={`form-input-id-card-${fieldname}`}
                  label={t("component.idCardReader.iDCardNumberAgentId", {
                    value: profile.idCardNoAgentIdIncorrectFormat
                      ? t("component.idCardReader.invalidCardNumber")
                      : "",
                  })}
                  icon="id card"
                  iconPosition="left"
                  placeholder="0-0000-00000-00-0"
                  width="4"
                  maxLength="17"
                  value={profile.idCardNoAgentIdformated}
                  onChange={(event, data) => {
                    const dataFormated = data.value.replace(/\D/g, "");
                    profile.setField({
                      fieldname: "idCardNoAgentId",
                      value: dataFormated,
                    });
                  }}
                  error={profile.idCardNoAgentIdIncorrectFormat}
                />
                <p></p>
                {/* <FormFieldCheckbox
                    id={`form-input-is-check-death-data-${fieldname}`}
                    label_checkbox={"ดึงข้อมูลกรณีเสียชีวิต "}
                    fieldName="isCheckDeathData"
                    onChangeInputField={this.onChangeCheckboxDeathData}
                    checked={profile.isCheckDeathData}
                  /> */}
                <Header as='h5' color="red">กรุณา Login เชื่อมต่อระบบ GovAMI ก่อนดึงข้อมูล</Header>
                <Form.Button
                  width={1}
                  style={styles.formButton}
                  fluid
                  color="teal"
                  type="button"
                  onClick={() => this.onClickButtonGdx()}
                  loading={profile.loading}
                >
                  {"ดึงข้อมูล"}
                </Form.Button>
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <Header as='h4'>ดึงข้อมูลจากอุปกรณ์อ่านบัตรประชาชน</Header>
                <p></p><p></p>
                <Form.Button
                  width={1}
                  style={styles.formButton}
                  fluid
                  color="teal"
                  type="button"
                  onClick={() => this.onClickButton()}
                  loading={profile.loading}
                >
                  {"ดึงข้อมูล"}
                </Form.Button>
              </Grid.Column>

            </Grid>
          </Popup>
          {/* <Form.Button
            width={3}
            style={styles.formButton}
            fluid
            color="teal"
            type="button"
            onClick={() => this.onClickButton()}
            loading={profile.loading}
          >
            {t("component.idCardReader.retrieveIDCard")}
          </Form.Button> */}
        </Form.Group>
        {this.props.displayMode === "mini" ? null : this.renderCardInfo()}
        {this.renderPersonInfo()}
        {this.props.displayMode === "full" ? this.renderAddress() : null}
      </React.Fragment>
    );
  }
  private renderCardInfo() {
    const { t, profile, fieldname } = this.props;
    return (
      <Form.Group widths="equal">
        <Form.Input
          id={`form-input-id-card-issuer-${fieldname}`}
          label={t("component.idCardReader.out")}
          fluid
          placeholder={t("component.idCardReader.out")}
          value={profile.idCardIssuer}
          onChange={(event: any, data: any) => {
            profile.setField({
              fieldname: "idCardIssuer",
              value: data.value,
            });
          }}
        />
        <Form.Field
          label={t("component.idCardReader.cardIssuanceDate")}
          control={DateInput}
          value={profile.idCardIssuedDate}
          fieldName="idCardIssuedDate"
          id={`${fieldname}_idCardIssuedDate`}
          onChangeInputField={this.onChangeProfileInputField}
        />
        {!profile.idCardLifetime ? (
          <Form.Field
            label={t("component.idCardReader.expiredDate")}
            control={DateInput}
            value={profile.idCardExpireDate || undefined}
            fieldName="idCardExpireDate"
            id={`${fieldname}_idCardExpireDate`}
            onChangeInputField={this.onChangeProfileInputField}
          />
        ) : null}
        <FormFieldCheckbox
          id={`form-input-id-card-lifetime-${fieldname}`}
          label={t("module.loan.agreementFormInfoBorrower.cardType")}
          label_checkbox={t(
            "module.loan.agreementFormInfoBorrower.lifetimeCard"
          )}
          fieldName="idCardLifetime"
          onChangeInputField={this.onChangeIDCardLifetime}
          checked={profile.idCardLifetime}
        />
      </Form.Group>
    );
  }
  private renderPersonInfo() {
    const { profile, calculateAgeDate, fieldname, t } = this.props;
    return (
      <React.Fragment>
        <Form.Group widths="equal">
          <TitleDDL
            id={`form-input-ddl-title-${fieldname}`}
            placeholder={t("component.idCardReader.prefix")}
            label={t("component.idCardReader.title")}
            fluid
            width={5}
            value={profile.title}
            onChange={(event: any, data: any) => {
              profile.setField({
                fieldname: "title",
                value: data.value,
              });
            }}
          />
          <Form.Input
            id={`form-input-firstname-${fieldname}`}
            label={t("component.idCardReader.firstNames")}
            placeholder={t("component.idCardReader.firstNames")}
            value={profile.firstname}
            fluid
            onChange={(event: any, data: any) => {
              profile.setField({
                fieldname: "firstname",
                value: data.value,
              });
            }}
          />
          <Form.Input
            id={`form-input-lastname-${fieldname}`}
            label={t("component.idCardReader.lastNames")}
            placeholder={t("component.idCardReader.lastNames")}
            value={profile.lastname}
            fluid
            onChange={(event: any, data: any) => {
              profile.setField({
                fieldname: "lastname",
                value: data.value,
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
              id={`${fieldname}_year`}
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
              value={profile.birthDate || undefined}
              fieldName="birthDate"
              id={`${fieldname}_birthDate`}
              type="date"
              onChangeInputField={this.onChangeProfileInputField}
            />
          </div>

          <FormFieldCheckbox
            id={`form-input-is-only-birth-year-${fieldname}`}
            label={t("component.idCardReader.unknownDate")}
            label_checkbox={t("component.idCardReader.chooseOnlyYearBirth")}
            onChangeInputField={this.onChangeIsOnlyBirthYearInputField}
            fieldName="isOnlyBirthYear"
            checked={profile.isOnlyBirthYear}
          />
        </Form.Group>
        <Form.Field
          id={`form-display-age-${fieldname}`}
          label={t("component.idCardReader.age")}
          control={InputLabel}
          labelText={t("component.idCardReader.year")}
          placeholder="-"
          readOnly
          value={profile.ageDisplay(calculateAgeDate)}
        />
      </React.Fragment>
    );
  }

  private renderAddress() {
    const { address, t, fieldname, titleAddress } = this.props;
    return (
      <Form.Field
        id={fieldname}
        label={
          titleAddress
            ? titleAddress
            : t("component.idCardReader.addressPerIDCard")
        }
        width={16}
        control={AddressFormBody}
        addressStore={address}
        locationStore={this.locationStore}
      />
    );
  }
  private onChangeIDCardLifetime = (fieldname: string, value: any) => {
    const { profile } = this.props;
    profile.setField({ fieldname, value });
    if (value) {
      profile.setField({ fieldname: "idCardExpireDate", value: undefined });
    }
  };
  private onChangeIsOnlyBirthYearInputField = (
    fieldname: string,
    value: any
  ) => {
    const { profile } = this.props;
    profile.setField({ fieldname, value });
    if (value && profile.birthDate) {
      profile.setField({
        fieldname: "birthDate",
        value: profile.birthDate.substring(0, 4) + "-01-01",
      });
    }
  };
  private onChangeProfileInputField = (fieldname: string, value: any) => {
    const { profile } = this.props;
    profile.setField({ fieldname, value });
  };
  private async onClickButton() {
    const { address, profile } = this.props;
    try {
      await profile.getCardData();
      await this.idCard.getCardData();
      await address.setAllField(profile.idCardAddress);
    } catch (e) {
      console.log(e);
    } finally {
      await this.locationStore.loadSubdistrict(address.subDistrict);
      await this.locationStore.loadDistrict(address.district);
      await this.locationStore.loadProvince(address.province);
      await address.setField({
        fieldname: "provinceCode",
        value: this.locationStore.provinces[0]
          ? this.locationStore.provinces[0].refCode
          : "",
      });
      const subDistrict = this.locationStore.subdistricts.find((item: any) => {
        if (item.province) {
          return (
            item.province.refCode === address.provinceCode &&
            item.thName === address.subDistrict
          );
        } else {
          return "";
        }
      });
      const districtCode = this.locationStore.districts.find((item: any) => {
        if (item.province) {
          return item.province.refCode === address.provinceCode;
        } else {
          return "";
        }
      });
      await address.setField({
        fieldname: "subDistrictCode",
        value: subDistrict ? subDistrict.refCode : "",
      });
      await address.setField({
        fieldname: "zipcode",
        value: subDistrict ? subDistrict.zipcode : "",
      });
      await address.setField({
        fieldname: "districtCode",
        value: districtCode ? districtCode.refCode : "",
      });
      await this.setState({
        subDistrict: subDistrict ? subDistrict.thName : "",
      });
      await this.setState({
        district: districtCode ? districtCode.thName : "",
      });
      await this.setState({
        province: this.locationStore.provinces[0]
          ? this.locationStore.provinces[0].thName
          : "",
      });
    }
  }
  private async onClickButtonGdx() {
    const { address, profile } = this.props;
    try {
      await profile.getCardDataGdx();
      // await this.idCard.getCardData();
      await address.setAllField(profile.idCardAddress);
      //ฺbeer08082021 ดึงข้อมูลผู้เสียชีวิต
      if (profile.isCheckDeathData) {
        this.getReportDeathData();
      }
    } catch (e) {
      console.log(e);
    } finally {
      await this.locationStore.loadSubdistrict(address.subDistrict);
      await this.locationStore.loadDistrict(address.district);
      await this.locationStore.loadProvince(address.province);
      await address.setField({
        fieldname: "provinceCode",
        value: this.locationStore.provinces[0]
          ? this.locationStore.provinces[0].refCode
          : "",
      });
      const subDistrict = this.locationStore.subdistricts.find((item: any) => {
        if (item.province) {
          return (
            item.province.refCode === address.provinceCode &&
            item.thName === address.subDistrict
          );
        } else {
          return "";
        }
      });
      const districtCode = this.locationStore.districts.find((item: any) => {
        if (item.province) {
          return item.province.refCode === address.provinceCode;
        } else {
          return "";
        }
      });
      await address.setField({
        fieldname: "subDistrictCode",
        value: subDistrict ? subDistrict.refCode : "",
      });
      await address.setField({
        fieldname: "zipcode",
        value: subDistrict ? subDistrict.zipcode : "",
      });
      await address.setField({
        fieldname: "districtCode",
        value: districtCode ? districtCode.refCode : "",
      });
      await this.setState({
        subDistrict: subDistrict ? subDistrict.thName : "",
      });
      await this.setState({
        district: districtCode ? districtCode.thName : "",
      });
      await this.setState({
        province: this.locationStore.provinces[0]
          ? this.locationStore.provinces[0].thName
          : "",
      });
    }
  }
  private async getReportDeathData() {
    const { address, profile } = this.props;
    try {
      const result: any = await fetchNoService(
        `${process.env.REACT_APP_GDX_ENDPOINT}/gdx_request_deathcertificate.php`,
        {
          CitizenId: profile.idCardNo,
          AgentId: profile.idCardNoAgentId,
          report_format: "excel",
        },
        "report_"
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  private onChangeCheckboxDeathData = (fieldname: string, value: any) => {
    const { profile } = this.props;
    profile.setField({ fieldname, value });
    if (value) {
      profile.setField({ fieldname: "isCheckDeathData", value: true });
    }
  };
}
const styles: any = {
  formButton: {
    marginTop: 23,
  },
};
export default withTranslation()(IDCardReaderProfile);
