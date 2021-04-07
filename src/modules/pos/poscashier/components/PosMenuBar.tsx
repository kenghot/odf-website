import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Icon, Menu } from "semantic-ui-react";
import { PermissionControl } from "../../../../components/permission";
import { M35401OpenShiftModal, M355SwapManagerModal } from "../../../../modals";
import { hasPermission } from "../../../../utils/render-by-permission";
import { IPosModel } from "../../PosModel";

interface IPosMenuBar extends WithTranslation {
  pos: IPosModel;
}

@observer
class PosMenuBar extends React.Component<IPosMenuBar> {
  public render() {
    const { t, pos } = this.props;
    const widths =
      (hasPermission("POS.USAGE.SALE") ? 1 : 0) +
      (hasPermission("POS.USAGE.RECEIPTS") ? 1 : 0) +
      (hasPermission("POS.USAGE.CONTROL") ? 1 : 0) +
      (hasPermission("POS.USAGE.SWAPMANAGER") ? 1 : 0);
    console.log();
    return (
      <Menu
        icon="labeled"
        widths={widths ? (widths as any) : undefined}
        className="posmanu"
      >
        <PermissionControl codes={["POS.USAGE.SALE"]}>
          <Menu.Item
            active={pos.defaultActiveMenu === 1}
            disabled={pos.defaultActiveMenu && pos.isOnline ? false : true}
            onClick={() =>
              pos.setField({ fieldname: "defaultActiveMenu", value: 1 })
            }
          >
            <Icon name="barcode" />
            {t("module.pos.posMenuBar.menu1")}
          </Menu.Item>
        </PermissionControl>
        <PermissionControl codes={["POS.USAGE.RECEIPTS"]}>
          <Menu.Item
            active={pos.defaultActiveMenu === 2}
            onClick={() =>
              pos.setField({ fieldname: "defaultActiveMenu", value: 2 })
            }
          >
            <Icon name="search" />
            {t("module.pos.posMenuBar.menu2")}
          </Menu.Item>
        </PermissionControl>
        <PermissionControl codes={["POS.USAGE.CONTROL"]}>
          <Menu.Item
            active={pos.defaultActiveMenu === 3}
            onClick={() =>
              pos.setField({ fieldname: "defaultActiveMenu", value: 3 })
            }
          >
            <Icon name="clock outline" />
            {t("module.pos.posMenuBar.menu3")}
          </Menu.Item>
        </PermissionControl>
        <PermissionControl codes={["POS.USAGE.SWAPMANAGER"]}>
          {pos.isOnline ? (
            <M355SwapManagerModal
              trigger={
                <Menu.Item>
                  <Icon name="sync alternate" />
                  {t("module.pos.posMenuBar.menu4")}
                </Menu.Item>
              }
              pos={pos}
            />
          ) : (
            <M35401OpenShiftModal
              swapManagerMode
              pos={pos}
              trigger={
                <Menu.Item>
                  <Icon name="sync alternate" />
                  {t("module.pos.posMenuBar.menu4")}
                </Menu.Item>
              }
            />
          )}
        </PermissionControl>
      </Menu>
    );
  }
}

export default withTranslation()(PosMenuBar);
