import React, { useState } from "react";
import btnStyles from "../../../../appStyles/btnStyles.module.css";
import { numCountDisplay } from "../../../formFuncs/miscFuncs";
import { ToolTipCtr } from "../../../layout/customComps";
import { getButtonIcon, PollFilters } from "./pollIconFuncs";

const { customBtn, customBtnOutline, customBtnOutlinePrimary } = btnStyles;

interface PollIconCtr {
  showAdd: () => void;
  numAnswers: number;
}

export const PollIconCtr = ({ showAdd, numAnswers }: PollIconCtr) => {
  const [shareBtnState, toggleShare] = useState(false);
  const [answerBtnState, toggleAnswer] = useState(false);

  const answerTxt =
    numAnswers > 1
      ? `${numCountDisplay(numAnswers)} Answers`
      : `${numCountDisplay(numAnswers)} Answer`;

  const shareBtn = shareBtnState
    ? getButtonIcon("share-fill", shareBtnState, toggleShare)
    : getButtonIcon("share-empty", shareBtnState, toggleShare);

  const answerBtn = answerBtnState
    ? getButtonIcon("answer-fill", answerBtnState, toggleAnswer)
    : getButtonIcon("answer-empty", answerBtnState, toggleAnswer);

  return (
    <div className="d-flex justify-content-between align-items-center w-100">
      <div className="d-flex align-items-center w-100">
        <div style={{ width: "17%" }}>
          <PollFilters />
        </div>
        <div className="d-flex justify-content-between align-items-center ml-5">
          <button
            className={`${customBtn} ${customBtnOutline} ${customBtnOutlinePrimary}`}
            onClick={() => showAdd()}
          >
            Add Answer
          </button>
          <div className="d-flex align-items-center ml-5">
            <ToolTipCtr
              mssg="Total Answers"
              position="bottom"
              style={{ bottom: "-40px", left: "50%" }}
            >
              {answerBtn}
            </ToolTipCtr>
            <div className="ml-3" style={{ color: "gray", fontWeight: 600 }}>
              {answerTxt}
            </div>
          </div>
          {/* <img
            src="https://res.cloudinary.com/rahmad12/image/upload/v1620773139/PoldIt/App_Imgs/Sad_fill_kywf7r.png"
            style={{ height: 60, width: 60 }}
          />
          <img
            src="https://res.cloudinary.com/rahmad12/image/upload/v1620773139/PoldIt/App_Imgs/Sad_outline_1_gdcev2.png"
            style={{ height: 60, width: 60 }}
          />
          <img
            src="https://res.cloudinary.com/rahmad12/image/upload/v1620773139/PoldIt/App_Imgs/Smiley_outline_1_oiceaw.png"
            style={{ height: 60, width: 60 }}
          />
          <img
            src="https://res.cloudinary.com/rahmad12/image/upload/v1620773139/PoldIt/App_Imgs/Smile-fill_wx6ltm.png"
            style={{ height: 60, width: 60 }}
          /> */}
        </div>
      </div>
      {shareBtn}
    </div>
  );
};
