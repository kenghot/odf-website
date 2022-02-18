import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Header, Segment, Tab,Grid,Icon } from "semantic-ui-react";
import {
  DebtCollectionLetterTable,
  DebtCollectionMemoTable,
  DebtCollectionReportDeathForm,
  DebtCollectionSueResultForm,
  DebtCollectionSueResultView,
  DebtCollectionVisitTable
} from ".";
import { COLORS } from "../../../constants";
import {
  hasPermission,
  hasPermissionMode
} from "../../../utils/render-by-permission";
import { IAuthModel } from "../../auth/AuthModel";
import { IDebtCollectionModel } from "../DebtCollectionModel";
import DebtCollectionSueForm from "./DebtCollectionSueForm";
import DebtCollectionSueView from "./DebtCollectionSueView";
import {
  NoPermissionMessage,
  PermissionControl
} from "../../../components/permission";

interface IDebtCollectionFormBody extends WithTranslation {
  debtCollection: IDebtCollectionModel;
  editMode?: boolean;
  authStore?: IAuthModel;
}
@inject("authStore")
@observer
class DebtCollectionFormBody extends React.Component<IDebtCollectionFormBody> {
  public render() {
    const { t, debtCollection, editMode } = this.props;
    /// for re render ///
    const tempLetterListBorrower = debtCollection.letter_list_borrower;
    const tempLetterListGuarantor = debtCollection.letter_list_guarantor;
    const tempLetterListAscertainHeirs =
      debtCollection.letter_list_ascertain_heirs;
      const tempLetterListAscertainHeirsGurantor =
      debtCollection.letter_list_ascertain_heirs_gurantor;
    const tempLetterListInheritance = debtCollection.letter_list_inheritance;
    const debtSue = debtCollection.debtSue;
    const name = debtCollection.deathNotification.name;
    const position = debtCollection.deathNotification.position;
    /// for re render ///
    const panes = [
      {
        menuItem: debtCollection.isPassAway
          ? t(
              "module.debtCollection.debtCollectionFormBody.investigateHeirsInheritanceManagers"
            )
          : t("module.debtCollection.debtCollectionFormBody.makeDemandLetter"),
        render: () => (
          <Tab.Pane>
            <Segment basic>{this.renderLetterTab()}</Segment>
          </Tab.Pane>
        )
      },
      {
        menuItem: debtCollection.isPassAway
          ? t(
              "module.debtCollection.debtCollectionFormBody.notifyEligibleStatutoryHeir"
            )
          : t("module.debtCollection.debtCollectionFormBody.followDomicile"),
        render: () => (
          <Tab.Pane>
            <Segment basic>{this.renderVisitTab()}</Segment>
          </Tab.Pane>
        )
      },
      {
        menuItem: t("module.debtCollection.debtCollectionFormBody.makeContractCancel"),
        render: () => (
          <Tab.Pane>
            <Segment basic> {this.renderDebtCollectionMakePrintCancel()}</Segment>
          </Tab.Pane>
        )
      },
      {
        menuItem: t("module.debtCollection.debtCollectionFormBody.prosecute"),
        render: () => (
          <Tab.Pane>
            <Segment basic>
              {this.renderDebtCollectionSue()}
              <br />
              {this.renderDebtCollectionSueResult()}
            </Segment>
          </Tab.Pane>
        )
      }
    ];
    return (
      <React.Fragment>
        <Header
          size="medium"
          content={t(
            "module.debtCollection.debtCollectionFormBody.debtTracking"
          )}
          subheader={t(
            "module.debtCollection.debtCollectionFormBody.recordDebtCollection"
          )}
        />
        <Segment basic style={styles.segment}>
          {this.renderButtonGroup()}
          {debtCollection.isPassAway ? (
            <DebtCollectionReportDeathForm
              name={name}
              position={position}
              debtCollection={debtCollection}
              editMode={editMode}
            />
          ) : (
            <br />
          )}
          <Tab panes={panes} />
        </Segment>
      </React.Fragment>
    );
  }

