import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Button,
  Checkbox,
  Grid,
  Icon,
  Popup,
  Segment
} from "semantic-ui-react";
import { InputAttachedFiles } from "../../../../components/common";
import { IAttachedFileModel } from "../../../../components/common/fileupload/AttachedFileModel";
import { Loading } from "../../../../components/common/loading";

interface IRequesAttachedFileList extends WithTranslation {
  attachedFiles: IAttachedFileModel[];
  requestItemId: string;
  readOnly?: boolean;
  loading?: boolean;
  showButtonIsVerified?: boolean;
  hideButtonSubmit?: boolean;
  onSubmit?: () => void;
}
@observer
class RequesAttachedFileList extends React.Component<IRequesAttachedFileList> {
  public render() {
    const {
      attachedFiles,
      readOnly,
      requestItemId,
      hideButtonSubmit,
      showButtonIsVerified,
      loading,
      t
    } = this.props;
    return (
      <Segment>
        <Loading active={loading || false} />
        {attachedFiles.map((item: IAttachedFileModel, index: number) => {
          return (
            <Grid columns={4} stackable key={index}>
              <Grid.Row verticalAlign="middle">
                <Grid.Column width={5}>
                  <Grid columns={2}>
                    <Grid.Row verticalAlign="middle">
                      <Grid.Column width={14}>
                        {showButtonIsVerified ? (
                          <Checkbox
                            label={item.documentName}
                            checked={item.isVerified === "true" ? true : false}
                            onChange={(event: any, data: any) =>
                              item.setField({
                                fieldname: "isVerified",
                                value: data.checked ? "true" : "0"
                              })
                            }
                            readOnly={
                              showButtonIsVerified
                                ? !showButtonIsVerified
                                : readOnly
                            }
                          />
                        ) : (
                          item.documentName
                        )}
                      </Grid.Column>
                      <Grid.Column width={1}>
                        {item.documentDescription ? (
                          <Popup
                            trigger={
                              <Icon size="small" circular name="exclamation" />
                            }
                            content={item.documentDescription}
                            size="tiny"
                          />
                        ) : null}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
                <Grid.Column width={3}>
                  <Checkbox
                    label={t("module.loan.requesAttachedFileList.wantDeliver")}
                    checked={item.isSend ? true : false}
                    onChange={async (event: any, data: any) => {
                      await item.setField({
                        fieldname: "isSend",
                        value: data.checked ? "true" : null
                      });
                      if (data.checked !== "true") {
                        await item.resetFile();
                      }
                    }}
                    readOnly={readOnly}
                  />
                </Grid.Column>
                <Grid.Column width={8}>
                  <InputAttachedFiles
                    disabled={!item.isSend}
                    attachedFile={item}
                    addFile={(value: any) => {
                      item.setField({
                        fieldname: "file",
                        value
                      });
                      item.setField({
                        fieldname: "refId",
                        value: requestItemId
                      });
                    }}
                    removeFile={() => item.deleteDataFile()}
                    readOnly={readOnly}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          );
        })}
        {hideButtonSubmit ? null : (
          <Button
            color="blue"
            fluid
            style={styles.button}
            onClick={this.onSubmit}
          >
            {t("module.loan.requesAttachedFileList.deliverDocuments")}
          </Button>
        )}
      </Segment>
    );
  }
  private onSubmit = () => {
    const { onSubmit } = this.props;
    if (typeof onSubmit !== "undefined") {
      onSubmit();
    }
  };
}
const styles: any = {
  button: {
    marginTop: 32
  }
};

export default withTranslation()(RequesAttachedFileList);
