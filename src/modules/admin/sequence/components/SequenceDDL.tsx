import { observer } from "mobx-react";
import { clone } from "mobx-state-tree";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Dropdown, DropdownOnSearchChangeData } from "semantic-ui-react";
import { SequenceListModel } from "../SequenceListModel";
import { ISequenceModel } from "../SequenceModel";

interface ISequenceDDL extends WithTranslation {
  id?: string;
  sequenceId: string;
  sequence: ISequenceModel;
  value?: string;
  clearable?: boolean;
  onChange: (value: any) => void;
  SequenceType?: "request" | "agreement" | "guarantee" | "voucher" | "receipt";
  placeholder?: string;
  SequencePerpage?: "10" | "10000";
}

@observer
class SequenceDDL extends React.Component<ISequenceDDL> {
  private sequenceList = SequenceListModel.create({});

  public async componentDidMount() {
    await this.sequenceList.setField({
      fieldname: "filterSequenceType",
      value: this.props.SequenceType || "request"
    });
    await this.sequenceList.setField({
      fieldname: "filterPerpage",
      value: this.props.SequencePerpage || "10"
    });
    await this.sequenceList.load_data();
    if (this.props.sequence.id) {
      const id = this.props.sequence.id;
      const found = this.sequenceList.list.find((element) => element.id === id);
      if (!found) {
        this.sequenceList.addSequenceToList(clone(this.props.sequence));
      }
    }
  }

  public componentDidUpdate(prevProps: any) {
    if (this.props.sequenceId !== prevProps.sequenceId) {
      if (this.props.sequence.id) {
        const id = this.props.sequence.id;
        const found = this.sequenceList.list.find(
          (element) => element.id === id
        );
        if (!found) {
          this.sequenceList.addSequenceToList(clone(this.props.sequence));
        }
      }
    }
  }

  public render() {
    const { value, clearable, placeholder, id } = this.props;
    const lengthListRender = this.sequenceList.list.length;
    return (
      <Dropdown
        id={id}
        search
        fluid
        options={this.sequenceList.list.map((a) => a.listitem)}
        placeholder={placeholder}
        value={value}
        onChange={(event, data) => this.onChangeGetValue(data.value!)}
        onSearchChange={(event, data) => this.onSearchChange(event, data)}
        selection
        clearable={clearable}
      />
    );
  }

  private onChangeGetValue = (value: any) => {
    const select = this.sequenceList.list.find((element) => {
      return element.id === value;
    });
    this.props.onChange(select);
  };
  private onSearchChange(
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownOnSearchChangeData
  ) {
    this.sequenceList.setField({
      fieldname: "filterPrefixCode",
      value: data.searchQuery
    });
    setTimeout(() => {
      this.sequenceList.load_data();
    }, 1500);
  }
}

export default withTranslation()(SequenceDDL);
