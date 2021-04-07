import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Form, Grid, Header, Segment } from "semantic-ui-react";

import { FormDisplay } from "../../../../components/common";
import { Loading } from "../../../../components/common/loading";

import { IUserModel } from "../UserModel";
interface IUserPosCode extends WithTranslation {
  editMode?: boolean;
  user?: IUserModel;
}

@observer
class UserPosCode extends React.Component<IUserPosCode> {
  public render() {
    const { t, editMode, user } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t("module.admin.userInfoForm.contentHeader")}
          subheader={t("module.admin.userInfoForm.subHeader")}
          style={styles.header}
        />
        <Form>
          <Form.Group widths="equal">
            {editMode ? (
              <Form.Input
                maxLength="4"
                id="form-input-pos-code"
                fluid
                label={t("module.admin.userInfoForm.posPinCode")}
                placeholder={t(
                  "module.admin.userInfoForm.placeholderPosPinCode"
                )}
                onChange={(e: any, data: any) => {
                  user!.setField({
                    fieldname: "posPinCode",
                    value: data.value
                  });
                  e.target.setCustomValidity("");
                }}
                onInvalid={(e: any, data: any) =>
                  e.target.setCustomValidity(
                    t("module.admin.userInfoForm.placeholderPosPinCode")
                  )
                }
                value={user!.posPinCode}
              />
            ) : (
              <FormDisplay
                id="form-input-pos-code"
                title={"POS Code"}
                value={user!.posPinCode || "-"}
              />
            )}
          </Form.Group>
        </Form>
        {editMode ? (
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Button
                  id="btn-save-user-add-responsible-org"
                  floated="right"
                  color="blue"
                  onClick={this.updateForm}
                  type="button"
                >
                  {t("module.admin.userGroupForm.save")}
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        ) : null}
        <Loading active={user!.posLoading} />
      </Segment>
    );
  }

  private updateForm = async () => {
    const { user } = this.props;
    try {
      await user!.updateUserPosPinCode();
    } catch (e) {
      console.log(e);
    }
  };
}

const styles: any = {
  header: {
    marginBottom: 28
  },
  row: {
    padding: 0
  },
  segment: {
    background: "#F9FAFB",
    paddingBottom: 68,
    boxShadow: "0 1px 2px 0 rgba(34,36,38,.15)"
  },
  button: {
    marginTop: 17
  }
};

export default withTranslation()(UserPosCode);
