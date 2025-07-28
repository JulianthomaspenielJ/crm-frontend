import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AuthService from "../services/AuthService";
import {
  Snackbar,
  Tooltip,
  Typography,
  TextField,
  Box,
  TableSortLabel,
  TablePagination,
  InputAdornment,
  Avatar,
} from "@mui/material";
import UserForm from "./UserForm";
import userNotFound from "../Image/useeNotfound.webp";
import MuiAlert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import SearchIcon from "@mui/icons-material/Search";
import Loading from "../Loading/Loading";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: "#884DFF",
    fontSize: 14,
  },
  [`&.${tableCellClasses.body}`]: {
    fontWeight: 500,
    fontSize: 13,
  },
}));

// Styled TableSortLabel component
const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  "&:hover": {
    color: "#e02b6a",
  },
  "&.Mui-active": {
    color: "#e02b6a",
  },
}));

const stringToColor = (string) => {
  let hash = 60;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    color += ("00" + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2);
  }
  return color;
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedTables() {
  const CRMBaseURL = AuthService();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));

  const [userData, setUserData] = useState([]);
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [userDatatoForm, setUserDatatoForm] = useState();
  const [dataUpadateMsg, setDataUpadateMsg] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState(" ");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setDataUpadateMsg(false);
  };

  const fetch = async () => {
    setLoading(true);
    try {
      const UserData = await CRMBaseURL.get("approveuser");
      setUserData(UserData.data.users);
    } catch (err) {
      console.log("Error occurred", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData =
    userData &&
    userData.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const sortedData =
    filteredData &&
    filteredData.sort((a, b) => {
      if (orderBy === "name") {
        return (a.name < b.name ? -1 : 1) * (order === "asc" ? 1 : -1);
      } else if (orderBy === "email") {
        return (a.email < b.email ? -1 : 1) * (order === "asc" ? 1 : -1);
      }
      return 0;
    });
  if (!loading) {
    return (
      <>
        {userData && userData.length > 0 ? (
          <>
            <Box display="flex" justifyContent="space-between">
              <div>
                <TextField
                  sx={{
                    color: "red",
                    width: 400,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "none",
                      },
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#5D5FEF",
                      fontSize: "14px",
                    },
                  }}
                  placeholder="Search here..."
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchQueryChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon style={{ color: "#5D5FEF" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </Box>
            <Box>
              <h4 style={{ marginRight: "50%", color: "#000" }}>
                Deactivate Users {`(${userData ? userData.length : 0})`}
              </h4>
            </Box>
            <TableContainer component={Paper}>
              {/* <div>
                <Typography
                  sx={{
                    pl: 1,
                    color: "#05004E",
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  Users
                </Typography>
              </div> */}
              <Table sx={{ minWidth: 500 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                    <StyledTableCell>#</StyledTableCell>
                    <StyledTableCell>
                      <StyledTableSortLabel
                        active={orderBy === "name"}
                        direction={orderBy === "name" ? order : "asc"}
                        onClick={(event) => handleRequestSort(event, "name")}
                      >
                        UserName
                      </StyledTableSortLabel>
                    </StyledTableCell>
                    <StyledTableCell>
                      <StyledTableSortLabel
                        active={orderBy === "email"}
                        direction={orderBy === "email" ? order : "asc"}
                        onClick={(event) => handleRequestSort(event, "email")}
                      >
                        Email
                      </StyledTableSortLabel>
                    </StyledTableCell>
                    {storedUserData &&
                      storedUserData.team === "Admin" &&
                      (storedUserData.userRole === "Manager" ||
                        storedUserData.userRole === "Admin" ||
                        storedUserData.userRole === "Super Admin") && (
                        <StyledTableCell>Action</StyledTableCell>
                      )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData && sortedData.length > 0 ? (
                    sortedData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#ffffff1a",
                            },
                          }}
                        >
                          <StyledTableCell>
                            {index + 1 + page * rowsPerPage}
                          </StyledTableCell>
                          <StyledTableCell>
                            {" "}
                            <Box display="flex" alignItems="center">
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  marginRight: 1,
                                  bgcolor: stringToColor(row.name), // Dynamically generate color
                                }}
                              >
                                <span style={{ fontSize: "12px" }}>
                                  {row.name.charAt(0)}{" "}
                                </span>
                                {/* Initial of the company name */}
                              </Avatar>
                              {row.name?.length > 25
                                ? `${row.name.substring(0, 25)}...`
                                : row.name}
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell>{row.email}</StyledTableCell>
                          <StyledTableCell>
                            {storedUserData &&
                              storedUserData.team === "Admin" &&
                              (storedUserData.userRole === "Manager" ||
                                storedUserData.userRole === "Admin" ||
                                storedUserData.userRole === "Super Admin") && (
                                <Tooltip title="View">
                                  <Typography
                                    onClick={() => {
                                      setUserFormOpen(true);
                                      setUserDatatoForm(row);
                                    }}
                                    sx={{
                                      border: "1px solid #FFCF01",
                                      color: "#FFCF01",
                                      "&:hover": {
                                        backgroundColor: "#FFCF01",

                                        color: "#fff",
                                      },
                                      py: "1px",
                                      borderRadius: 2,
                                      cursor: "pointer",
                                      width: 55,
                                      textAlign: "center",
                                      fontSize: 14,
                                    }}
                                  >
                                    View
                                  </Typography>
                                </Tooltip>
                              )}
                            {/* //<RemoveRedEyeIcon color="warning" /> */}
                          </StyledTableCell>
                        </TableRow>
                      ))
                  ) : (
                    <>
                      {" "}
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <div style={{ padding: "50px 0px 50px 0px" }}>
                            <img
                              src={userNotFound}
                              style={{ width: 200, height: 200 }}
                              alt="No data available"
                            />
                            <Typography>No data available</Typography>
                          </div>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={sortedData && sortedData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "75vh",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <img
                src={userNotFound}
                style={{ width: 200, height: 200 }}
                alt="User not found"
              />
              <Typography>
                Currently, there are no users awaiting approval.
              </Typography>
            </div>
          </div>
        )}

        <UserForm
          setUserFormOpen={setUserFormOpen}
          userFormOpen={userFormOpen}
          userDatatoForm={userDatatoForm}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarType={setSnackbarType}
          setDataUpadateMsg={setDataUpadateMsg}
          fetch={fetch}
        />
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={dataUpadateMsg}
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
  } else {
    return <Loading />;
  }
}
