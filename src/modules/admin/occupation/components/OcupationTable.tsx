import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  Checkbox,
  Dropdown,
  Header,
  Menu,
  Segment,
  Table
} from "semantic-ui-react";
import { OcupationTableLine } from ".";
import { EmptyTableRow, SectionContainer } from "../../../../components/common";
import { COLORS } from "../../../../constants";
import { hasPermission } from "../../../../utils/render-by-permission";
import { IOcupationListModel } from "../OcupationListModel";
import { IOcupationModel, OcupationModel } from "../OcupationModel";

interface IOcupationTable extends WithTranslation, RouteComponentProps {
  ocupationListStore: IOcupationListModel;
  ocupationType: number;
  header?: string;
  subheader?: string;
}
@observer
class OcupationTable extends React.Component<IOcupationTable> {
  public state = { showCreateForm: false };
  public render() {
    const { t, header, subheader, ocupationListStore } = this.props;
    const menuOptions = [
      {
        key: "1",
        text: t("module.admin.userTable.enable"),
        value: "setActive"
      },
      {
        key: "0",
        text: t("module.admin.userTable.disable"),
        value: "setInactive"
      }
    ];
    return (
      <Segment basic>
        <Header
          size="medium"
          content={header}
          subheader={subheader}
          style={styles.header}
        />
        <SectionContainer
          stretch
          fluid
          basic
          titleComponent={
            hasPermission("OCCUPATION.EDIT") ? (
              <Menu style={styles.menu}>
                <Dropdown
                  button
                  text={t("module.admin.userTable.chooseAll")}
                  options={menuOptions}
                  style={styles.dropdown}
                  clearable
                  disabled={ocupationListStore.statusMenu}
                  onChange={(event, data) =>
                    this.onChangeStatusField(data.value)
                  }
                />
              </Menu>
            ) : (
              undefined
            )
          }
          linkLabel={
            hasPermission("OCCUPATION.CREATE") ? t("module.admin.ocupationTable.increaseCareer") : undefined
          }
          onClick={
            hasPermission("OCCUPATION.CREATE")
              ? () =>
                  this.setState({ showCreateForm: !this.state.showCreateForm })
              : undefined
          }
          iconName="plus circle"
        >
          <Table size="small">
            {this.renderTableHeader()}
            {this.renderTableBody()}
          </Table>
        </SectionContainer>
      </Segment>
    );
  }

  private renderTableHeader() {
    const { ocupationListStore, t, ocupationType } = this.props;
    return (
      <Table.Header>
        <Table.Row>
          {hasPermission("OCCUPATION.EDIT") ? (
            <Table.HeaderCell textAlign="center" width={1}>
              <Checkbox
                checked={ocupationListStore.selected_checkbox(ocupationType)}
                onChange={(event, value) =>
                  ocupationListStore!.selected_all(
                    value.checked || false,
                    ocupationType
                  )
                }
              />
            </Table.HeaderCell>
          ) : null}
          <Table.HeaderCell textAlign="center" width={6}>
            {t("module.admin.ocupationTable.ocupation")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={6}>
            {t("module.admin.ocupationTable.status")}
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={3} />
        </Table.Row>
      </Table.Header>
    );
  }

  private renderTableBody() {
    let dataTable = [];
    switch (this.props.ocupationType) {
      case 0:
        dataTable = this.props.ocupationListStore.occupation_list_0;
        break;
      case 1:
        dataTable = this.props.ocupationListStore.occupation_list_1;
        break;
      case 2:
        dataTable = this.props.ocupationListStore.occupation_list_2;
        break;
    }
    const ocupationCreate = OcupationModel.create({});
    return (
      <Table.Body>
        <OcupationTableLine
          item={ocupationCreate}
          showFormCreate={() =>
            this.setState({ showCreateForm: !this.state.showCreateForm })
          }
          createMode={this.state.showCreateForm}
          onUpdate={this.createForm}
        />
        {dataTable.length > 0 ? (
          dataTable.map((data: IOcupationModel, index: number) => {
            return (
              <OcupationTableLine
                onUpdate={this.updateForm}
                onDelete={this.deleteForm}
                item={data}
                key={index}
                editMode
              />
            );
          })
        ) : (
          <EmptyTableRow />
        )}
      </Table.Body>
    );
  }

  private onChangeStatusField = async (value: any) => {
    const { ocupationListStore, ocupationType } = this.props;
    try {
      await ocupationListStore!.update_data_selected(value, ocupationType);
      await ocupationListStore.deSelected_all();
    } catch (e) {
      console.log(e);
    }
  };
  private createForm = async (item: IOcupationModel) => {
    try {
      await item!.setField({
        fieldname: "occupationType",
        value: this.props.ocupationType
      });
      await item!.createOcupation();
      await this.props.ocupationListStore.load_data();
      await this.setState({ showCreateForm: false });
    } catch (e) {
      console.log(e);
    }
  };
  private updateForm = async (item: IOcupationModel) => {
    try {
      await item!.updateOcupation();
    } catch (e) {
      console.log(e);
    }
  };
  private deleteForm = async (item: IOcupationModel) => {
    try {
      await item!.deleteOcupation(item.id);
      await this.props.ocupationListStore.load_data();
    } catch (e) {
      console.log(e);
    }
  };
}

const styles: any = {
  dropdown: {
    background: COLORS.teal,
    color: "white"
  },
  menu: {
    background: "transparent",
    border: "none",
    boxShadow: "none"
  },
  header: {
    marginBottom: 28
  }
};

export default withRouter(withTranslation()(OcupationTable));
