import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Icon, Table } from "semantic-ui-react";
import {
  AlertMessage,
  AttachedFile,
  DateInput,
  SubSectionContainer,
} from "../../../components/common";
import { CurrencyInput } from "../../../components/common/input";
import {
  NoPermissionMessage,
  PermissionControl
} from "../../../components/permission";
import { hasPermission } from "../../../utils/render-by-permission";
import { IDebtCollectionSueModel } from "../DebtCollectionModel";

interface IDebtCollectionSueForm extends WithTranslation {
  debtSue: IDebtCollectionSueModel;
  onUpdateDebtCollectionInfomationSue: () => Promise<any>;
  printCancelBorrower: () => void;
  printCancelGurantor: () => void;
  onCalculateInterestRate: () => Promise<any>;
  hidePrintButton: boolean;
}

@observer
class DebtCollectionSueForm extends React.Component<IDebtCollectionSueForm> {
  public render() {
    const { t, debtSue } = this.props;
    return (
      <Form>
        <Header
          size="medium"
          content={t(
            "module.debtCollection.debtCollectionSueForm.litigationInfomation"
          )}
          subheader={t(
            "module.debtCollection.debtCollectionSueForm.litigationInfomationDescription"
          )}
        />
        {hasPermission("DEBTCOLLECTION.LEGAL.EDIT") ? (
          <React.Fragment>
            {this.renderHeader()}
            {this.renderAttatchFile()}
          </React.Fragment>
        ) : (
          <NoPermissionMessage />
        )}
        <AlertMessage messageobj={debtSue.alert} float timeout={3000} />
      </Form>
    );
  }
  private renderHeader() {
    const {
      debtSue,
      printCancelBorrower,
      printCancelGurantor,
      onCalculateInterestRate,
      hidePrintButton,
      t
    } = this.props;
    return (
      <React.Fragment>
        <Form.Group widths={"equal"}>
          <Form.Field
            label={t(
              "module.debtCollection.debtCollectionSueForm.courtFilingDate"
            )}
            control={DateInput}
            value={debtSue.submitDate || undefined}
            fieldName="submitDate"
            onChangeInputField={this.onChangeInputField}
          />
          <Form.Field
            label={t(
              "module.debtCollection.debtCollectionSueForm.judgmentDate"
            )}
            control={DateInput}
            value={debtSue.judgementDate || undefined}
            fieldName="judgementDate"
            onChangeInputField={this.onChangeInputField}
          />
          <Form.Field
            label={t("module.debtCollection.debtCollectionSueForm.principle")}
            control={CurrencyInput}
            id={"input-debtSue-debtAmount"}
            value={debtSue.debtAmount}
            onChangeInputField={this.onChangeInputField}
            fieldName={"debtAmount"}
            onBlur={onCalculateInterestRate}
          />
        </Form.Group>
        <Form.Group widths={"equal"}>
          <Form.Field
            label={t(
              "module.debtCollection.debtCollectionSueForm.interestStartingDate"
            )}
            control={DateInput}
            value={debtSue.interestStartDate || undefined}
            fieldName="interestStartDate"
            onChangeInputField={this.onChangeInputField}
            onBlur={onCalculateInterestRate}
          />
          <Form.Field
            label={t(
              "module.debtCollection.debtCollectionSueForm.interestEndingDate"
            )}
            control={DateInput}
            value={debtSue.interestEndDate || undefined}
            fieldName="interestEndDate"
            onChangeInputField={this.onChangeInputField}
            onBlur={onCalculateInterestRate}
          />
          <Form.Field
            label={t("module.debtCollection.debtCollectionSueForm.interest")}
            control={CurrencyInput}
            id={"input-debtSue-interestRate"}
            placeholder={"0%"}
            value={debtSue.interestRate}
            onChangeInputField={this.onChangeInputField}
            fieldName={"interestRate"}
            onBlur={onCalculateInterestRate}
            labelText={"%"}
          />
        </Form.Group>
        {hidePrintButton ? null : (
          <Grid columns={"1"}>
            <Grid.Column textAlign={"right"}>
              <PermissionControl
                codes={["DEBTCOLLECTION.LEGAL.PRINT.CANCELLETTER"]}
              >
                <Button color={"orange"} onClick={printCancelBorrower}>
                  <Icon name="print" />
                  {t(
                    "module.debtCollection.debtCollectionSueForm.printDenounceTheBorrower"
                  )}
                </Button>
              </PermissionControl>
              <PermissionControl
                codes={["DEBTCOLLECTION.LEGAL.PRINT.GUARANTORLETTER"]}
              >
                <Button color={"purple"} onClick={printCancelGurantor}>
                  <Icon name="print" />
                  {t(
                    "module.debtCollection.debtCollectionSueForm.printDenounceTheGuarantor"
                  )}
                </Button>
              </PermissionControl>
            </Grid.Column>
          </Grid>
        )}
      </React.Fragment>
    );
  }

  private renderAttatchFile = () => {
    const { debtSue, onUpdateDebtCollectionInfomationSue, t } = this.props;
    return (
      <SubSectionContainer
        title={t("module.debtCollection.debtCollectionSueForm.attatchFile")}
        fluid
        basic
        stretch
        footer={
          <Button
            content={t("module.debtCollection.debtCollectionSueForm.submit")}
            color={"blue"}
            onClick={onUpdateDebtCollectionInfomationSue}
          />
        }
      >
        <AttachedFile
          files={debtSue.attachedFilesList}
          multiple
          addFiles={debtSue.addFiles}
          removeFile={(index?: number) => debtSue.removeFile(index!)}
          mode={"edit"}
          fieldName="debtSue.attachedFiles"
        />
      </SubSectionContainer>
    );
  };

  private onChangeInputField = (fieldname: string, value: any) => {
    const { debtSue } = this.props;
    debtSue.setField({ fieldname, value });
  };
}

export default withTranslation()(DebtCollectionSueForm);
