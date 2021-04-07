import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Header, Message } from "semantic-ui-react";
import { SubSectionContainer } from "../../../../components/common";
import { IRequestModel } from "../RequestModel";
import { IValidationModel } from "../ValidationModel";
import ValidationItems from "./ValidationItems";

interface IValidation extends WithTranslation {
  request: IRequestModel;
  precoditionCheck?: boolean;
}

@observer
class Validation extends React.Component<IValidation> {
  public render() {
    const { request, t, precoditionCheck } = this.props;
    return (
      <React.Fragment>
        <Header
          size="medium"
          content={t("module.loan.validation.checkProperties")}
          subheader={t("module.loan.validation.checkPropertiesDetails")}
        />
        {precoditionCheck ? (
          <Message negative>
            <Message.Header>
              {t(
                "module.loan.validation.notYetConfirmedResultsOfQualificationExamination"
              )}
            </Message.Header>
            <p>
              {t(
                "module.loan.validation.pleaseCheckConfirmQualificationResults"
              )}
            </p>
          </Message>
        ) : null}
        {request.validationChecklist &&
          request.validationChecklist!.map(
            (checkListGroup: IValidationModel, index: number) => (
              <SubSectionContainer
                stretch
                title={checkListGroup.label}
                key={index}
              >
                <ValidationItems
                  checkListItem={checkListGroup.checklist}
                  precoditionCheck={precoditionCheck}
                />
              </SubSectionContainer>
            )
          )}
      </React.Fragment>
    );
  }
}

export default withTranslation()(Validation);
