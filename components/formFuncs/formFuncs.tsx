import { AppMssg, ErrorMssg, StatesUS } from "../appTypes/appType";

export const ErrorList = ({ errors }: { errors: ErrorMssg[] }) => {
  return (
    <ul className="list-group">
      {errors.map((error, idx) => (
        <li key={idx} className="list-group-item list-group-item-danger m-1">
          {error.message}
        </li>
      ))}
    </ul>
  );
};

export const AppMssgList = ({ mssgs }: { mssgs: AppMssg[] }) => {
  return (
    <ul className="list-group">
      {mssgs.map((msg, idx) => {
        const msgTypeColor =
          msg.msgType === 0
            ? "list-group-item-danger"
            : "list-group-item-success";

        return (
          <li key={idx} className={`list-group-item ${msgTypeColor} m-1`}>
            {msg.message}
          </li>
        );
      })}
    </ul>
  );
};

export const StateVals = ({ stateList }: { stateList: StatesUS[] }) => {
  return (
    <>
      {stateList.map((stateVal) => (
        <option key={stateVal.id}>{stateVal.name}</option>
      ))}
    </>
  );
};