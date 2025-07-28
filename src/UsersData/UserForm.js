import React from "react";
import { TextField, Button, Autocomplete } from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import AuthService from "../services/AuthService";

function UserForm({
  userDatatoForm,
  userFormOpen,
  setUserFormOpen,
  setSnackbarMessage,
  setSnackbarType,
  setDataUpadateMsg,
  fetch,
}) {
  const roles = {
    all: ["Super Admin", "Admin", "Manager", "Senior Executive", "Executive"],
    limited: ["Manager", "Senior Executive", "Executive"],
  };

  const teamOptions = ["Admin", "Pricing", "Sales", "Marketing"];

  const initialValues = {
    name: userDatatoForm ? userDatatoForm.name : "",
    email: userDatatoForm ? userDatatoForm.email : "",
    mobileNo: userDatatoForm ? userDatatoForm.mobile : "",
    designation: userDatatoForm ? userDatatoForm.designation : "",
    role: userDatatoForm ? userDatatoForm.role : "",
    team: userDatatoForm ? userDatatoForm.team : "",
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    mobileNo: yup
      .string()
      .matches(/^[0-9]{10}$/, "Not a valid number")
      .required("Mobile number is required"),
    designation: yup.string().required("Designation is required"),
    role: yup.string().required("Role is required"),
    team: yup.string().required("Team is required"),
  });

  const CRMBaseURL = AuthService();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  

  const onSubmit = async (values) => {
    const submitValues = {
      ...values,
      id: parseInt(userDatatoForm.id),
      approvedBy:
        storedUserData &&
        `${storedUserData.userName} (${storedUserData.email})`,
    };
    

    try {
      const response = await CRMBaseURL.post("updateuser", submitValues);
    
      fetch();
      setSnackbarType("success");
      setSnackbarMessage(response && response.data?.message);
      setDataUpadateMsg(true);
    } catch (err) {
      console.log("Error occurred:", err);
      setSnackbarType("error");
      setSnackbarMessage("Something went wrong. Please try again.");
      setDataUpadateMsg(true);
    }

    setUserFormOpen(false);
  };

  return (
    <Dialog open={userFormOpen}>
      <DialogTitle>User Registration Form</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, setFieldValue, errors, touched, values }) => {
          
            const isLimitedRoles = ["Pricing", "Sales", "Marketing"].includes(
              values.team
            );
            const availableRoles = isLimitedRoles ? roles.limited : roles.all;

            return (
              <Form>
                <Field
                 required
                  as={TextField}
                  fullWidth
                  name="name"
                  sx={{ my: 2 }}
                  label="Name"
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
                <Field
                 required
                  as={TextField}
                  fullWidth
                  name="email"
                  sx={{ mb: 2 }}
                  label="Email"
                  type="email"
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  disabled={!!userDatatoForm}
                />
                <Field
                 required
                  as={TextField}
                  fullWidth
                  name="mobileNo"
                  sx={{ mb: 2 }}
                  label="Mobile No"
                  type="tel"
                  error={touched.mobileNo && !!errors.mobileNo}
                  helperText={touched.mobileNo && errors.mobileNo}
                />
                <Autocomplete
                  options={teamOptions}
                  value={values.team || null}
                  onChange={(event, newValue) => {
                    setFieldValue("team", newValue || "");

                    setFieldValue("role", ""); // Clear role if no team selected
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Team"
                      name="team"
                      error={touched.team && !!errors.team}
                      helperText={touched.team && errors.team}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                  )}
                />
                <Autocomplete
                  options={availableRoles}
                  value={values.role || null}
                  disabled={!values.team}
                  onChange={(event, newValue) => {
                    setFieldValue("role", newValue || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Role"
                      name="role"
                      error={touched.role && !!errors.role}
                      helperText={touched.role && errors.role}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                  )}
                />
                <Field
                  as={TextField}
                  sx={{ mb: 2 }}
                  required
                  fullWidth
                  name="designation"
                  label="Designation"
                  error={touched.designation && !!errors.designation}
                  helperText={touched.designation && errors.designation}
                />
                <DialogActions>
                  <Button
                    onClick={() => setUserFormOpen(false)}
                    color="primary"
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                      backgroundImage:
                        "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
                    }}
                  >
                    Submit
                  </Button>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default UserForm;
