import React, { useEffect, useState } from "react";
import {
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TablePagination,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import userNotFound from "../../Image/useeNotfound.webp";
import SearchIcon from "@mui/icons-material/Search";
import AuthService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import DealViewDialog from "../NewDeal/DealViewDialog";
import ChatDialog from "../AllDeals/ChatScreen";
import dayjs from "dayjs";

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


const styles = {
  flagLabel: {
    color: "white",
    fontSize: "14px",
    padding: "3px 30px 3px 5px",
    clipPath: "polygon(100% 0%, 75% 50%, 100% 100%, 0 100%, 0% 50%, 0 1%)",
    fontFamily: "Arial, sans-serif",
    border: "none", // Add border if needed
    cursor: "pointer",
  },
}

function QuotationUploadedScreen({setLoading}) {
    const CRMBaseURL = AuthService();
    const navigate = useNavigate();
  
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
    const [editedFinalOutcome, setEditedFinalOutcome] = useState("");
  
    const handleGetViewAllData = async (deal) => {
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
  
    const handleEditOutcome = async () => {
      const updatedDeals = dealDataList.map((deal) =>
        deal.id === currentDeal.id
          ? { ...deal, finalOutCome: editedFinalOutcome }
          : deal
      );
  
      setDealDataList(updatedDeals);
      setCurrentDeal({ ...currentDeal, finalOutCome: editedFinalOutcome });
  
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      const values = {
        id: currentDeal.id,
        finalOutCome: editedFinalOutcome,
        editedBy: storedUserData
          ? `${storedUserData.userName} (${storedUserData.email})`
          : undefined,
      };
      const res = await CRMBaseURL.post("updatefinaloutcome", values)
  
      setDialogOpen(false);
    };
  
    const handleCloseDialog = () => {
      setDialogOpen(false);
    };
  
    const fetchDealsData = async () => {
      try {
        const dealData = await CRMBaseURL.get("getuplodeddeal");
        setDealDataList(dealData.data?.data || []);
      } catch (err) {
        console.log("Error occurred", err);
      }
    };
  
    useEffect(() => {
      fetchDealsData();
    }, []);
  
    const getContactDetails = (id) => {
      navigate("/dashboard/contact_details", {
        state: { ID: id },
      });
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
      filteredData &&
      filteredData.sort((a, b) => {
        if (orderBy === "Contact") {
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
        }
        return 0;
      });
  
    return (
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
            Uploaded Quotation {`(${dealDataList ? dealDataList.length : 0})`}
          </h3>
          {/* <div
            className="icon_container"
            onClick={() => {}}
          >
            <AddIcon />
          </div> */}
        </Box>
        <TableContainer className="table_container">
          <Table sx={{ minWidth: 500 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>#</StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "Contact"}
                    direction={orderBy === "Contact" ? order : "asc"}
                    onClick={() => handleRequestSort("Contact")}
                  >
                    Contact
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "priority"}
                    direction={orderBy === "priority" ? order : "asc"}
                    onClick={() => handleRequestSort("priority")}
                  >
                    Priority
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "productType"}
                    direction={orderBy === "productType" ? order : "asc"}
                    onClick={() => handleRequestSort("productType")}
                  >
                    Product Type
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "quantity"}
                    direction={orderBy === "quantity" ? order : "asc"}
                    onClick={() => handleRequestSort("quantity")}
                  >
                    Quantity
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "dealOwner"}
                    direction={orderBy === "dealOwner" ? order : "asc"}
                    onClick={() => handleRequestSort("dealOwner")}
                  >
                    Deal Owner
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "updater"}
                    direction={orderBy === "updater" ? order : "asc"}
                    onClick={() => handleRequestSort("updater")}
                  >
                    Quotation Updater
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? order : "asc"}
                    onClick={() => handleRequestSort("status")}
                  >
                    Status
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
                <StyledTableCell>Actions</StyledTableCell>
                <StyledTableCell>Talk</StyledTableCell>
              </TableRow>
            </TableHead>
  
            <TableBody>
              {sortedData && sortedData.length > 0 ? (
                sortedData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((data, i) => {
                     // Calculate the difference in days between today and the approximate closing date
                  const today = dayjs();
                  const dueDate = dayjs(data.approximateClosingDate);
                  const daysDifference = dueDate.diff(today, "day");
                  const weeksDifference = dueDate.diff(today, "week");
                  const CloseDifference = today.diff(dueDate, 'day');

                  // Define background color based on the difference in weeks
                  let priorityColor = "";
                  if (weeksDifference > 3) {
                    priorityColor = "green"; // More than 3 weeks difference
                  } else if (weeksDifference >= 2 && weeksDifference <= 3) {
                    priorityColor = "orange"; // 2 to 3 weeks difference
                  } else if (weeksDifference <= 1 && daysDifference > 0) {
                    priorityColor = "#385680"; // 1 week or less
                  } else if (dueDate.isBefore(today)) {
                    priorityColor = "#ff0404cc"; // Due date has passed
                  }
                    return(
                    <TableRow key={data.id}>
                      <StyledTableCell>{i + 1}</StyledTableCell>
                      <StyledTableCell
                        sx={{
                          color: "#3aa2ef",
                          cursor: "pointer",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                        onClick={() => {
                          getContactDetails(data.contactID);
                        }}
                      >
                        {data.companyName}
                      </StyledTableCell>
                      <StyledTableCell >
                        <Box sx={{display:"flex",alignItems:"center"}}>
                        <Box
                          sx={{
                            ...styles.flagLabel,
                            backgroundColor: priorityColor, // Use the priority color dynamically
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 16, // Adjust size for a bigger dot
                              height: 16, // Adjust size for a bigger dot
                              border:"1px solid #fff",
                              backgroundColor:
                                data.priority === "High"
                                  ? "#f0a000"
                                  : data.priority === "Normal"
                                  ? "#7a7a7a"
                                  : data.priority === "Low"
                                  ? "#905027"
                                  : "", // Use dynamic color based on priority
                              borderRadius: "50%", // Makes it a circle
                              display: "inline-block", // Keeps it inline
                            }}
                          />
                         {`${daysDifference} days`|| "-"}
                          {/* {daysDifference > 0 ? `${daysDifference} days` : "closed"} */}
                        </Box>
                        {CloseDifference || "-"}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>{data.productType}</StyledTableCell>
                      <StyledTableCell>{data.quantity} Nos</StyledTableCell>
                      <StyledTableCell>{data.dealOwnerName}</StyledTableCell>
                      <StyledTableCell>{data.quotationUpdaterName.split(' ')[0]}</StyledTableCell>
                      <StyledTableCell>{data.status}</StyledTableCell>
                      <StyledTableCell>{data.createdAt}</StyledTableCell>
                      <StyledTableCell>
                        {/* Update or remove if no actions needed */}
                        <Typography
                          sx={{
                            border: "1px solid #00E096 ",
                            color: "#00E096",
                            "&:hover": {
                              backgroundColor: "#00E096 ",
                              color: "#fff",
                            },
                            padding: "1px 8px 1px 8px",
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
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography
                          onClick={() => {
                            handleChat(data.id);
                          }}
                        >
                          <ChatIcon
                            sx={{ cursor: "pointer", color: "#00E096" }}
                          />
                        </Typography>
                      </StyledTableCell>
                    </TableRow>
                  )})
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
  
        <DealViewDialog
          open={dialogOpen}
          deal={currentDeal}
          onClose={handleCloseDialog}
          onEditOutcome={handleEditOutcome}
          fetchChatData={fetchChatData}
          editedFinalOutcome={editedFinalOutcome}
          setEditedFinalOutcome={setEditedFinalOutcome}
          setLoading={setLoading} 
        />
      </>
    );
  }
  
export default QuotationUploadedScreen
