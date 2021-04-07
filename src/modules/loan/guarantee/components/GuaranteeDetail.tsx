import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment, Tab } from "semantic-ui-react";
import {
  GuaranteeBorrowerInfo,
  GuaranteeHeader,
  GuaranteeLoanDetails,
  GuaranteeOccuption
} from ".";
import { AddressBody } from "../../../../components/address";
import {
  FormDisplay,
  SubSectionContainer
} from "../../../../components/common";
import { ListBlock } from "../../../../components/common/block";
import { date_display_CE_TO_BE } from "../../../../utils";
import { hasPermission } from "../../../../utils/render-by-permission";
import { ProfileInfoCard } from "../../../share/profile/components";
import {
  AddressShort,
  RegistedAddressType,
  SignerView
} from "../../components";
import WitnessView from "../../components/WitnessView";
import { IGuaranteeItemModel, IGuaranteeModel } from "../GuaranteeModel";

interface IGuaranteeDetail extends WithTranslation {
  guarantee: IGuaranteeModel;
}
@observer
class GuaranteeDetail extends React.Component<IGuaranteeDetail> {
  public render() {
    const { guarantee } = this.props;
    return (
      <Segment padded="very">
        <Form>
          <GuaranteeHeader guarantee={guarantee} />
          {this.renderDocumentTrackDate()}
          {this.renderReferenceDocument()}
          {this.renderBody()}
        </Form>
      </Segment>
    );
  }
  private renderDocumentTrackDate() {
    const { guarantee, t } = this.props;
    const list = [];
    if (guarantee.documentDate) {
      list.push({
        title: t("module.loan.guaranteeDetail.contractSpecifiedDate"),
        description: date_display_CE_TO_BE(guarantee.documentDate),
        url: ""
      });
    }
    if (guarantee.startDate) {
      list.push({
        title: t("module.loan.guaranteeDetail.startDate"),
        description: date_display_CE_TO_BE(guarantee.startDate),
        url: ""
      });
    }
    if (guarantee.endDate) {
      list.push({
        title: t("module.loan.guaranteeDetail.contractEndDate"),
        description: date_display_CE_TO_BE(guarantee.endDate),
        url: ""
      });
    }

    if (guarantee.cancelDate) {
      list.push({
        title: t("module.loan.guaranteeDetail.dateContractTerminated"),
        description: date_display_CE_TO_BE(guarantee.cancelDate),
        url: ""
      });
    }
    return list.length > 0 ? <ListBlock list={list} /> : null;
  }
  private renderReferenceDocument() {
    const { guarantee, t } = this.props;
    const list = [];
    if (
      guarantee.request &&
      guarantee.request.id &&
      hasPermission("REQUEST.VIEW")
    ) {
      list.push({
        title: t("module.loan.guaranteeDetail.referenceDocument"),
        description: guarantee.request.documentNumber,
        url: `/loan/request/view/${guarantee.request.id}/${guarantee.request.documentNumber}`
      });
    }
    if (guarantee.agreementId && hasPermission("AGREEMENT.VIEW")) {
      list.push({
        title: t("module.loan.guaranteeDetail.referenceLoanContractNo"),
        description: guarantee.agreementDocumentNumber,
        url: `/loan/agreement/view/${guarantee.agreementId}/${guarantee.agreementDocumentNumber}`
      });
    }
    return list.length > 0 ? <ListBlock list={list} /> : null;
  }
  private renderBody() {
    const { t, guarantee } = this.props;
    return (
      <React.Fragment>
        <FormDisplay
          title={t("module.loan.guaranteeDetail.contractingLocation")}
          value={guarantee.signLocation || "-"}
        />
        <Form.Field
          label={t("module.loan.guaranteeDetail.letterGuaranteeLocation")}
          width={16}
          control={AddressShort}
          addressStore={guarantee.signLocationAddress}
        />
        <Form.Field
          label={t("module.loan.agreementDetail.authorizedPerson")}
          width={16}
          control={SignerView}
          agreementAuthorizedTitle={guarantee.agreementAuthorizedTitle}
          agreementAuthorizedFirstname={guarantee.agreementAuthorizedFirstname}
          agreementAuthorizedLastname={guarantee.agreementAuthorizedLastname}
          agreementAuthorizedPosition={guarantee.agreementAuthorizedPosition}
          agreementAuthorizedCommandNo={guarantee.agreementAuthorizedCommandNo}
          agreementAuthorizedCommandDate={
            guarantee.agreementAuthorizedCommandDate
          }
        />
        <Form.Field
          label={t("module.loan.agreementDetail.witness")}
          width={16}
          control={WitnessView}
          witness1={guarantee.witness1}
          witness2={guarantee.witness2}
        />
        {this.renderGuarantorAndBorrower()}
        <Form.Field
          label={t("module.loan.guaranteeDetail.loanDetails")}
          width={16}
          control={GuaranteeLoanDetails}
          guarantee={guarantee}
        />
      </React.Fragment>
    );
  }
  private renderGuarantorAndBorrower() {
    const { guarantee, t } = this.props;
    switch (guarantee.guaranteeType) {
      case "G":
        const panes = guarantee.guaranteeItems.map(
          (item: IGuaranteeItemModel, index: number) => ({
            menuItem: "# " + (index + 1).toString(),
            render: () => (
              <Tab.Pane key={index}>
                <Form.Field>
                  <label>
                    {t("module.loan.guaranteeDetail.vendorInformation")}
                  </label>
                  <Segment padded>
                    <ProfileInfoCard profile={item.guarantor} noSegment />
                    <Form.Field
                      label={t(
                        "module.loan.guaranteeDetail.addressAccordingToTheIDCard"
                      )}
                      width={16}
                      control={AddressBody}
                      addressStore={item.guarantorIdCardAddress}
                    />
                    <Form.Field
                      label={t("module.loan.agreementDetail.houseAddress")}
                      width={16}
                      control={RegistedAddressType}
                      inputFieldAddressType="guarantorRegisteredAddressType"
                      readOnly
                      valueFieldAddressType={item.guarantorRegisteredAddressType}
                    />
                    {item.guarantorRegisteredAddressType === 99 ? (
                      <Form.Field
                        label={t("module.loan.guaranteeDetail.otherAddress")}
                        width={16}
                        control={AddressBody}
                        addressStore={item.guarantorRegisteredAddress}
                      />
                    ) : null}
                    <Form.Field
                      label={t("module.loan.guaranteeGuarantorInfo.occupation")}
                      width={16}
                      control={GuaranteeOccuption}
                      guarantorOccupation={item.guarantorOccupation}
                      guarantorSalary={item.guarantorSalary}
                      guarantorCompanyName={item.guarantorCompanyName}
                      guarantorPosition={item.guarantorPosition}
                    />
                    <FormDisplay
                      title={t("module.loan.agreementDetail.telephoneNumber")}
                      value={item.guarantorTelephone || "-"}
                    />
                  </Segment>
                </Form.Field>

                <Form.Field
                  label={t("module.loan.guaranteeDetail.informationBorrowers")}
                  control={GuaranteeBorrowerInfo}
                  guaranteeItem={item}
                />
              </Tab.Pane>
            )
          })
        );
        return (
          <SubSectionContainer
            title={t("module.loan.guaranteeDetail.listGuarantee")}
            style={styles.container}
            stretch
            basic
            fluid
          >
            <Tab
              panes={panes}
              menu={{
                tabular: true,
                attached: true,
                fluid: true,
                widths: guarantee.guaranteeItems.length
              }}
            />
          </SubSectionContainer>
        );
      default:
        return (
          <React.Fragment>
            {guarantee.guaranteeItems.map(
              (item: IGuaranteeItemModel, index: number) => {
                return (
                  <React.Fragment key={index}>
                    <Form.Field>
                      <label>
                        {t("module.loan.guaranteeDetail.vendorInformation")}
                      </label>
                      <Segment padded>
                        <ProfileInfoCard profile={item.guarantor} noSegment />
                        <Form.Field
                          label={t(
                            "module.loan.guaranteeDetail.addressAccordingToTheIDCard"
                          )}
                          width={16}
                          control={AddressBody}
                          addressStore={item.guarantorIdCardAddress}
                        />
                        <Form.Field
                          label={t("module.loan.agreementDetail.houseAddress")}
                          width={16}
                          control={RegistedAddressType}
                          inputFieldAddressType="guarantorRegisteredAddressType"
                          readOnly
                          valueFieldAddressType={item.guarantorRegisteredAddressType}
                        />
                        {item.guarantorRegisteredAddressType === 99 ? (
                          <Form.Field
                            label={t(
                              "module.loan.guaranteeDetail.otherAddress"
                            )}
                            width={16}
                            control={AddressBody}
                            addressStore={item.guarantorRegisteredAddress}
                          />
                        ) : null}
                        <Form.Field
                          label={t(
                            "module.loan.guaranteeGuarantorInfo.occupation"
                          )}
                          width={16}
                          control={GuaranteeOccuption}
                          guarantorOccupation={item.guarantorOccupation}
                          guarantorSalary={item.guarantorSalary}
                          guarantorCompanyName={item.guarantorCompanyName}
                          guarantorPosition={item.guarantorPosition}
                        />
                        <FormDisplay
                          title={t(
                            "module.loan.agreementDetail.telephoneNumber"
                          )}
                          value={item.guarantorTelephone || "-"}
                        />
                      </Segment>
                    </Form.Field>
                    <Form.Field
                      label={t(
                        "module.loan.guaranteeDetail.informationBorrowers"
                      )}
                      control={GuaranteeBorrowerInfo}
                      guaranteeItem={item}
                    />
                  </React.Fragment>
                );
              }
            )}
          </React.Fragment>
        );
    }
  }
}

const styles: any = {
  formGroup: {
    marginBottom: 0
  }
};

export default withTranslation()(GuaranteeDetail);
