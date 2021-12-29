import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Icon } from "semantic-ui-react";
import {
  AttachedFile,
  FormDisplay,
  SubSectionContainer
} from "../../../components/common";
import {
  NoPermissionMessage,
  PermissionControl
} from "../../../components/permission";
import { date_display_CE_TO_BE } from "../../../utils/format-helper";
import { hasPermissionMode } from "../../../utils/render-by-permission";
import { IDebtCollectionSueModel } from "../DebtCollectionModel";

interface IDebtCollectionSueView extends WithTranslation {
  debtSue: IDebtCollectionSueModel;
  printCancelBorrower: () => void;
  printCancelGurantor: () => void;
  hidePrintButton: boolean;
  editMode?: boolean;
}

@observer
class DebtCollectionSueView extends React.Component<IDebtCollectionSueView> {
  public render() {
    const { editMode, t } = this.props;
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
        {hasPermissionMode(
          "DEBTCOLLECTION.LEGAL.VIEW",
          "DEBTCOLLECTION.LEGAL.EDIT",
          editMode
        ) ? (
          <React.Fragment>
            {this.renderHeader()}
            {this.renderAttatchFile()}
          </React.Fragment>
        ) : (
          <NoPermissionMessage />
        )}
      </Form>
    );
  }
  private renderHeader() {
    const {
      debtSue,
      printCancelBorrower,
      printCancelGurantor,
      hidePrintButton,
      t
    } = this.props;
    return (
      <React.Fragment>
        <Form.Group widths={"equal"}>
          <FormDisplay
            title={t(
              "module.debtCollection.debtCollectionSueForm.courtFilingDate"
            )}
            value={date_display_CE_TO_BE(debtSue.submitDate)}
          />
          {/* <FormDisplay
            title={t(
              "module.debtCollection.debtCollectionSueForm.judgmentDate"
            )}
            value={date_display_CE_TO_BE(debtSue.judgementDate)}
          /> */}
          <FormDisplay
            title={t("module.debtCollection.debtCollectionSueForm.principle")}
            value={debtSue.debtAmount || "-"}
          />
        </Form.Group>
        <Form.Group widths={"equal"}>
          {/* <FormDisplay
            title={t(
              "module.debtCollection.debtCollectionSueForm.interestStartingDate"
            )}
            value={date_display_CE_TO_BE(debtSue.interestStartDate)}
          />
          <FormDisplay
            title={t(
              "module.debtCollection.debtCollectionSueForm.interestEndingDate"
            )}
            value={date_display_CE_TO_BE(debtSue.interestEndDate)}
          />
          <FormDisplay
            title={t("module.debtCollection.debtCollectionSueForm.interest")}
            value={debtSue.interestRate || "-"}
          /> */}
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
    const { debtSue, t } = this.props;
    return (
      <SubSectionContainer
        title={t("module.debtCollection.debtCollectionSueForm.attatchFile")}
        fluid
        basic
        stretch
      >
        <AttachedFile
          files={debtSue.attachedFilesList}
          mode={"view"}
          emptyLabel={t(
            "module.debtCollection.debtCollectionSueForm.noAttatchFile"
          )}
        />
      </SubSectionContainer>
    );
  };
}

export default withTranslation()(DebtCollectionSueView);
