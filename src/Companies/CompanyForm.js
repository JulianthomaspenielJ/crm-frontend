import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Grid,
  Autocomplete,
  Snackbar,
  IconButton,
  CircularProgress,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthService from "../services/AuthService";
import MuiAlert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PersonRemoveAlt1RoundedIcon from "@mui/icons-material/PersonRemoveAlt1Rounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import { fetchCountries, fetchStates, fetchIndustries } from "./CompanyData";
import "react-phone-number-input/style.css";
import {
  parsePhoneNumberFromString,
  getExampleNumber,
  AsYouType,
} from "libphonenumber-js";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CompanyForm({
  setOpenCompanyForm,
  openCompanyForm,
  fetchCompanyData,
  companyDataList,
}) {
  const CRMBaseURL = AuthService();
  const fieldRefs = useRef({});
  const [isApiCallInProgress, setApiCallInProgress] = useState(false);

  const NumberofEmployeeOptions = [
    "1 to 10",
    "10 to 50",
    "50 to 100",
    "100 to 500",
    "500 above",
  ];

  const [errorOpen, setErrorOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [hasGst, setHasGst] = useState("yes");
  const [maxLength, setMaxLength] = useState();

  const [options, setOptions] = useState("");

  const [countries, setCountries] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [countrySortName, setCountrySortName] = useState("");
  const [isGSTLoading, setIsGSTLoading] = useState(false);
  // Fetch countries on component mount
  useEffect(() => {
    const getCountries = async () => {
      const countryData = await fetchCountries();
      const industry = await fetchIndustries();
      setCountries(countryData);
      setOptions(industry);
    };
    getCountries();
  }, []);

  // Handle country selection and fetch states dynamically
  const handleCountryChange = async (value) => {
    setCountrySortName(value?.sortname);
    setMaxLength(getMaxNationalNumberLengthForCountry(value?.sortname));
    formik.setFieldValue("mobile", "");
    formik.setFieldValue("state", "");
    if (value) {
      formik.setFieldValue("country", value.country_name); // Set only the country name
      const countryStates = await fetchStates(value.country_id);
      setFilteredStates(countryStates); // Update the state options
      formik.setFieldValue("state", ""); // Reset state when country changes
    } else {
      setFilteredStates([]); // Clear states if no country is selected
      formik.setFieldValue("country", ""); // Reset country
      formik.setFieldValue("state", ""); // Reset state if no country
    }
  };

  // Get the max valid length for the national number in the given country
  const getMaxNationalNumberLengthForCountry = (countryCode) => {
    const exampleNumber = getExampleNumber(countryCode);
    return exampleNumber ? exampleNumber.nationalNumber.length : 10; // Default length if not found
  };

  const formatPhoneNumber = (value, countryCode) => {
    const cleanNumber = value.replace(/\D/g, "");
    const formatter = new AsYouType(countryCode);
    return formatter.input(cleanNumber);
  };

  const handlePhoneNumberChange = (e) => {
    const rawValue = e.target.value;
    const formattedNumber = formatPhoneNumber(rawValue, countrySortName);

    // Only set the formatted number if it does not exceed maxLength
    if (formattedNumber.replace(/\D/g, "").length <= maxLength) {
      formik.setFieldValue("mobile", formattedNumber);
    }
  };

  const validationSchema = Yup.object({
    gstNumber:
      hasGst === "yes"
        ? Yup.string()
            .required("GST Number must be required")
            .matches(
              /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
              "GST number is invalid"
            )
            .test("is-valid-gstNumber", "GST NOT valid", async (value) => {
              if (!value) return true; // Skip validation if value is empty

              if (isApiCallInProgress) {
                setIsGSTLoading(true);
                try {
                  const response = await CRMBaseURL.post("gst", {
                    gstNumber: value,
                  });

                  if (response.data.message === "Data fetched Successfully") {
                    setIsFormDisabled(false);
                    formik.setFieldValue(
                      "companyName",
                      response.data.Data.Name || ""
                    );
                    formik.setFieldValue(
                      "city",
                      response.data.Data.Address || ""
                    );
                    formik.setFieldValue(
                      "panNumber",
                      response.data.Data.PAN || ""
                    );
                    // Set other fields as needed
                    return true; // Validation passed
                  } else if (
                    response.data.message ===
                    "No data found for this GST number"
                  ) {
                    formik.setFieldValue("companyName", "");
                    formik.setFieldValue("city", "");
                    formik.setFieldValue("panNumber", "");
                    return new Yup.ValidationError(
                      "No data found for this GST number",
                      null,
                      "gstNumber"
                    );
                  } else {
                    formik.setFieldValue("companyName", "");
                    formik.setFieldValue("city", "");
                    formik.setFieldValue("panNumber", "");
                    return new Yup.ValidationError(
                      "GST number validation failed",
                      null,
                      "gstNumber"
                    );
                  }
                } catch (error) {
                  formik.setFieldValue("companyName", "");
                  formik.setFieldValue("city", ""); 
                  formik.setFieldValue("panNumber", "");
                  return new Yup.ValidationError(
                    "GST number is invalid or missing.",
                    null,
                    "gstNumber"
                  );
                } finally {
                  setApiCallInProgress(false); // Reset the flag
                  setIsGSTLoading(false);
                }
              } else {
                return true;
              }
            })
        : Yup.string(),

    domainName: Yup.string()
      .matches(
        /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid domain, domain format should be like www.example.com"
      )
      .required("Company domain name must be required"),
    companyName: Yup.string().required("Company name must be required"),
    companyOwner: Yup.string(),
    industry: Yup.string().required("Industry must be required"),
    city: Yup.string().required("City must be required"),
    state: Yup.string().required("State must be required"),
    postalCode: Yup.string()
      .matches(/^[1-9][0-9]{5}$/, "Invalid postal code")
      .required("Postal code must be required"),
    numberOfEmployees: Yup.string().required("Number Of Employees must be required"),
    annualRevenue: Yup.string().required("Annual Revenue must be required"),
    description: Yup.string(),
    socialUrl: Yup.string()
      .url("Invalid URL")
      .required("Social URL must be required"),
    panNumber:
      hasGst === "yes"
        ? Yup.string()
            .matches(/^([A-Z]{5}[0-9]{4}[A-Z]{1})$/, "PAN number is invalid")
            .required("PAN Number must be required")
            .test(
              "is-valid-panNumber",
              "Pan Number Already Exits",
              function (value) {
                const data = companyDataList.filter((data) => {
                  return data.panNumber === value;
                });

                return data.length === 0;
              }
            )
        : Yup.string(),
    msmeNumber: Yup.string(),
    numberOfBranches: Yup.number().required(
      "Number of Branches must be required"
    ),
    mobile: Yup.string()
      .required("Phone number is required")
      .test("is-valid-phone", "Invalid phone number", function (value) {
        const mobile = parsePhoneNumberFromString(value, countrySortName);
        return mobile && mobile.isValid();
      })
      .test("is-valid-phone", "Mobile Number Already Exits", function (value) {
        const val = value.replace(/\s+/g, "");
        const data = companyDataList.filter((data) => {
          return data.mobile === val;
        });

        return data.length === 0;
      }),
    email: Yup.string()
      .email("Invalid email address format")
      .required("Email must be required")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email must be a valid email address"
      )
      .test("is-valid-email", "Email ID Already Exits", function (value) {
        const data = companyDataList.filter((data) => {
          return data.email === value;
        });

        return data.length === 0;
      }),
    country: Yup.string().required("Country must be required"),
    cin: Yup.string(),
  });

  const handleClose = () => {
    setErrorOpen(false);
  };

  const handleGstChange = (event) => {
    const value = event.target.value;
    setHasGst(value);
    if (value === "no") {
      formik.resetForm();
      formik.setFieldValue("country", null); // Explicitly set country to null
      formik.setFieldValue("state", null); 
      setIsFormDisabled(false);

    } else {
      formik.setFieldValue("country", null); // Ensure country is reset to null
      formik.setFieldValue("state", null);
      formik.resetForm();
      setIsFormDisabled(true);
    }
  };

  const validateGST = async (gstNumber) => {
    setIsSubmitting(true);
    try {
      const response = await CRMBaseURL.post("gst", { gstNumber });
      if (response.data.message === "Data fetched Successfully") {
        setSnackbarType("success");
        setSnackbarMessage("GST validated successfully");
        setErrorOpen(true);
        setIsFormDisabled(false);
        formik.setValues({
          ...formik.values,
          gstNumber: gstNumber || "",
          companyName: response.data.Data.Name || "",
          city: response.data.Data.Address || "",
          panNumber: response.data.Data.PAN || "",
          // Add other fields from response.data.Data as needed
        });
      } else if (
        response.data.message === "No data found for this GST number"
      ) {
        setSnackbarType("error");
        setSnackbarMessage("No data found for this GST number");
        setErrorOpen(true);
        setIsFormDisabled(true);
      }
    } catch (error) {
      setSnackbarType("error");
      setSnackbarMessage("Error validating GST number");
      setErrorOpen(true);
      setIsFormDisabled(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      gstNumber: "",
      domainName: "",
      companyName: "",
      companyOwner: "",
      industry: "",
      city: "",
      state: "",
      postalCode: "",
      numberOfEmployees: "",
      annualRevenue: "",
      description: "",
      socialUrl: "",
      panNumber: "",
      msmeNumber: "",
      numberOfBranches: "",
      mobile: "",
      email: "",
      country: "",
      cin: "",
      contacts: [
        {
          name: "",
          email: "",
          phoneNumber: "",
          designation: "",
          leadStatus: "",
          lifecycleStage: "",
        },
      ],
    },
    validationSchema: validationSchema,
    validateOnChange: false,

    onSubmit: async (values) => {
      setIsSubmitting(true);

      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      const OwnerID = storedUserData && `${storedUserData.id}`;

      values = {
        ...values,
        createdBy: `${storedUserData.userName} (${storedUserData.email})`,
        ownerId: parseInt(OwnerID),
        contacts: values.contacts.map((contact) => ({
          name: contact.name,
          email: contact.email,
          phoneNumber: contact.phoneNumber,
          designation: contact.designation,
          leadStatus: contact.leadStatus,
          lifecycleStage: contact.lifecycleStage,
        })),
      };

      const res = await CRMBaseURL.post("addcompany", values);
      if (res.data.Message === "Data Inserted Successfully") {
        setSnackbarType("success");
        setSnackbarMessage(res && res.data.Message);
        setErrorOpen(true);
        setOpenCompanyForm(false);
        fetchCompanyData();
      } else {
        setSnackbarType("error");
        setSnackbarMessage(res && res.data.Message);
        setErrorOpen(true);
      }
      setIsSubmitting(false);

      if (hasGst === "no") {
        formik.setValues({
          ...formik.values,
          gstNumber: "N/A",
          panNumber: "N/A",
        });
      }

      values.mobile = values.mobile?.replace(/\s+/g, "");

      // const OwnerID = storedUserData?.id ? `${storedUserData.id}` : "";
      values = {
        ...values,
        ...contacts,

        createdBy:
          storedUserData &&
          `${storedUserData.userName} (${storedUserData.email})`,
        ownerId: parseInt(OwnerID, 10), // Ensure OwnerID is parsed as a number
      };

      try {
        console.log("Form values:", values);
        const res = await CRMBaseURL.post("addcompany", values);
        if (res.data.Message === "Data Inserted Successfully") {
          setSnackbarType("success");
          setSnackbarMessage(res.data.Message);
          setErrorOpen(true);
          setOpenCompanyForm(false);
          fetchCompanyData();
        } else {
          setSnackbarType("error");
          setSnackbarMessage(res.data.Message);
          setErrorOpen(true);
        }
      } catch (error) {
        // Handle any network or server errors
        setSnackbarType("error");
        setSnackbarMessage("Something went wrong. Please try again.");
        setErrorOpen(true);
      } finally {
        // Ensure that submission state is always reset
        setIsSubmitting(false);
      }
    },
  });

  const handleGSTValue = (value) => {
    formik.setFieldValue("gstNumber", value);
    setApiCallInProgress(true);
  };

  const addContact = () => {
    formik.setFieldValue("contacts", [
      ...formik.values.contacts,
      {
        name: "",
        email: "",
        phoneNumber: "",
        designation: "",
        leadStatus: "",
        lifecycleStage: "",
      },
    ]);
  };
  const handleContactChange = (index, event) => {
    const { name, value } = event.target;
    const updatedContacts = [...formik.values.contacts];
    updatedContacts[index][name] = value;
    formik.setFieldValue("contacts", updatedContacts);
  };

  const removeContact = (index) => {
    const updatedContacts = formik.values.contacts.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("contacts", updatedContacts);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleKeyDown = (event, currentField) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const fields = Object.keys(fieldRefs.current);
      const currentIndex = fields.indexOf(currentField);
      const nextField = fields[currentIndex + 1];

      if (nextField) {
        fieldRefs.current[nextField].focus();
      }
    }
  };

  const handleKeyDownGst = (event, currentField) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const fields = Object.keys(fieldRefs.current);
      const currentIndex = fields.indexOf(currentField);
      const nextField = fields[currentIndex + 1];

      if (nextField) {
        fieldRefs.current[nextField].focus();
      }
    }
  };

  const renderContactTextField = (label, name, value, index) => (
    <Grid item xs={6} key={name}>
      <TextField
        fullWidth
        label={label}
        name={name}
        value={value}
        onChange={(e) => handleContactChange(index, e)}
        margin="normal"
      />
    </Grid>
  );

  const renderTextField = (id, label, disabled = false) => (
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        id={id}
        name={id}
        required={
          ![
            "description",
            "cin",
            "msmeNumber",
            "companyOwner",
          ].includes(id)
        }
        label={label}
        value={formik.values[id]}
        inputRef={(el) => (fieldRefs.current[id] = el)} // Attach ref to the input field
        {...formik.getFieldProps(id)}
        onKeyDown={(event) => handleKeyDown(event, id)}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched[id] && Boolean(formik.errors[id])}
        helperText={formik.touched[id] && formik.errors[id]}
        margin="normal"
        disabled={disabled}
      />
    </Grid>
  );

  const renderAutocomplete = (id, label, options, disabled = false) => (
    <Tooltip>
      <Grid item xs={12} sm={6}>
        <Autocomplete
          fullWidth
          id={id}
          options={isFormDisabled ? [] : options || []}
          value={formik.values[id]}
          onChange={(event, newValue) => formik.setFieldValue(id, newValue)}
          onBlur={formik.handleBlur}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              label={label}
              error={formik.touched[id] && Boolean(formik.errors[id])}
              helperText={formik.touched[id] && formik.errors[id]}
              margin="normal"
              disabled={disabled}
            />
          )}
        />
      </Grid>
    </Tooltip>
  );

  const handleCancel = () => {
    setOpenCompanyForm(false);
  };

  return (
    <>
      <Dialog
        open={openCompanyForm}
        maxWidth="lg"
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Add Company Details"}
        </DialogTitle>
        <DialogContent>
          <Box>
            <form onSubmit={formik.handleSubmit}>
              <Grid container columnSpacing={2}>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography>The company has a GST number?</Typography>
                    <RadioGroup value={hasGst} onChange={handleGstChange} row>
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                {hasGst === "yes" && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      id="gstNumber"
                      name="gstNumber"
                      label="GST Number"
                      {...formik.getFieldProps("gstNumber")}
                      onKeyDown={(event) => handleKeyDown(event, "gstNumber")}
                      // onChange={formik.handleChange}
                      value={formik.values.gstNumber}
                      onChange={(e) => {
                        handleGSTValue(e.target.value);
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.gstNumber &&
                        Boolean(formik.errors.gstNumber)
                      }
                      helperText={
                        formik.touched.gstNumber && formik.errors.gstNumber
                      }
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {isGSTLoading && <CircularProgress size={20} />}{" "}
                            {/* Show loader when loading */}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                )}

                {renderTextField(
                  "domainName",
                  "Company Domain Name",
                  isFormDisabled
                )}
                {renderTextField("companyName", "Company Name", isFormDisabled)}
                {renderTextField(
                  "companyOwner",
                  "Company Owner",
                  isFormDisabled
                )}
                <Grid item xs={6} mt={2}>
                  <Autocomplete
                    freeSolo
                    options={isFormDisabled ? [] : options || []}
                    value={formik.values.industry}
                    onChange={(event, newValue) =>
                      formik.setFieldValue("industry", newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Select Industry"
                        variant="outlined"
                        error={Boolean(
                          formik.touched.industry && formik.errors.industry
                        )}
                        helperText={
                          formik.touched.industry && formik.errors.industry
                            ? formik.errors.industry
                            : ""
                        }
                        onBlur={() => formik.setFieldTouched("industry")}
                        disabled={isFormDisabled}
                      />
                    )}
                  />
                </Grid>
                {/* {renderTextField("industry", "Industry", isFormDisabled)} */}
                <Grid item xs={6} mt={2}>
                  <Autocomplete
                      freeSolo
                      options={isFormDisabled ? [] : countries || []}
                      getOptionLabel={(option) => option.country_name}
                      value={
                        countries.find((c) => c.country === formik.values.country) || null
                      }
                      onChange={(event, newValue) => handleCountryChange(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          label="Select Country"
                          variant="outlined"
                          error={Boolean(formik.touched.country && formik.errors.country)}
                          helperText={
                            formik.touched.country && formik.errors.country
                              ? formik.errors.country
                              : ""
                          }
                          onBlur={formik.handleBlur}
                          disabled={isFormDisabled}
                        />
                      )}
                      noOptionsText={
                        formik.values.country ? "Search the Country" : "No countries found"
                      }
                    />

                </Grid>
                <Grid item xs={6} mt={2}>
                <Autocomplete
                  freeSolo
                  options={filteredStates}
                  getOptionLabel={(option) => option.state_name}
                  value={
                    filteredStates.find((s) => s.state_name === formik.values.state) || null
                  }
                  onChange={(event, newValue) =>
                    formik.setFieldValue("state", newValue ? newValue.state_name : null)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Select State"
                      variant="outlined"
                      error={Boolean(formik.touched.state && formik.errors.state)}
                      helperText={
                        formik.touched.state && formik.errors.state
                          ? formik.errors.state
                          : ""
                      }
                      onBlur={() => formik.setFieldTouched("state")}
                    />
                  )}
                  disabled={!formik.values.country} // Disable until a country is selected
                  />

                </Grid>
                {renderTextField("city", "City", isFormDisabled)}
                {renderTextField("postalCode", "Postal Code", isFormDisabled)}
                {renderTextField("email", "Email", isFormDisabled)}

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="mobile"
                    margin="normal"
                    name="mobile"
                    required
                    inputRef={(el) => (fieldRefs.current.mobile = el)} // Attach ref to the input field
                    {...formik.getFieldProps("mobile")}
                    onKeyDown={(event) => handleKeyDown(event, "mobile")}
                    label="Phone Number"
                    value={formik.values.mobile}
                    onChange={handlePhoneNumberChange}
                    error={
                      formik.touched.mobile && Boolean(formik.errors.mobile)
                    }
                    helperText={formik.touched.mobile && formik.errors.mobile}
                    onBlur={formik.handleBlur}
                    disabled={!formik.values.country}
                  />
                </Grid>

                {/* {renderTextField("mobile", "Mobile", isFormDisabled)} */}
                {hasGst === "yes" &&
                  renderTextField("panNumber", "PAN Number", isFormDisabled)}
                {renderAutocomplete(
                  "numberOfEmployees",
                  "Number of Employees",
                  NumberofEmployeeOptions,
                  isFormDisabled
                )}
                {renderTextField(
                  "numberOfBranches",
                  "Number of Branches",
                  isFormDisabled
                )}
                {renderTextField("msmeNumber", "MSME Number", isFormDisabled)}
                {renderTextField(
                  "annualRevenue",
                  "Annual Revenue",
                  isFormDisabled
                )}
                {renderTextField("cin", "CIN", isFormDisabled)}
                {renderTextField("socialUrl", "Social URL", isFormDisabled)}
                {renderTextField("description", "Description", isFormDisabled)}
              </Grid>
              <Box>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 600,
                    paddingTop: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Add Contact Details
                  <Tooltip title="Add contact">
                    <IconButton
                      onClick={addContact}
                      color="primary"
                      sx={{ marginLeft: 1 }}
                    >
                      <PersonAddAlt1RoundedIcon />
                    </IconButton>
                  </Tooltip>
                </Typography>
                {formik.values.contacts.map((contact, index) => (
                  <Grid
                    key={index}
                    container
                    spacing={2}
                    sx={{
                      marginBottom: 2,
                      alignItems: "center",
                    }}
                  >
                    {["name", "email", "phoneNumber", "designation"].map(
                      (field) => (
                        <React.Fragment key={field}>
                          {renderContactTextField(
                            capitalizeFirstLetter(field),
                            field,
                            contact[field],
                            index
                          )}
                        </React.Fragment>
                      )
                    )}

                    <Grid item>
                      <Tooltip title="Remove contact">
                        <IconButton
                          onClick={() => removeContact(index)}
                          color="error"
                        >
                          <PersonRemoveAlt1RoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                ))}
              </Box>
              <DialogActions>
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting || !(formik.isValid && formik.dirty)} // Disable button during submission
                  sx={{
                    paddingX: isSubmitting ? "30px" : "20px",
                    backgroundImage:
                      !isSubmitting && formik.isValid && formik.dirty
                        ? "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)"
                        : "none", // Set to 'none' if submitting or form is invalid/untouched
                  }}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
                </Button>
              </DialogActions>
            </form>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={errorOpen}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackbarType}
          iconMapping={{
            success: <CheckCircleIcon />,
            error: <ErrorIcon />,
          }}
          sx={{ backgroundColor: snackbarType === "error" ? "red" : "green" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default CompanyForm;
