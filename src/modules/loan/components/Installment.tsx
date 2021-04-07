import { observer } from "mobx-react";
import moment from "moment";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { DateInput, FormDisplay, InputLabel } from "../../../components/common";
import { CurrencyInput } from "../../../components/common/input";
import { InstallmentTimeLimitation } from "../../../constants/APP_CONFICS";
import { currency } from "../../../utils/format-helper";

interface IInstallment extends WithTranslation {
  id: string;
  loanAmount?: number;
  installmentAmount?: string;
  installmentPeriodValue?: number;
  installmentTimes?: number;
  installmentPeriodDay?: number;
  installmentFirstDate?: string;
  installmentLastDate?: string;
  installmentLastAmount?: string;
  onChangeInputField: (fieldName: string, value: any) => void;
  editMode?: boolean;
  onRerender?: boolean;
}

@observer
class Installment extends React.Component<IInstallment> {
  private limitInstallmentTimes = InstallmentTimeLimitation;
  public componentDidUpdate(prevProps: any) {
    if (this.props.onRerender !== prevProps.onRerender) {
      this.onInstallmentAmountChange(this.props.installmentAmount);
    }
    if (this.props.loanAmount !== prevProps.loanAmount) {
      this.onInstallmentAmountChange(this.props.installmentAmount);
    }
  }