  private renderButtonGroup() {
    const { t, debtCollection, editMode } = this.props;
    return (
      <Button.Group fluid size="large" style={styles.bttonGroup}>
        <Button
          color={debtCollection.isPassAway ? undefined : "blue"}
          onClick={() =>
            debtCollection.setField({ fieldname: "isPassAway", value: false })
          }
        >
          {t("module.debtCollection.debtCollectionFormBody.normalCase")}
        </Button>
        <Button.Or
          text={`${t("module.debtCollection.debtCollectionFormBody.or")}`}
        />
        <Button
          color={debtCollection.isPassAway ? "blue" : undefined}
          onClick={async () => {
            await debtCollection.setField({
              fieldname: "isPassAway",
              value: true
            });
            if (!debtCollection.deathNotification.isConfirm && editMode) {
              if (
                !debtCollection.deathNotification.name &&
                !debtCollection.deathNotification.position
              ) {
                await debtCollection.deathNotification.setField({
                  fieldname: "name",
                  value: this.props.authStore!.userProfile.fullname
                });
                await debtCollection.deathNotification.setField({
                  fieldname: "position",
                  value: this.props.authStore!.userProfile.position
                });
              }
            }
          }}
        >
          {t("module.debtCollection.debtCollectionFormBody.caseBorrowerDies")}
        </Button>
      </Button.Group>
    );
  }

