import { observer } from "mobx-react";
import React, { Component } from "react";

// import FactSheet from "../modules/loan/request/components/FactSheet";
// import { FactSheetModel } from "../modules/loan/request/FactSheetModel";

@observer
class TestPage extends Component<any> {
  // public state = { factsheet: FactSheetModel.create({}) };
  public componentDidMount() {
    // const { factsheet } = this.state;
    // factsheet.loadFactSheet();
    // this.setState(factsheet);
  }
  public render() {
    // const { factsheet } = this.state;
    return <div />;
  }
}
export default TestPage;
