import { Roles } from "pages/Admin/UsersInfo/UsersInfo";
import React, { useEffect, useState } from "react";
import { adminUserDataForm, validationErrorsAdmin } from "_components/index";
import {
  Model,
  SelectMenu,
  AdminPara,
  UsersDataFormInput,
  SelectMenuActive,
  ButtonCustomWidth,
} from "_pageComponents/index";
import usersInfoBox from "../../../../appStyles/adminStyles/usersInfoBox.module.css";

const UserUpdateModel: React.FC<{
  showUserEditModal: boolean;
  setShowUserEditModal: Function;
  handleCLoseModal: Function;
  handleSubmitUsersData: React.FormEventHandler;
  validationErrors: validationErrorsAdmin;
  setValidationErrors: Function;
  userDataForm: adminUserDataForm;
  setUserDataForm: Function;
  userRoles: Roles[];
}> = (props) => {
  const {
    showUserEditModal,
    setShowUserEditModal,
    handleCLoseModal,
    handleSubmitUsersData,
    validationErrors,
    setValidationErrors,
    userDataForm,
    setUserDataForm,
    userRoles,
  } = props;

  const accessRoles = [
    {
      value: "admin",
      label: "Admin",
    },
    {
      value: "employee",
      label: "Employee",
    },
    {
      value: "moderator",
      label: "Moderator",
    },
  ];

  const [roles, setRoles] = useState(userRoles);
  useEffect(() => {
    if (userRoles) setRoles(userRoles);
  });

  const isActive = [
    {
      value: true,
      label: "true",
    },
    {
      value: false,
      label: "false",
    },
  ];

  return (
    <Model
      show={showUserEditModal}
      size="md"
      modalTitle={"Update User Info"}
      handleClose={handleCLoseModal}
    >
      <form onSubmit={handleSubmitUsersData}>
        <div className={usersInfoBox.userInfoBox__inputWrapper}>
          <h5 style={{ marginBottom: "1rem" }}>User update Form</h5>
          <div className={usersInfoBox.userInfoBox__singleInputWrapper}>
            <AdminPara text="Full Name" />
            <UsersDataFormInput
              type="text"
              required={true}
              name="fullName"
              value={userDataForm.fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUserDataForm({
                  ...userDataForm,
                  fullName: e.currentTarget.value,
                });
              }}
            />
          </div>
          <div className={usersInfoBox.userInfoBox__singleInputWrapper}>
            <AdminPara text="E-mail" />
            <UsersDataFormInput
              validationerrors={validationErrors}
              type="email"
              border={validationErrors.emailErr && "2px solid #DC3545"}
              required
              name="email"
              value={userDataForm.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setValidationErrors({ ...userDataForm, email: "" });
                setUserDataForm({ ...userDataForm, email: e.target.value });
              }}
            />
          </div>
          <div className={usersInfoBox.userInfoBox__singleInputWrapper}>
            <p></p>
            {validationErrors.emailErr && (
              <p style={{ color: "#DC3545" }}> {validationErrors.emailErr}</p>
            )}
          </div>

          <div className={usersInfoBox.userInfoBox__singleInputWrapper}>
            <AdminPara text="Job Title" />
            <UsersDataFormInput
              type="text"
              required
              value={userDataForm.jobTitle}
              name="jobTitle"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUserDataForm({ ...userDataForm, jobTitle: e.target.value });
              }}
            />
          </div>

          <div className={usersInfoBox.userInfoBox__singleInputWrapper}>
            <AdminPara text="Access-Role" />
            <SelectMenu
              options={roles}
              selectedValue={userDataForm.accessRole}
              userDataForm={userDataForm}
              setUserDataForm={setUserDataForm}
            />
          </div>

          <div className={usersInfoBox.userInfoBox__singleInputWrapper}>
            <AdminPara text="isActive" />
            <SelectMenuActive
              activeOptions={isActive}
              selectedValue={userDataForm.isActive || false}
              userDataForm={userDataForm}
              setUserDataForm={setUserDataForm}
            />
          </div>

          <div className={usersInfoBox.modalButtonsWrapper}>
            <ButtonCustomWidth
              type="text"
              width={"9rem"}
              height={"2.5rem"}
              title="Cancel"
              onClick={handleCLoseModal}
            />
            <ButtonCustomWidth
              width={"9rem"}
              height={"2.5rem"}
              type="submit"
              title="Save User info"
              onClick={() => "f"}
            />
          </div>
        </div>
      </form>
    </Model>
  );
};

export default UserUpdateModel;

//  <div className={usersInfoBox.userInfoBox__singleInputWrapper}>
//   <AdminPara text="Phone Number" />
//   <UsersDataFormInput
//     type="text"
//     name="phoneNumber"
//     validationErrors={validationErrors}
//     value={userDataForm.phoneNumber}
//     onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//       setUserDataForm({
//         ...userDataForm,
//         phoneNumber: e.target.value,
//       });
//     }}
//   />
// </div>
// <div className={usersInfoBox.userInfoBox__singleInputWrapper}>
//   <AdminPara text="Home Address" />
//   <UsersDataFormInput
//     type="text"
//     required
//     validationErrors={validationErrors}
//     value={userDataForm.homeAddress}
//     name="homeAddress"
//     onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//       setUserDataForm({
//         ...userDataForm,
//         homeAddress: e.target.value,
//       });
//     }}
//   />
// </div>

//    <div className={usersInfoBox.userInfoBox__singleInputWrapper}>
//   <AdminPara text="Groups" />
//   <UsersDataFormInput
//     type="text"
//     name="groups"
//     validationErrors={validationErrors}
//     value={userDataForm.groups}
//     required
//     onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//       setUserDataForm({ ...userDataForm, groups: e.target.value });
//     }}
//   />
// </div>
// <div className={usersInfoBox.userInfoBox__singleInputWrapper}>
//   <AdminPara text="Last Sign-in" />
//   <UsersDataFormInput
//     type="text"
//     required
//     value={userDataForm.lastSignIn}
//     validationErrors={validationErrors}
//     name="lastSignIn"
//     onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//       setUserDataForm({
//         ...userDataForm,
//         lastSignIn: e.target.value,
//       });
//     }}
//   />
// </div>