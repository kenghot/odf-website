import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Grid, Header, List, Message, Segment } from "semantic-ui-react";
import { SubSectionContainer } from "../../../../components/common";
import { IOrgModel } from "../../organization/OrgModel";
import { RoleListModel } from "../../role/RoleListModel";
import { ISequenceModel } from "../../sequence/SequenceModel";

interface IDocumentManagementForm extends WithTranslation {
  sequence: ISequenceModel;
}
@observer
class DocumentManagementForm extends React.Component<IDocumentManagementForm> {
  private roleList = RoleListModel.create({});
  public async componentDidMount() {
    await this.roleList.load_data();
  }
  public render() {
    const { t } = this.props;
    return (
      <Segment padded="very">
        <Header
          size="medium"
          content={t(
            "module.admin.documentManagementForm.listAgenciesCodeIdentifier"
          )}
          subheader={t(
            "module.admin.documentManagementForm.orderRequireDocumentsFormat"
          )}
          style={styles.header}
        />
        <SubSectionContainer
          title={t("module.admin.documentManagementForm.department")}
          stretch
        >
          {this.renderLists()}
        </SubSectionContainer>
      </Segment>
    );
  }
  private renderLists() {
    const { sequence, t } = this.props;
    return (
      <Grid columns="equal" padded>
        {sequence.organizations.length > 0 ? (
          sequence.organizations.map((data: IOrgModel, index: number) => {
            return (
              <Grid.Row key={index} style={styles.row}>
                <Grid.Column>
                  <List horizontal>
                    <List.Item>
                      <List.Content>
                        <List.Header>{data.orgName}</List.Header>
                        <List.Description>
                          {data.address.shortaddress}
                        </List.Description>
                      </List.Content>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
            );
          })
        ) : (
          <Message
            icon="inbox"
            header={t(
              "module.admin.documentManagementForm.noOrganizationInfoFound"
            )}
          />
        )}
      </Grid>
    );
  }
}

const styles: any = {
  header: {
    marginBottom: 28
  },
  row: {
    padding: 0
  }
};

export default withTranslation()(DocumentManagementForm);
