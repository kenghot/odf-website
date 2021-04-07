import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Header, Radio, Segment } from "semantic-ui-react";
import { DateInput, FormDisplay } from "../../../components/common";
import { COLORS } from "../../../constants";
import { date_display_CE_TO_BE } from "../../../utils";
import { IAuthModel } from "../../auth/AuthModel";
import { IDebtCollectionModel } from "../DebtCollectionModel";

interface IDebtCollectionReportDeathForm extends WithTranslation {
  debtCollection: IDebtCollectionModel;
  editMode?: boolean;
  name: string;
  position: string;
  authStore?: IAuthModel;
}
@inject("authStore")
@observer
class DebtCollectionReportDeathForm extends React.Component<
  IDebtCollectionReportDeathForm
> {
  public componentDidUpdate(prevProps: any) {
    if (this.props.name !== prevProps.name) {
      this.props.debtCollection.deathNotification.setField({
        fieldname: "name",
        value: this.props.authStore!.userProfile.fullname
      });
    }
    if (this.props.position !== prevProps.position) {
      this.props.debtCollection.deathNotification.setField({
        fieldname: "position",
        value: this.props.authStore!.userProfile.position
      });
    }
  }
  public render() {
    const { debtCollection, t, editMode } = this.props;
    return (
      <Form onSubmit={() => debtCollection.updateDeathNotification()}>
        <Segment padded="very" style={styles.segment}>
          <Header
            size="medium"
            content={t(
              "module.debtCollection.debtCollectionReportDeathForm.recordOfficer"
            )}
            subheader={t(
              "module.debtCollection.debtCollectionReportDeathForm.eventBorrowerDies"
            )}
          />
          {this.renderDeathBorrower()}
          {editMode ? this.renderEditMode() : this.renderViewMode()}
        </Segment>
      </Form>
    );
  }

  private renderViewMode() {
    const { debtCollection, t } = this.props;
    return (
      <React.Fragment>
        <FormDisplay
          title={t(
            "module.debtCollection.debtCollectionReportDeathForm.dateNotification"
          )}
          value={
            date_display_CE_TO_BE(
              debtCollection.deathNotification.notificationDate
            ) || "-"
          }
          width={4}
        />
        <FormDisplay
          title={t(
            "module.debtCollection.debtCollectionReportDeathForm.officerReceivingDeathBorrower"
          )}
          value={debtCollection.deathNotification.name || "-"}
        />
        <FormDisplay
          title={t(
            "module.debtCollection.debtCollectionReportDeathForm.position"
          )}
          value={debtCollection.deathNotification.position || "-"}
        />
      </React.Fragment>
    );
  }

  private renderEditMode() {
    const { debtCollection, t } = this.props;
    return (
      <React.Fragment>
        <Form.Field
          required
          label={t(
            "module.debtCollection.debtCollectionReportDeathForm.dateNotification"
          )}
          control={DateInput}
          value={debtCollection.deathNotification.notificationDate}
          fieldName={"notificationDate"}
          onChangeInputField={this.onChangeInputField}
          id={"deathNotificationNotificationDate"}
        />
        <Form.Input
          fluid
          label={t(
            "module.debtCollection.debtCollectionReportDeathForm.officerReceivingDeathBorrower"
          )}
          placeholder={t(
            "module.debtCollection.debtCollectionReportDeathForm.pleaseSpecifyReceivingNotification"
          )}
          value={debtCollection.deathNotification.name}
          onChange={(event: any, data: any) =>
            debtCollection.deathNotification.setField({
              fieldname: "name",
              value: data.value
            })
          }
          id={"deathNotificationName"}
        />
        <Form.Input
          fluid
          label={t(
            "module.debtCollection.debtCollectionReportDeathForm.position"
          )}
          placeholder={t(
            "module.debtCollection.debtCollectionReportDeathForm.pleaseSpecifyPositionInformant"
          )}
          value={debtCollection.deathNotification.position}
          onChange={(event: any, data: any) =>
            debtCollection.deathNotification.setField({
              fieldname: "position",
              value: data.value
            })
          }
          id={"deathNotificationPosition"}
        />
        <Form.Button color="teal" floated="right">
          {t("module.debtCollection.debtCollectionReportDeathForm.save")}
        </Form.Button>
        <br />
      </React.Fragment>
    );
  }

  private renderDeathBorrower() {
    const { t, debtCollection, editMode } = this.props;
    return (
      <Form.Field>
        <label>
          {t(
            "module.debtCollection.debtCollectionReportDeathForm.notifiedBorrowerDied"
          )}
        </label>
        <Segment padded style={styles.segmentRadio}>
          <Form.Group>
            <Form.Field
              readOnly={!editMode}
              control={Radio}
              label={t(
                "module.debtCollection.debtCollectionReportDeathForm.confirm"
              )}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                debtCollection.deathNotification.setField({
                  fieldname: "isConfirm",
                  value: true
                })
              }
              checked={debtCollection.deathNotification.isConfirm === true}
            />
            <Form.Field
              readOnly={!editMode}
              control={Radio}
              label={t(
                "module.debtCollection.debtCollectionReportDeathForm.refuse"
              )}
              onChange={(event: React.SyntheticEvent<HTMLElement>, data: any) =>
                debtCollection.deathNotification.setField({
                  fieldname: "isConfirm",
                  value: false
                })
              }
              checked={debtCollection.deathNotification.isConfirm === false}
            />
          </Form.Group>
        </Segment>
      </Form.Field>
    );
  }
  private onChangeInputField = (fieldname: string, value: any) => {
    const { debtCollection } = this.props;
    debtCollection.deathNotification.setField({ fieldname, value });
  };
}
const styles: any = {
  segment: {
    marginTop: 0,
    marginLeft: 21,
    marginRight: 21,
    marginBottom: 21,
    background: COLORS.contentGrey
  },
  segmentRadio: {
    paddingBottom: 7
  }
};
export default withTranslation()(DebtCollectionReportDeathForm);
