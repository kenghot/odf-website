import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Dropdown, DropdownOnSearchChangeData } from "semantic-ui-react";
import { IUserListModel } from "../UserListModel";

interface IUserDDL extends WithTranslation {
  userList?: IUserListModel;
  value?: any;
  onChange: (value: any) => void;
  id?: string;
  didMount?: boolean;
  placeholder?: string;
}

@observer
class UserDDL extends React.Component<IUserDDL> {
  public async componentDidMount() {
    if (this.props.didMount) {
      await this.props.userList!.load_data_pos();
    }
  }

  public render() {
    const { value, userList, onChange, placeholder, id } = this.props;
    return (
      <Dropdown
        id={id}
        clearable
        search
        fluid
        options={userList!.list.map((a) => a.listitemDescription)}
        placeholder={placeholder}
        value={value}
        onChange={(event, data) => {
          onChange(data.value!);
        }}
        onSearchChange={(event, data) => this.onSearchChange(event, data)}
        selection
      />
    );
  }
  private onSearchChange(
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownOnSearchChangeData
  ) {
    this.props.userList!.setField({
      fieldname: "filterFirstname",
      value: data.searchQuery
    });
    setTimeout(() => {
      this.props.userList!.load_data_pos();
    }, 1500);
  }
}

export default withTranslation()(UserDDL);
