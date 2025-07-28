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
  TableBody,
  TablePagination,
  Select,
  MenuItem,
  Button,
  Avatar,
  Popover,
  List,
  ListItem,
  ListItemText,
  Switch,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import userNotFound from "../Image/useeNotfound.webp";
import AuthService from "../services/AuthService";
import GEMForm from "./GEMForm";
import { useNavigate } from "react-router-dom";
import GEMApproveForm from "./GEMDatas/GEMApproveForm";
import * as XLSX from "xlsx";
import IosShareIcon from "@mui/icons-material/IosShare";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Loading from "../Loading/Loading";
import { lighten, darken } from "@mui/system";
import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: "#000",
    fontSize: 14,
    border: "1px solid #f0f0f0",
  },
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: "#fff",
    fontWeight: 500,
    fontSize: 13,
    padding: "18px 15px",
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
    color: "#e02b6a",
  },
  "&.Mui-active": {
    color: "#e02b6a",
  },
}));

const initialVisibleColumns = {
  "Ticket No": true,
  "GEM No": true,
  "Dealer Name": true,
  "Owner Name": true,
  "Due Date": true,
  Status: true,
};

function GEMList() {
  const CRMBaseURL = AuthService();
  const navigate = useNavigate();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));

  const role = storedUserData?.userRole;
  const team = storedUserData?.team;
  const userID = storedUserData?.id;

  const [contactDataList, setContactDataList] = useState([]);
  const [openContactsForm, setOpenContactsForm] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openGemDetails, setOpenGemDetails] = useState(false);
  const [gemID, setGemID] = useState("");
  const [gemtype, setGemType] = useState("");
  const [approveGemDialog, setApproveGemDialog] = useState(false);
  const [gemPrice, setGemPrice] = useState(false);

  const [gemNumberFilter, setGemNumberFilter] = useState("");
  const [ticketNumberFilter, setTicketNumberFilter] = useState("");
  const [dealerNameFilter, setDealerNameFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);

  const [loading, setLoading] = useState(false);
  const [showColumnsData, setShowColumnsData] = useState(initialVisibleColumns);
  const [applyColumnsData, setApplyColumnsData] = useState(
    initialVisibleColumns
  );
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  const statusColors = {
    "Waiting for Approval": "#FF9800", // Orange
    "Quotation Updated": "#03A9F4", // Light Blue
    "GeM Approved Waiting for Quotation": "#4CAF50", // Green
    "Demo Scheduled": "#9C27B0", // Purple
    Negotiation: "#FFC107", // Amber
    "Closed Won": "#4CAF50", // Green
    "Closed Loss": "#F44336", // Red
    Invalid: "#9E9E9E", // Grey
  };

  const fetchContactData = async () => {
    setLoading(true);
    const values = {
      userID: storedUserData ? parseInt(storedUserData.id, 10) : null,
      team: storedUserData && `${storedUserData.team}`,
      role: storedUserData && `${storedUserData.userRole}`,
    };
    try {
      const contactData = await CRMBaseURL.post("mygem", values);
      setContactDataList(contactData.data?.data || []);
    } catch (err) {
      console.log("Error occurred", err);
    }
    setLoading(false);
  };

  const OpenGemApproveView = (id) => {
    setGemID(id);
    setApproveGemDialog(true);
  };

  const filterData = (data) => {
    // Initialize the 'today' variable here
    const today = new Date();

    return data.filter((row) => {
      const tiketNumberMatch = row.ticketNo
        ?.toString()
        .toLowerCase()
        .includes(ticketNumberFilter);
      const gemNumberMatch = row.gemNumber
        ?.toString()
        .toLowerCase()
        .includes(gemNumberFilter);
      const dealerNameMatch = row.dealerName
        .toLowerCase()
        .includes(dealerNameFilter.toLowerCase());
      const ownerMatch = row.createdBy
        .toLowerCase()
        .includes(ownerFilter.toLowerCase());
      const statusMatch = statusFilter ? row.status === statusFilter : true;

      let startDateMatch = true;
      if (startDateFilter) {
        const startDate = new Date(row.gemRaisedAt);
        switch (startDateFilter) {
          case "Yesterday":
            startDateMatch =
              startDate.toDateString() ===
              new Date(today.setDate(today.getDate() - 1)).toDateString();
            break;
          case "3 days before":
            startDateMatch =
              startDate >= new Date(today.setDate(today.getDate() - 3));
            break;
          case "5 days before":
            startDateMatch =
              startDate >= new Date(today.setDate(today.getDate() - 5));
            break;
          case "Custom":
            startDateMatch =
              customStartDate &&
              customEndDate &&
              startDate >= new Date(customStartDate) &&
              startDate <= new Date(customEndDate);
            break;
          default:
            startDateMatch = true;
        }
      }

      let dueDateMatch = true;
      if (dueDateFilter) {
        const dueDate = new Date(row.dueDate);
        switch (dueDateFilter) {
          case "Next 3 days":
            dueDateMatch =
              dueDate <= new Date(today.setDate(today.getDate() + 3));
            break;
          case "Next 5 days":
            dueDateMatch =
              dueDate <= new Date(today.setDate(today.getDate() + 5));
            break;
          case "Next 7 days":
            dueDateMatch =
              dueDate <= new Date(today.setDate(today.getDate() + 7));
            break;
          case "Custom":
            dueDateMatch =
              customStartDate &&
              customEndDate &&
              dueDate >= new Date(customStartDate) &&
              dueDate <= new Date(customEndDate);
            break;
          default:
            dueDateMatch = true;
        }
      }

      return (
        gemNumberMatch &&
        dealerNameMatch &&
        ownerMatch &&
        startDateMatch &&
        dueDateMatch &&
        statusMatch &&
        tiketNumberMatch
      );
    });
  };

  const exportToExcel = (filteredData) => {
    // Convert the filtered data into a worksheet
    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    // Create a new workbook and add the worksheet to it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FilteredData");

    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, "filtered_data.xlsx");
  };

  const HandlePrice = (id) => {
    setGemID(id);
    setGemType("Quotation Required");
    navigate("/dashboard/gem_details", {
      state: { gemID: id, type: "Quotation Required" },
    });
    setGemPrice(true);
  };

  useEffect(() => {
    // if (checked) {
    //   fetchContactData1();
    // } else {
    fetchContactData();
    // }
  }, []);

  // Handle search query change
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

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

  const filteredData =
    contactDataList &&
    contactDataList.filter((contact) => {
      const lowerCaseQuery = searchQuery && searchQuery.toLowerCase();

      const formattedLastActivityDate = new Date(
        contact.lastActivityDate
      ).toLocaleDateString("en-GB");
      const formattedCreatedAt = new Date(
        contact.gemRaisedAt
      ).toLocaleDateString("en-GB");

      return (
        contact.dealerName.toLowerCase().includes(lowerCaseQuery) ||
        contact.gemNumber.toLowerCase().includes(lowerCaseQuery) ||
        contact.customerName.toString().includes(searchQuery) ||
        contact.dueDate.toLowerCase().includes(lowerCaseQuery) ||
        formattedLastActivityDate.includes(searchQuery) ||
        formattedCreatedAt.includes(searchQuery) ||
        contact.description.toLowerCase().includes(lowerCaseQuery) // Add this line
      );
    });

  const handleView = (id) => {
    setGemID(id);
    setGemType("My Gem");
    navigate("/dashboard/gem_details", {
      state: { gemID: id, type: "My Gem" },
    });
    setOpenGemDetails(true);
  };

  // Sort data based on selected column and order
  const sortedData =
    filteredData &&
    filteredData.sort((a, b) => {
      if (orderBy === "dealerName") {
        return (
          (a.dealerName < b.dealerName ? -1 : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "gemNumber") {
        return (
          (a.gemNumber < b.gemNumber ? -1 : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "customerName") {
        return (
          (a.customerName < b.customerName ? -1 : 1) *
          (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "dueDate") {
        return (
          (new Date(a.dueDate) < new Date(b.dueDate) ? -1 : 1) *
          (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "description") {
        return (
          (a.description < b.description ? -1 : 1) * (order === "asc" ? 1 : -1)
        ); // Add this line
      } else if (orderBy === "createdBy") {
        return (
          (a.createdBy < b.createdBy ? -1 : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "createdAt") {
        return (
          (new Date(a.gemRaisedAt) < new Date(b.gemRaisedAt) ? -1 : 1) *
          (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "ticketNo") {
        return (
          (new Date(a.ticketNo) < new Date(b.ticketNo) ? -1 : 1) *
          (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "status") {
        return (
          (new Date(a.status) < new Date(b.status) ? -1 : 1) *
          (order === "asc" ? 1 : -1)
        );
      }
      return 0;
    });

  if (!loading) {
    return (
      <>
        {/*  <Box display="flex" justifyContent="space-between" mb={2}>
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
        <Box
          sx={{
            display: "flex",
            color: "#000",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h4 style={{ color: "#000" }}>
            GeM List
            {`(${contactDataList ? contactDataList.length : 0})`}
          </h4>
          <div style={{ display: "flex", gap: 10, paddingRight: 20 }}>
            {/* <IosShareIcon
            onClick={() => exportToExcel(filteredData)}
            sx={{
              marginRight:"20px",
              color:"#fff",
              cursor:"pointer"
            }}
          /> */}
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
            {storedUserData?.team === "Admin" &&
              (storedUserData?.userRole === "Super Admin" ||
                storedUserData?.userRole === "Admin") && (
                <Button
                  onClick={() => exportToExcel(filteredData)}
                  variant="outlined"
                  startIcon={<IosShareIcon />}
                  sx={{
                    border: "2px solid transparent",
                    borderRadius: "8px",
                    padding: "5px 12px",
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

            {/* <Button
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
          </Button> */}
          </div>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <TableCell>#</TableCell>
                {showColumnsData["Ticket No"] && (
                  <TableCell sx={{ border: "1px solid #fff", fontSize: 14 }}>
                    <StyledTableSortLabel
                      active={orderBy === "ticketNo"}
                      direction={orderBy === "ticketNo" ? order : "asc"}
                      onClick={() => handleRequestSort("ticketNo")}
                    >
                      Ticket No
                    </StyledTableSortLabel>
                  </TableCell>
                )}

                {showColumnsData["GEM No"] && (
                  <TableCell sx={{ border: "1px solid #fff", fontSize: 14 }}>
                    <StyledTableSortLabel
                      active={orderBy === "gemNumber"}
                      direction={orderBy === "gemNumber" ? order : "asc"}
                      onClick={() => handleRequestSort("gemNumber")}
                    >
                      GEM No
                    </StyledTableSortLabel>
                  </TableCell>
                )}
                {showColumnsData["Dealer Name"] && (
                  <TableCell sx={{ border: "1px solid #fff", fontSize: 14 }}>
                    <StyledTableSortLabel
                      active={orderBy === "dealerName"}
                      direction={orderBy === "dealerName" ? order : "asc"}
                      onClick={() => handleRequestSort("dealerName")}
                    >
                      {" "}
                      Dealer Name
                    </StyledTableSortLabel>
                  </TableCell>
                )}
                {showColumnsData["Owner Name"] && (
                  <TableCell sx={{ border: "1px solid #fff", fontSize: 14 }}>
                    <StyledTableSortLabel
                      active={orderBy === "createdBy"}
                      direction={orderBy === "createdBy" ? order : "asc"}
                      onClick={() => handleRequestSort("createdBy")}
                    >
                      Owner
                    </StyledTableSortLabel>
                  </TableCell>
                )}

                {/* Start Date Filter */}
                {/* <StyledTableCell>
              Start Date
                <Select
                  variant="standard"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="Yesterday">Yesterday</MenuItem>
                  <MenuItem value="3 days before">3 days before</MenuItem>
                  <MenuItem value="5 days before">5 days before</MenuItem>
                  <MenuItem value="Custom">Custom</MenuItem>
                </Select>

                {startDateFilter === "Custom" && (
                  <>
                    <TextField
                      variant="standard"
                      type="date"
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      InputProps={{ disableUnderline: false }}
                    />
                    <TextField
                      variant="standard"
                      type="date"
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      InputProps={{ disableUnderline: false }}
                    />
                  </>
                )}

                <StyledTableSortLabel
                  active={orderBy === "createdAt"}
                  direction={orderBy === "createdAt" ? order : "asc"}
                  onClick={() => handleRequestSort("createdAt")}
                >
                  
                </StyledTableSortLabel>
              </StyledTableCell> */}

                {/* Due Date Filter */}
                {showColumnsData["Due Date"] && (
                  <TableCell sx={{ border: "1px solid #fff", fontSize: 14 }}>
                    <StyledTableSortLabel
                      active={orderBy === "dueDate"}
                      direction={orderBy === "dueDate" ? order : "asc"}
                      onClick={() => handleRequestSort("dueDate")}
                    >
                      {" "}
                      Due Date
                    </StyledTableSortLabel>
                  </TableCell>
                )}

                {/* Status Filter */}
                {showColumnsData["Status"] && (
                  <TableCell sx={{ border: "1px solid #fff", fontSize: 14 }}>
                    <StyledTableSortLabel
                      active={orderBy === "status"}
                      direction={orderBy === "status" ? order : "asc"}
                      onClick={() => handleRequestSort("status")}
                    >
                      Status
                    </StyledTableSortLabel>
                  </TableCell>
                )}

                <TableCell sx={{ border: "1px solid #fff", fontSize: 14 }}>
                  Action
                </TableCell>
              </TableRow>

              <TableRow sx={{ backgroundColor: "#fff" }}>
                <StyledTableCell>
                  <FilterAltIcon style={{ color: "#0767e6" }} />
                </StyledTableCell>
                {showColumnsData["Ticket No"] && (
                  <StyledTableCell>
                    {" "}
                    <TextField
                      variant="standard"
                      placeholder="Filter Ticket No"
                      value={ticketNumberFilter}
                      onChange={(e) => {
                        setTicketNumberFilter(e.target.value);
                        setPage(0);
                      }}
                      InputProps={{ disableUnderline: false }}
                    />
                  </StyledTableCell>
                )}
                {showColumnsData["GEM No"] && (
                  <StyledTableCell>
                    {" "}
                    <TextField
                      variant="standard"
                      placeholder="Filter GEM No"
                      value={gemNumberFilter}
                      onChange={(e) => {
                        setGemNumberFilter(e.target.value);
                        setPage(0);
                      }}
                      InputProps={{ disableUnderline: false }}
                    />
                  </StyledTableCell>
                )}
                {showColumnsData["Dealer Name"] && (
                  <StyledTableCell>
                    <TextField
                      variant="standard"
                      placeholder="Filter Dealer Name"
                      value={dealerNameFilter}
                      onChange={(e) => {
                        setDealerNameFilter(e.target.value);
                        setPage(0);
                      }}
                      InputProps={{ disableUnderline: false }}
                    />
                  </StyledTableCell>
                )}
                {showColumnsData["Owner Name"] && (
                  <StyledTableCell>
                    {" "}
                    <TextField
                      variant="standard"
                      placeholder="Filter Owner"
                      value={ownerFilter}
                      onChange={(e) => {
                        setOwnerFilter(e.target.value);
                        setPage(0);
                      }}
                      InputProps={{ disableUnderline: false }}
                    />
                  </StyledTableCell>
                )}
                {showColumnsData["Due Date"] && (
                  <StyledTableCell>
                    {" "}
                    <Select
                      variant="standard"
                      value={dueDateFilter}
                      onChange={(e) => {
                        setDueDateFilter(e.target.value);
                        setPage(0);
                      }}
                      displayEmpty
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="Next 3 days">Next 3 days</MenuItem>
                      <MenuItem value="Next 5 days">Next 5 days</MenuItem>
                      <MenuItem value="Next 7 days">Next 7 days</MenuItem>
                      <MenuItem value="Custom">Custom</MenuItem>
                    </Select>
                    {dueDateFilter === "Custom" && (
                      <>
                        <TextField
                          variant="standard"
                          type="date"
                          onChange={(e) => {
                            setCustomStartDate(e.target.value);
                            setPage(0);
                          }}
                          InputProps={{ disableUnderline: false }}
                        />
                        <TextField
                          variant="standard"
                          type="date"
                          onChange={(e) => {
                            setCustomEndDate(e.target.value);
                            setPage(0);
                          }}
                          InputProps={{ disableUnderline: false }}
                        />
                      </>
                    )}
                  </StyledTableCell>
                )}
                {showColumnsData["Status"] && (
                  <StyledTableCell>
                    {" "}
                    <Select
                      variant="standard"
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(0);
                      }}
                      displayEmpty
                    >
                      <MenuItem value="">Select Status</MenuItem>
                      <MenuItem value="Waiting for Approval">open</MenuItem>
                      <MenuItem value="GeM Approved Waiting for Quotation">
                        Waiting for Quotation
                      </MenuItem>
                      <MenuItem value="Quotation Updated">
                        Quotation Updated
                      </MenuItem>
                      <MenuItem value="Negotiation">Negotiation</MenuItem>
                      <MenuItem value="Won">Won</MenuItem>
                      <MenuItem value="Loss">Loss</MenuItem>
                      <MenuItem value="Invalid">Invalid</MenuItem>
                    </Select>
                  </StyledTableCell>
                )}
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterData(sortedData).length > 0 ? (
                filterData(sortedData)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const canApproveDealButton =
                      row.status === "Waiting for Approval" &&
                      ((role === "Manager" && team === "Pricing") ||
                        role === "Admin" ||
                        role === "Super Admin");
                    const canPricingButton =
                      row.status === "GeM Approved Waiting for Quotation" &&
                      (userID === row.approverID ||
                        userID === row.quotationUpdaterID ||
                        role === "Admin" ||
                        role === "Super Admin");
                    const reverseSerialNumber =
                      sortedData.length - (page * rowsPerPage + index);

                    return (
                      <TableRow
                        key={row._id}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#ffffff1a",
                          },
                        }}
                      >
                        <StyledTableCell>{reverseSerialNumber}</StyledTableCell>
                        {showColumnsData["Ticket No"] && (
                          <StyledTableCell>
                            <Typography
                              sx={{
                                color: "#367cee",
                                fontSize: 13,
                                "&:hover": {
                                  textDecoration: "underline",
                                },
                              }}
                              onClick={() => {
                                navigate("/dashboard/gem_details", {
                                  state: { gemID: row.id, type: "My Gem" },
                                });
                              }}
                            >
                              {row.ticketNo}
                            </Typography>
                          </StyledTableCell>
                        )}
                        {showColumnsData["GEM No"] && (
                          <StyledTableCell>{row.gemNumber}</StyledTableCell>
                        )}

                        {/* <StyledTableCell>{row.dealerName}</StyledTableCell> */}
                        {showColumnsData["Dealer Name"] && (
                          <StyledTableCell
                            sx={{
                              color: "#3aa2ef",
                              cursor: "pointer",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                            onClick={() => {
                              navigate("/dashboard/partner_details", {
                                state: { ID: row.dealerId },
                              });
                            }}
                          >
                            <Box display="flex" alignItems="center">
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  marginRight: 1,
                                  bgcolor: stringToColor(row.dealerName), // Dynamically generate color
                                }}
                              >
                                <span style={{ fontSize: "12px" }}>
                                  {row.dealerName.charAt(0)}{" "}
                                </span>
                                {/* Initial of the company name */}
                              </Avatar>
                              {row.dealerName?.length > 25
                                ? `${row.dealerName.substring(0, 25)}...`
                                : row.dealerName}
                            </Box>
                          </StyledTableCell>
                        )}
                        {/* <StyledTableCell>{row.customerName}</StyledTableCell> */}
                        {/* <StyledTableCell>
                      {new Date(row.dueDate).toLocaleDateString("en-GB")}
                    </StyledTableCell>
                    <StyledTableCell>{row.description}</StyledTableCell> */}
                        {showColumnsData["Owner Name"] && (
                          <StyledTableCell>
                            {row.createdBy.split(" ")[0]}
                          </StyledTableCell>
                        )}
                        {/* <StyledTableCell>
                      {new Date(row.gemRaisedAt).toLocaleDateString("en-GB")}
                    </StyledTableCell> */}
                        {showColumnsData["Due Date"] && (
                          <StyledTableCell>
                            {new Date(row.dueDate).toLocaleDateString("en-GB")}
                          </StyledTableCell>
                        )}
                        {showColumnsData["Status"] && (
                          <StyledTableCell>
                            <Typography
                              sx={{
                                color: darken(
                                  statusColors[row.status] || "#813216bf",
                                  0.3
                                ),
                                backgroundColor: lighten(
                                  statusColors[row.status] || "#813216bf",
                                  0.5
                                ),
                                height: "25px",
                                fontSize: 12,
                                margin: "0px 15px",
                                //  padding:row.status?.length>10? "20px 8px":"0px",
                                borderRadius: "4px",
                                width: "150px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",

                                whiteSpace: "wrap",
                              }}
                            >
                              {" "}
                              {row.status === "Waiting for Approval"
                                ? "Open"
                                : row.status ===
                                  "GeM Approved Waiting for Quotation"
                                ? "Awaiting the Quotation"
                                : row.status}
                            </Typography>
                          </StyledTableCell>
                        )}

                        <StyledTableCell>
                          {canApproveDealButton ? (
                            <Typography
                              sx={{
                                border: "1px solid #00E096",
                                color: "#00E096",
                                "&:hover": {
                                  backgroundColor: "#00E096",
                                  color: "#fff",
                                },
                                padding: "1px 8px 1px 8px",
                                borderRadius: 2,
                                cursor: "pointer",
                                width: 80,
                                textAlign: "center",
                              }}
                              onClick={() => {
                                OpenGemApproveView(row.id);
                              }}
                            >
                              Validate
                            </Typography>
                          ) : canPricingButton ? (
                            <Typography
                              sx={{
                                border: "1px solid #FFCF00",
                                color: "#FFCF00",
                                "&:hover": {
                                  backgroundColor: "#FFCF00",
                                  color: "#fff",
                                },
                                padding: "1px 8px 1px 8px",
                                borderRadius: 2,
                                cursor: "pointer",
                                width: 80,
                                textAlign: "center",
                              }}
                              onClick={() => {
                                HandlePrice(
                                  row.id,
                                  row.productType,
                                  row.notificationID
                                );
                              }}
                            >
                              Price
                            </Typography>
                          ) : (
                            <Typography
                              sx={{
                                border: "1px solid #0095FF",
                                color: "#0095FF",
                                "&:hover": {
                                  backgroundColor: "#0095FF",
                                  color: "#fff",
                                },
                                padding: "1px 8px 1px 8px",
                                borderRadius: 2,
                                cursor: "pointer",
                                width: 80,
                                textAlign: "center",
                              }}
                              onClick={() => {
                                handleView(row.id);
                              }}
                            >
                              View
                            </Typography>
                          )}
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sortedData ? sortedData.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
        <GEMApproveForm
          gemID={gemID}
          approveGemDialog={approveGemDialog}
          setApproveGemDialog={setApproveGemDialog}
          setGemID={setGemID}
          fetchContactData={fetchContactData}
        />
        <GEMForm
          openContactsForm={openContactsForm}
          setOpenContactsForm={setOpenContactsForm}
          fetchContactData={fetchContactData}
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

export default GEMList;
