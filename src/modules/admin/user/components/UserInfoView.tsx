import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Checkbox, Form, Grid, Header, Segment } from "semantic-ui-react";
import { AttachedFile, FormDisplay } from "../../../../components/common";
import { IUserModel } from "../UserModel";

interface IUserInfoView extends WithTranslation {
  user: IUserModel;
}

@observer
class UserInfoView extends React.Component<IUserInfoView> {
  public render() {
    const { t, user } = this.props;
    return (
      <Segment padded="very">
        <Grid columns="equal" style={styles.header}>
          <Grid.Row verticalAlign="top">
            <Grid.Column>
              <Header
                size="medium"
                content={t("module.admin.userInfoForm.userInformation")}
                subheader={t(
                  "module.admin.userInfoForm.basicInformationAccess"
                )}
              />
            </Grid.Column>
            <Grid.Column floated="right" textAlign="right">
              <Form>
                <Form.Field>
                  <Checkbox
                    toggle
                    disabled
                    checked={user.active}
                    label={user.status}
                  />
                </Form.Field>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Form>
          <FormDisplay
            id="form-display-username"
            title={t("module.admin.userInfoForm.userID")}
            value={user.username || "-"}
          />
          <Form.Group widths="equal">
            <FormDisplay
              id="form-display-title"
              title={t("module.admin.userInfoForm.title")}
              value={user.title || "-"}
            />
            <FormDisplay
              id="form-display-firstname"
              title={t("module.admin.userInfoForm.firstName")}
              value={user.firstname || "-"}
            />
            <FormDisplay
              id="form-display-lastname"
              title={t("module.admin.userInfoForm.lastNames")}
              value={user.lastname || "-"}
            />
          </Form.Group>
          <FormDisplay
            title={t("module.admin.userInfoForm.underDepartment")}
            value={user.organization.orgName || "-"}
          />
          <FormDisplay
            title={t("module.admin.userInfoForm.position")}
            value={user.position || "-"}
          />
          <FormDisplay
            title={t("module.admin.userInfoForm.email")}
            value={user.email || "-"}
          />
          <FormDisplay
            title={t("module.admin.userInfoForm.telephoneNumber")}
            value={user.telephone || "-"}
          />
          <Form.Field
            label={t("module.admin.userInfoForm.attachment")}
            mode="view"
            control={AttachedFile}
            files={user.fileList}
          />
        </Form>
      </Segment>
    );
  }
}

const styles: any = {
  header: {
    marginBottom: 14
  },
  column: {
    paddingTop: 14,
    paddingBottom: 14
  }
};

export default withTranslation()(UserInfoView);
