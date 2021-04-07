import React from "react";
import { IAuthModel } from "../../modules/auth/AuthModel";
import { hasPermission } from "../../utils/render-by-permission";

interface IPermissionControl {
  codes: string[];
  authStore?: IAuthModel;
  somePermission?: boolean;
}

class PermissionControl extends React.Component<IPermissionControl> {
  public render() {
    const { codes, children, somePermission } = this.props;
    if (somePermission) {
      if (codes.some((code: string) => hasPermission(code))) {
        return children;
      } else {
        return null;
      }
    } else {
      if (codes.every((code: string) => hasPermission(code))) {
        return children;
      } else {
        return null;
      }
    }
  }
}

export default PermissionControl;
