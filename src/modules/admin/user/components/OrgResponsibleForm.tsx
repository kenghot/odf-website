import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Grid, Header, Message, Segment } from "semantic-ui-react";

import {
  CheckListItem,
  SubSectionContainer
} from "../../../../components/common";
import { Loading } from "../../../../components/common/loading";
import { OrganizationDDL } from "../../organization/components";
import { OrgListModel } from "../../organization/OrgListModel";
import { IOrgModel } from "../../organization/OrgModel";
import { IUserModel } from "../UserModel";
interface IOrgResponsibleForm extends WithTranslation {
  editMode?: boolean;
  user?: IUserModel;
}

@observer
class OrgResponsibleForm extends React.Component<IOrgResponsibleForm> {
  private orgList = OrgListModel.create({});
  public async componentDidMount() {
    await this.orgList.load_data();
  }
  public state = {
    showAddlist: false
  };
  public render() {
    const { t, editMode, user } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t(
            "module.admin.orgResponsibleForm.defineResponsibleAgencies"
          )}
          subheader={t(
            "module.admin.orgResponsibleForm.inOrderGrantUsersAccessInformation"
          )}
          style={styles.header}
        />
        <SubSectionContainer
          title={t("module.admin.orgResponsibleForm.department")}
          linkLabel={
            editMode
              ? t("module.admin.orgResponsibleForm.addResponsibleAgencies")
              : ""
          }
          idLink="user-add-responsible-org"
          onClick={() =>
            this.setState({ showAddlist: !this.state.showAddlist })
          }
          iconName="plus circle"
          stretch
          fluid
        >
          {this.state.showAddlist ? this.renderAddlist() : null}
          {this.renderLists()}
        </SubSectionContainer>
        {editMode ? (
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Button
                  id="btn-save-user-add-responsible-org"
                  floated="right"
                  loading={user!.orgLoading}
                  color="blue"
                  onClick={this.updateForm}
                >
                  {t("module.admin.userGroupForm.save")}
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        ) : null}
        <Loading active={user!.orgLoading} />
      </Segment>
    );
  }

  private renderLists() {
    const { editMode, user, t } = this.props;
    return (
      <Segment basic>
        <Grid columns="equal" padded>
          {user!.responsibilityOrganizations.length > 0 ? (
            user!.responsibilityOrganizations.map(
              (data: IOrgModel, index: number) => {
                return (
                  <React.Fragment key={index}>
                    <Grid.Row style={styles.row}>
                      <Grid.Column>
                        <CheckListItem
                          value={data}
                          title={data.orgName}
                          label={data.address.shortaddress}
                          checked={data.isSelcted}
                          // checked={true}
                          disabled={!editMode}
                          onSelectCheckBox={this.onChangeCheckBox}
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </React.Fragment>
                );
              }
            )
          ) : (
            <Message
              icon="building"
              header={t(
                "module.admin.userGroupForm.foundNoResponsibleOrganizationInfo"
              )}
              content={t("module.admin.userGroupForm.pleaseSelectMoreItems")}
            />
          )}
        </Grid>
      </Segment>
    );
  }

  private renderAddlist() {
    const { user, t } = this.props;
    return (
      <Segment basic style={styles.segment}>
        <OrganizationDDL
          id="input-ddl-user-add-responsible-org"
          onChange={this.onChangeOrganizationDDL}
          multiple
          orgList={this.orgList}
          value={user!.organizationIds.slice()}
        />
        <Button
          floated="right"
          color="blue"
          style={styles.button}
          onClick={this.updateForm}
        >
          {t("module.admin.orgResponsibleForm.save")}
        </Button>
      </Segment>
    );
  }
  private onChangeCheckBox = (value: IOrgModel, checked: boolean) => {
    const { user } = this.props;
    value.setField({ fieldname: "isSelcted", value: checked });

    if (!checked) {
      user!.setField({
        fieldname: "organizationIds",
        value: user!.organizationIds.filter((item: any) => item !== value.id)
      });
    } else {
      user!.setField({
        fieldname: "organizationIds",
        value: [value.id, ...user!.organizationIds]
      });
    }
  };
  private onChangeOrganizationDDL = (value: any) => {
    const { user } = this.props;
    user!.setField({ fieldname: "organizationIds", value });
  };
  private updateForm = async () => {
    const { user } = this.props;
    try {
      await user!.updateResponsibilityOrgUser(user!.id);
      await this.setState({ showAddlist: false });
      // await user!.getUserDetail();
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

export default withTranslation()(OrgResponsibleForm);
