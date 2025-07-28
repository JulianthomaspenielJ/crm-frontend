import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AuthService from "../../services/AuthService";
import {
  Snackbar,
  Typography,
  TextField,
  Box,
  TableSortLabel,
  TablePagination,
  InputAdornment,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import SearchIcon from "@mui/icons-material/Search";
import userNotFound from "../../Image/useeNotfound.webp";
import RestoreUser from "./RestoreUser";
import Loading from "../../Loading/Loading";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#fff",
    color: "#884DFF",
    fontSize: 14,
  },
  [`&.${tableCellClasses.body}`]: {
    fontWeight: 500,
    fontSize: 13,
  },
}));

const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  "&:hover": {
    color: "#e02b6a",
  },
  "&.Mui-active": {
    color: "#e02b6a",
  },
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function DeletedUser() {
  const CRMBaseURL = AuthService();

  const [userData, setUserData] = useState([]);
  // const [userFormOpen, setUserFormOpen] = useState(false);
  // const [userDatatoForm, setUserDatatoForm] = useState();
  const [dataUpadateMsg, setDataUpadateMsg] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [restoreID, setRestoreID] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setDataUpadateMsg(false);
  };

  const fetch = async () => {
    setLoading(true);
    try {
      const UserData = await CRMBaseURL.get("userdeleteddata");
      setUserData(UserData.data.data);
    } catch (err) {
      console.log("Error occurred", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleRestore = (id) => {
    setRestoreID(id);
    setRestoreDialogOpen(true);
  };

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
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.mobile.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.approvedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.createdAt.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const sortedData =
    filteredData &&
    filteredData.sort((a, b) => {
      const valueA = a[orderBy]?.toLowerCase() || "";
      const valueB = b[orderBy]?.toLowerCase() || "";

      return (valueA < valueB ? -1 : 1) * (order === "asc" ? 1 : -1);
    });

  

  if (!loading) {
    return (
      <>
        {userData && userData.length > 0 ? (
          <>
            <Box display="flex" justifyContent="space-between" mb={2}>
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
            <Box className="top_header">
              <h3 style={{ marginRight: "50%", color: "#fff" }}>
                Deleted Users {`(${userData ? userData.length : 0})`}
              </h3>
            </Box>

            <TableContainer
              component={Paper}
              sx={{ padding: "10px 20px 0px 20px" }}
            >
              <div>
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
              </div>
              <Table sx={{ minWidth: 500 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
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
                    <StyledTableCell>
                      <StyledTableSortLabel
                        active={orderBy === "mobile"}
                        direction={orderBy === "mobile" ? order : "asc"}
                        onClick={(event) => handleRequestSort(event, "mobile")}
                      >
                        Mobile
                      </StyledTableSortLabel>
                    </StyledTableCell>
                    <StyledTableCell>
                      <StyledTableSortLabel
                        active={orderBy === "role"}
                        direction={orderBy === "role" ? order : "asc"}
                        onClick={(event) => handleRequestSort(event, "role")}
                      >
                        Role
                      </StyledTableSortLabel>
                    </StyledTableCell>
                    <StyledTableCell>
                      <StyledTableSortLabel
                        active={orderBy === "designation"}
                        direction={orderBy === "designation" ? order : "asc"}
                        onClick={(event) =>
                          handleRequestSort(event, "designation")
                        }
                      >
                        Designation
                      </StyledTableSortLabel>
                    </StyledTableCell>
                    <StyledTableCell>
                      <StyledTableSortLabel
                        active={orderBy === "team"}
                        direction={orderBy === "team" ? order : "asc"}
                        onClick={(event) => handleRequestSort(event, "team")}
                      >
                        Team
                      </StyledTableSortLabel>
                    </StyledTableCell>
                    <StyledTableCell>
                      <StyledTableSortLabel
                        active={orderBy === "approvedBy"}
                        direction={orderBy === "approvedBy" ? order : "asc"}
                        onClick={(event) =>
                          handleRequestSort(event, "approvedBy")
                        }
                      >
                        Deleted By
                      </StyledTableSortLabel>
                    </StyledTableCell>
                    <StyledTableCell>
                      <StyledTableSortLabel
                        active={orderBy === "createdAt"}
                        direction={orderBy === "createdAt" ? order : "asc"}
                        onClick={(event) =>
                          handleRequestSort(event, "createdAt")
                        }
                      >
                        Deleted At
                      </StyledTableSortLabel>
                    </StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
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
                        <TableRow key={index}>
                          <StyledTableCell>
                            {index + 1 + page * rowsPerPage}
                          </StyledTableCell>
                          <StyledTableCell>{row.name}</StyledTableCell>
                          <StyledTableCell>{row.email}</StyledTableCell>
                          <StyledTableCell>{row.mobile}</StyledTableCell>
                          <StyledTableCell>{row.role}</StyledTableCell>
                          <StyledTableCell>{row.designation}</StyledTableCell>
                          <StyledTableCell>{row.team}</StyledTableCell>
                          <StyledTableCell>{row.updatedBy.split(" ",[1])}</StyledTableCell>
                          <StyledTableCell>{row.createdAt}</StyledTableCell>
                          <StyledTableCell>
                            <Typography
                              onClick={() => handleRestore(row.id)}
                              sx={{
                                border: "1px solid #FFCF01",
                                color: "#FFCF01",
                                "&:hover": {
                                  backgroundColor: "#FFCF01",
                                  color: "#fff",
                                },
                                padding: "2px 5px 2px 5px",
                                borderRadius: 2,
                                cursor: "pointer",
                                width: 80,
                                textAlign: "center",
                              }}
                            >
                              Restore
                            </Typography>
                          </StyledTableCell>
                        </TableRow>
                      ))
                  ) : (
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
              <Typography>No data found !</Typography>
            </div>
          </div>
        )}

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

        <RestoreUser
          restoreID={restoreID}
          restoreDialogOpen={restoreDialogOpen}
          setRestoreDialogOpen={setRestoreDialogOpen}
          setDataUpadateMsg={setDataUpadateMsg}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarType={setSnackbarType}
          fetch={fetch}
        />
      </>
    );
  } else {
    return <Loading />;
  }
}
