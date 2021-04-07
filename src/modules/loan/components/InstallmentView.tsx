import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { FormDisplay } from "../../../components/common";
import { date_display_CE_TO_BE } from "../../../utils";
import { currency } from "../../../utils/format-helper";

interface IInstallmentView extends WithTranslation {
  installmentAmount?: string;
  installmentPeriodValue?: string;
  installmentTimes?: number;
  installmentPeriodDay?: string;
  installmentFirstDate?: string;
  installmentLastDate?: string;
  installmentLastAmount?: string;
}

@observer
class InstallmentView extends React.Component<IInstallmentView> {
  public render() {
    const {
      installmentAmount,
      installmentPeriodValue,
      installmentTimes,
      installmentPeriodDay,
      installmentFirstDate,
      installmentLastDate,
      installmentLastAmount,
      t
    } = this.props;
    return (
      <Segment padded>
        <Form.Group widths="equal">
          <FormDisplay
            title={t(
              "module.loan.components.amountInstallmentPaymentsPerInstallment"
            )}
            value={t("module.loan.components.loanAmountBaht", {
              loanAmount: currency(installmentAmount, 2) || "-"
            })}
          />
          <FormDisplay
            title={t("module.loan.components.periodPerPeriod")}
            value={t("module.loan.components.installmentPeriodMonth", {
              value: installmentPeriodValue || "-"
            })}
          />
          <FormDisplay
            title={t("module.loan.components.totalInstallments")}
            value={t("module.loan.components.installmentTimesPeriod", {
              value: installmentTimes || "-"
            })}
          />
          <FormDisplay
            title={t("module.loan.components.paymentCycleDate")}
            value={t("module.loan.components.installmentPeriodDayMonth", {
              value: installmentPeriodDay || "-"
            })}
          />
        </Form.Group>

        <Form.Group widths="equal">
          <FormDisplay
            title={t("module.loan.components.firstPaymentDueDate")}
            value={date_display_CE_TO_BE(installmentFirstDate!) || "-"}
          />
          <FormDisplay
            title={t("module.loan.components.finalPaymentDueWithin")}
            value={date_display_CE_TO_BE(installmentLastDate!) || "-"}
          />
        </Form.Group>
        <FormDisplay
          title={t("module.loan.components.theFinalPaymentAmount")}
          value={t("module.loan.components.loanAmountBaht", {
            loanAmount: currency(installmentLastAmount, 2) || "-"
          })}
        />
      </Segment>
    );
  }
}

export default withTranslation()(InstallmentView);
