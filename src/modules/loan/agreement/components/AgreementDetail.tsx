import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment, Tab, Button, Header } from "semantic-ui-react";
import { AgreementGuarantorInfo, AgreementHeader } from ".";
import { AddressBody } from "../../../../components/address";
import {
  FormDisplay,
  SubSectionContainer
} from "../../../../components/common";
import { ListBlock } from "../../../../components/common/block";
import { date_display_CE_TO_BE } from "../../../../utils";
import { ProfileInfoCard } from "../../../share/profile/components";
import {
  AddressShort,
  InstallmentView,
  LoanDetailsView,
  RegistedAddressType
} from "../../components";

import { hasPermission } from "../../../../utils/render-by-permission";
import SignerView from "../../components/SignerView";
import WitnessView from "../../components/WitnessView";
import { IAgreementItemModel, IAgreementModel } from "../AgreementModel";
import { fetchNoService } from "../../../../utils/request-noservice";

interface IAgreementDetail extends WithTranslation {
  agreement: IAgreementModel;
}
@observer
class AgreementDetail extends React.Component<IAgreementDetail> {
  public render() {
    const { agreement } = this.props;
    return (
      <Segment padded="very">
        <AgreementHeader agreement={agreement} />
        {this.renderDocumentTrackDate()}
        {this.renderReferenceDocument()}
        {this.renderAgreementBody()}
      </Segment>
    );
  }
  private renderReferenceDocument() {
    const { agreement, t } = this.props;
    const list = [];
    if (agreement.request && agreement.request.id) {
      list.push({
        title: t("module.loan.agreementDetail.referenceDocument"),
        description: agreement.request.documentNumber,
        url: `/loan/request/view/${agreement.request.id}/${agreement.request.documentNumber}`
      });
    }
    if (agreement.guaranteeId && hasPermission("AGREEMENT.VIEW")) {
      list.push({
        title: t(
          "module.loan.agreementDetail.referenceNumberOfTheContractOfGuarantee"
        ),
        description: agreement.guaranteeDocumentNumber,
        url: `/loan/guarantee/view/${agreement.guaranteeId}/${agreement.guaranteeDocumentNumber}`
      });
    }
    return list.length > 0 ? <ListBlock list={list} /> : null;
  }
  private renderDocumentTrackDate() {
    const { agreement, t } = this.props;
    const list = [];
    if (agreement.documentDate) {
      list.push({
        title: t("module.loan.agreementDetail.contractSpecifiedDate"),
        description: date_display_CE_TO_BE(agreement.documentDate),
        url: ""
      });
    }
    if (agreement.startDate) {
      list.push({
        title: t("module.loan.agreementDetail.startDate"),
        description: date_display_CE_TO_BE(agreement.startDate),
        url: ""
      });
    }
    if (agreement.endDate) {
      list.push({
        title: t("module.loan.agreementDetail.contractEndDate"),
        description: date_display_CE_TO_BE(agreement.endDate),
        url: ""
      });
    }
    if (agreement.loanPaymentDate) {
      list.push({
        title: t("module.loan.agreementDetail.dateOfTransfer"),
        description: date_display_CE_TO_BE(agreement.loanPaymentDate),
        url: ""
      });
    }
    if (agreement.disclaimDate) {
      list.push({
        title: t("module.loan.agreementDetail.waiverDate"),
        description: date_display_CE_TO_BE(agreement.disclaimDate),
        url: ""
      });
    }
    if (agreement.cancelDate) {
      list.push({
        title: t("module.loan.agreementDetail.contractCancellationDate"),
        description: date_display_CE_TO_BE(agreement.cancelDate),
        url: ""
      });
    }
    if (agreement.closeDate) {
      list.push({
        title: t("module.loan.agreementDetail.accountClosingDate"),
        description: date_display_CE_TO_BE(agreement.closeDate),
        url: ""
      });
    }
    return list.length > 0 ? <ListBlock list={list} /> : null;
  }
  private renderAgreementBody() {
    const { t, agreement } = this.props;
    return (
      <Form>
        <FormDisplay
          title={t("module.loan.agreementDetail.contractingLocation")}
          value={agreement.signLocation || "-"}
        />
        <Form.Field
          label={t("module.loan.agreementDetail.contractingAddress")}
          width={16}
          control={AddressShort}
          addressStore={agreement.signLocationAddress}
        />
        <Form.Field
          label={t("module.loan.agreementDetail.authorizedPerson")}
          width={16}
          control={SignerView}
          agreementAuthorizedTitle={agreement.agreementAuthorizedTitle}
          agreementAuthorizedFirstname={agreement.agreementAuthorizedFirstname}
          agreementAuthorizedLastname={agreement.agreementAuthorizedLastname}
          agreementAuthorizedPosition={agreement.agreementAuthorizedPosition}
          agreementAuthorizedCommandNo={agreement.agreementAuthorizedCommandNo}
          agreementAuthorizedCommandDate={
            agreement.agreementAuthorizedCommandDate
          }
        />
        <Form.Field
          label={t("module.loan.agreementDetail.witness")}
          width={16}
          control={WitnessView}
          witness1={agreement.witness1}
          witness2={agreement.witness2}
        />
        {this.renderBorrowerAndGuarantor()}
        <Form.Field>
          <label>
            {t(
              "module.loan.agreementDetail.informationAboutLoanGuaranteesSpecifiedContract"
            )}
          </label>
          <Segment padded>
            <FormDisplay
              title={t("module.loan.agreementDetail.documentNumberGuarantee")}
              value={agreement.guaranteeDocumentNumber || "-"}
            />
            <FormDisplay
              title={t("module.loan.agreementDetail.dateGuaranteeContract")}
              value={
                date_display_CE_TO_BE(agreement.guaranteeDocumentDate) || "-"
              }
            />
          </Segment>
        </Form.Field>
        <Form.Field
          label={t("module.loan.agreementDetail.loanDetails")}
          width={16}
          control={LoanDetailsView}
          loanAmount={agreement.loanAmount}
          loanDurationYear={agreement.loanDurationYear}
          loanDurationMonth={agreement.loanDurationMonth}
        />
        <FormDisplay
          title={t("module.loan.agreementDetail.contractedPaymentLocation")}
          value={agreement.loanPaymentLocation || "-"}
        />
        <Form.Field
          label={t("module.loan.agreementDetail.loanRepayment")}
          width={16}
          control={InstallmentView}
          installmentAmount={agreement.installmentAmount}
          installmentPeriodValue={agreement.installmentPeriodValue}
          installmentTimes={agreement.installmentTimes}
          installmentPeriodDay={agreement.installmentPeriodDay}
          installmentFirstDate={agreement.installmentFirstDate}
          installmentLastDate={agreement.installmentLastDate}
          installmentLastAmount={agreement.installmentLastAmount}
          editMode={false}
        />
        <Form.Input
          floated="right"
          id={`form-input-id-card`}
          label={t("component.idCardReader.iDCardNumberAgentId")}
          icon="id card"
          iconPosition="left"
          placeholder="0000000000000"
          width="4"
          maxLength="13"
          value={agreement.idCardNoAgentId}
          onChange={(event, data) => {
            agreement.setField({
              fieldname: "idCardNoAgentId",
              value: data.value,
            });
          }}
        />
        <Button
          width={7}
          onClick={this.getReportDeathData}
        >
          {"ดึงข้อมูลผู้กู้กรณีเสียชีวิต"}
        </Button><br />กรุณา Login เชื่อมต่อระบบ GovAMI ก่อนดึงข้อมูล
      </Form>
    );
  }
  private renderBorrowerAndGuarantor() {
    const { agreement, t } = this.props;
    switch (agreement.agreementType) {
      case "G":
        const panes = agreement.agreementItems.map(
          (item: IAgreementItemModel, index: number) => ({
            menuItem: "#  " + (index + 1).toString(),
            render: () => (
              <Tab.Pane key={index}>
                <Form.Field>
                  <label>
                    {t("module.loan.agreementDetail.informationBorrowers")}
                  </label>
                  <Segment padded>
                    <ProfileInfoCard profile={item.borrower} noSegment />
                    <Form.Field
                      label={t("module.loan.agreementDetail.addressPerIDCard")}
                      width={16}
                      control={AddressBody}
                      addressStore={item.borrowerIdCardAddress}
                    />
                    <Form.Field
                      label={t("module.loan.agreementDetail.houseAddress")}
                      width={16}
                      control={RegistedAddressType}
                      readOnly
                      inputFieldAddressType="borrowerRegisteredAddressType"
                      valueFieldAddressType={item.borrowerRegisteredAddressType}
                    />
                    {item.borrowerRegisteredAddressType === 99 ? (
                      <Form.Field
                        label={t("module.loan.agreementDetail.otherAddress")}
                        width={16}
                        control={AddressBody}
                        addressStore={item.borrowerRegisteredAddress}
                      />
                    ) : null}
                    <FormDisplay
                      title={t("module.loan.agreementDetail.telephoneNumber")}
                      value={item.borrowerTelephone || "-"}
                    />
                  </Segment>
                </Form.Field>
                <Form.Field
                  label={t("module.loan.agreementDetail.vendorInformation")}
                  control={AgreementGuarantorInfo}
                  agreementItem={item}
                />
              </Tab.Pane>
            )
          })
        );
        return (
          <SubSectionContainer
            title={t("module.loan.agreementDetail.listBorrowers")}
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
                widths: agreement.agreementItems.length
              }}
            />
          </SubSectionContainer>
        );
      default:
        return (
          <React.Fragment>
            {agreement.agreementItems.map(
              (item: IAgreementItemModel, index: number) => {
                return (
                  <React.Fragment key={index}>
                    <Form.Field>
                      <label>
                        {t("module.loan.agreementDetail.informationBorrowers")}
                      </label>
                      <Segment padded>
                        <ProfileInfoCard profile={item.borrower} noSegment />
                        <Form.Field
                          label={t(
                            "module.loan.agreementDetail.addressPerIDCard"
                          )}
                          width={16}
                          control={AddressBody}
                          addressStore={item.borrowerIdCardAddress}
                        />
                        <Form.Field
                          label={t("module.loan.agreementDetail.houseAddress")}
                          width={16}
                          control={RegistedAddressType}
                          readOnly
                          inputFieldAddressType="borrowerRegisteredAddressType"
                          valueFieldAddressType={
                            item.borrowerRegisteredAddressType
                          }
                        />
                        {item.borrowerRegisteredAddressType === 99 ? (
                          <Form.Field
                            label={t(
                              "module.loan.agreementDetail.otherAddress"
                            )}
                            width={16}
                            control={AddressBody}
                            addressStore={item.borrowerRegisteredAddress}
                          />
                        ) : null}
                        <FormDisplay
                          title={t(
                            "module.loan.agreementDetail.telephoneNumber"
                          )}
                          value={item.borrowerTelephone || "-"}
                        />
                      </Segment>
                    </Form.Field>
                    <Form.Field
                      label={t("module.loan.agreementDetail.vendorInformation")}
                      control={AgreementGuarantorInfo}
                      agreementItem={item}
                    />
                  </React.Fragment>
                );
              }
            )}
          </React.Fragment>
        );
    }
  }
  private getReportDeathData = async () => {
    const { agreement } = this.props;
    try {
      // console.log(agreement.idCardNoAgentId)
      // console.log(agreement.idcard)
      const result: any = await fetchNoService(
        `${process.env.REACT_APP_GDX_ENDPOINT}/gdx_request_deathcertificate.php`,
        {
          CitizenID: agreement.idcard,
          AgentID: agreement.idCardNoAgentId,
          report_format: "excel",
        },
        "report_death"
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

}

const styles: any = {
  container: {
    marginBottom: 7
  }
};

export default withTranslation()(AgreementDetail);
