import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { PageTabHeader } from "../../../components/project";
import { hasPermission } from "../../../utils/render-by-permission";

interface IAdminTabHeader extends WithTranslation {
  //
}
@observer
class AdminTabHeader extends React.Component<IAdminTabHeader> {
  public render() {
    const { t } = this.props;
    const panes = [];

    if (hasPermission("USER.ACCESS")) { // เข้าถึงระบบจัดการข้อมูลผู้ใช้งาน
      panes.push(
        {
          id: "admin-user-managment",
          title: t("module.admin.adminTabHeader.user"),
          pathname: "/admin/user_managment"
        },
      );
    }
    if (hasPermission("ROLE.ACCESS")) { // เข้าถึงระบบจัดการข้อมูลกลุ่มผู้ใช้งานและสิทธิ์การใช้งาน
      panes.push(
        {
          id: "admin-role-permission",
          title: t("module.admin.adminTabHeader.userGroupsAndLicenses"),
          pathname: "/admin/role_permission"
        },
      );
    }
    if (hasPermission("ORG.ACCESS")) { // เข้าถึงระบบจัดการข้อมูลหน่วยงาน
      panes.push(
        {
          id: "admin-org-management",
          title: t("module.admin.adminTabHeader.agencyAuthorizedPerson"),
          pathname: "/admin/org_management"
        },
      );
    }
    if (hasPermission("DOC.ACCESS")) { // เข้าถึงระบบจัดการเลขที่เอกสาร
      panes.push(
        {
          id: "admin-doc-control",
          title: t("module.admin.adminTabHeader.documentNumberManagement"),
          pathname: "/admin/doc_control"
        },
      );
    }
    if (hasPermission("OCCUPATION.ACCESS")) { // เข้าถึงระบบจัดการข้อมูลอาชีพ
      panes.push(
        {
          id: "admin-ocupation",
          title: t("module.admin.adminTabHeader.occupation"),
          pathname: "/admin/ocupation"
        }
      );
    }

    return <PageTabHeader panes={panes} />;
  }
}

export default withTranslation()(AdminTabHeader);
