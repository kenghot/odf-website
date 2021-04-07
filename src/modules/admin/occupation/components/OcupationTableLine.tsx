import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Checkbox, Form, Icon, List, Segment, Table } from "semantic-ui-react";
import { PermissionControl } from "../../../../components/permission";
import { DeleteModal } from "../../../../modals";
import { IOcupationModel } from "../OcupationModel";

interface IOcupationTableLine extends WithTranslation {
  onDelete?: (item: IOcupationModel) => void;
  onUpdate?: (item: IOcupationModel) => void;
  item: IOcupationModel;
  editMode?: boolean;
  createMode?: boolean;
  showFormCreate?: () => void;
}

@observer
class OcupationTableLine extends React.Component<IOcupationTableLine> {
  public state = { showForm: false };
  public render() {
    const { item, editMode, createMode, t } = this.props;
    const { showForm } = this.state;
    const menuOptions = [
      {
        key: "1",
        text: t("module.admin.ocupationTable.enable"),
        value: true
      },
      {
        key: "0",
        text: t("module.admin.ocupationTable.disable"),
        value: false
      }
    ];
    return (
      <React.Fragment>
        {showForm || createMode ? (
          <Table.Row>
            <Table.Cell colSpan="4" style={styles.row}>
              <Form>
                <Segment padded style={styles.form}>
                  {createMode ? (
                    <Form.Button
                      icon="x"
                      circular
                      floated="right"
                      size="mini"
                      type="button"
                      onClick={() => this.showFormCreate()}
                    />
                  ) : (
                    <Form.Button
                      icon="x"
                      circular
                      floated="right"
                      size="mini"
                      type="button"
                      onClick={() => this.setState({ showForm: false })}
                    />
                  )}
                  <Form.Input
                    fluid
                    label={t("module.admin.ocupationTable.ocupationName")}
                    placeholder={t("module.admin.ocupationTable.specifyOcupationName")}
                    onChange={(event: any, data: any) =>
                      item!.setField({
                        fieldname: "name",
                        value: data.value
                      })
                    }
                    value={item!.name || ""}
                  />
                  <Form.Select
                    fluid
                    options={menuOptions}
                    placeholder={t("module.admin.ocupationTable.pleaseSelect")}
                    onChange={(event: any, v: any) =>
                      item!.setField({
                        fieldname: "active",
                        value: v.value
                      })
                    }
                    value={item.active}
                  />
                  <Form.Button
                    floated="right"
                    color="blue"
                    type="button"
                    onClick={() => this.onUpdate(item)}
                  >
                    {t("module.admin.userGroupCard.save")}
                  </Form.Button>
                </Segment>
              </Form>
            </Table.Cell>
          </Table.Row>
        ) : null}
        {!showForm && editMode ? (
          <Table.Row>
            <PermissionControl codes={["OCCUPATION.EDIT"]}>
              <Table.Cell textAlign="center">
                <Checkbox
                  checked={item.isSelected}
                  onChange={(event, value) =>
                    item!.setField({
                      fieldname: "isSelected",
                      value: value.checked
                    })
                  }
                />
              </Table.Cell>
            </PermissionControl>
            <Table.Cell>{item.name}</Table.Cell>
            <Table.Cell textAlign="center">{item.status}</Table.Cell>
            <Table.Cell textAlign="right">
              <List horizontal verticalAlign="middle">
                <PermissionControl codes={["OCCUPATION.EDIT"]}>
                  <List.Item>
                    <Icon
                      circular
                      inverted
                      link
                      color="olive"
                      name="edit outline"
                      onClick={() => this.setState({ showForm: true })}
                    />
                  </List.Item>
                </PermissionControl>
                <PermissionControl codes={["OCCUPATION.DEL"]}>
                  <DeleteModal
                    trigger={
                      <List.Item>
                        <Icon
                          circular
                          inverted
                          link
                          color="red"
                          name="trash alternate outline"
                        />
                      </List.Item>
                    }
                    onConfirmDelete={() => this.onDelete(item)}
                  />
                </PermissionControl>
              </List>
            </Table.Cell>
          </Table.Row>
        ) : null}
      </React.Fragment>
    );
  }
  private onDelete = async (item: IOcupationModel) => {
    const { onDelete } = this.props;
    if (typeof onDelete !== "undefined") {
      await onDelete(item);
    }
  };
  private onUpdate = async (item: IOcupationModel) => {
    const { onUpdate } = this.props;
    await onUpdate!(item);
    await this.setState({ showForm: false });
  };
  private showFormCreate = () => {
    const { showFormCreate } = this.props;
    if (typeof showFormCreate !== "undefined") {
      showFormCreate();
    }
  };
}
const styles: any = {
  form: {
    paddingBottom: "48px",
    paddingRight: "28px",
    paddingLeft: "35px",
    background: "#F9FAFB"
  },
  row: {
    padding: 0
  }
};

export default withTranslation()(OcupationTableLine);
