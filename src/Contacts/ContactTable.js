import React, { useEffect, useState } from "react";
import {
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Box,
  TextField,
  Table,
  Button,
  TableBody,
  TablePagination,
  Avatar,
  Popover,
  List,
  ListItem,
  ListItemText,
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import userNotFound from "../Image/useeNotfound.webp";
import AuthService from "../services/AuthService";
import ContactForm from "./ContactForm";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import IosShareIcon from "@mui/icons-material/IosShare";
import * as XLSX from "xlsx";
import { lighten, darken } from "@mui/system";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";
import NearMeIcon from "@mui/icons-material/NearMe";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 14,
    border: "1px solid #fff",
  },
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: "#fff",
    fontWeight: 500,
    fontSize: 13,
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

const initialVisibleColumns = {
  "Contact name": true,
  "Sales owner": true,
  "Life cycle": true,
  "Job title": true,
  "Lead source": true,
  "Created at": true,
};

const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  "&:hover": {
    color: "#e02b6a",
  },
  "&.Mui-active": {
    color: "#e02b6a",
  },
}));

const priorityColors = {
  Gold: "#FF9800", // Dark Red
  Silver: "#bebebe", // Dark Orange
  bronze: "#854e28", // Dark Green
};

function ContactTable() {
  const CRMBaseURL = AuthService();
  const navigate = useNavigate();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));

  const [contactDataList, setContactDataList] = useState([]);
  const [openContactsForm, setOpenContactsForm] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const [searchByName, setSearchByName] = useState([]);
  const [searchByLevel, setSearchByLevel] = useState([]);
  const [searchByOwner, setSearchByOwner] = useState([]);

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

  const fetchContactData = async () => {
    setLoading(true);
    const ID = storedUserData && `${storedUserData.id}`;
    const values = {
      id: parseInt(ID),
      team: storedUserData && `${storedUserData.team}`,
      role: storedUserData && `${storedUserData.userRole}`,
    };
    try {
      const contactData = await CRMBaseURL.post("getContactTableData", values);
      setContactDataList(contactData.data?.data || []);
    } catch (err) {
      console.log("Error occurred", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  const filters = contactDataList.filter((row) => {
    return (
      (searchByName.length === 0 ||
        searchByName.some((name) =>
          row.name.toLowerCase().includes(name.toLowerCase())
        )) &&
      (searchByLevel.length === 0 ||
        searchByLevel.some((level) =>
          row.contactLevelType.toLowerCase().includes(level.toLowerCase())
        )) &&
      (searchByOwner.length === 0 ||
        searchByOwner.some((owner) =>
          row.createdBy.toLowerCase().includes(owner.toLowerCase())
        ))
    );
  });

  const exportToExcel = (filteredData) => {
    // Convert the filtered data into a worksheet
    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    // Create a new workbook and add the worksheet to it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FilteredData");

    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, "company_data.xlsx");
  };

  // const handleSearchQueryChange = (event) => {
  //   setSearchQuery(event.target.value);
  // };

  // Handle sort request
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getContactDetails = (id) => {
    navigate("/dashboard/contact_details", {
      state: { ID: id },
    });
  };

  const filteredData =
    contactDataList &&
    contactDataList.filter((contact) => {
      const lowerCaseQuery = searchQuery.toLowerCase();

      const formattedLastActivityDate = new Date(
        contact.lastActivityDate
      ).toLocaleDateString("en-GB");
      const formattedCreatedAt = new Date(contact.createdAt).toLocaleDateString(
        "en-GB"
      );

      return (
        contact.name.toLowerCase().includes(lowerCaseQuery) ||
        contact.email.toLowerCase().includes(lowerCaseQuery) ||
        contact.phoneNumber.toString().includes(searchQuery) ||
        contact.companyName.toLowerCase().includes(lowerCaseQuery) ||
        formattedLastActivityDate.includes(searchQuery) ||
        contact.leadStatus.toLowerCase().includes(lowerCaseQuery) ||
        formattedCreatedAt.includes(searchQuery)
      );
    });

  const sortedData =
    filters &&
    filters.sort((a, b) => {
      if (orderBy === "name") {
        return (a.name < b.name ? -1 : 1) * (order === "asc" ? 1 : -1);
      } else if (orderBy === "priority") {
        return (
          (a.contactLevelType < b.contactLevelType ? -1 : 1) *
          (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "phoneNumber") {
        return (
          (a.phoneNumber < b.phoneNumber ? -1 : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "companyName") {
        return (
          (a.companyName < b.companyName ? -1 : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "salesOwner") {
        return (
          (a.createdBy < b.createdBy ? -1 : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "lastActivityDate") {
        return (
          (new Date(a.lastActivityDate) < new Date(b.lastActivityDate)
            ? -1
            : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "leadStatus") {
        return (
          (a.leadStatus < b.leadStatus ? -1 : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "createdAt") {
        return (
          (new Date(a.createdAt) < new Date(b.createdAt) ? -1 : 1) *
          (order === "asc" ? 1 : -1)
        );
      }
      return 0;
    });

  if (!loading) {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            paddingBottom: "15px",
          }}
        >
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
              marginRight: 1.5,
            }}
            aria-describedby={id}
            onClick={handleClick}
          >
            <ViewColumnRoundedIcon
              sx={{ fontSize: "14px", marginRight: "5px" }}
            />
            Manage Columns
          </Typography>

          {storedUserData?.team === "Admin" &&
            (storedUserData?.userRole === "Super Admin" ||
              storedUserData?.userRole === "Admin") && (
              <Button
                onClick={() => exportToExcel(filters)}
                variant="outlined"
                startIcon={<IosShareIcon />}
                sx={{
                  border: "2px solid transparent",
                  borderRadius: "8px",
                  padding: "5px 12px",
                  marginRight: "10px",
                  backgroundImage:
                    "linear-gradient(#fff, #fff), linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                  textTransform: "none",
                  "& .MuiButton-startIcon": {
                    background:
                      "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  },
                  "& .MuiButton-label": {
                    background:
                      "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  },
                  "&:hover": {
                    backgroundColor: "transparent",
                    boxShadow: "0 0 10px rgba(0, 181, 255, 0.5)",
                  },
                }}
              >
                Export
              </Button>
            )}

          <Button
            startIcon={<AddIcon />}
            // className="icon_container"
            onClick={() => {
              setOpenContactsForm(true);
            }}
            sx={{
              borderRadius: "8px",
              padding: "5px 12px",
              color: "#fff",
              background:
                "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
            }}
          >
            ADD
          </Button>
        </Box>
        {/* <Box display="flex" justifyContent="space-between" mb={2}>
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
      </Box> */}
        {/* <Box className="top_header">
      <h3 style={{marginRight:"50%", color:"#fff"}}>Contacts {`(${contactDataList?contactDataList.length:0})`}</h3>
        <div className="icon_container"
            onClick={() => {
              setOpenContactsForm(true);
            }}
          ><AddIcon/>
          </div>
      </Box> */}
        <TableContainer>
          <Table sx={{ minWidth: 500 }} aria-label="customized table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <StyledTableCell>#</StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleRequestSort("name")}
                  >
                    Name
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "priority"}
                    direction={orderBy === "priority" ? order : "asc"}
                    onClick={() => handleRequestSort("priority")}
                  >
                    Priority Level
                  </StyledTableSortLabel>
                </StyledTableCell>
                {/* <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "phoneNumber"}
                  direction={orderBy === "phoneNumber" ? order : "asc"}
                  onClick={() => handleRequestSort("phoneNumber")}
                >
                  Phone Number
                </StyledTableSortLabel>
              </StyledTableCell> */}
                {/* <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "companyName"}
                    direction={orderBy === "companyName" ? order : "asc"}
                    onClick={() => handleRequestSort("companyName")}
                  >
                    Primary Company
                  </StyledTableSortLabel>
                </StyledTableCell> */}
                {/* <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "lastActivityDate"}
                  direction={orderBy === "lastActivityDate" ? order : "asc"}
                  onClick={() => handleRequestSort("lastActivityDate")}
                >
                  Last Activity Date
                </StyledTableSortLabel>
              </StyledTableCell> */}
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "salesOwner"}
                    direction={orderBy === "salesOwner" ? order : "asc"}
                    onClick={() => handleRequestSort("salesOwner")}
                  >
                    Sales Owner
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "createdAt"}
                    direction={orderBy === "createdAt" ? order : "asc"}
                    onClick={() => handleRequestSort("createdAt")}
                  >
                    Created Date
                  </StyledTableSortLabel>
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: "#fff" }}>
                <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                  <FilterAltIcon
                    style={{ color: "#0767e6", marginLeft: "-4px" }}
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                  <TextField
                    placeholder="Filter by Customer name"
                    value={searchByName}
                    onChange={(e) => {
                      setSearchByName(e.target.value.split(","));
                      setPage(0);
                    }}
                    variant="standard"
                    fullWidth
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                  <TextField
                    placeholder="Filter by Level"
                    value={searchByLevel}
                    onChange={(e) => {
                      setSearchByLevel(e.target.value.split(","));
                      setPage(0);
                    }}
                    variant="standard"
                    fullWidth
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                  <TextField
                    placeholder="Filter by Owner"
                    value={searchByOwner}
                    onChange={(e) => {
                      setSearchByOwner(e.target.value.split(","));
                      setPage(0);
                    }}
                    variant="standard"
                    fullWidth
                  />
                </TableCell>

                <TableCell sx={{ border: "1px solid #f0f0f0" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filters.length > 0 ? (
                filters
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((data, i) => {
                    const reverseSerialNumber =
                      filters.length - (page * rowsPerPage + i);
                    return (
                      <TableRow key={data.id}>
                        <StyledTableCell>
                          {" "}
                          <Typography
                            sx={{
                              fontSize: 12,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <NearMeIcon
                              sx={{
                                color: lighten(
                                  priorityColors[data.contactLevelType] ||
                                    "#000000",
                                  0.3
                                ),
                              }}
                            />
                            {reverseSerialNumber}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            color: "#3aa2ef",
                            cursor: "pointer",
                            whiteSpace: "normal", // Allow text to wrap
                            wordBreak: "break-word", // Break long words into the next line if needed
                            maxWidth: "150px", // Optional: Control how wide the text can go before wrapping
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                          onClick={() => getContactDetails(data.id)}
                        >
                          <Box display="flex" alignItems="center">
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                marginRight: 1,
                                bgcolor: stringToColor(data.name), // Dynamically generate color
                              }}
                            >
                              <span style={{ fontSize: "12px" }}>
                                {data.name.charAt(0)}{" "}
                              </span>
                              {/* Initial of the company name */}
                            </Avatar>
                            {data.name?.length > 25
                              ? `${data.name.substring(0, 25)}...`
                              : data.name}
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Typography
                            sx={{
                              color: darken(
                                priorityColors[data.contactLevelType] ||
                                  "#000000",
                                0.3
                              ),
                              backgroundColor: lighten(
                                priorityColors[data.contactLevelType] ||
                                  "#000000",
                                0.5
                              ),
                              height: "25px",
                              fontSize: 12,
                              margin: "0px 15px",
                              // padding: "5px 8px",
                              borderRadius: "4px",
                              width: "100px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {" "}
                            {data.contactLevelType}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                          {data.createdBy.split(" ", [1])}
                        </StyledTableCell>
                        <StyledTableCell>
                          {new Date(data.createdAt).toLocaleDateString("en-GB")}
                        </StyledTableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <StyledTableCell colSpan={8} align="center">
                    <img
                      src={userNotFound}
                      alt="User Not Found"
                      style={{ width: "300px", height: "250px" }}
                    />
                    <Typography variant="body1" sx={{ color: "#ee7171" }}>
                      No Contacts Found
                    </Typography>
                  </StyledTableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}
        >
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={sortedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
        {openContactsForm && (
          <ContactForm
            openContactsForm={openContactsForm}
            setOpenContactsForm={setOpenContactsForm}
            fetchContactData={fetchContactData}
          />
        )}

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
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

export default ContactTable;
