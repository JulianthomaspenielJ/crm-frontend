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
  Dialog,
  DialogActions,
  Button,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  Avatar,
  Popover,
  List,
  ListSubheader,
  ListItemText,
  Switch,
  ListItem,
} from "@mui/material";
import * as XLSX from "xlsx";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import userNotFound from "../../Image/useeNotfound.webp";
import AuthService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import DealViewDialog from "../NewDeal/DealViewDialog";
import ChatDialog from "./ChatScreen";
import dayjs from "dayjs";
import ApproveDialog from "../ApproveDealList/ApproveDialog";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import IosShareIcon from "@mui/icons-material/IosShare";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Loading from "../../Loading/Loading";
import { lighten, darken } from "@mui/system";
import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";
import NearMeIcon from '@mui/icons-material/NearMe';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: "#fff",
    color: "#000",
    fontSize: 14,
    padding: "15px 5px",
    border: "1px solid #fff",
  },
  [`&.${tableCellClasses.body}`]: {
    fontWeight: 500,
    fontSize: 12,
    padding: "0px 10px",
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
    // color: "#e02b6a",
    color: "#2354e6",
  },
  "&.Mui-active": {
    // color: "#e02b6a",
    color: "#2354e6",
  },
}));

const priorityColors = {
  High: "#F44336", // Dark Red
  Normal: "#FF9800", // Dark Orange
  Low: "#4CAF50", // Dark Green
};

const priority = {
  High: "#fc2d1e", // Dark Red
  Normal: "#ff9800", // Dark Orange
  Low: "#4caf50", // Dark Green
};

const statusColors = {
  "Quotation Required": "#FF9800", // Orange
  "Quotation Sent": "#03A9F4", // Light Blue
  "Appointment Scheduled": "#4CAF50", // Green
  "Demo Scheduled": "#9C27B0", // Purple
  Negotiation: "#FFC107", // Amber
  "Closed Won": "#4CAF50", // Green
  "Closed Loss": "#F44336", // Red
  Invalid: "#9E9E9E", // Grey
};

const getStatusColor = (status) => {
  switch (status) {
    case "Rejected":
      return "red";
    case "On Progress":
      return "orange";
    case "QUOTED":
      return "green";
    default:
      return "defaultColor";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "Low":
      return "green";
    case "Normal":
      return "orange";
    case "High":
      return "red";
    default:
      return "defaultColor";
  }
};

const initialVisibleColumns = {
  ticketNo: true,
  contact: true,
  productType: true,
  status: true,
  quantity: true,
  dealOwner: true,
  dueDate: true,
  priority: true,
};

const TransitionBox = styled(Box)`
  transition: all 0.3s ease;
  max-height: ${({ open }) => (open ? "500px" : "0")};
  overflow: hidden;
  opacity: ${({ open }) => (open ? 1 : 0)};
`;

