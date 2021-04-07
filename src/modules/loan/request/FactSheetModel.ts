import { flow } from "mobx";
import { getParent, types } from "mobx-state-tree";
import moment from "moment";
import { AddressModel } from "../../../components/address";
import { ErrorModel } from "../../../components/common/error";
import {
  AttachedFileModel,
  IAttachedFileModel
} from "../../../components/common/fileupload/AttachedFileModel";
import { MessageModel } from "../../../components/common/message";
import { QuestionModel } from "../../../components/questionnaire";
import { IQuestionModel } from "../../../components/questionnaire/QuestionaireModel";
import { IInput } from "../../../utils/common-interface";
import customtypes from "../../../utils/mobx-types-helper";
import { ProfileModel } from "../../share/profile/ProfileModel";

export const ScrollModel = types.model("ScrollModel", {
  answer: types.optional(types.string, ""),
  scroll: types.optional(types.number, 0)
});

export const CriteriaModel = types
  .model("CriteriaModel", {
    id: types.maybe(types.number),
    label: types.optional(types.string, ""),
    scroll: types.array(ScrollModel),
    question_id: types.maybe(types.number),
    answer: types.optional(types.string, "")
  })
  .views((self: any) => ({
    get result() {
      let scroll = 0;
      if (self.question_list) {
        const mainQ = self.question_list.find(
          (item: any) => item.question_id === self.question_id
        );
        if (mainQ) {
          const item = self.scroll.find((_item: any) => {
            try {
              const condition = _item.answer.replace(/{answer}/g, mainQ.answer);
              return _item.answer.includes("{answer}") && mainQ.answer
                ? // tslint:disable-next-line: no-eval
                  eval(condition)
                : _item.answer === mainQ.answer;
            } catch (e) {
              console.log(e);
            }
          });
          scroll = item ? item.scroll : 0;
        } else {
          const qId = Math.floor(self.question_id / 100);
          const mainQ = self.question_list.find(
            (item: any) => item.question_id === qId
          );
          const Q = mainQ.child.find(
            (item: any) => item.question_id === self.question_id
          );
          const item = self.scroll.find((_item: any) => {
            try {
              const condition = _item.answer.replace(/{answer}/g, Q.answer);
              console.log(condition);
              return _item.answer.includes("{answer}") && Q.answer
                ? // tslint:disable-next-line: no-eval
                  eval(condition)
                : _item.answer === Q.answer;
            } catch (e) {
              console.log(e);
            }
          });
          scroll = item ? item.scroll : 0;
        }
      }
      return scroll;
    },
    get factsheet() {
      return getParent(getParent(getParent(getParent(self))));
    },
    get question_list() {
      return self.factsheet.question_list;
    }
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    }
  }));
export const CriteriaGroupModel = types
  .model("CriteriaGroupModel", {
    group_id: types.maybe(types.number),
    group_lable: types.optional(types.string, ""),
    criteria_list: types.array(CriteriaModel),
    pass_scroll: types.optional(types.number, 0)
  })
  .views((self: any) => ({
    get summary_scroll() {
      return self.criteria_list
        .map((item: any) => item.result)
        .reduce((a: number, b: number) => a + b, 0);
    }
  }));
export const FactSheetItemModel = types
  .model("FactSheetItemModel", {
    fact_sheet_version: types.optional(types.string, ""),
    fact_sheet_create_at: types.optional(types.string, ""),
    question_list: types.array(QuestionModel),
    credit_scroll_criteria: types.array(CriteriaGroupModel)
  })
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      self[fieldname] = value;
    },
    setAllField: (data: any) => {
      Object.keys(data).forEach((key) => {
        try {
          self[key] = data[key];
        } catch (e) {
          console.log(e);
        }
      });
    },
    setDefaultAnswer: (question: IQuestionModel) => {
      if (question.choice_type === "RADIO") {
        question.setDefaultAnswerRadioChoice();
      } else if (question.choice_type === "TEXT") {
        question.setDefaultAnswerTextChoice();
      } else if (question.choice_type === "GROUP") {
        question.child!.forEach((qC: IQuestionModel) => {
          self.setDefaultAnswer(qC);
        });
      }
    },
    loadFactSheet: flow(function*() {
      try {
        const result: any = yield require("./factsheet.json");
        self.setAllField(result.data);

        self.question_list.forEach((question: IQuestionModel) => {
          self.setDefaultAnswer(question);
        });
      } catch (e) {
        console.log(e);
      }
    })
  }));
