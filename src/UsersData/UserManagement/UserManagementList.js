import React, { useState, useEffect, useCallback } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AuthService from "../../services/AuthService";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Snackbar,
  Tooltip,
  Typography,
  TextField,
  Box,
  TableSortLabel,
  TablePagination,
  IconButton,
  Autocomplete,
  Avatar,
  Popover,
  List,
  ListItem,
  ListItemText,
  Switch,
  Button,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import ErrorIcon from "@mui/icons-material/Error";
import UserManagementForm from "./UserManagementForm";
import userNotFound from "../../Image/useeNotfound.webp";
import DeleteUserData from "./DeleteUserData";
import Loading from "../../Loading/Loading";
import { lighten, darken } from "@mui/system";
import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: "#f0f0f0",
    // color: "#884DFF",
    color: "#000",
    fontSize: 14,
    border: "1px solid #fff",
  },
  [`&.${tableCellClasses.body}`]: {
    fontWeight: 500,
    fontSize: 13,
    padding: "13px",
    border: "1px solid #f0f0f0",
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

const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  "&:hover": {
    color: "#884DFF",
    // color: "#e02b6a",
  },
  "&.Mui-active": {
    // color: "#e02b6a",
    color: "#884DFF",
  },
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const roleOptions = [
  "Super Admin",
  "Admin",
  "Manager",
  "Executive",
  "Senior Executive",
  "Executive",
];

const teamOptions = [
  "Pricing",
  "Marketing",
  "Sales",
  "Admin",
  // 'Development',
];

const initialVisibleColumns = {
  "User name": true,
  "Email ID": true,
  "Mobile Number": true,
  Team: true,
  Role: true,
  Designation: true,
  "Created by": true,
  "Created at": true,
};

export default function UserManagement() {
  const CRMBaseURL = AuthService();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));

  const [userData, setUserData] = useState([]);
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [userDatatoForm, setUserDatatoForm] = useState();
  const [dataUpadateMsg, setDataUpadateMsg] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteID, setDeleteID] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
    designation: "",
    team: "",
    approvedBy: "",
    createdAt: "",
  });

  const [showColumnsData, setShowColumnsData] = useState(initialVisibleColumns);
  const [applyColumnsData, setApplyColumnsData] = useState(
    initialVisibleColumns
  );
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleToggle = (column) => {
    setApplyColumnsData((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleApply = () => {
    setShowColumnsData(applyColumnsData);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setDataUpadateMsg(false);
  };
  const roleColors = {
    Manager: "#ff9800", // Orange
    "Senior Executive": "#2196f3", // Blue
    Executive: "#4caf50", // Green
    Admin: "#f44336", // Red
    "Super Admin": "#9c27b0", // Purple
    // Add more roles and colors as needed
  };

  const teamColors = {
    Admin: "#f44336", // Red
    Pricing: "#ff9800", // Orange
    Sales: "#4caf50", // Green
    Marketing: "#2196f3", // Blue
    // Add more teams and colors as needed
  };
  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const UserData = await CRMBaseURL.get("getuserdata");
      setUserData(UserData.data.data);
    } catch (err) {
      console.log("Error occurred", err);
    }
    setLoading(false);
  }, [CRMBaseURL, setUserData]);

  useEffect(() => {
    fetch();
  }, []);

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

  const handleSearchChange = (event, field) => {
    setSearchParams({ ...searchParams, [field]: event.target.value });
  };

  const filteredDatas = sortedData.filter((row) => {
    return (
      (!searchParams.name ||
        row.name.toLowerCase().includes(searchParams.name.toLowerCase())) &&
      (!searchParams.email ||
        row.email.toLowerCase().includes(searchParams.email.toLowerCase())) &&
      (!searchParams.mobile || row.mobile.includes(searchParams.mobile)) &&
      (!searchParams.role ||
        row.role.toLowerCase().includes(searchParams.role.toLowerCase())) &&
      (!searchParams.designation ||
        row.designation
          .toLowerCase()
          .includes(searchParams.designation.toLowerCase())) &&
      (!searchParams.team ||
        row.team.toLowerCase().includes(searchParams.team.toLowerCase())) &&
      (!searchParams.approvedBy ||
        row.approvedBy
          .toLowerCase()
          .includes(searchParams.approvedBy.toLowerCase())) &&
      (!searchParams.createdAt ||
        row.createdAt.includes(searchParams.createdAt))
    );
  });
  const handleDelete = (id) => {
    setDeleteDialog(true);
    setDeleteID(id);
  };

  if (!loading) {
    return (
      <>
        {userData && userData.length > 0 ? (
          <>
            <Box display="flex" justifyContent="space-between" mb={2}>
              {/* <div>
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
              </div> */}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h4 style={{ marginRight: "50%", color: "#000" }}>
                Approved Users {`(${userData ? userData.length : 0})`}
              </h4>

              <Typography
                sx={{
                  background: "#f3edff",
                  padding: "8px 10px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6504e5",
                  cursor: "pointer",
                }}
                aria-describedby={id}
                onClick={handleClick}
              >
                <ViewColumnRoundedIcon
                  sx={{ fontSize: "14px", marginRight: "5px" }}
                />
                Manage Columns
              </Typography>
            </Box>

            <TableContainer
              component={Paper}
              // sx={{ padding: "10px 20px 0px 20px" }}
            >
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
                    {showColumnsData["User name"] && (
                      <StyledTableCell>
                        <StyledTableSortLabel
                          active={orderBy === "name"}
                          direction={orderBy === "name" ? order : "asc"}
                          onClick={(event) => handleRequestSort(event, "name")}
                        >
                          UserName
                        </StyledTableSortLabel>
                      </StyledTableCell>
                    )}
                    {showColumnsData["Email ID"] && (
                      <StyledTableCell>
                        <StyledTableSortLabel
                          active={orderBy === "email"}
                          direction={orderBy === "email" ? order : "asc"}
                          onClick={(event) => handleRequestSort(event, "email")}
                        >
                          Email
                        </StyledTableSortLabel>
                      </StyledTableCell>
                    )}
                    {showColumnsData["Mobile Number"] && (
                      <StyledTableCell>
                        <StyledTableSortLabel
                          active={orderBy === "mobile"}
                          direction={orderBy === "mobile" ? order : "asc"}
                          onClick={(event) =>
                            handleRequestSort(event, "mobile")
                          }
                        >
                          Mobile
                        </StyledTableSortLabel>
                      </StyledTableCell>
                    )}
                    {showColumnsData["Role"] && (
                      <StyledTableCell>
                        <StyledTableSortLabel
                          active={orderBy === "role"}
                          direction={orderBy === "role" ? order : "asc"}
                          onClick={(event) => handleRequestSort(event, "role")}
                        >
                          Role
                        </StyledTableSortLabel>
                      </StyledTableCell>
                    )}
                    {showColumnsData["Designation"] && (
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
                    )}
                    {showColumnsData["Team"] && (
                      <StyledTableCell>
                        <StyledTableSortLabel
                          active={orderBy === "team"}
                          direction={orderBy === "team" ? order : "asc"}
                          onClick={(event) => handleRequestSort(event, "team")}
                        >
                          Team
                        </StyledTableSortLabel>
                      </StyledTableCell>
                    )}
                    {showColumnsData["Created by"] && (
                      <StyledTableCell>
                        <StyledTableSortLabel
                          active={orderBy === "approvedBy"}
                          direction={orderBy === "approvedBy" ? order : "asc"}
                          onClick={(event) =>
                            handleRequestSort(event, "approvedBy")
                          }
                        >
                          Created By
                        </StyledTableSortLabel>
                      </StyledTableCell>
                    )}
                    {showColumnsData["Created at"] && (
                      <StyledTableCell>
                        <StyledTableSortLabel
                          active={orderBy === "createdAt"}
                          direction={orderBy === "createdAt" ? order : "asc"}
                          onClick={(event) =>
                            handleRequestSort(event, "createdAt")
                          }
                        >
                          Created At
                        </StyledTableSortLabel>
                      </StyledTableCell>
                    )}

                    {storedUserData &&
                      storedUserData.team === "Admin" &&
                      (storedUserData.userRole === "Manager" ||
                        storedUserData.userRole === "Admin" ||
                        storedUserData.userRole === "Super Admin") && (
                        <StyledTableCell>Action</StyledTableCell>
                      )}
                      <StyledTableCell>Action</StyledTableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: "#fff" }}>
                    <TableCell
                      sx={{ border: "1px solid #f0f0f0", fontSize: 14 }}
                    >
                      <FilterAltIcon
                        style={{ color: "#0767e6", marginLeft: "-4px" }}
                      />
                    </TableCell>
                    {showColumnsData["User name"] && (
                      <TableCell
                        sx={{ border: "1px solid #f0f0f0", fontSize: 14 }}
                      >
                        <TextField
                          variant="standard"
                          size="small"
                          placeholder="Search..."
                          value={searchParams.name}
                          onChange={(event) => {
                            handleSearchChange(event, "name");
                            setPage(0);
                          }}
                        />
                      </TableCell>
                    )}
                    {showColumnsData["Email ID"] && (
                      <TableCell
                        sx={{ border: "1px solid #f0f0f0", fontSize: 14 }}
                      >
                        <TextField
                          variant="standard"
                          size="small"
                          placeholder="Search..."
                          value={searchParams.email}
                          onChange={(event) => {
                            handleSearchChange(event, "email");
                            setPage(0);
                          }}
                        />
                      </TableCell>
                    )}
                    {showColumnsData["Mobile Number"] && (
                      <TableCell
                        sx={{ border: "1px solid #f0f0f0", fontSize: 14 }}
                      >
                        <TextField
                          variant="standard"
                          size="small"
                          placeholder="Search..."
                          value={searchParams.mobile}
                          onChange={(event) => {
                            handleSearchChange(event, "mobile");
                            setPage(0);
                          }}
                        />
                      </TableCell>
                    )}
                    {showColumnsData["Role"] && (
                      <TableCell
                        sx={{ border: "1px solid #f0f0f0", fontSize: 14 }}
                      >
                        <Autocomplete
                          options={roleOptions}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              size="small"
                              placeholder="Search..."
                            />
                          )}
                          value={searchParams.role}
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              { target: { value: newValue } },
                              "role"
                            );
                            setPage(0);
                          }}
                          size="small"
                        />
                      </TableCell>
                    )}
                    {showColumnsData["Designation"] && (
                      <TableCell
                        sx={{ border: "1px solid #f0f0f0", fontSize: 14 }}
                      >
                        <TextField
                          variant="standard"
                          size="small"
                          placeholder="Search..."
                          value={searchParams.designation}
                          onChange={(event) => {
                            handleSearchChange(event, "designation");
                            setPage(0);
                          }}
                        />
                      </TableCell>
                    )}
                    {showColumnsData["Team"] && (
                      <TableCell
                        sx={{ border: "1px solid #f0f0f0", fontSize: 14 }}
                      >
                        <Autocomplete
                          options={teamOptions}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              size="small"
                              placeholder="Search..."
                            />
                          )}
                          value={searchParams.team}
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              { target: { value: newValue } },
                              "team"
                            );
                            setPage(0);
                          }}
                          size="small"
                        />
                      </TableCell>
                    )}
                    {showColumnsData["Created by"] && (
                      <TableCell
                        sx={{ border: "1px solid #f0f0f0", fontSize: 14 }}
                      >
                        <TextField
                          variant="standard"
                          size="small"
                          placeholder="Search..."
                          value={searchParams.approvedBy}
                          onChange={(event) => {
                            handleSearchChange(event, "approvedBy");
                            setPage(0);
                          }}
                        />
                      </TableCell>
                    )}
                    {showColumnsData["Created at"] && (
                      <TableCell
                        sx={{ border: "1px solid #f0f0f0", fontSize: 14 }}
                      >
                        <TextField
                          variant="standard"
                          size="small"
                          placeholder="Search..."
                          value={searchParams.createdAt}
                          onChange={(event) => {
                            handleSearchChange(event, "createdAt");
                            setPage(0);
                          }}
                        />
                      </TableCell>
                    )}
                    <TableCell
                      sx={{ border: "1px solid #f0f0f0", fontSize: 14 }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDatas && filteredDatas.length > 0 ? (
                    filteredDatas
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const reverseIndex =
                          filteredDatas.length - (page * rowsPerPage + index);
                        return (
                          <TableRow
                            key={index}
                            sx={{
                              "&:hover": {
                                backgroundColor: "#f0f0f0a3",
                              },
                            }}
                          >
                            <StyledTableCell>{reverseIndex}</StyledTableCell>
                            {showColumnsData["User name"] && (
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
                            )}
                            {showColumnsData["Email ID"] && (
                              <StyledTableCell>{row.email}</StyledTableCell>
                            )}
                            {showColumnsData["Mobile Number"] && (
                              <StyledTableCell>{row.mobile}</StyledTableCell>
                            )}
                            {showColumnsData["Role"] && (
                              <StyledTableCell>
                                <Typography
                                  sx={{
                                    color: darken(
                                      roleColors[row.role] || "#813216bf",
                                      0.3
                                    ),
                                    backgroundColor: lighten(
                                      roleColors[row.role] || "#813216bf",
                                      0.5
                                    ),
                                    height: "25px",
                                    fontSize: 12,
                                    borderRadius: "4px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {row.role}
                                </Typography>
                              </StyledTableCell>
                            )}
                            {showColumnsData["Designation"] && (
                              <StyledTableCell>
                                {row.designation}
                              </StyledTableCell>
                            )}
                            {showColumnsData["Team"] && (
                              <StyledTableCell>
                                <Typography
                                  sx={{
                                    color: darken(
                                      teamColors[row.team] || "#813216bf",
                                      0.3
                                    ),
                                    backgroundColor: lighten(
                                      teamColors[row.team] || "#813216bf",
                                      0.5
                                    ),
                                    height: "25px",
                                    fontSize: 12,
                                    borderRadius: "4px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {row.team}
                                </Typography>
                              </StyledTableCell>
                            )}
                            {showColumnsData["Created by"] && (
                              <StyledTableCell>
                                {row.approvedBy.split(" ", 1)}
                              </StyledTableCell>
                            )}
                            {showColumnsData["Created at"] && (
                              <StyledTableCell>{row.createdAt}</StyledTableCell>
                            )}
                            <StyledTableCell sx={{ display: "flex" }}>
                              {storedUserData &&
                                storedUserData.team === "Admin" &&
                                (storedUserData.userRole === "Manager" ||
                                  storedUserData.userRole === "Admin" ||
                                  storedUserData.userRole ===
                                    "Super Admin") && (
                                  <>
                                    <Tooltip title="Edit">
                                      <IconButton
                                        onClick={() => {
                                          setUserFormOpen(true);
                                          setUserDatatoForm(row);
                                        }}
                                      >
                                        <CreateIcon color="success" />
                                      </IconButton>
                                    </Tooltip>
                                    {storedUserData &&
                                      storedUserData.team === "Admin" &&
                                      (storedUserData.userRole === "Admin" ||
                                        storedUserData.userRole ===
                                          "Super Admin") && (
                                        <Tooltip title="Delete">
                                          <IconButton
                                            onClick={() => handleDelete(row.id)}
                                          >
                                            <DeleteIcon color="error" />
                                          </IconButton>
                                        </Tooltip>
                                      )}
                                  </>
                                )}
                            </StyledTableCell>
                          </TableRow>
                        );
                      })
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

        <UserManagementForm
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

        <DeleteUserData
          deleteID={deleteID}
          deleteDialog={deleteDialog}
          setDeleteDialog={setDeleteDialog}
          setDataUpadateMsg={setDataUpadateMsg}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarType={setSnackbarType}
          fetch={fetch}
        />

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <List
            sx={{
              width: "280px",
              bgcolor: "background.paper",
              padding: "5px 15px 15px 15px",
            }}
          >
            {Object.keys(applyColumnsData).map((column) => (
              <ListItem key={column} sx={{ padding: "5px 15px" }}>
                <ListItemText
                  id={`switch-list-label-${column}`}
                  primary={column.charAt(0).toUpperCase() + column.slice(1)}
                  primaryTypographyProps={{
                    fontSize: "12px", // Smaller font size
                    fontWeight: 500,
                  }}
                  sx={{ fontSize: "10px" }} // Set the font size for ListItemText
                />
                <Switch
                  size="small"
                  edge="end"
                  onChange={() => handleToggle(column)}
                  checked={applyColumnsData[column]}
                  inputProps={{
                    "aria-labelledby": `switch-list-label-${column}`,
                  }}
                />
              </ListItem>
            ))}
            <Box sx={{ display: "flex", justifyContent: "end", paddingTop: 2 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  handleApply();
                }}
              >
                Apply
              </Button>
            </Box>
          </List>
        </Popover>
      </>
    );
  } else {
    return <Loading />;
  }
}
