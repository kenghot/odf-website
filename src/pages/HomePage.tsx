import { inject, observer } from "mobx-react";
import React from "react";
import { IAppModel } from "../AppModel";

interface IHomePage {
  appStore: IAppModel;
}
@inject("appStore", "authStore")
@observer
class HomePage extends React.Component<IHomePage> {
  public componentDidMount() {
    this.props.appStore!.setField({ fieldname: "pageHeader", value: "" });
  }
  public render() {
    return null;
  }
}
export default HomePage;
