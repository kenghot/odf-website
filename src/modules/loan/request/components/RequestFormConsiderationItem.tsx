import { inject, observer } from "mobx-react";
import moment from "moment";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Icon, Radio, Segment } from "semantic-ui-react";
import { IAppModel } from "../../../../AppModel";
import { DateInput, FormDisplay } from "../../../../components/common";
import { CurrencyInput } from "../../../../components/common/input";
import { Loading } from "../../../../components/common/loading";
import { COLORS } from "../../../../constants";
import { date_display_CE_TO_BE } from "../../../../utils/format-helper";
import { IResultModel } from "../RequestModel";

interface IRequestFormConsiderationItem extends WithTranslation {
  resultItem: IResultModel;
  activeLoading: boolean;
  appStore?: IAppModel;
  readOnly?: boolean;
  onUpdate?: () => void;
  formId: string;
  label?: string;
  childrendView?: any;
  childrenEdit?: any;
  requestType: string;
  limitBudget?: string;
}

@inject("appStore")
@observer
class RequestFormConsiderationItem extends React.Component<
  IRequestFormConsiderationItem
> {
  public state = {
    editMode: false
  };
  public render() {
    const { editMode } = this.state;
    return editMode ? this.renderEditMode() : this.renderViewMode();
  }
  private renderViewMode() {
    const {
      appStore,
      resultItem,
      readOnly,
      childrendView,
      label,
      t
    } = this.props;
    return (
      <Form style={styles.form}>
        <Form.Field width={16}>
          <label>{label}</label>
          <Segment padded>
            <Form.Group widths="equal">
              <FormDisplay
                title={t("module.loan.requestDetail.date")}
                value={date_display_CE_TO_BE(resultItem.meetingDate) || "-"}
                width={5}
              />
              <FormDisplay
                title={t("module.loan.requestDetail.fromMeeting")}
                value={`${resultItem.meetingNumber}` || "-"}
                width={4}
              />
              <FormDisplay
                title={t("module.loan.requestDetail.result")}
                value={
                  appStore!.enumItemLabel("resultType", resultItem.result) ||
                  "-"
                }
                width={3}
              />
              <FormDisplay
                title={t("module.loan.requestDetail.approvedLimit")}
                value={`${resultItem.approveBudget}` || "-"}
                width={3}
              />
              <Form.Field width={1}>
                {readOnly ? null : (
                  <Icon
                    name="edit outline"
                    circular
                    inverted
                    color="teal"
                    onClick={() => {
                      this.setupBudgetValue();
                      this.setState({ editMode: true });
                    }}
                  />
                )}
              </Form.Field>
            </Form.Group>
            {childrendView ? childrendView : null}
            <FormDisplay
              title={t("module.loan.requestDetail.additionalComments")}
              value={resultItem.comments || "-"}
              width={16}
            />
          </Segment>
        </Form.Field>
      </Form>
    );
  }
  private renderEditMode() {
    const {
      activeLoading,
      resultItem,
      formId,
      appStore,
      label,
      childrenEdit,
      t
    } = this.props;
    return (
      <Form style={styles.form} onSubmit={this.onUpdate}>
        <Form.Field width={16}>
          <label>{label}</label>
          <Segment padded style={styles.segment}>
            <Loading active={activeLoading} />
            <Form.Field width={16}>
              <Icon
                name="x"
                onClick={() => {
                  this.setState({ editMode: false });
                }}
                link
                style={{ float: "right" }}
              />
            </Form.Field>
            <Form.Group widths="equal">
              <Form.Field
                width={10}
                label={t("module.loan.requestDetail.date")}
                control={DateInput}
                value={resultItem.meetingDate || undefined}
                fieldName="meetingDate"
                onChangeInputField={this.onChangeInputField}
                id={`${formId}_meetingDate`}
              />
              <Form.Input
                label={t("module.loan.requestDetail.fromMeeting")}
                fluid
                placeholder={t("module.loan.requestDetail.specifyMeetingTime")}
                value={resultItem.meetingNumber}
                onChange={(event: any, data: any) => {
                  resultItem.setField({
                    fieldname: "meetingNumber",
                    value: data.value
                  });
                }}
              />
            </Form.Group>

            <Form.Field>
              <label>{t("module.loan.requestDetail.result")}</label>
              <Segment padded>
                <Form.Group inline style={styles.radio}>
                  {appStore!
                    .enumItems("resultType")
                    .map((item: any, index: number) => (
                      <React.Fragment key={index}>
                        <Form.Field
                          control={Radio}
                          label={item.text}
                          value={item.value}
                          onChange={(
                            event: React.SyntheticEvent<HTMLElement>,
                            data: any
                          ) => this.onChangeInputField("result", data.value)}
                          checked={resultItem.result === item.value}
                        />
                      </React.Fragment>
                    ))}
                </Form.Group>
              </Segment>
            </Form.Field>
            <Form.Field
              required
              requiredField={true}
              label={t("module.loan.requestDetail.approvedLimit")}
              width={16}
              id={`input-request-resultItem-${formId}-approveBudget`}
              control={CurrencyInput}
              labelText={t("module.loan.requestDetail.baht")}
              fieldName="approveBudget"
              value={resultItem.approveBudget}
              onChangeInputField={this.onChangeInputFieldApproveBudget}
            />
            {childrenEdit ? childrenEdit : null}
            <Form.TextArea
              width={16}
              label={t("module.loan.requestDetail.additionalComments")}
              placeholder={t("module.loan.requestDetail.pleaseSpecify")}
              value={resultItem.comments}
              onChange={(event: any, data: any) => {
                resultItem.setField({
                  fieldname: "comments",
                  value: data.value
                });
              }}
            />
            <Form.Button type="submit" floated="right" color="blue">
              {t("module.loan.requestDetail.save")}
            </Form.Button>
          </Segment>
        </Form.Field>
      </Form>
    );
  }
  private setupBudgetValue() {
    const { resultItem, limitBudget } = this.props;
    if (
      !resultItem.approveBudget ||
      resultItem.approveBudget === "" ||
      +resultItem.approveBudget === 0
    ) {
      resultItem.setField({ fieldname: "approveBudget", value: limitBudget });
    }
    if (!resultItem.meetingDate || resultItem.meetingDate === "") {
      resultItem.setField({
        fieldname: "meetingDate",
        value: moment().format("YYYY-MM-DD")
      });
    }
  }
  private onUpdate = async () => {
    const { onUpdate } = this.props;
    if (typeof onUpdate !== "undefined") {
      try {
        await onUpdate();
      } catch (e) {
        console.log(e);
      } finally {
        this.setState({ editMode: false });
      }
    }
  };
  private onChangeInputField = (fieldname: string, value: any) => {
    const { resultItem } = this.props;
    resultItem.setField({ fieldname, value });
  };
  private onChangeInputFieldApproveBudget = (fieldname: string, value: any) => {
    const { resultItem, requestType } = this.props;
    if (requestType === "G") {
      if (+value > 100000) {
        resultItem.setField({ fieldname, value: 100000 });
      } else {
        resultItem.setField({ fieldname, value });
      }
    } else {
      if (+value > 30000) {
        resultItem.setField({ fieldname, value: 30000 });
      } else {
        resultItem.setField({ fieldname, value });
      }
    }
  };
}
const styles: any = {
  radio: {
    marginBottom: 0
  },
  segment: {
    paddingBottom: 50,
    background: COLORS.solitude
  },
  form: {
    marginBottom: 18
  }
};

export default withTranslation()(RequestFormConsiderationItem);
