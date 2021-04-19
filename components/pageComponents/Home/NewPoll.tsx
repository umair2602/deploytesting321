import { useEffect, useState } from "react";
import "jquery";
import { FiPlusSquare } from "react-icons/fi";
import styles from "../../../appStyles/appStyles.module.css";
import { ErrorList } from "../../formFuncs/formFuncs";
import GraphResolvers from "../../../lib/apollo/apiGraphStrings";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useAuth } from "../../authProvider/authProvider";
import {
  ErrorMssg,
  ISubTopic,
  NewPollForm,
  SelectedImage,
  SelectedSubTopic,
  SelectedTopic,
} from "../../appTypes/appType";
import TopicWindow from "../Other/TopicWindow";
import { SubTopicWindow } from "../Other/TopicWindow/subTopic";
import {
  SelectedTopicBtn,
  SearchBar,
  AddSubTopic,
  ImagePicker,
  SelectedImgCtr,
  ErrorMssgCtr,
} from "./newPollComps";
import uploadImg from "../../apis/imgUpload";

export default function NewPoll() {
  //Styles
  const { appColor, appTxt, formTxt } = styles;

  //API
  const { CREATE_POLL, UPLOAD_IMAGE } = GraphResolvers.mutations;
  const {
    GET_POLLS_ALL,
    GET_TOPICS,
    GET_SUBTOPICS_PER_TOPIC,
  } = GraphResolvers.queries;
  const [createPoll] = useMutation(CREATE_POLL);
  const { data } = useQuery(GET_TOPICS);
  const [getSubTopics, { data: subTopicsData }] = useLazyQuery(
    GET_SUBTOPICS_PER_TOPIC
  );
  const [uploadImage, { data: dbImgData }] = useMutation(UPLOAD_IMAGE);

  //State Management
  const topicInitialState: SelectedTopic = { id: "", topic: "" };
  const [formErrors, setFormErrors] = useState<ErrorMssg[]>([]);
  const [imgError, setImgError] = useState("");
  const [subTopics, setSubTopics] = useState<ISubTopic[]>([]);
  const [selectedImgs, selectImgs] = useState<SelectedImage[]>([]);
  const [charCount, updateCharCount] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState(topicInitialState);
  const [addBtn, toggleAddBtn] = useState(false);
  const [selectedSubTopics, setSelectedSubTopics] = useState<
    SelectedSubTopic[]
  >([]);

  //Context and app Render hooks
  const appContext = useAuth();
  useEffect(() => {
    manageSubTopicData();
  }, [subTopicsData]);

  //Functions

  const manageSubTopicData = () => {
    subTopicsData && setSubTopics(subTopicsData.subTopicsPerTopic);
  };

  const updateSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const searchVal = e.target.value.toLowerCase();

    const results = subTopicsData.subTopicsPerTopic.filter(
      (subTopic: ISubTopic) => {
        const subTopicVal = subTopic.subTopic.toLowerCase();

        if (subTopicVal.search(searchVal) > -1) {
          return subTopic;
        }
      }
    );

    setSubTopics(results);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    let finalImgIds: string[] = [];

    const question = (document.getElementById("question") as HTMLInputElement)
      .value;

    const errors: ErrorMssg[] = [];

    question.length > 250 &&
      errors.push({
        message:
          "Your question is over 250 characters.  Please edit the question.",
      });

    question.length === 0 &&
      errors.push({ message: "Please provide a question." });

    selectedTopic.topic === "" &&
      errors.push({
        message: "Please choose a topic.",
      });

    selectedSubTopics.length === 0 &&
      errors.push({
        message: "Please choose at least one sub topic.",
      });

    setFormErrors(errors);

    if (errors.length === 0) {
      setFormErrors([]);
      saveImgtoCloud().then((data) => {
        if (data) {
          for (let i = 0; i < data.length; i++) {
            uploadImage({ variables: { details: JSON.stringify(data[i]) } });
            if (dbImgData) {
              finalImgIds.push(dbImgData.uploadImage._id);
            }
          }

          const subTopics = selectedSubTopics.map((item) => item.id);

          const pollItem = {
            question,
            topic: selectedTopic.id,
            subTopics,
            pollImages: finalImgIds,
          };

          createPoll({
            variables: { details: JSON.stringify(pollItem) },
            refetchQueries: [{ query: GET_POLLS_ALL }],
          });

          ($("#newPollModal") as any).modal("hide"); //closes modal programitically
          clearForm();
        }
      });
    }
  };

  const clearForm = () => {
    selectImgs([]);
    setFormErrors([]);
    updateCharCount(0);
    setSelectedTopic(topicInitialState);
    (document.getElementById("newPoll") as HTMLFormElement).reset();
    manageSubTopicData();
  };

  const countCharacters = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    updateCharCount(e.target.value.length);
  };

  const chooseTopic = async (topic: { id: string; topic: string }) => {
    getSubTopics({ variables: { topic: topic.topic } });
    setSelectedTopic(topic);
    toggleAddBtn(false);
    setSelectedSubTopics([]);
  };

  const imgSelectHandler = (e: any) => {
    setImgError("");
    const fileObjList: File[] = Array.from(e.target?.files);
    const imgDiff = fileObjList.length + selectedImgs.length;

    if (imgDiff > 3) {
      setImgError(
        "You can only select up to 3 images.  Please either remove an image or choose again."
      );
      return;
    }

    const selectedImgList: SelectedImage[] = fileObjList.map((fileObj) => {
      const fileURL = URL.createObjectURL(fileObj);
      return {
        imageName: fileObj.name.split(".")[0],
        image: fileObj,
        imageUri: fileURL,
        userId: appContext?.authState.user._id,
        imgType: "poll",
      };
    });

    selectImgs([...selectedImgs, ...selectedImgList]);
  };

  const updateSelectedImgList = (img: SelectedImage) => {
    const updatedImgList = selectedImgs.filter(
      (item) => item.imageUri !== img.imageUri
    );

    setImgError("");
    selectImgs(updatedImgList);
  };

  const saveImgtoCloud = async () => {
    if (selectedImgs) {
      return Promise.all(selectedImgs.map((item) => uploadImg(item)));
    }
  };

  const charDivStyle =
    charCount > 250
      ? { fontSize: 14, color: "red", fontWeight: 600 }
      : { fontSize: 14 };

  return (
    <div
      className="modal fade"
      id="newPollModal"
      tabIndex={-1}
      aria-labelledby="newPollModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className={`${appColor} p-2`}>
            <h3 className={`text-center p-2 modal-title ${appTxt}`}>
              NEW POLL
            </h3>
          </div>
          <div className="modal-body">
            <form id="newPoll">
              <div className="form-group">
                <label
                  htmlFor="question"
                  className={`col-form-label ${formTxt}`}
                >
                  Poll Question
                </label>
                <textarea
                  className="form-control"
                  id="question"
                  rows={4}
                  onChange={countCharacters}
                ></textarea>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <ImagePicker handleImg={imgSelectHandler} />
                {selectedImgs.length > 0 && (
                  <div
                    className={`text-white ${styles.appColor} pl-2 pr-2 rounded ${styles.cursor}`}
                    onClick={() => selectImgs([])}
                  >
                    Clear Image Selection
                  </div>
                )}
                <div style={charDivStyle}>{`${charCount}/250`}</div>
              </div>
              {selectedImgs.length > 0 && (
                <div className="form-group">
                  <label
                    htmlFor="question"
                    className={`col-form-label ${formTxt}`}
                  >
                    Selected Images
                  </label>
                  <div className="d-flex" id="selectedImgs">
                    {selectedImgs.map((item, idx) => (
                      <SelectedImgCtr
                        img={item}
                        updateImgs={updateSelectedImgList}
                        key={idx}
                      />
                    ))}
                  </div>
                  <div
                    className="d-flex flex-row-reverse"
                    style={{ fontSize: 14 }}
                  >{`${selectedImgs.length}/3`}</div>
                </div>
              )}
              {imgError && (
                <ErrorMssgCtr errMssg={imgError} clearErr={setImgError} />
              )}
              <div className="form-group mb-5 mt-3 d-flex flex-column justify-content-between">
                <div className="d-flex mb-1 justify-content-between">
                  <label
                    htmlFor="topic"
                    className={`col-form-label ${formTxt} d-flex align-items-center`}
                    style={{ height: 50 }}
                  >
                    Select Poll Topic
                  </label>
                  {selectedTopic.topic && (
                    <div className="d-flex w-75 align-items-center">
                      <SelectedTopicBtn
                        btnType="topic"
                        selectedTopic={selectedTopic}
                        selectedSubTopics={selectedSubTopics}
                        setSelectedTopic={setSelectedTopic}
                        setSelectedSubTopics={setSelectedSubTopics}
                      />
                    </div>
                  )}
                </div>
                <TopicWindow
                  data={data?.topics}
                  selectedTopic={selectedTopic}
                  setTopic={chooseTopic}
                />
              </div>
              {selectedTopic.topic && (
                <>
                  <div className="form-group">
                    <div
                      className="d-flex flex-column mb-1"
                      style={{ height: "7vh" }}
                    >
                      <div className="d-flex justify-content-between">
                        <label
                          htmlFor="subTopic"
                          className={`col-form-label ${formTxt} d-flex align-items-center`}
                          style={{ height: 50 }}
                        >
                          Select Poll SubTopic(s)
                        </label>
                        {selectedSubTopics && (
                          <div className="d-flex w-75">
                            <SelectedTopicBtn
                              btnType="subTopic"
                              selectedTopic={selectedTopic}
                              selectedSubTopics={selectedSubTopics}
                              setSelectedTopic={setSelectedTopic}
                              setSelectedSubTopics={setSelectedSubTopics}
                            />
                          </div>
                        )}
                      </div>
                      <SearchBar search={updateSearch} />
                    </div>
                    <SubTopicWindow
                      data={subTopics}
                      selectedSubTopics={selectedSubTopics}
                      setSubTopics={setSelectedSubTopics}
                    />
                  </div>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    style={{ fontSize: 14 }}
                  >
                    <div
                      className={styles.cursor}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Add new Sub Topic"
                      onClick={() => toggleAddBtn(!addBtn)}
                    >
                      <FiPlusSquare size="28px" color="#ff4d00" />
                    </div>

                    <div
                      className="d-flex align-items-center justify-content-between"
                      style={{ width: "20%" }}
                    >
                      <div>Select up to 3</div>
                      <div className="">{`${selectedSubTopics.length}/3`}</div>
                    </div>
                  </div>
                  {addBtn && (
                    <AddSubTopic
                      show={toggleAddBtn}
                      topic={selectedTopic}
                      setErrors={setFormErrors}
                      subTopics={selectedSubTopics}
                      setSubTopic={setSelectedSubTopics}
                    />
                  )}
                </>
              )}
            </form>
            {formErrors.length > 0 && <ErrorList errors={formErrors} />}
          </div>
          <div className="modal-footer">
            <div className="d-flex justify-content-between flex-fill p-2 flex-row-reverse">
              <div
                className="d-flex justify-content-between"
                style={{ width: "40%" }}
              >
                {/* <button
                  type="button"
                  onClick={() => {
                    saveImgtoCloud().then((data) => {
                      if (data) {
                        for (let i = 0; i < data.length; i++) {
                          uploadImage({
                            variables: { details: JSON.stringify(data[i]) },
                          });
                        }
                      }
                    });
                  }}
                  id="submitButton"
                  className={`btn ${appColor} text-white`}
                >
                  Save Image
                </button> */}
                <button
                  type="button"
                  onClick={() => clearForm()}
                  id="submitButton"
                  className={`btn ${appColor} text-white`}
                >
                  Clear Poll
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  id="submitButton"
                  className={`btn ${appColor} text-white`}
                >
                  Create Poll
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={() => clearForm()}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
