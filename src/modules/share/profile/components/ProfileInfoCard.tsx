import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { FormDisplay, InputLabel } from "../../../../components/common";
import { FormFieldCheckbox } from "../../../../components/common/formfield";
import { date_display_CE_TO_BE, idcardFormatting } from "../../../../utils";

import { IProfileModel } from "../ProfileModel";

interface IProfileInfoCard extends WithTranslation {
  profile: IProfileModel;
  noSegment?: boolean;
}

@observer
class ProfileInfoCard extends React.Component<IProfileInfoCard> {
  public render() {
    return this.props.noSegment! ? this.renderBody() : <Segment padded="very">{this.renderBody()}</Segment>;
  }

  private renderBody() {
    return (
      <React.Fragment>
        {this.renderCardInfo()}
        {this.renderPersonInfo()}
      </React.Fragment>
    );
  }

  private renderCardInfo() {
    const { profile, t } = this.props;
    return (
      <Form.Group widths="equal">
        <FormDisplay
          title={t("module.loan.searchForm.iDCardNumber")}
          value={idcardFormatting(profile.idCardNo) || "-"}
        />
        <FormDisplay title={t("component.idCardReader.out")} value={profile.idCardIssuer || "-"} />
        <FormDisplay
          title={t("component.idCardReader.cardIssuanceDate")}
          value={date_display_CE_TO_BE(profile.idCardIssuedDate) || "-"}
        />
        {!profile.idCardLifetime ? (
          <FormDisplay
            title={t("component.idCardReader.expiredDate")}
            value={date_display_CE_TO_BE(profile.idCardExpireDate) || "-"}
          />
        ) : null}
        <FormFieldCheckbox
          disabled
          label={t("module.loan.agreementFormInfoBorrower.cardType")}
          label_checkbox={t("module.loan.agreementFormInfoBorrower.lifetimeCard")}
          checked={profile.idCardLifetime}
        />
      </Form.Group>
    );
  }
  private renderPersonInfo() {
    const { profile, t } = this.props;
    return (
      <React.Fragment>
        <Form.Group widths="equal">
          <FormDisplay widht={2} title={t("component.idCardReader.prefix")} value={profile.title} />
          <FormDisplay title={t("component.idCardReader.firstNames")} value={profile.firstname || "-"} />
          <FormDisplay title={t("component.idCardReader.lastNames")} value={profile.lastname || "-"} />
          <FormDisplay
            title={t("component.idCardReader.dateBirth")}
            value={
              profile.isOnlyBirthYear
                ? date_display_CE_TO_BE(profile.birthDate).slice(-4) || "-"
                : date_display_CE_TO_BE(profile.birthDate) || "-"
            }
          />
          <FormFieldCheckbox
            disabled
            label={t("component.idCardReader.unknownDate")}
            label_checkbox={t("component.idCardReader.chooseOnlyYearBirth")}
            checked={profile.isOnlyBirthYear}
          />
        </Form.Group>

        <Form.Field
          label={t("component.idCardReader.age")}
          control={InputLabel}
          labelText={t("component.idCardReader.year")}
          placeholder="-"
          readOnly
          value={profile.age || "-"}
        />
      </React.Fragment>
    );
  }
}

export default withTranslation()(ProfileInfoCard);