function AllDeals({ setLoading }) {
  const CRMBaseURL = AuthService();
  const navigate = useNavigate();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));

  const role = storedUserData?.userRole;
  const team = storedUserData?.team;
  const userID = storedUserData?.id;

  const [approveID, setApproveID] = useState("");
  const [dealDataList, setDealDataList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatData, setChatData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [currentDeal, setCurrentDeal] = useState(null);
  const [summary, setSummary] = useState([]);
  const [editedFinalOutcome, setEditedFinalOutcome] = useState("");
  // const [loading, setLoading] = React.useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [exportData, setExportData] = useState([]);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [notificationID, setNotificationID] = useState(null);
  const [approveDialog, setApproveDialog] = useState(false);

  const [searchByContact, setSearchByContact] = useState("");
  const [searchByTicketID, setSearchByTicketID] = useState("");
  const [searchByProductType, setSearchByProductType] = useState("");
  const [searchByQuantity, setSearchByQuantity] = useState("");
  const [searchByDealOwner, setSearchByDealOwner] = useState("");
  const [searchByUpdater, setSearchByUpdater] = useState("");
  const [searchByStatus, setSearchByStatus] = useState("");
  const [searchByDueDate, setSearchByDueDate] = useState("");
  const [serachByStartDate, setSearchBystartDate] = useState("");
  const [searchByPriority, setSearchByPriority] = useState("");

  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);

  const [customDueStartDate, setCustomDueStartDate] = useState(null);
  const [customDueEndDate, setCustomDueEndDate] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
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

  const filteredDatas = dealDataList.filter((row) => {
    const today = new Date();
    const dealStartDate = new Date(row.dealStartDate);
    const closingDate = new Date(row.approximateClosingDate);

    // Handle due date filter based on the selection
    const isWithinRange = (range) => {
      const diffInTime = closingDate.getTime() - today.getTime();
      const diffInDays = diffInTime / (1000 * 3600 * 24);

      switch (range) {
        case "next3":
          return diffInDays >= 0 && diffInDays <= 3;
        case "next5":
          return diffInDays >= 0 && diffInDays <= 5;
        case "next7":
          return diffInDays >= 0 && diffInDays <= 7;
        case "next15":
          return diffInDays >= 0 && diffInDays <= 15;
        case "past":
          return diffInDays < 0;
        case "custom":
          if (customDueStartDate && customDueEndDate) {
            const customStart = new Date(customDueStartDate);
            const customEnd = new Date(customDueEndDate);
            return closingDate >= customStart && closingDate <= customEnd;
          }
          return false; // Return false if no custom dates set
        default:
          return true;
      }
    };

    const StartDate = (range) => {
      const diffInTime = today.getTime() - dealStartDate.getTime(); // difference between today and dealStartDate
      const diffInDays = diffInTime / (1000 * 3600 * 24);

      if (range === "custom" && customStartDate && customEndDate) {
        const customStart = new Date(customStartDate);
        const customEnd = new Date(customEndDate);
        return dealStartDate >= customStart && dealStartDate <= customEnd;
      }

      switch (range) {
        case "past3":
          return diffInDays <= 3 && diffInDays >= 0; // within past 3 days
        case "past5":
          return diffInDays <= 5 && diffInDays >= 0; // within past 5 days
        case "past7":
          return diffInDays <= 7 && diffInDays >= 0; // within past 7 days
        default:
          return true;
      }
    };

    return (
      (searchByTicketID === "" ||
        row.ticketID.toLowerCase().includes(searchByTicketID.toLowerCase())) &&
      (searchByContact === "" ||
        row.companyName
          .toLowerCase()
          .includes(searchByContact.toLowerCase())) &&
      (searchByProductType === "" ||
        row.productType
          .toLowerCase()
          .includes(searchByProductType.toLowerCase())) &&
      (searchByQuantity === "" ||
        row.quantity.toLowerCase().includes(searchByQuantity.toLowerCase())) &&
      (searchByDealOwner === "" ||
        row.dealOwnerName
          .toLowerCase()
          .includes(searchByDealOwner.toLowerCase())) &&
      (searchByUpdater === "" ||
        row.quotationUpdaterName
          .toLowerCase()
          .includes(searchByUpdater.toLowerCase())) &&
      (searchByStatus === "" ||
        row.status.toLowerCase().includes(searchByStatus.toLowerCase())) &&
      (searchByDueDate === "" || isWithinRange(searchByDueDate)) &&
      (serachByStartDate === "" || StartDate(serachByStartDate)) &&
      (searchByPriority === "" ||
        row.priority.toLowerCase().includes(searchByPriority.toLowerCase()))
    );
  });

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new(); // Create a new workbook
    const ws = XLSX.utils.json_to_sheet(filteredDatas); // Convert filtered data to a worksheet

    // Append worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Filtered Deals");

    // Export the workbook
    XLSX.writeFile(wb, "Filtered_Deals.xlsx");
  };

  const handleDownload = () => {
    const formattedData = exportData.map((item) => ({
      Ticket: item.id,
      Date: item.createdAt,
      //Priority: item.priority,
      "Sales Person": item.createdBy.split(" ")[0],
      status: item.status,
      company: item.company,
      Email: item.email,
      Phone: item.phone,
      ProductType: item.productType,
      QuoteBy: item.quotationUpdater.split(" ")[0],
      QuoteAt: item.quotationUpdatedAt,
      Quantity: item.quantity,
      "Remarks (If Reject)": item.reason,
    }));

    // Create the worksheet and the workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DealsData");

    // Apply conditional formatting if needed
    const ws = workbook.Sheets["DealsData"];
    const range = XLSX.utils.decode_range(ws["!ref"]); // Get the range of cells

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        const cell = ws[cell_ref];

        // Apply color formatting based on value
        if (cell && cell.v) {
          if (cell.v === "Low") {
            cell.s = { fill: { fgColor: { rgb: "00FF00" } } }; // Green
          } else if (cell.v === "Medium") {
            cell.s = { fill: { fgColor: { rgb: "FFA500" } } }; // Orange
          } else if (cell.v === "High") {
            cell.s = { fill: { fgColor: { rgb: "FF0000" } } }; // Red
          } else if (cell.v === "Rejected") {
            cell.s = { fill: { fgColor: { rgb: "FF0000" } } }; // Red
          } else if (cell.v === "On Progress") {
            cell.s = { fill: { fgColor: { rgb: "FFA500" } } }; // Orange
          } else if (cell.v === "QUOTED") {
            cell.s = { fill: { fgColor: { rgb: "00FF00" } } }; // Green
          }
        }
      }
    }

    const formattedStartDate = dayjs(fromDate).format("YYYY-MM-DD");
    const formattedEndDate = dayjs(toDate).format("YYYY-MM-DD");
    const filename = `DealsData_${formattedStartDate}_to_${formattedEndDate}.xlsx`;

    XLSX.writeFile(workbook, filename);

    setPreviewDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setPreviewDialogOpen(false);
    setDialogOpen(false);
    fetchDealsData();
  };

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters && byteCharacters.length);
    for (let i = 0; i < byteCharacters && byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const handleGetViewAllData = async (deal) => {
    if (deal) {
      try {
        const values = {
          id: deal.id,
          notificationID: deal.notificationID,
          userId: parseInt(storedUserData && `${storedUserData.id}`, 10),
        };
        const res = await CRMBaseURL.post("dealdetaileddata", values);
        const data = res.data?.data;
        const sum = res.data?.sum;

        setCurrentDeal(data);
        setSummary(sum);

        setDialogOpen(true);
      } catch (error) {
        console.error("Error fetching deal details", error);
      }
    }
  };

  const handleEditOutcome = async () => {
    const updatedDeals = dealDataList.map((deal) =>
      deal.id === currentDeal.id
        ? { ...deal, finalOutCome: editedFinalOutcome }
        : deal
    );

    setDealDataList(updatedDeals);
    setCurrentDeal({ ...currentDeal, finalOutCome: editedFinalOutcome });

    const values = {
      id: currentDeal.id,
      finalOutCome: editedFinalOutcome,
      editedBy: storedUserData
        ? `${storedUserData.userName} (${storedUserData.email})`
        : undefined,
    };

    const res = await CRMBaseURL.post("updatefinaloutcome", values);

    setDialogOpen(false);
  };

  const fetchDealsData = async (myDeals = false) => {
    setDataLoading(true);
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const values = {
      id: parseInt(storedUserData && `${storedUserData.id}`, 10),
      userId: parseInt(storedUserData && `${storedUserData.id}`, 8),
      team: storedUserData && `${storedUserData.team}`,
      role: storedUserData && `${storedUserData.userRole}`,
      myDeals,
    };

    try {
      const dealData = await CRMBaseURL.post("alldeals", values);

      setDealDataList(dealData.data?.data || []);
    } catch (err) {
      console.log("Error occurred", err);
    }
    setDataLoading(false);
  };

  useEffect(() => {
    fetchDealsData();
  }, []);

  const getDealDetails = (id, productType, notificationID) => {
    navigate("/dashboard/deal_details", {
      state: {
        ID: id,
        productType: productType,
        notificationID: notificationID,
      },
    });
  };

  const getContactDetails = (id) => {
    navigate("/dashboard/contact_details", {
      state: { ID: id },
    });
  };
  const getCompanyDetails = (id) => {
    navigate("/dashboard/company_details", {
      state: { ID: id },
    });
  };

  const handleOpenDetails = async (deal) => {
    if (deal) {
      try {
        const res = await CRMBaseURL.post("dealdetaileddata", { id: deal.id });
        const data = res.data?.data;
        setCurrentDeal(data);
        setDialogOpen(true);
      } catch (error) {
        console.error("Error fetching deal details", error);
      }
    }
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleRequestSort = (property) => {
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

  const handleChat = async (id) => {
    const data = {
      dealID: id,
    };
    fetchChatData(data);
    setChatOpen(true);
    setSelectedId(id);
  };

  const handleActionClick = async (ID, notificationID) => {
    setNotificationID(notificationID);
    setApproveDialog(true);
    setApproveID(ID);
    fetchDealsData();
  };

  const fetchChatData = async (data) => {
    try {
      const response = await CRMBaseURL.post("getchat", data);
      setChatData(response.data?.data);
    } catch (e) {
    }
  };
  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedId(null);
  };

  const filteredData =
    dealDataList &&
    dealDataList.filter((list) => {
      const lowerCaseQuery = searchQuery.toLowerCase();

      const formattedCreatedAt = new Date(list.createdAt).toLocaleDateString(
        "en-GB"
      );

      return (
        list.companyName.toLowerCase().includes(lowerCaseQuery) ||
        list.priority.toLowerCase().includes(lowerCaseQuery) ||
        list.productType.toLowerCase().includes(lowerCaseQuery) ||
        list.quantity.toLowerCase().includes(lowerCaseQuery) ||
        list.dealOwnerName.toLowerCase().includes(lowerCaseQuery) ||
        list.status.toLowerCase().includes(lowerCaseQuery) ||
        formattedCreatedAt.includes(searchQuery) // Search in formatted creation date
      );
    });
  const sortedData =
    filteredDatas &&
    filteredDatas.sort((a, b) => {
      if (orderBy === "contact") {
        return (
          (a.companyName < b.companyName ? -1 : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "priority") {
        return (a.priority < b.priority ? -1 : 1) * (order === "asc" ? 1 : -1);
      } else if (orderBy === "productType") {
        return (
          (a.productType < b.productType ? -1 : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "quantity") {
        return (a.quantity < b.quantity ? -1 : 1) * (order === "asc" ? 1 : -1);
      } else if (orderBy === "dealOwner") {
        return (
          (a.dealOwnerName < b.dealOwnerName ? -1 : 1) *
          (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "status") {
        return (a.status < b.status ? -1 : 1) * (order === "asc" ? 1 : -1);
      } else if (orderBy === "createdAt") {
        return (
          (new Date(a.createdAt) < new Date(b.createdAt) ? -1 : 1) *
          (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "ticketID") {
        // Sorting by Ticket No
        return (a.ticketID < b.ticketID ? -1 : 1) * (order === "asc" ? 1 : -1);
      }
      return 0;
    });

  const isButtonDisabled = !fromDate || !toDate;
  if (!dataLoading) {
    return (
      <>
        <Box
          // className="top_header"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#000",
          }}
        >
          <h4>All Deals {`(${dealDataList ? dealDataList.length : 0})`}</h4>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
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
                  onClick={exportToExcel}
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
          </Box>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 500 }} aria-label="customized table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <StyledTableCell>
                  <Typography sx={{ marginLeft: "10px" }}> #</Typography>
                </StyledTableCell>
                {showColumnsData?.ticketNo && (
                  <StyledTableCell>
                    <StyledTableSortLabel
                      active={orderBy === "ticketID"}
                      direction={orderBy === "ticketID" ? order : "asc"}
                      onClick={() => handleRequestSort("ticketID")}
                    >
                      Ticket No
                    </StyledTableSortLabel>
                  </StyledTableCell>
                )}

                {showColumnsData?.contact && (
                  <StyledTableCell>
                    <StyledTableSortLabel
                      active={orderBy === "contact"}
                      direction={orderBy === "contact" ? order : "asc"}
                      onClick={() => handleRequestSort("contact")}
                    >
                      Contact
                    </StyledTableSortLabel>
                  </StyledTableCell>
                )}
                {showColumnsData?.productType && (
                  <StyledTableCell>
                    <StyledTableSortLabel
                      active={orderBy === "productType"}
                      direction={orderBy === "productType" ? order : "asc"}
                      onClick={() => handleRequestSort("productType")}
                    >
                      Product Type
                    </StyledTableSortLabel>
                  </StyledTableCell>
                )}

                {showColumnsData?.status && (
                  <StyledTableCell>
                    <StyledTableSortLabel
                      active={orderBy === "status"}
                      direction={orderBy === "status" ? order : "asc"}
                      onClick={() => handleRequestSort("status")}
                    >
                      Status
                    </StyledTableSortLabel>
                  </StyledTableCell>
                )}

                {showColumnsData?.quantity && (
                  <StyledTableCell>
                    <StyledTableSortLabel
                      active={orderBy === "quantity"}
                      direction={orderBy === "quantity" ? order : "asc"}
                      onClick={() => handleRequestSort("quantity")}
                    >
                      Quantity
                    </StyledTableSortLabel>
                  </StyledTableCell>
                )}

                {showColumnsData?.dealOwner && (
                  <StyledTableCell>
                    <StyledTableSortLabel
                      active={orderBy === "dealOwner"}
                      direction={orderBy === "dealOwner" ? order : "asc"}
                      onClick={() => handleRequestSort("dealOwner")}
                    >
                      Deal Owner
                    </StyledTableSortLabel>
                  </StyledTableCell>
                )}

                {/* <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "updater"}
                  direction={orderBy === "updater" ? order : "asc"}
                  onClick={() => handleRequestSort("updater")}
                >
                  Quotation Updater
                </StyledTableSortLabel>
              </StyledTableCell> */}

                {/* <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "startDate"}
                  direction={orderBy === "startDate" ? order : "asc"}
                  onClick={() => handleRequestSort("startDate")}
                >
                  Start Date
                </StyledTableSortLabel>
              </StyledTableCell> */}
                {showColumnsData?.dueDate && (
                  <StyledTableCell>
                    <StyledTableSortLabel
                      active={orderBy === "dueDate"}
                      direction={orderBy === "dueDate" ? order : "asc"}
                      onClick={() => handleRequestSort("dueDate")}
                    >
                      Due Date
                    </StyledTableSortLabel>
                  </StyledTableCell>
                )}
                {/* {showColumnsData?.priority && (
                  <StyledTableCell>
                    <StyledTableSortLabel
                      active={orderBy === "priority"}
                      direction={orderBy === "priority" ? order : "asc"}
                      onClick={() => handleRequestSort("priority")}
                    >
                      priority
                    </StyledTableSortLabel>
                  </StyledTableCell>
                )} */}
                <StyledTableCell>
                  <StyledTableSortLabel>Actions</StyledTableSortLabel>
                </StyledTableCell>
              </TableRow>

              {/* Search Fields Row */}
              <TableRow sx={{ backgroundColor: "#fff" }}>
                <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                  <FilterAltIcon
                    style={{
                      color: "#0767e6",
                      marginLeft: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowFilters(!showFilters)} // Toggle the state on icon click
                  />
                </TableCell>

                {/* Transition effect on filters */}
                <TransitionBox open={showFilters} sx={{ display: "contents" }}>
                  {showColumnsData?.ticketNo && (
                    <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                      <TextField
                        placeholder="Filter Ticket No"
                        value={searchByTicketID}
                        onChange={(e) => {
                          setPage(0);
                          setSearchByTicketID(e.target.value);
                        }}
                        variant="standard"
                      />
                    </TableCell>
                  )}
                  {showColumnsData?.contact && (
                    <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                      <TextField
                        placeholder="Filter Contact"
                        value={searchByContact}
                        onChange={(e) => {
                          setSearchByContact(e.target.value);
                          setPage(0);
                        }}
                        variant="standard"
                      />
                    </TableCell>
                  )}
                  {showColumnsData?.productType && (
                    <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                      <TextField
                        placeholder="Filter Product Type"
                        value={searchByProductType}
                        onChange={(e) => {
                          setSearchByProductType(e.target.value);
                          setPage(0);
                        }}
                        variant="standard"
                        fullWidth
                      />
                    </TableCell>
                  )}
                  {showColumnsData?.status && (
                    <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                      <FormControl variant="standard" fullWidth>
                        <Select
                          value={searchByStatus}
                          onChange={(e) => {
                            setSearchByStatus(e.target.value);
                            setPage(0);
                          }}
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>All</em>
                          </MenuItem>
                          <MenuItem value="Waiting for Approval">Open</MenuItem>
                          <MenuItem value="Quotation Required">
                            Quotation Required
                          </MenuItem>
                          <MenuItem value="Quotation Sent">
                            Quotation Sent
                          </MenuItem>
                          <MenuItem value="Negotiation">Negotiation</MenuItem>
                          <MenuItem value="Closed Won">Won</MenuItem>
                          <MenuItem value="Closed Loss">Loss</MenuItem>
                          <MenuItem value="Invalid">Invalid</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  )}
                  {showColumnsData?.quantity && (
                    <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                      <TextField
                        placeholder="Filter Quantity"
                        value={searchByQuantity}
                        onChange={(e) => {
                          setSearchByQuantity(e.target.value);
                          setPage(0);
                        }}
                        variant="standard"
                        fullWidth
                      />
                    </TableCell>
                  )}
                  {showColumnsData?.dealOwner && (
                    <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                      <TextField
                        placeholder="Filter Deal Owner"
                        value={searchByDealOwner}
                        onChange={(e) => {
                          setSearchByDealOwner(e.target.value);
                          setPage(0);
                        }}
                        variant="standard"
                        fullWidth
                      />
                    </TableCell>
                  )}
                  {showColumnsData?.dueDate && (
                    <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                      <FormControl fullWidth>
                        <Select
                          value={searchByDueDate}
                          onChange={(e) => {
                            setSearchByDueDate(e.target.value);
                            setPage(0);
                          }}
                          variant="standard"
                        >
                          <MenuItem value="">None</MenuItem>
                          <MenuItem value="next3">Next 3 Days</MenuItem>
                          <MenuItem value="next5">Next 5 Days</MenuItem>
                          <MenuItem value="next7">Next 7 Days</MenuItem>
                          <MenuItem value="next15">Next 15 Days</MenuItem>
                          <MenuItem value="past">Past Deals</MenuItem>
                          <MenuItem value="custom">Custom</MenuItem>
                        </Select>

                        {searchByDueDate === "custom" && (
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label="Due Start Date"
                                value={customDueStartDate}
                                onChange={(newValue) =>
                                  setCustomDueStartDate(newValue)
                                }
                                renderInput={(params) => (
                                  <TextField {...params} variant="standard"  fullWidth/>
                                )}
                              />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label="Due End Date"
                                value={customDueEndDate}
                                onChange={(newValue) =>
                                  setCustomDueEndDate(newValue)
                                }
                                renderInput={(params) => (
                                  <TextField {...params} variant="standard"  fullWidth />
                                )}
                              />
                            </LocalizationProvider>
                          </Box>
                        )}
                      </FormControl>
                    </TableCell>
                  )}
                  {/* {showColumnsData?.priority && (
                    <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                      <FormControl variant="standard" fullWidth>
                        <Select
                          value={searchByPriority}
                          onChange={(e) => {
                            setSearchByPriority(e.target.value);
                            setPage(0);
                          }}
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>All</em>
                          </MenuItem>
                          <MenuItem value="High">High</MenuItem>
                          <MenuItem value="Normal">Normal</MenuItem>
                          <MenuItem value="Low">Low</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  )} */}
                </TransitionBox>

                <TableCell sx={{ border: "1px solid #f0f0f0" }}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredDatas.length > 0 ? (
                filteredDatas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((data, i) => {
                    const canApproveDealButton =
                      data.status === "Waiting for Approval" &&
                      ((role === "Manager" && team === "Pricing") ||
                        role === "Admin" ||
                        role === "Super Admin");

                    const canPricingButton =
                      data.status === "Quotation Required" &&
                      (userID === data.approverID ||
                        userID === data.quotationUpdaterID ||
                        role === "Admin" ||
                        role === "Super Admin");
                    const canNegotiationButton =
                      data.status === "Negotiation" &&
                      (userID === data.approverID ||
                        userID === data.quotationUpdaterID ||
                        role === "Admin" ||
                        role === "Super Admin");
                    const Rejected = data.status === "Deal Rejected";
                    const reverseIndex =
                      filteredDatas.length - (page * rowsPerPage + i);

                    return (
                      <TableRow
                        key={data.id}
                        sx={{
                          padding: "10px",
                          marginLeft: "20px",
                          backgroundColor:
                            data.isNotificationRead === 0 ? "#f0f8ff" : "white",
                          fontWeight:
                            data.isNotificationRead === 0 ? "bold" : "normal",
                        }}
                      >
                        <StyledTableCell>
                          <Typography
                            sx={{
                              fontSize: 12,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <NearMeIcon
                              sx={{
                                color: priority[data.priority] || "#000000",
                              }}
                            />{" "}
                            {reverseIndex}
                          </Typography>
                        </StyledTableCell>
                        {showColumnsData?.ticketNo && (
                          <StyledTableCell>
                            <Typography
                              onClick={() => handleOpenDetails(data)}
                              sx={{
                                color: "#367cee",
                                cursor: "pointer",

                                fontSize: 12,
                                fontWeight: 500,
                                "&:hover": {
                                  textDecoration: "underline",
                                },
                              }}
                              // sx={{
                              //   paddingLeft: "10px",
                              //   fontSize: 12,
                              //   fontWeight: 500,
                              // }}
                            >
                              {" "}
                              {data.ticketID}
                            </Typography>
                          </StyledTableCell>
                        )}
                        {showColumnsData?.contact && (
                          <StyledTableCell
                            sx={{
                              color: "#3aa2ef",
                              cursor: "pointer",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                            onClick={() => {
                              if (data.isCompany === 0) {
                                getContactDetails(data.contactID);
                              } else if (data.isCompany === 1) {
                                getCompanyDetails(data.contactID);
                              }
                            }}
                          >
                            <Box display="flex" alignItems="center">
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  marginRight: 1,
                                  bgcolor: stringToColor(data.companyName), // Dynamically generate color
                                }}
                              >
                                <span style={{ fontSize: "12px" }}>
                                  {data.companyName.charAt(0)}
                                </span>
                              </Avatar>
                              {data.companyName?.length > 20
                                ? `${data.companyName.substring(0, 20)}...`
                                : data.companyName}
                            </Box>
                          </StyledTableCell>
                        )}
                        {showColumnsData?.productType && (
                          <StyledTableCell>{data.productType}</StyledTableCell>
                        )}

                        {/* Status Cell */}
                        {showColumnsData?.status && (
                          <StyledTableCell>
                            <Typography
                              sx={{
                                color: darken(
                                  statusColors[data.status] || "#813216bf",
                                  0.3
                                ),
                                backgroundColor: lighten(
                                  statusColors[data.status] || "#813216bf",
                                  0.5
                                ),
                                height: "25px",
                                fontSize: 12,
                                margin: "0px 15px",
                                // padding: "5px 8px",
                                borderRadius: "4px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {" "}
                              {data.status === "Waiting for Approval"
                                ? "Open"
                                : data.status}
                            </Typography>
                          </StyledTableCell>
                        )}

                        {/* Priority Cell */}
                        {showColumnsData?.quantity && (
                          <StyledTableCell>
                            {data.quantity} {data.quantity <= 1 ? "No" : "Nos"}
                          </StyledTableCell>
                        )}
                        {showColumnsData?.dealOwner && (
                          <StyledTableCell>
                            {data.dealOwnerName.split(" ", [1])}
                          </StyledTableCell>
                        )}

                        {/* <StyledTableCell>
                        {data.quotationUpdaterName.split(" ")[0]}
                      </StyledTableCell> */}

                        {/* <StyledTableCell>{data.dealStartDate}</StyledTableCell> */}
                        {showColumnsData?.dueDate && (
                          <StyledTableCell>
                            {data.approximateClosingDate}
                          </StyledTableCell>
                        )}
                        {/* {showColumnsData?.priority && (
                          <StyledTableCell>
                            <Typography
                              sx={{
                                color: darken(
                                  priorityColors[data.priority] || "#000000",
                                  0.3
                                ),
                                backgroundColor: lighten(
                                  priorityColors[data.priority] || "#000000",
                                  0.5
                                ),
                                height: "25px",
                                fontSize: 12,
                                margin: "0px 15px",
                                // padding: "5px 8px",
                                borderRadius: "4px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {" "}
                              {data.priority}
                            </Typography>
                          </StyledTableCell>
                        )} */}

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
                                margin: "20px",
                                borderRadius: 2,
                                cursor: "pointer",
                                width: 80,
                                textAlign: "center",
                              }}
                              onClick={() => {
                                handleActionClick(data.id, data.notificationID);
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
                                margin: "20px",
                                borderRadius: 2,
                                cursor: "pointer",
                                width: 80,
                                textAlign: "center",
                              }}
                              onClick={() => {
                                getDealDetails(
                                  data.id,
                                  data.productType,
                                  data.notificationID
                                );
                              }}
                            >
                              Price
                            </Typography>
                          ) : canNegotiationButton ? (
                            <Typography
                              sx={{
                                border: "1px solid #FFCF00",
                                color: "#FFCF00",
                                "&:hover": {
                                  backgroundColor: "#FFCF00",
                                  color: "#fff",
                                },
                                padding: "1px 8px 1px 8px",
                                margin: "20px",
                                borderRadius: 2,
                                cursor: "pointer",
                                width: 80,
                                textAlign: "center",
                              }}
                              onClick={() => {
                                getDealDetails(
                                  data.id,
                                  data.productType,
                                  data.notificationID
                                );
                              }}
                            >
                              Update
                            </Typography>
                          ) : Rejected ? (
                            <Typography
                              sx={{
                                border: "1px solid #fa2d2d",
                                color: "#fa2d2d",
                                "&:hover": {
                                  backgroundColor: "#fa2d2d",
                                  color: "#fff",
                                },
                                padding: "1px 8px 1px 8px",
                                margin: "20px",
                                borderRadius: 2,
                                cursor: "pointer",
                                width: 80,
                                textAlign: "center",
                              }}
                              onClick={() => {
                                handleGetViewAllData(data);
                              }}
                            >
                              Rejected
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
                                margin: "20px",
                                borderRadius: 2,
                                cursor: "pointer",
                                width: 80,
                                textAlign: "center",
                              }}
                              onClick={() => {
                                handleGetViewAllData(data);
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
                      style={{ width: "200px", height: "180px" }}
                    />
                    <Typography variant="body1">
                      No Deals at the moment
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
            count={sortedData && sortedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>

        <ChatDialog
          open={chatOpen}
          onClose={handleCloseChat}
          id={selectedId}
          data={chatData}
          fetchChatData={fetchChatData}
        />
        <Dialog
          open={previewDialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Export Preview</DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Ticket</StyledTableCell>
                    <StyledTableCell>Created At</StyledTableCell>
                    <StyledTableCell>Priority</StyledTableCell>
                    <StyledTableCell>Sales Person</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Company Name</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Phone</StyledTableCell>
                    <StyledTableCell>Product Type</StyledTableCell>
                    <StyledTableCell>Quoted By</StyledTableCell>
                    <StyledTableCell>Quoted At</StyledTableCell>
                    <StyledTableCell>Quantity</StyledTableCell>
                    <StyledTableCell>Remarks(if deleted)</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exportData.map((item, index) => (
                    <TableRow key={index}>
                      <StyledTableCell>{item.id}</StyledTableCell>
                      <StyledTableCell>{item.createdAt}</StyledTableCell>
                      <StyledTableCell>
                        <Select
                          value={item.priority}
                          style={{ color: getPriorityColor(item.priority) }}
                        >
                          <MenuItem value="Low" style={{ color: "green" }}>
                            Low
                          </MenuItem>
                          <MenuItem value="Normal" style={{ color: "orange" }}>
                            Medium
                          </MenuItem>
                          <MenuItem value="High" style={{ color: "red" }}>
                            High
                          </MenuItem>
                        </Select>
                      </StyledTableCell>
                      <StyledTableCell>
                        {item.createdBy.split(" ", [1])}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Select
                          value={item.status}
                          style={{ color: getStatusColor(item.status) }}
                        >
                          <MenuItem value="Rejected" style={{ color: "red" }}>
                            Rejected
                          </MenuItem>
                          <MenuItem
                            value="On Progress"
                            style={{ color: "orange" }}
                          >
                            On Progress
                          </MenuItem>
                          <MenuItem value="QUOTED" style={{ color: "green" }}>
                            QUOTED
                          </MenuItem>
                        </Select>
                      </StyledTableCell>
                      <StyledTableCell>{item.company}</StyledTableCell>
                      <StyledTableCell>{item.email}</StyledTableCell>
                      <StyledTableCell>{item.phone}</StyledTableCell>
                      <StyledTableCell>{item.productType}</StyledTableCell>
                      <StyledTableCell>
                        {item.quotationUpdater.split(" ", [1])}
                      </StyledTableCell>
                      <StyledTableCell>
                        {item.quotationUpdatedAt}
                      </StyledTableCell>
                      <StyledTableCell>{item.quantity}</StyledTableCell>
                      <StyledTableCell>{item.reason}</StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleDownload}
              variant="contained"
              color="primary"
            >
              Download
            </Button>
          </DialogActions>
        </Dialog>
        <ApproveDialog
          approveDialog={approveDialog}
          setApproveDialog={setApproveDialog}
          approveID={approveID}
          fetchDealsData={fetchDealsData}
          notificationID={notificationID}
        />
        <DealViewDialog
          open={dialogOpen}
          deal={currentDeal}
          sum={summary}
          onClose={handleCloseDialog}
          onEditOutcome={handleEditOutcome}
          editedFinalOutcome={editedFinalOutcome}
          setEditedFinalOutcome={setEditedFinalOutcome}
          setLoading={setLoading}
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

export default AllDeals;
