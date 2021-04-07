import { observer } from "mobx-react";
import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Grid, Message } from "semantic-ui-react";
import { CheckListItem } from "../../../../components/common";
import { RoleListModel } from "../RoleListModel";
import { IRoleModel } from "../RoleModel";

interface IRoleCheckBoxList extends WithTranslation {
  editMode?: boolean;
  onSelectedRole: (value: IRoleModel, checked: boolean) => void;
  rolesSelectedIdList: string[];
  id?: string;
}
@observer
class RoleCheckBoxList extends React.Component<IRoleCheckBoxList> {
  private roleList = RoleListModel.create({});
  public async componentDidMount() {
    this.roleList.setField({ fieldname: "checkPermission", value: true });
    await this.roleList.load_data();
  }
  public render() {
    const { onSelectedRole, editMode, rolesSelectedIdList, t, id } = this.props;
    return (
      <Grid columns="equal" padded id={id}>
        {this.roleList.list.length > 0 ? (
          this.roleList.list.map((data: IRoleModel, index: number) => {
            return (
              <Grid.Row key={index} style={styles.row}>
                <Grid.Column>
                  <CheckListItem
                    title={data.name}
                    value={data}
                    label={data.description}
                    checked={rolesSelectedIdList.includes(data.id)}
                    onSelectCheckBox={onSelectedRole}
                    disabled={!editMode}
                  />
                </Grid.Column>
              </Grid.Row>
            );
          })
        ) : (
            <Message
              icon="users"
              header={t("module.admin.userGroupCard.userGroupNotFound")}
            />
          )}
      </Grid>
    );
  }
}

const styles: any = {
  row: {
    padding: 0
  }
};

export default withTranslation()(RoleCheckBoxList);