  public render() {
    const {
      loanAmount,
      installmentAmount,
      installmentPeriodValue,
      installmentTimes,
      installmentPeriodDay,
      installmentFirstDate,
      installmentLastDate,
      installmentLastAmount,
      onChangeInputField,
      editMode,
      id,
      t
    } = this.props;
    return (
      <Segment padded>
        <FormDisplay
          title={t("module.loan.components.calculatedBalance")}
          value={t("module.loan.components.loanAmountBaht", {
            loanAmount: currency(loanAmount)
          })}
        />
        <Form.Group widths="equal">
          <Form.Field
            label={t(
              "module.loan.components.amountInstallmentPaymentsPerInstallment"
            )}
            id={`input-installment-amount-${id}`}
            control={CurrencyInput}
            required
            requiredField={true}
            labelText={t("module.loan.components.baht")}
            readOnly={!editMode}
            value={installmentAmount}
            onChangeInputField={(fieldName: string, value: any) =>
              this.onInstallmentAmountChange(value)
            }
            fieldName={"installmentAmount"}
          />
          <Form.Field
            control={InputLabel}
            id={`input-installment-period-value-${id}`}
            label={t("module.loan.components.periodPerPeriod")}
            required
            requiredField={true}
            labelText={t("module.loan.components.month")}
            placeholder="0"
            type="number"
            readOnly={!editMode}
            value={installmentPeriodValue}
            onChangeInputField={(fieldName: string, value: any) =>
              this.onInstallmentPeriodValueChange(value)
            }
            fieldName={"installmentPeriodValue"}
          />
        </Form.Group>
        <Form.Field
          label={t("module.loan.components.totalInstallments")}
          id={`input-installment-times-${id}`}
          width={16}
          control={InputLabel}
          required
          requiredField={true}
          labelText={t("module.loan.components.period")}
          placeholder="0"
          type="number"
          max={this.limitInstallmentTimes}
          readOnly={!editMode}
          value={installmentTimes}
          onChangeInputField={(fieldName: string, value: any) =>
            this.onInstallmentTimeChange(value)
          }
          fieldName={"installmentTimes"}
        />
        <Form.Field
          id={`input-installment-period-day-${id}`}
          label={t("module.loan.components.paymentCycleDate")}
          width={16}
          control={InputLabel}
          labelText={t("module.loan.components.ofEveryMonth")}
          placeholder="0"
          type="number"
          readOnly={!editMode}
          value={installmentPeriodDay}
          onChangeInputField={onChangeInputField}
          fieldName={"installmentPeriodDay"}
        />
        <Form.Group widths="equal">
          <Form.Field
            required
            label={t("module.loan.components.firstPaymentDueDate")}
            control={DateInput}
            value={installmentFirstDate || undefined}
            fieldName="installmentFirstDate"
            onChangeInputField={(fieldName: string, value: any) =>
              this.onFirstDateChange(value)
            }
            id={`input-installment-first-date-${id}`}
          />
          <Form.Field
            required
            label={t("module.loan.components.finalPaymentDueWithin")}
            control={DateInput}
            value={installmentLastDate || undefined}
            fieldName="installmentLastDate"
            onChangeInputField={onChangeInputField}
            id={`input-installment-last-date-${id}`}
          />
        </Form.Group>
        <Form.Field
          label={t("module.loan.components.theFinalPaymentAmount")}
          width={16}
          id={`input-installment-last-amount-${id}`}
          control={CurrencyInput}
          labelText={t("module.loan.components.baht")}
          readOnly
          value={installmentLastAmount}
          onChangeInputField={onChangeInputField}
          fieldName={"installmentLastAmount"}
        />
      </Segment>
    );
  }
  private async onInstallmentAmountChange(value: any) {
    const { loanAmount, onChangeInputField } = this.props;
    const limitInstallmentTimes = this.limitInstallmentTimes;
    const condition = loanAmount && value && +value > 0 && +loanAmount > +value;
    // ถ้ายอดกู้มากกว่ายอดผ่อน หาเศษจาก ยอดกู้/ยอดผ่อน
    let mod: number = condition ? +loanAmount! % +value : 0;
    let time = Math.floor(condition ? +loanAmount! / +value : 0) + (mod > 0 ? 1 : 0);


    // ตรวจสอบ limitInstallmentTimes // 0 คือไม่จำกัด // default 36 สำหรับกองทุน ผส.
    if (limitInstallmentTimes && limitInstallmentTimes > 0) {
      if (time > limitInstallmentTimes) {
        const overLimitTimes = time - limitInstallmentTimes;
        // คำนวนยอดผ่อนงวดสุดท้ายใหม่
        // โดยดูจากหักจำนวนที่ต้องจ่ายก่อนงวดสุดท้ายออกจากยอดกู้ทั้งหมด 
        mod = +loanAmount! - ((limitInstallmentTimes - 1) * (+value));
        // กำหนดตำนวนงวดที่ต้องผ่อนเท่ากับ limit
        time = limitInstallmentTimes;
      }
    }
    onChangeInputField("installmentAmount", value);
    await onChangeInputField("installmentTimes", `${time}`);
    onChangeInputField("installmentLastAmount", `${mod}`);
    this.calInsallmentLastDate();
  }
  private async onInstallmentTimeChange(value: any) {
    const { loanAmount, onChangeInputField } = this.props;
    const installmentAmount = (loanAmount && value
      ? +loanAmount / +value
      : 0
    ).toFixed(2);

    await onChangeInputField("installmentTimes", value);
    onChangeInputField("installmentAmount", `${installmentAmount}`);
    onChangeInputField("installmentLastAmount", `${0}`);
    this.calInsallmentLastDate();
  }
  private async onInstallmentPeriodValueChange(value: any) {
    const {
      onChangeInputField
    } = this.props;

    await onChangeInputField("installmentPeriodValue", value);
    this.calInsallmentLastDate();

  }
  private onFirstDateChange(value: any) {
    const {
      onChangeInputField
    } = this.props;

    onChangeInputField("installmentFirstDate", value);
    this.calInsallmentLastDate();
  }
  private calInsallmentLastDate() {
    const {
      installmentTimes,
      installmentPeriodValue,
      onChangeInputField,
      installmentFirstDate
    } = this.props;

    const duration =
      installmentPeriodValue && installmentTimes
        ? ((+installmentPeriodValue * +installmentTimes) - 1)
        : 0;
    if (duration && installmentFirstDate) {
      onChangeInputField(
        "installmentLastDate",
        moment(installmentFirstDate)
          .add(duration, "month")
          .format("YYYY-MM-DD")
      );
    }
  }
}

export default withTranslation()(Installment);
