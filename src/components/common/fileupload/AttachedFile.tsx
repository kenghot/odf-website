import i18next from "i18next";
import React from "react";
import Dropzone from "react-dropzone";
import { WithTranslation, withTranslation } from "react-i18next";
import {
  Button,
  Container,
  Icon,
  List,
  Message,
  Segment
} from "semantic-ui-react";
import { COLORS } from "../../../constants";
import { DeleteModal } from "../../../modals";
import { Text } from "../text";

interface IAttachedFile extends WithTranslation {
  multiple?: boolean;
  basic?: boolean;
  files?: File[];
  addFile?: (file: File) => void;
  addFiles?: (files: any) => void;
  removeFile?: (index?: number) => void;
  mode: "view" | "edit";
  title?: string;
  emptyLabel?: string;
  fieldName?: string; // กำหนด fieldname ของ file ตาม structure data ที่จะส่งไปให้ API
}
class AttachedFile extends React.Component<IAttachedFile> {
  public state = {
    files: []
  };
  public render() {
    const { files } = this.props;
    const { t, mode } = this.props;
    return (
      <div>
        {files && files.length > 0 ? this.renderFileList() : null}
        {files && files.length === 0 && mode === "view" ? this.renderEmpty() : null}
        {mode === "edit" ? this.renderDropzone(t) : null}
      </div>
    );
  }
  private renderFileList = () => {
    const { basic, files } = this.props;

    return (
      <Segment basic={basic}>
        <List>
          {files &&
            files.map((file: any, index: number) => (
              <List.Item key={index}>
                {file.destination ? (
                  <a
                    href={`${process.env.REACT_APP_STATIC_ENDPOINT}/${file.path}`}
                    download
                    target="_blank"
                  >
                    {file.name || file.originalname}
                  </a>
                ) : (
                  file.name || file.originalname
                )}

                {this.renderRemoveIcon(file, index)}
              </List.Item>
            ))}
        </List>
      </Segment>
    );
  };

  private renderEmpty = () => {
    const { basic, emptyLabel, t } = this.props;
    return (
      <Segment basic={basic} style={styles.segment}>
        <Message
          icon="inbox"
          header={emptyLabel || t("component.attachedFile.attachmentNotFound")}
        />
      </Segment>
    );
  };

  private renderRemoveIcon = (file: File, index: number) => {
    const { mode, t } = this.props;
    return mode === "edit" ? (
      <List.Content floated="right">
        <DeleteModal
          title={t("modal.DeleteModal.confirmDeleteFile")}
          trigger={
            <Icon
              name="trash alternate outline"
              link
            />
          }
          onConfirmDelete={() => this.removeFile(file, index)}
        />
      </List.Content>
    ) : null;
  };
  private renderDropzone = (t: i18next.TFunction) => (
    <Dropzone onDrop={this.onDrop} noClick={true}>
      {({ getRootProps, getInputProps, open }) => (
        <div {...getRootProps({ className: "dropzone" })}>
          <Segment placeholder basic={this.props.basic} style={styles.segment}>
            <Container textAlign="center" style={styles.container}>
              <Text shade={4}>{t("component.attachedFile.dragAndDrop")}</Text>
            </Container>
            <Button onClick={open}>
              {t("component.attachedFile.searchFile")}
            </Button>
            <input
              name={this.props.fieldName && this.props.fieldName}
              {...getInputProps()}
            />
          </Segment>
        </div>
      )}
    </Dropzone>
  );
  private onDrop = (files: File[]) => {
    const { multiple } = this.props;
    multiple ? this.addFiles(files) : this.addFile(files[0]);
  };
  private addFile = (file: File) => {
    this.setState({ files: [file] });
    if (this.props.addFile) {
      this.props.addFile(file);
    }
  };
  private addFiles = (files: File[]) => {
    this.setState({ files: [...this.state.files, ...files] });
    if (this.props.addFiles) {
      this.props.addFiles(files);
    }
  };
  private removeFile = (file: File, index: number) => {
    this.setState({
      files: this.state.files.filter((f: File) => f.name !== file.name)
    });
    if (this.props.removeFile) {
      this.props.removeFile(index);
    }
  };
}
const styles = {
  segment: {
    backgroundColor: COLORS.white
  },
  container: {
    padding: "14px"
  }
};
export default withTranslation()(AttachedFile);
