import { observer } from "mobx-react";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Grid, Icon, Label } from "semantic-ui-react";
import { DeleteModal } from "../../../modals";
import { IAttachedFileModel } from "../fileupload/AttachedFileModel";
import { hasPermission } from "../../../utils/render-by-permission";

interface IInputAttachedFiles extends WithTranslation {
  attachedFile?: IAttachedFileModel;
  addFile?: (file: File) => void;
  removeFile?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  fieldName?: string; // กำหนด fieldname ของ file ตาม structure data ที่จะส่งไปให้ API
}
@observer
class InputAttachedFiles extends React.Component<IInputAttachedFiles> {
  private fileInputRef: React.RefObject<HTMLInputElement>;
  constructor(props: any) {
    super(props);
    this.fileInputRef = React.createRef();
  }
  public onDrop = (e: any) => {
    this.addFile(e.target.files[0]);
  };

  public render() {
    const { disabled, readOnly, t } = this.props;
    return (
      <React.Fragment>
        <Button
          as="div"
          labelPosition="right"
          fluid
          style={styles.input}
          disabled={disabled}
        >
          <Button
            icon
            color="blue"
            style={styles.buttonLabel}
            onClick={() => {
              this.fileInputRef.current!.click();
            }}
            disabled={readOnly}
          >
            แนบเอกสาร
            <Icon name="paperclip" />
          </Button>
          <input
            ref={this.fileInputRef}
            type="file"
            hidden
            onChange={this.onDrop}
          />
          <Label basic style={styles.label}>
            <Grid columns={this.checkEmptyFile() ? 2 : 1} style={styles.grid}>
              <Grid.Row style={styles.row}>
                <Grid.Column
                  width={this.checkEmptyFile() ? 14 : 16}
                  textAlign="left"
                >
                  {this.renderFileLink()}
                </Grid.Column>
                {this.checkEmptyFile() ? (
                  <Grid.Column
                    width={2}
                    floated="right"
                    textAlign="right"
                    style={styles.row}
                  >
                    {readOnly || hasPermission("REQUEST.ONLINE.CREATE") ? null : (
                      <DeleteModal
                        title={t("modal.DeleteModal.confirmDeleteFile")}
                        trigger={
                          <Icon
                            name={"trash alternate outline"}
                            link
                            circular
                            color="red"
                            inverted
                            size="small"
                          // onClick={this.removeFile}
                          />
                        }
                        onConfirmDelete={() => this.removeFile()}
                      />
                    )}
                  </Grid.Column>
                ) : null}
              </Grid.Row>
            </Grid>
          </Label>
        </Button>
      </React.Fragment>
    );
  }
  private renderFileLink() {
    const { attachedFile } = this.props;
    const file: any = attachedFile ? attachedFile.file : "";
    if (file) {
      if (file.path) {
        return (
          <a
            href={`${process.env.REACT_APP_STATIC_ENDPOINT}/${file.path}`}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            {file.name || file.originalname}
          </a>
        );
      } else {
        return file.name || file.originalname;
      }
    } else {
      return "";
    }
  }
  private checkEmptyFile() {
    const { attachedFile } = this.props;
    const file: any = attachedFile ? attachedFile.file : "";
    if (file && (file.name || file.originalname)) {
      return true;
    } else {
      return false;
    }
  }

  private removeFile = () => {
    const { removeFile } = this.props;
    this.fileInputRef.current!.value = "";
    if (typeof removeFile !== "undefined") {
      removeFile();
    }
  };
  private addFile = (file: any) => {
    const { addFile } = this.props;
    if (typeof addFile !== "undefined") {
      addFile(file);
    }
  };
}

const styles: any = {
  input: {
    cursor: "initial"
  },
  buttonLabel: {
    width: "30%",
    cursor: "pointer"
  },
  label: {
    width: "70%"
  },
  labelCursor: {
    width: "70%",
    cursor: "pointer"
  },
  grid: {
    width: "100%"
  },
  row: {
    padding: 0
  }
};

export default withTranslation()(InputAttachedFiles);
