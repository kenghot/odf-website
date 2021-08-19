import { inject, observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Button,
  Grid,
  Header,
  List,
  Responsive,
  SemanticCOLORS,
  SemanticICONS,
} from "semantic-ui-react";
import { COLORS } from "../../../constants";
import { IAuthModel } from "../../../modules/auth/AuthModel";
import { Text } from "../../common";
import { hasPermission } from "../../../utils/render-by-permission";

interface IPageHeader extends WithTranslation {
  authStore?: IAuthModel;
  icon?: SemanticICONS;
  color?: SemanticCOLORS;
  title?: string;
}
@inject("authStore")
@observer
class PageHeader extends React.Component<IPageHeader> {
  public render() {
    const { authStore } = this.props;
    return (
      <Grid columns={16} padded style={styles.borderBottom} stackable>
        <Grid.Row>
          <Grid.Column width={6}>
            <List horizontal verticalAlign="middle">
              {this.renderIcon()}
              {this.renderHeaderTitle()}
            </List>
          </Grid.Column>
          <Grid.Column width={10} floated="right">
            <List horizontal verticalAlign="middle" floated="right">
              <List.Item>
                <Header size="small" textAlign="right">
                  <Header.Content>
                    <Text>{`${authStore!.userProfile.title}${authStore!.userProfile.firstname
                      } ${authStore!.userProfile.lastname}`}</Text>
                    <Header.Subheader>
                      <Text>
                        {`${authStore!.userProfile.position}, ${authStore!.userProfile.organization.orgName}`}
                      </Text>
                    </Header.Subheader>

                  </Header.Content>
                </Header>
              </List.Item>
              <Responsive as={List.Item} float="right" minWidth={1024}>
                <Button as="div" icon="user" circular size="large" />
              </Responsive>
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  private renderIcon() {
    return this.props.icon ? (
      <List.Item>
        <Button
          icon={this.props.icon}
          color={this.props.color!}
          size="massive"
        />
      </List.Item>
    ) : null;
  }
  private renderHeaderTitle() {
    return this.props.title ? (
      <List.Item>
        <Header as="h2">
          <Header.Content>{this.props.title}</Header.Content>
        </Header>
      </List.Item>
    ) : null;
  }
}

const styles: any = {
  borderBottom: {
    borderBottom: `2px solid ${COLORS.borderLightGrey}`,
    background: "white",
  },
};

export default withTranslation()(PageHeader);
