import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Segment } from "semantic-ui-react";
import { FormDisplay } from "../../../../components/common";
import { CurrencyInput } from "../../../../components/common/input";
import { OcupationDDL } from "../../../admin/occupation/components";
import { OcupationListModel } from "../../../admin/occupation/OcupationListModel";
import { IOcupationModel } from "../../../admin/occupation/OcupationModel";
import { IRequestModel } from "../RequestModel";

interface IRequesObjective extends WithTranslation {
  request: IRequestModel;
  readOnly?: boolean;
}
@observer
class RequesObjective extends React.Component<IRequesObjective> {
  private ocupationList = OcupationListModel.create({});
  public render() {
    const { request, readOnly, t } = this.props;
    return (
      <Segment padded>
        <Form.Field
          required
          id={"input-request-request-budget"}
          label={t("module.loan.requestDetail.balance")}
          control={CurrencyInput}
          readOnly={readOnly}
          labelText={t("module.loan.requestDetail.baht")}
          value={request.requestBudget}
          fieldName="requestBudget"
          onChangeInputField={this.onChangeInputFieldBudget}
        />
        <Form.Group widths="equal">
          {readOnly ? (
            <FormDisplay
              title={t("module.loan.requestDetail.toUsedCareer")}
              value={request.requestOccupation.name}
            />
          ) : (
            <Form.Field
              required
              disabled={readOnly}
              label={t("module.loan.requestDetail.toUsedCareer")}
              placeholder={t("module.loan.requestDetail.pleaseChooseCareer")}
              control={OcupationDDL}
              value={request.requestOccupation.id}
              ocupationList={this.ocupationList}
              onChange={this.onChangeOcupationDDL}
              ocupationType="request"
            />
          )}
          {readOnly ? (
            <FormDisplay
              title={t("module.loan.requestDetail.description")}
              value={request.requestOccupation.description}
            />
          ) : (
            <Form.Input
              required
              fluid
              label={t("module.loan.requestDetail.description")}
              placeholder={t("module.loan.requestDetail.specifyCareerDetails")}
              onChange={(event: any, data: any) =>
                request.requestOccupation!.setField({
                  fieldname: "description",
                  value: data.value
                })
              }
              value={request.requestOccupation.description}
            />
          )}
        </Form.Group>
      </Segment>
    );
  }
  private onChangeInputFieldBudget = (fieldname: string, value: any) => {
    const { request } = this.props;
    const cleanValue = value.replace(/[^\d.]/g, "");
    const numberFloat = parseFloat(cleanValue);
    if (numberFloat > 30000) {
      request.setField({ fieldname, value: "30000" });
    } else {
      request.setField({ fieldname, value });
    }
  };
  private onChangeOcupationDDL = (id: any) => {
    const { request } = this.props;
    if (this.ocupationList.list.length > 0) {
      const item = this.ocupationList.list.find(
        (item: IOcupationModel) => item.id === id
      );
      if (item) {
        request!.requestOccupation.setField({
          fieldname: "id",
          value: item.id
        });
        request!.requestOccupation.setField({
          fieldname: "salary",
          value: item.salary
        });
        request!.requestOccupation.setField({
          fieldname: "description",
          value: item.description
        });
        request!.requestOccupation.setField({
          fieldname: "name",
          value: item.name
        });
      }
    }
  };
}

export default withTranslation()(RequesObjective);
