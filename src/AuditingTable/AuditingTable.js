import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Box,
  TextField,
  Typography,
  TablePagination,
  TableSortLabel,
  Menu,
  MenuItem,
  IconButton,
  InputAdornment,
  CircularProgress,
  Avatar,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import AuthService from "../services/AuthService";
import userNotFound from "../Image/useeNotfound.webp";
import AuditingDtsDialog from "./AuditingDtsDialog";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import SearchIcon from "@mui/icons-material/Search";
import Loading from "../Loading/Loading";

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
    padding: "17px",
    backgroundColor: "#fff",
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
  let hash = 70;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    color += ("00" + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2);
  }
  return color;
};

function AuditingTable() {
  const options = [
    "Filtered By",
    "Users",
    "Companies",
    "Contacts",
    "Products",
    "Components",
    "Components list",
    "Deals",
    "Products Main list",
    "Products list",
    "Margin",
    "GeM",
    "Partners",
    "Partner Contacts",
  ];
  const CRMBaseURL = AuthService();

  // const [filteredValue, setFilteredValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState(" ");
  const [auditingDtsOpen, setAuditingDtsOpen] = useState(false);
  const [auditingData, setAuditingData] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [filterName, setFilterName] = useState(options[selectedIndex]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState({});

  const open = Boolean(anchorEl);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = async (e, index) => {
    setSelectedIndex(index);
    setLoading(true);
    setAnchorEl(null);

    setFilterName(options[index]);
    const payload = { newValue: options[index] };

    try {
      const res = await CRMBaseURL.post("audit", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setTableData(res.data?.Data);
      setFilteredData(res.data?.Data);
    } catch (error) {
      console.error("Error posting data: ", error);
    } finally {
      setLoading(false);
    }
    setPage(0);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const payload = { newValue: options[selectedIndex] };

      try {
        const res = await CRMBaseURL.post("audit", payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setTableData(res.data?.Data);
        setFilteredData(res.data?.Data);
      } catch (error) {
        console.error("Error fetching initial data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    const filtered =
      tableData &&
      tableData.filter(
        (row) =>
          row.actionStatus.toLowerCase().includes(value.toLowerCase()) ||
          row.actionBy.toLowerCase().includes(value.toLowerCase()) ||
          row.description.toLowerCase().includes(value.toLowerCase()) ||
          row.actionAt.toLowerCase().includes(value.toLowerCase())
      );
    setFilteredData(filtered);
    setPage(0);
  };

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData =
    filteredData &&
    filteredData.sort((a, b) => {
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

  const handleViewData = async (data) => {
    const values = {
      id: data.actionTableID,
      description: data.description,
    };
    try {
      const res = await CRMBaseURL.post("auditdata", values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const datas = res.data?.data;
      const value = [
        {
          ...(datas[0] || datas),
          actionDescription: data && data.description,
          actionAt: data && data.actionAt,
          actionBy: data && data.actionBy,
        },
      ];
      setAuditingData(value);
      setAuditingDtsOpen(true);
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setBtnLoading((prev) => ({ ...prev, [data.id]: false }));
    }
  };

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
                color: "#5D5FEF", // change to your desired color
                fontSize: "14px", // change to your desired size
              },
            }}
            placeholder="Search here..."
            variant="outlined"
            value={searchValue}
            onChange={handleSearchChange}
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#000",
        }}
      >
        <h3 style={{ marginRight: "44%", color: "#000" }}>
          Audit Table data's
        </h3>
        <div>
          <div>
            <Box
              id="lock-button"
              aria-haspopup="listbox"
              aria-controls="lock-menu"
              sx={{ display: "flex", alignItems: "center" }}
              aria-expanded={open ? "true" : undefined}
              onClick={handleClickListItem}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: "#322E6F",
                  cursor: "pointer",
                }}
              >
                Filter By : {options[selectedIndex]}
              </Typography>
              <IconButton sx={{ fontSize: 20, color: "#322E6F" }}>
                {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </IconButton>
            </Box>
          </div>

          <Menu
            id="lock-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "lock-button",
              role: "listbox",
            }}
          >
            {options.map((option, index) => (
              <MenuItem
                key={option}
                disabled={index === 0}
                selected={index === selectedIndex}
                onClick={(event) => handleMenuItemClick(event, index)}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 500 }} aria-label="customized table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <StyledTableCell>#</StyledTableCell>
              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "actionStatus"}
                  direction={orderBy === "actionStatus" ? order : "asc"}
                  onClick={() => handleSortRequest("actionStatus")}
                >
                  Action Status
                </StyledTableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "actionBy"}
                  direction={orderBy === "actionBy" ? order : "asc"}
                  onClick={() => handleSortRequest("actionBy")}
                >
                  Action By
                </StyledTableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <StyledTableSortLabel
                  active={orderBy === "actionAt"}
                  direction={orderBy === "actionAt" ? order : "asc"}
                  onClick={() => handleSortRequest("actionAt")}
                >
                  Action At
                </StyledTableSortLabel>
              </StyledTableCell>
              <StyledTableCell>Action Description</StyledTableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <Box
              sx={{
                paddingTop: 50,
              }}
            >
              <Loading />
            </Box>
          ) : (
            <TableBody>
              {sortedData && sortedData.length > 0 ? (
                sortedData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#efefef", // Change this to your desired hover color
                        },
                      }}
                    >
                      <StyledTableCell>
                        {page * rowsPerPage + index + 1}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography
                          onClick={() => {
                            handleViewData(row);
                          }}
                          sx={{
                            border:
                              row.actionStatus === "Create"
                                ? "1px solid #00E096 "
                                : row.actionStatus === "Delete"
                                ? "1px solid #EF3838 "
                                : row.actionStatus === "Restored"
                                ? "1px solid #FFCF01"
                                : row.actionStatus === "Update"
                                ? "1px solid #0095FF"
                                : "",
                            color:
                              row.actionStatus === "Create"
                                ? "#00E096"
                                : row.actionStatus === "Delete"
                                ? "#EF3838"
                                : row.actionStatus === "Restored"
                                ? "#FFCF01"
                                : row.actionStatus === "Update"
                                ? "#0095FF"
                                : "",
                            "&:hover": {
                              backgroundColor: btnLoading[row.id]
                                ? ""
                                : row.actionStatus === "Create"
                                ? "#00E096 "
                                : row.actionStatus === "Delete"
                                ? "#EF3838 "
                                : row.actionStatus === "Restored"
                                ? "#FFCF01"
                                : row.actionStatus === "Update"
                                ? "#0095FF"
                                : "",
                              color: "#fff",
                            },
                            padding: "1px 8px 1px 8px",
                            borderRadius: 2,
                            cursor: "pointer",
                            width: 80,
                            textAlign: "center",
                          }}
                        >
                          {btnLoading[row.id] ? (
                            <CircularProgress
                              size={20} // Adjust size as needed
                              sx={{
                                marginTop: "4px",
                                color:
                                  row.actionStatus === "Create"
                                    ? "#00E096"
                                    : row.actionStatus === "Delete"
                                    ? "#EF3838"
                                    : row.actionStatus === "Restored"
                                    ? "#FFCF01"
                                    : row.actionStatus === "Update"
                                    ? "#0095FF"
                                    : "",
                              }}
                            />
                          ) : (
                            row.actionStatus
                          )}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.actionBy ? (
                          <Box display="flex" alignItems="center">
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                marginRight: 1,
                                bgcolor: stringToColor(row.actionBy), // Dynamically generate color
                              }}
                            >
                              <span style={{ fontSize: "12px" }}>
                                {row.actionBy.charAt(0)}{" "}
                              </span>
                              {/* Initial of the company name */}
                            </Avatar>
                            {row.actionBy?.length > 25
                              ? `${row.actionBy.substring(0, 25)}...`
                              : row.actionBy}
                          </Box>
                        ) : (
                          "-"
                        )}
                      </StyledTableCell>
                      <StyledTableCell>{row.actionAt}</StyledTableCell>
                      <StyledTableCell>{row.description}</StyledTableCell>
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
          )}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={filteredData && filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <AuditingDtsDialog
        auditingDtsOpen={auditingDtsOpen}
        setAuditingDtsOpen={setAuditingDtsOpen}
        setAuditingData={setAuditingData}
        auditingData={auditingData}
        filterName={filterName}
      />
    </>
  );
}

export default AuditingTable;
