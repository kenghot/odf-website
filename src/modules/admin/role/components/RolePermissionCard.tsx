import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Card, Checkbox, Grid, Icon } from "semantic-ui-react";
import { Text } from "../../../../components/common";
import { hasPermission } from "../../../../utils/render-by-permission";
import {
  IPermissionItemModel,
  IPermissionModel
} from "../../permissions/PermissionModel";
import { IRoleModel } from "../RoleModel";

interface IRolePermissionCard extends WithTranslation {
  icon?: any;
  color?: any;
  title?: string;
  item?: IPermissionModel;
  role?: IRoleModel;
  onUpdate: (item: IRoleModel) => void;
}

@observer
class RolePermissionCard extends React.Component<IRolePermissionCard> {
  public state = {
    showContent: true
  };
  public render() {
    const { t, icon, color, title, onUpdate, role } = this.props;
    return (
      <Card fluid style={styles.card}>
        <Card.Content
          header={
            <Grid columns="equal">
              <Grid.Row verticalAlign="middle">
                <Grid.Column>
                  <Icon
                    name={icon ? icon : "address card"}
                    color={color ? color : "pink"}
                    circular
                    inverted
                  />
                  {title}
                </Grid.Column>
                <Grid.Column textAlign="right">
                  <Icon
                    name={this.state.showContent ? "angle up" : "angle down"}
                    style={styles.icon}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          }
          onClick={() =>
            this.setState({ showContent: !this.state.showContent })
          }
          style={styles.cardContent}
        />
        {this.state.showContent ? (
          <Card.Content description={this.renderPermissions()} />
        ) : null}
        {this.state.showContent && hasPermission("ROLE.PERMISSION.EDIT") ? (
          <Card.Content extra>
            <Button
              floated="right"
              color="blue"
              onClick={() => onUpdate(role!)}
            >
              {t("module.admin.userPermissionCard.save")}
            </Button>
          </Card.Content>
        ) : null}
      </Card>
    );
  }

  private renderPermissions() {
    const { item, role } = this.props;
    return (
      <Grid columns={3} padded stackable doubling>
        {item!.permissions.map((data: IPermissionItemModel, index: number) => {
          return (
            <Grid.Row key={index}>
              <Grid.Column width={8}>
                <Text shade={2}>{data.code}</Text>
              </Grid.Column>
              <Grid.Column width={6}>
                <Text shade={2}>{data.description}</Text>
              </Grid.Column>
              <Grid.Column textAlign="right" width={2}>
                <Checkbox
                  checked={role!.permissionsSelectedCodeList.includes(
                    data.code
                  )}
                  onChange={(e: any, value: any) =>
                    role!.onSelectedPermissions(data.code, value.checked)
                  }
                  readOnly={!hasPermission("ROLE.PERMISSION.EDIT")}
                />
              </Grid.Column>
            </Grid.Row>
          );
        })}
      </Grid>
    );
  }
}
const styles: any = {
  card: {
    marginLeft: 0,
    marginRight: 0
  },
  cardContent: {
    cursor: "pointer"
  },
  icon: {
    marginRight: 13
  }
};

export default withTranslation()(RolePermissionCard);
