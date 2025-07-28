import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Loading from "../../Loading/Loading";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";

import AuthService from "../../services/AuthService";
import {
  Tooltip,
  TablePagination,
  TextField,
  TableSortLabel,
  Typography,
  Box,
  IconButton,
  Avatar,
  Popover,
  List,
  ListItem,
  Switch,
  Button,
  ListItemText,
} from "@mui/material";
import ReferenceDialog from "./ReferenceDialog";
import ReferenceDtsDialog from "./ReferenceDtsDialog";
import userNotFound from "../../Image/useeNotfound.webp";
import ReferenceEditDialog from "./ReferenceEditDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PricingDeleteDialog from "./PricingDeleteDialog";
import DealViewDialog from "../../Deals/NewDeal/DealViewDialog";
import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    border: "1px solid #fff",
    color: "#000",
    fontSize: 14,
    padding: "15px 10px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontWeight: 500,
    fontSize: 12,
    padding: "15px",
    border: "1px solid #f0f0f0",
  },
}));

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

const stringToColor = (string) => {
  let hash = 100;
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
  "Model No": true,
  "Ticket No": true,
  Customer: true,
  "Created by": true,
  "Created At": true,
};

function ReferenceList() {
  const CRMBaseURL = AuthService();
  const navigate = useNavigate();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const [referenceDialog, setReferenceDialog] = useState(false);
  const [referenceDtsDialog, setReferenceDtsDialog] = useState(false);
  const [detailedProductData, setDetailedProductData] = useState(null);
  const [referenceData, setReferenceData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState(" ");
  const [orderBy, setOrderBy] = useState("");
  const [referenceEditDialog, setReferenceEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dealsData, setDealsData] = useState("");
  const [currentDeal, setCurrentDeal] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editedFinalOutcome, setEditedFinalOutcome] = useState("");
  const [filters, setFilters] = useState({
    referenceName: "",
    ticketNo: "",
    customerName: "",
    createdBy: "",
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

  const handleFilterChange = (field) => (event) => {
    setFilters({ ...filters, [field]: event.target.value });
    setPage(0);
  };

  const handleOpenDetails = async (id, eventName) => {
    try {
      const response = await CRMBaseURL.post("postproduct", { id });
      const detailedData = response.data.Data[0];
      setDetailedProductData({ ...detailedData, referenceID: id });

      if (eventName === "edit") {
        setReferenceEditDialog(true);
      } else if (eventName === "view") {
        setReferenceDtsDialog(true);
      } else if (eventName === "delete") {
        setOpenDeleteDialog(true);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleEditOutcome = async () => {
    const updatedDeals = dealsData.map((deal) =>
      deal.id === currentDeal.id
        ? { ...deal, finalOutCome: editedFinalOutcome }
        : deal
    );

    setDealsData(updatedDeals);
    setCurrentDeal({ ...currentDeal, finalOutCome: editedFinalOutcome });

    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const values = {
      id: currentDeal.id,
      finalOutCome: editedFinalOutcome,
      editedBy: storedUserData
        ? `${storedUserData.userName} (${storedUserData.email})`
        : undefined,
    };

    try {
      const res = await CRMBaseURL.post("updatefinaloutcome", values);
    } catch (error) {
      console.error("Error updating final outcome", error);
    }
  };

  const handleOpenDealDetails = async (deal) => {
    console.log("deal",deal)
    if (deal) {
      if (deal.ticketNo?.toLowerCase().startsWith('hd')) {
        console.log('deal');
        try {
          const res = await CRMBaseURL.post("dealdetaileddata", { id: deal.dealID });
          const data = res.data?.data;
          setCurrentDeal(data);
          setDialogOpen(true);
        } catch (error) {
          console.error("Error fetching deal details", error);
        }
      } else if (deal.ticketNo?.toLowerCase().startsWith('hg')) {
        navigate("/dashboard/gem_details", {
          state: { gemID:deal?.gemID, type: "My Gem" },
        });
      } 
    
    }
  };

  const fetch = async () => {
    setLoading(true);
    try {
      const response = await CRMBaseURL.get("/getproduct");
      const data = response.data.data;
      setReferenceData(data);
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

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // const filteredData =
  //   referenceData &&
  //   referenceData.filter(
  //     (reference) =>
  //       reference?.referenceName
  //         .toLowerCase()
  //         .includes(searchQuery.toLowerCase()) ||
  //       reference?.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       reference?.customerName
  //         .toLowerCase()
  //         .includes(searchQuery.toLowerCase()) ||
  //       reference?.CreatedAt.toLowerCase().includes(
  //         searchQuery.toLowerCase()
  //       ) ||
  //       reference?.CreatedBy.toLowerCase().includes(searchQuery.toLowerCase())
  //   );

  const filteredDatas = referenceData.filter((item) => {
    return (
      (!filters?.referenceName ||
        item?.referenceName
          .toLowerCase()
          .includes(filters?.referenceName.toLowerCase())) &&
      (!filters.ticketNo ||
        item.ticketNo.toLowerCase().includes(filters.ticketNo.toLowerCase())) &&
      (!filters.customerName ||
        item.customerName
          .toLowerCase()
          .includes(filters.customerName.toLowerCase())) &&
      (!filters.createdBy ||
        item.CreatedBy.toLowerCase().includes(
          filters.createdBy.toLowerCase()
        )) &&
      (!filters.createdAt ||
        item?.CreatedAt.toString().toLowerCase().includes(filters.createdAt))
    );
  });

  const sortedData =
    filteredDatas &&
    filteredDatas.sort((a, b) => {
      const compareA =
        typeof a[orderBy] === "string" ? a[orderBy].toLowerCase() : a[orderBy];
      const compareB =
        typeof b[orderBy] === "string" ? b[orderBy].toLowerCase() : b[orderBy];
      if (compareA < compareB) {
        return order === "asc" ? -1 : 1;
      }
      if (compareA > compareB) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!loading) {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            // marginBottom: 10,
          }}
        >
          {/* <TextField
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
          /> */}
        </div>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#000",
          }}
        >
          <h3 style={{ marginRight: "40%", color: "#000" }}>
            Pricing Screen {`(${referenceData ? referenceData.length : 0})`}
          </h3>
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
          {/* <div
          className="icon_container"
          onClick={() => {
            setReferenceDialog(true);
          }}
        >
          <AddIcon />
        </div> */}
        </Box>
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <StyledTableCell>#</StyledTableCell>
                {showColumnsData["Model No"] && (
                  <StyledTableCell>
                    <Tooltip title="Sort reference name" arrow>
                      <StyledTableSortLabel
                        active={orderBy === "referenceName"}
                        direction={orderBy === "referenceName" ? order : "asc"}
                        onClick={() => handleRequestSort("referenceName")}
                      >
                        Model Number
                      </StyledTableSortLabel>
                    </Tooltip>
                  </StyledTableCell>
                )}
                {showColumnsData["Ticket No"] && (
                  <StyledTableCell>
                    <Tooltip title="Sort reference name" arrow>
                      <StyledTableSortLabel
                        active={orderBy === "ticketNo"}
                        direction={orderBy === "ticketNo" ? order : "asc"}
                        onClick={() => handleRequestSort("ticketNo")}
                      >
                        Ticket Number
                      </StyledTableSortLabel>
                    </Tooltip>
                  </StyledTableCell>
                )}
                {showColumnsData["Customer"] && (
                  <StyledTableCell>
                    <StyledTableSortLabel
                      active={orderBy === "customerName"}
                      direction={orderBy === "customerName" ? order : "asc"}
                      onClick={() => handleRequestSort("customerName")}
                    >
                      Customer
                    </StyledTableSortLabel>
                  </StyledTableCell>
                )}
                {showColumnsData["Created by"] && (
                  <StyledTableCell>
                    <StyledTableSortLabel
                      active={orderBy === "CreatedBy"}
                      direction={orderBy === "CreatedBy" ? order : "asc"}
                      onClick={() => handleRequestSort("CreatedBy")}
                    >
                      Created By
                    </StyledTableSortLabel>
                  </StyledTableCell>
                )}
                {showColumnsData["Created At"] && (
                  <StyledTableCell>
                    <StyledTableSortLabel
                      active={orderBy === "CreatedAt"}
                      direction={orderBy === "CreatedAt" ? order : "asc"}
                      onClick={() => handleRequestSort("CreatedAt")}
                    >
                      Created At
                    </StyledTableSortLabel>
                  </StyledTableCell>
                )}
                <StyledTableCell style={{ paddingLeft: "60px" }}>
                  Action
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <StyledTableCell>
                  <FilterAltIcon
                    style={{ color: "#0767e6", marginLeft: "-4px" }}
                  />
                </StyledTableCell>

                {showColumnsData["Model No"] && (
                  <StyledTableCell>
                    <TextField
                      variant="standard"
                      placeholder="Search"
                      value={filters.referenceName}
                      onChange={handleFilterChange("referenceName")}
                      fullWidth
                    />
                  </StyledTableCell>
                )}
                {showColumnsData["Ticket No"] && (
                  <StyledTableCell>
                    <TextField
                      variant="standard"
                      placeholder="Search"
                      value={filters.ticketNo}
                      onChange={handleFilterChange("ticketNo")}
                      fullWidth
                    />
                  </StyledTableCell>
                )}
                {showColumnsData["Customer"] && (
                  <StyledTableCell>
                    <TextField
                      variant="standard"
                      placeholder="Search"
                      value={filters.customerName}
                      onChange={handleFilterChange("customerName")}
                      fullWidth
                    />
                  </StyledTableCell>
                )}
                {showColumnsData["Created by"] && (
                  <StyledTableCell>
                    <TextField
                      variant="standard"
                      placeholder="Search"
                      value={filters.createdBy}
                      onChange={handleFilterChange("createdBy")}
                      fullWidth
                    />
                  </StyledTableCell>
                )}
                {showColumnsData["Created At"] && (
                  <StyledTableCell>
                    <TextField
                      variant="standard"
                      placeholder="Search"
                      value={filters.createdAt}
                      onChange={handleFilterChange("createdAt")}
                      fullWidth
                    />
                  </StyledTableCell>
                )}
                <StyledTableCell></StyledTableCell>
              </TableRow>
              {filteredDatas && filteredDatas.length > 0 ? (
                filteredDatas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const reverseSerialNumber =
                      filteredDatas.length - (page * rowsPerPage + index);
                    return (
                      <TableRow key={index}>
                        <StyledTableCell>{reverseSerialNumber}</StyledTableCell>
                        {showColumnsData["Model No"] && (
                          <StyledTableCell>
                            <Typography
                              sx={{
                                color: "#367cee",
                                cursor: "pointer",
                                fontSize: 12,
                                fontWeight: 500,
                                "&:hover": {
                                  textDecoration: "underline",
                                },
                              }}
                              onClick={() => handleOpenDetails(row.id, "view")}
                            >
                              {row.referenceName}
                            </Typography>
                          </StyledTableCell>
                        )}
                        {showColumnsData["Ticket No"] && (
                          <StyledTableCell
                            sx={{
                              color: "#3aa2ef",
                              cursor: "pointer",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                            onClick={() => handleOpenDealDetails(row)}
                          >
                            {row.ticketNo}
                          </StyledTableCell>
                        )}
                        {showColumnsData["Customer"] && (
                          <StyledTableCell>
                            <Box display="flex" alignItems="center">
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  marginRight: 1,
                                  bgcolor: stringToColor(row.customerName), // Dynamically generate color
                                }}
                              >
                                <span style={{ fontSize: "12px" }}>
                                  {row.customerName.charAt(0)}{" "}
                                </span>
                                {/* Initial of the company name */}
                              </Avatar>
                              {row.customerName?.length > 25
                                ? `${row.customerName.substring(0, 25)}...`
                                : row.customerName}
                            </Box>
                          </StyledTableCell>
                        )}
                        {showColumnsData["Created by"] && (
                          <StyledTableCell>
                            {row.CreatedBy.split(" ")[0]}
                          </StyledTableCell>
                        )}
                        {showColumnsData["Created At"] && (
                          <StyledTableCell>{row.CreatedAt}</StyledTableCell>
                        )}
                        <StyledTableCell>
                          <Box sx={{ display: "flex", gap: 2 }}>
                            <Tooltip title="View Details">
                              {/* <Typography
                            onClick={() => handleOpenDetails(row.id, "view")}
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
                          </Typography> */}
                              {/* <IconButton
                              onClick={() => handleOpenDetails(row.id, "view")}
                            >
                              <VisibilityIcon sx={{ color: "#2196f3c4" }} />
                            </IconButton> */}
                            </Tooltip>
                            {storedUserData &&
                              (storedUserData.userRole === "Manager" ||
                                storedUserData.userRole === "Admin" ||
                                storedUserData.userRole === "Super Admin") && (
                                <>
                                  <Tooltip title="Edit">
                                    {/*\<Typography
                                  onClick={() =>
                                    handleOpenDetails(row.id, "edit")
                                  }
                                  sx={{
                                    border: "1px solid #00E096",
                                    color: "#00E096",
                                    "&:hover": {
                                      backgroundColor: "#00E096",

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
                                  Edit
                                </Typography> */}
                                    <IconButton
                                      onClick={() =>
                                        handleOpenDetails(row.id, "edit")
                                      }
                                    >
                                      <EditIcon sx={{ color: "#0b9366f7" }} />
                                    </IconButton>
                                  </Tooltip>

                                  <Tooltip title="Delete">
                                    <IconButton
                                      onClick={() =>
                                        handleOpenDetails(row.id, "delete")
                                      }
                                    >
                                      <DeleteIcon color="error" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                          </Box>
                          {/* //<RemoveRedEyeIcon color="warning" /> */}
                        </StyledTableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={6}>
                    <img
                      src={userNotFound}
                      style={{ width: 200, height: 200 }}
                      alt="User not found"
                    />
                    <Typography>No data found</Typography>
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

        <ReferenceDialog
          setReferenceDialog={setReferenceDialog}
          referenceDialog={referenceDialog}
          fetch={fetch}
        />

        <ReferenceDtsDialog
          setReferenceDtsDialog={setReferenceDtsDialog}
          referenceDtsDialog={referenceDtsDialog}
          detailedProductData={detailedProductData}
        />

        <ReferenceEditDialog
          setReferenceEditDialog={setReferenceEditDialog}
          referenceEditDialog={referenceEditDialog}
          detailedProductData={detailedProductData}
        />

        <PricingDeleteDialog
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          detailedProductData={detailedProductData}
          fetch={fetch}
        />
        <DealViewDialog
          open={dialogOpen}
          deal={currentDeal}
          onClose={handleCloseDialog}
          onEditOutcome={handleEditOutcome}
          editedFinalOutcome={editedFinalOutcome}
          setEditedFinalOutcome={setEditedFinalOutcome}
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

export default ReferenceList;
