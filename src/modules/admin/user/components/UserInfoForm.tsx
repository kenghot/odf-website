import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Checkbox, DropdownProps, Form, Grid, Header, Segment } from "semantic-ui-react";
import { AttachedFile } from "../../../../components/common";
import { TitleDDL } from "../../../../components/project";
import { DeleteModal, ResetPasswordModal } from "../../../../modals";
import { hasPermission } from "../../../../utils/render-by-permission";
import { OrganizationDDL } from "../../organization/components";
import { OrgListModel } from "../../organization/OrgListModel";
import { IUserModel } from "../UserModel";

interface IUserInfoForm extends WithTranslation, RouteComponentProps {
  user: IUserModel;
}
@observer
class UserInfoForm extends React.Component<IUserInfoForm> {
  private orgList = OrgListModel.create({});
  public _isMounted = false;
  public componentDidMount() {
    this._isMounted = true;
    setTimeout(() => {
      if (this._isMounted) {
        this.orgList.setField({
          fieldname: "filterName",
          value: this.props.user.organization.orgName
        });
        this.orgList.load_data();
      }
    }, 1000);
  }
  public componentWillUnmount() {
    this._isMounted = false;
  }
  public render() {
    const { t, user } = this.props;
    return (
      <Form loading={user.loading} onSubmit={this.updateForm}>
        <Segment padded="very">
          {this.renderHeader(t, user)}
          {this.renderUserInfo(t, user)}
          {user.id ? (
            <Form.Field
              label={t("module.admin.userInfoForm.attachment")}
              mode="edit"
              control={AttachedFile}
              multiple={true}
              addFiles={user.addFiles}
              fieldName="user.attachedFiles"
              files={user.fileList}
              removeFile={(index?: number) => user.removeFile(index!)}
            />
          ) : null}
          {this.renderButtons(t, user)}
        </Segment>
      </Form>
    );
  }
  private renderHeader(t: any, user: IUserModel) {
    return (
      <Grid columns="equal" style={styles.header}>
        <Grid.Row verticalAlign="top">
          <Grid.Column>
            <Header
              size="medium"
              content={t("module.admin.userInfoForm.userInformation")}
              subheader={t("module.admin.userInfoForm.basicInformationAccess")}
            />
          </Grid.Column>
          <Grid.Column floated="right" textAlign="right">
            <Form.Field>
              <Checkbox
                id="check-box-user-status"
                toggle
                checked={user.active}
                onChange={(e: any, data: any) =>
                  user.setField({
                    fieldname: "active",
                    value: data.checked
                  })
                }
                label={user.status}
              />
            </Form.Field>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  private renderUserInfo(t: any, user: IUserModel) {
    return (
      <React.Fragment>
        <Form.Input
          id="form-input-username"
          required
          fluid
          label={t("module.admin.userInfoForm.userID")}
          placeholder={t("module.admin.userInfoForm.userID")}
          onChange={(e: any, data: any) => {
            user.setField({
              fieldname: "username",
              value: data.value
            });
            e.target.setCustomValidity("");
          }}
          onInvalid={(e: any, data: any) =>
            e.target.setCustomValidity(t("module.admin.userInfoForm.userID"))
          }
          value={user.username}
        />
        <Form.Group widths="equal">
          <TitleDDL
            id="form-input-ddl-title1"
            search
            fluid
            placeholder={t("module.admin.userInfoForm.prefix")}
            label={t("module.admin.userInfoForm.title")}
            onChange={(
              event: React.SyntheticEvent<HTMLElement, Event>,
              data: DropdownProps
            ) =>
              user.setField({
                fieldname: "title",
                value: data.value
              })
            }
            value={user.title}
          />
          <Form.Input
            id="form-input-firstname"
            fluid
            label={t("module.admin.userInfoForm.firstName")}
            placeholder={t("module.admin.userInfoForm.firstName")}
            onChange={(event: any, data: any) =>
              user.setField({
                fieldname: "firstname",
                value: data.value
              })
            }
            value={user.firstname}
          />
          <Form.Input
            id="form-input-lastname"
            fluid
            label={t("module.admin.userInfoForm.lastNames")}
            placeholder={t("module.admin.userInfoForm.lastNames")}
            onChange={(event: any, data: any) =>
              user.setField({
                fieldname: "lastname",
                value: data.value
              })
            }
            value={user.lastname}
          />
        </Form.Group>
        <Form.Field
          id="form-input-ddl-organization"
          label={t("module.admin.userInfoForm.underDepartment")}
          control={OrganizationDDL}
          value={user.organization.id}
          orgList={this.orgList}
          onChange={this.onChangeOrganizationDDL}
        />
        <Form.Input
          id="form-input-position"
          fluid
          label={t("module.admin.userInfoForm.position")}
          placeholder={t("module.admin.userInfoForm.position")}
          onChange={(event: any, data: any) =>
            user.setField({
              fieldname: "position",
              value: data.value
            })
          }
          value={user.position}
        />
        <Form.Input
          id="form-input-email"
          required
          type="email"
          fluid
          error={!user.validateEmail && user.email ? true : false}
          label={
            !user.validateEmail && user.email
              ? t("module.admin.userInfoForm.validateEmail")
              : t("module.admin.userInfoForm.email")
          }
          placeholder={t("module.admin.userInfoForm.email")}
          onChange={(e: any, data: any) => {
            user.setField({
              fieldname: "email",
              value: data.value
            });
            e.target.setCustomValidity("");
          }}
          onInvalid={(e: any, data: any) =>
            e.target.setCustomValidity(t("module.admin.userInfoForm.email"))
          }
          value={user.email}
        />
        <Form.Input
          id="form-input-telephone"
          fluid
          label={t("module.admin.userInfoForm.telephoneNumber")}
          placeholder={t("module.admin.userInfoForm.telephoneNumber")}
          onChange={(event: any, data: any) =>
            user.setField({
              fieldname: "telephone",
              value: data.value
            })
          }
          value={user.telephone}
        />
      </React.Fragment>
    );
  }
  private renderButtons(t: any, user: IUserModel) {
    return (
      <React.Fragment>
        <Form.Group widths="equal">
          {user.id && hasPermission("USER.DEL") ? (
            <DeleteModal
              onConfirmDelete={this.deleteForm}
              trigger={
                <Form.Button
                  id="form-button-delete"
                  floated="left"
                  color="red"
                  inverted
                  type="button"
                >
                  {t("module.admin.userInfoForm.delete")}
                </Form.Button>
              }
            />
          ) : (
            <Form.Field />
          )}
          <Form.Button
            id="form-button-submit"
            width={5}
            fluid
            floated="right"
            color="blue"
            type="submit"
            loading={user.loading}
          >
            {t("module.admin.userInfoForm.save")}
          </Form.Button>
        </Form.Group>
        {user.id ? (
          <Form.Group widths="equal">
            <Form.Field />
            <ResetPasswordModal
              user={user}
              trigger={
                <Form.Button
                  id="form-button-new-password"
                  width={5}
                  fluid
                  floated="right"
                  color="orange"
                  type="button"
                >
                  {t("module.admin.userInfoForm.setNewPassword")}
                </Form.Button>
              }
            />
          </Form.Group>
        ) : null}
      </React.Fragment>
    );
  }
  private updateForm = async () => {
    const { user, history } = this.props;
    try {
      if (user.id) {
        await user.updateUser(user.id);
      } else {
        await user.createUser();
        history.push(`/admin/user_managment/edit/${user.id}/${user.username}`);
      }
    } catch (e) {
      console.log(e);
    }
  };
  private deleteForm = async () => {
    const { user, history } = this.props;
    try {
      await user.delete_data();
      history.push(`/admin/user_managment`);
    } catch (e) {
      console.log(e);
    }
  };
  private onChangeOrganizationDDL = (value: string) => {
    const { user } = this.props;
    user.organization.setField({ fieldname: "id", value });
  };
}

const styles: any = {
  header: {
    marginBottom: 14
  },
  row: {
    paddingTop: 0,
    paddingBottom: 0
  },
  column: {
    paddingTop: 14,
    paddingBottom: 14
  }
};

export default withRouter(withTranslation()(UserInfoForm));