  private renderLetterTab() {
    const { t, debtCollection, editMode } = this.props;
    return (
      <React.Fragment>
        {debtCollection.isPassAway ? (
          <React.Fragment>
            <DebtCollectionLetterTable
              createBtnLabel={t(
                "module.debtCollection.debtCollectionFormBody.createBtnLabel"
              )}
              subHeaderTitle={t(
                "module.debtCollection.debtCollectionFormBody.creatingStoringDocumentsHeirsDeliveryResults"
              )}
              editMode={editMode}
              debtCollection={debtCollection}
              letterType={"CNB"}
              letterList={debtCollection.letter_list_notification_heir_borrower}
              headerTitle={t(
                "module.debtCollection.debtCollectionFormBody.letterFindHeirBorrower"
              )}
              linkModalLabel={t(
                "module.debtCollection.debtCollectionFormBody.createSuccessorBorrowers"
              )}
              hasPermissionView={hasPermissionMode(
                "DEBTCOLLECTION.CASEOFDEATH.DETECT.LETTER.VIEW",
                "DEBTCOLLECTION.CASEOFDEATH.DETECT.LETTER.EDIT",
                editMode
              )}
              hasPermissionEdit={hasPermission(
                "DEBTCOLLECTION.CASEOFDEATH.DETECT.LETTER.EDIT"
              )}
              hasPermissionCreate={hasPermission(
                "DEBTCOLLECTION.CASEOFDEATH.DETECT.LETTER.CREATE"
              )}
              hasPermissionDelete={hasPermission(
                "DEBTCOLLECTION.CASEOFDEATH.DETECT.LETTER.DEL"
              )}
            />
            <br />
            <DebtCollectionLetterTable
              createBtnLabel={t(
                "module.debtCollection.debtCollectionFormBody.createGurantorBtnLabel"
              )}
              subHeaderTitle={t(
                "module.debtCollection.debtCollectionFormBody.creatingStoringDocumentsHeirsDeliveryResults"
              )}
              editMode={editMode}
              debtCollection={debtCollection}
              letterType={"CNG"}
              letterList={debtCollection.letter_list_notification_heir_gurantor}
              headerTitle={t(
                "module.debtCollection.debtCollectionFormBody.letterFindHeirGurantor"
              )}
              linkModalLabel={t(
                "module.debtCollection.debtCollectionFormBody.createSuccessorGurantor"
              )}
              hasPermissionView={hasPermissionMode(
                "DEBTCOLLECTION.CASEOFDEATH.DETECT.LETTER.VIEW",
                "DEBTCOLLECTION.CASEOFDEATH.DETECT.LETTER.EDIT",
                editMode
              )}
              hasPermissionEdit={hasPermission(
                "DEBTCOLLECTION.CASEOFDEATH.DETECT.LETTER.EDIT"
              )}
              hasPermissionCreate={hasPermission(
                "DEBTCOLLECTION.CASEOFDEATH.DETECT.LETTER.CREATE"
              )}
              hasPermissionDelete={hasPermission(
                "DEBTCOLLECTION.CASEOFDEATH.DETECT.LETTER.DEL"
              )}
            />
            <br />
            <DebtCollectionLetterTable
              createBtnLabel={t(
                "module.debtCollection.debtCollectionFormBody.createBtnLabelTrusteeBook"
              )}
              subHeaderTitle={t(
                "module.debtCollection.debtCollectionFormBody.creatingStoringDocumentsManagingInheritance"
              )}
              editMode={editMode}
              debtCollection={debtCollection}
              letterType={"CNM"}
              letterList={debtCollection.letter_list_notification_manager}
              headerTitle={t(
                "module.debtCollection.debtCollectionFormBody.heritageManagerBooks"
              )}
              linkModalLabel={t(
                "module.debtCollection.debtCollectionFormBody.createTrusteeBook"
              )}
              hasPermissionView={hasPermissionMode(
                "DEBTCOLLECTION.CASEOFDEATH.DETECT.LETTER.VIEW",
                "DEBTCOLLECTION.CASEOFDEATH.DETECT.LETTER.EDIT",
                editMode
              )}
              hasPermissionEdit={hasPermission(
                "DEBTCOLLECTION.CASEOFDEATH.DETECT.LETTER.EDIT"
              )}
              hasPermissionCreate={hasPermission(
                "DEBTCOLLECTION.CASEOFDEATH.DETECT.LETTER.CREATE"
              )}
              hasPermissionDelete={hasPermission(
                "DEBTCOLLECTION.CASEOFDEATH.DETECT.LETTER.DEL"
              )}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <DebtCollectionLetterTable
              createBtnLabel={t(
                "module.debtCollection.debtCollectionDemandLetterTable.createBtnLabelDemandBook"
              )}
              subHeaderTitle={t(
                "module.debtCollection.debtCollectionDemandLetterTable.creatingManagingDocumentsSendingDocuments"
              )}
              editMode={editMode}
              debtCollection={debtCollection}
              letterType={"CLB"}
              letterList={debtCollection.letter_list_borrower}
              headerTitle={t(
                "module.debtCollection.debtCollectionFormBody.borrowerRequestLetter"
              )}
              linkModalLabel={t(
                "module.debtCollection.debtCollectionDemandLetterTable.createDemandBook"
              )}
              hasPermissionView={hasPermissionMode(
                "DEBTCOLLECTION.LETTER.VIEW",
                "DEBTCOLLECTION.LETTER.EDIT",
                editMode
              )}
              hasPermissionEdit={hasPermission("DEBTCOLLECTION.LETTER.EDIT")}
              hasPermissionCreate={hasPermission(
                "DEBTCOLLECTION.LETTER.CREATE"
              )}
              hasPermissionDelete={hasPermission("DEBTCOLLECTION.LETTER.DEL")}
            />
            <DebtCollectionLetterTable
              createBtnLabel={t(
                "module.debtCollection.debtCollectionDemandLetterTable.createBtnLabelDemandBook"
              )}
              subHeaderTitle={t(
                "module.debtCollection.debtCollectionDemandLetterTable.creatingManagingDocumentsSendingDocuments"
              )}
              linkModalLabel={t(
                "module.debtCollection.debtCollectionDemandLetterTable.createDemandBook"
              )}
              editMode={editMode}
              debtCollection={debtCollection}
              letterType={"CLG"}
              letterList={debtCollection.letter_list_guarantor}
              headerTitle={t(
                "module.debtCollection.debtCollectionFormBody.claimsGuarantors"
              )}
              hasPermissionView={hasPermissionMode(
                "DEBTCOLLECTION.LETTER.VIEW",
                "DEBTCOLLECTION.LETTER.EDIT",
                editMode
              )}
              hasPermissionEdit={hasPermission("DEBTCOLLECTION.LETTER.EDIT")}
              hasPermissionCreate={hasPermission(
                "DEBTCOLLECTION.LETTER.CREATE"
              )}
              hasPermissionDelete={hasPermission("DEBTCOLLECTION.LETTER.DEL")}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  private renderVisitTab() {
    const { t, debtCollection, editMode } = this.props;
    return (
      <React.Fragment>
        {debtCollection.isPassAway ? (
           <React.Fragment>
           <DebtCollectionLetterTable
           createBtnLabel={t(
             "module.debtCollection.debtCollectionFormBody.createBtnLabelLetterNotifyHeirsBorrowers"
           )}
           subHeaderTitle={t(
             "module.debtCollection.debtCollectionFormBody.creationStorageDocumentsHeirsTrusteeBorrowers"
           )}
           editMode={editMode}
           debtCollection={debtCollection}
           letterType={"CSB"}
           letterList={debtCollection.letter_list_ascertain_heirs}
           headerTitle={t(
             "module.debtCollection.debtCollectionFormBody.letterInformingStatutoryHeirsBorrowers"
           )}
           linkModalLabel={t(
             "module.debtCollection.debtCollectionFormBody.createLetterNotifyHeirsBorrowers"
           )}
           hasPermissionView={hasPermissionMode(
             "DEBTCOLLECTION.CASEOFDEATH.LETTER.VIEW",
             "DEBTCOLLECTION.CASEOFDEATH.LETTER.EDIT",
             editMode
           )}
           hasPermissionEdit={hasPermission(
             "DEBTCOLLECTION.CASEOFDEATH.LETTER.EDIT"
           )}
           hasPermissionCreate={hasPermission(
             "DEBTCOLLECTION.CASEOFDEATH.LETTER.CREATE"
           )}
           hasPermissionDelete={hasPermission(
             "DEBTCOLLECTION.CASEOFDEATH.LETTER.DEL"
           )}
         />
         <br />
         <DebtCollectionLetterTable
         createBtnLabel={t(
           "module.debtCollection.debtCollectionFormBody.createBtnLabelLetterNotifyHeirsGurantor"
         )}
         subHeaderTitle={t(
           "module.debtCollection.debtCollectionFormBody.creationStorageDocumentsHeirsTrusteeGurantor"
         )}
         editMode={editMode}
         debtCollection={debtCollection}
         letterType={"CSG"}
         letterList={debtCollection.letter_list_ascertain_heirs_gurantor}
         headerTitle={t(
           "module.debtCollection.debtCollectionFormBody.letterInformingStatutoryHeirsGurantor"
         )}
         linkModalLabel={t(
           "module.debtCollection.debtCollectionFormBody.createLetterNotifyHeirsGurantor"
         )}
         hasPermissionView={hasPermissionMode(
           "DEBTCOLLECTION.CASEOFDEATH.LETTER.VIEW",
           "DEBTCOLLECTION.CASEOFDEATH.LETTER.EDIT",
           editMode
         )}
         hasPermissionEdit={hasPermission(
           "DEBTCOLLECTION.CASEOFDEATH.LETTER.EDIT"
         )}
         hasPermissionCreate={hasPermission(
           "DEBTCOLLECTION.CASEOFDEATH.LETTER.CREATE"
         )}
         hasPermissionDelete={hasPermission(
           "DEBTCOLLECTION.CASEOFDEATH.LETTER.DEL"
         )}
       />
       <br />
          <DebtCollectionLetterTable
            createBtnLabel={t(
              "module.debtCollection.debtCollectionFormBody.createBtnLabelLetterNotifyHeirs"
            )}
            subHeaderTitle={t(
              "module.debtCollection.debtCollectionFormBody.creationStorageDocumentsHeirsTrustee"
            )}
            editMode={editMode}
            debtCollection={debtCollection}
            letterType={"CSM"}
            letterList={debtCollection.letter_list_inheritance}
            headerTitle={t(
              "module.debtCollection.debtCollectionFormBody.letterInformingStatutoryHeirs"
            )}
            linkModalLabel={t(
              "module.debtCollection.debtCollectionFormBody.createLetterNotifyHeirs"
            )}
            hasPermissionView={hasPermissionMode(
              "DEBTCOLLECTION.CASEOFDEATH.LETTER.VIEW",
              "DEBTCOLLECTION.CASEOFDEATH.LETTER.EDIT",
              editMode
            )}
            hasPermissionEdit={hasPermission(
              "DEBTCOLLECTION.CASEOFDEATH.LETTER.EDIT"
            )}
            hasPermissionCreate={hasPermission(
              "DEBTCOLLECTION.CASEOFDEATH.LETTER.CREATE"
            )}
            hasPermissionDelete={hasPermission(
              "DEBTCOLLECTION.CASEOFDEATH.LETTER.DEL"
            )}
          />
           </React.Fragment>
        ) : (
          <React.Fragment>
            <DebtCollectionVisitTable
              editMode={editMode}
              debtCollection={debtCollection}
            />
            <DebtCollectionMemoTable
              editMode={editMode}
              debtCollection={debtCollection}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  private renderDebtCollectionSue() {
    const { debtCollection, editMode } = this.props;
    const debtSue = debtCollection.debtSue;
    if (editMode) {
      if (hasPermission("DEBTCOLLECTION.LEGAL.EDIT")) {
        return (
          <DebtCollectionSueForm
            debtSue={debtSue}
            onUpdateDebtCollectionInfomationSue={
              debtCollection.updateDebtCollectionInfomationSue
            }
            printCancelBorrower={debtCollection.printCancelBorrower}
            printCancelGurantor={debtCollection.printCancelGurantor}
            onCalculateInterestRate={debtCollection.onCalculateInterestRate}
            hidePrintButton={debtCollection.deathNotification.isConfirm}
          />
        );
      } else {
        return (
          <DebtCollectionSueView
            debtSue={debtSue}
            editMode={editMode}
            printCancelBorrower={debtCollection.printCancelBorrower}
            printCancelGurantor={debtCollection.printCancelGurantor}
            hidePrintButton={debtCollection.deathNotification.isConfirm}
          />
        );
      }
    } else {
      return (
        <DebtCollectionSueView
          debtSue={debtSue}
          editMode={editMode}
          printCancelBorrower={debtCollection.printCancelBorrower}
          printCancelGurantor={debtCollection.printCancelGurantor}
          hidePrintButton={debtCollection.deathNotification.isConfirm}
        />
      );
    }
  }
  private renderDebtCollectionMakePrintCancel() {
    const { debtCollection, editMode,t } = this.props;
    const debtSue = debtCollection.debtSue;
    return (
      <React.Fragment>
          <Grid columns={"1"}>
            <Grid.Column textAlign={"right"}>
              <PermissionControl
                codes={["DEBTCOLLECTION.LEGAL.PRINT.CANCELLETTER"]}
              >
                <Button color={"orange"} onClick={debtCollection.printCancelBorrower}>
                  <Icon name="print" />
                  {t(
                    "module.debtCollection.debtCollectionSueForm.printDenounceTheBorrower"
                  )}
                </Button>
              </PermissionControl>
            </Grid.Column>
          </Grid>
          <Grid columns={"1"}>
            <Grid.Column textAlign={"right"}>
              <PermissionControl
                codes={["DEBTCOLLECTION.LEGAL.PRINT.GUARANTORLETTER"]}
              >
                <Button color={"purple"} onClick={debtCollection.printCancelGurantor}>
                  <Icon name="print" />
                  {t(
                    "module.debtCollection.debtCollectionSueForm.printDenounceTheGuarantor"
                  )}
                </Button>
              </PermissionControl>
            </Grid.Column>
          </Grid>
      </React.Fragment>
    );
  }

  private renderDebtCollectionSueResult() {
    const { debtCollection, editMode } = this.props;
    const debtSue = debtCollection.debtSue;
    if (editMode) {
      if (hasPermission("DEBTCOLLECTION.LEGAL.RESULT.EDIT")) {
        return (
          <DebtCollectionSueResultForm
            debtSue={debtSue}
            onUpdateDebtCollectionResultSue={
              debtCollection.updateDebtCollectionResultSue
            }
            onCalculateJudgementInterestRate={
              debtCollection.onCalculateJudgementInterestRate
            }
          />
        );
      } else {
        return (
          <DebtCollectionSueResultView editMode={editMode} debtSue={debtSue} />
        );
      }
    } else {
      return (
        <DebtCollectionSueResultView editMode={editMode} debtSue={debtSue} />
      );
    }
  }
}

const styles: any = {
  segment: {
    padding: 0,
    background: COLORS.white
  },
  bttonGroup: {
    marginBottom: 28
  }
};

export default withTranslation()(DebtCollectionFormBody);