export const FactSheetModel = types
  .model("FactSheetModel", {
    id: types.maybe(types.string),
    borrower: types.optional(ProfileModel, {}),
    residenceWith: types.optional(types.number, 0),
    residenceWithDescription: types.optional(types.string, ""),
    numberOfChildren: types.optional(types.number, 0),
    numberOfWorkingChildren: types.optional(types.number, 0),
    numberOfParentingChildren: types.optional(types.number, 0),
    currentAddressType: types.optional(types.number, 0),
    currentAddress: types.optional(AddressModel, {}),
    factSheetItems: customtypes.optional(FactSheetItemModel, {}),
    attachedFiles: customtypes.optional(types.array(AttachedFileModel), []),
    interviewerName: types.optional(types.string, ""),
    interviewDate: customtypes.optional(
      types.string,
      moment().format("YYYY-MM-DD")
    ),
    isApproved: types.optional(types.boolean, false),
    comments: customtypes.optional(types.string, ""),
    borrowerScore: types.optional(types.number, 0),
    guarantorScore: types.optional(types.number, 0),
    error: types.optional(ErrorModel, {}),
    loading: types.optional(types.boolean, false),
    alert: types.optional(MessageModel, {})
  })
  .views((self: any) => ({
    get fileList() {
      return self.attachedFiles.map((item: IAttachedFileModel) => item.file);
    }
  }))
  .actions((self: any) => ({
    setField: ({ fieldname, value }: IInput) => {
      if (typeof self[fieldname] === "number") {
        value = value !== "" ? +value : undefined;
      }
      self[fieldname] = value;
    },
    setAllField: (data: any) => {
      Object.keys(data).forEach((key) => {
        try {
          self[key] = data[key];
        } catch (e) {
          console.log(e);
        }
      });
    },
    addFiles: (files: File[]) => {
      files.forEach((_file: File) => {
        const attachedFile = AttachedFileModel.create({
          file: _file,
          refId: self.id,
          refType: "FACTSHEET.ATTACHEDFILE"
        });
        self.attachedFiles.push(attachedFile);
      });
    },
    removeFile: (index: number) => {
      try {
        self.attachedFiles[index].deleteFile();
        self.attachedFiles.splice(index, 1);
        self.error.setField({ fieldname: "tigger", value: false });
        self.alert.setField({ fieldname: "tigger", value: true });
        self.alert.setField({
          fieldname: "title",
          value: "บันทึกสำเร็จค่ะ"
        });
        self.alert.setField({
          fieldname: "message",
          value: "ข้อมูลถูกลบเรียบร้อยแล้ว"
        });
      } catch (e) {
        self.error.setField({ fieldname: "tigger", value: true });
        self.error.setField({ fieldname: "code", value: e.code });
        self.error.setField({ fieldname: "title", value: e.name });
        self.error.setField({
          fieldname: "message",
          value: e.message
        });
        self.error.setField({
          fieldname: "technical_stack",
          value: e.technical_stack
        });
        console.log(e);
      }
    }
  }));

export type IFactSheetModel = typeof FactSheetModel.Type;
export type IFactSheetItemModel = typeof FactSheetItemModel.Type;
export type ICriteriaGroupModel = typeof CriteriaGroupModel.Type;
export type ICriteriaModel = typeof CriteriaModel.Type;
