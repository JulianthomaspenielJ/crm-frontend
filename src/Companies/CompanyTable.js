import React, { useState, useEffect } from "react";
import {
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Box,
  TextField,
  Button,
  Table,
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
import CompanyForm from "./CompanyForm";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import "./Styles.css";
import Loading from "../Loading/Loading";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import IosShareIcon from "@mui/icons-material/IosShare";
import * as XLSX from "xlsx";
import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";
import NearMeIcon from '@mui/icons-material/NearMe';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: "#fff",
    color: "#000",
    fontSize: 14,
    border: "1px solid #fff",
  },
  [`&.${tableCellClasses.body}`]: {
    fontWeight: 500,
    fontSize: 12,
    border: "1px solid #f0f0f0",
  },
}));

const initialVisibleColumns = {
  "Company name": true,
  "Company domain": true,
  City: true,
  Industry: true,
  Sales: true,
  "Annual Revenue": true,
  "No.of branches": true,
  "No.of employees": true,
};

// Styled TableSortLabel component
const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  "&:hover": {
    color: "#884DFF", // pink color for hover
  },
  "&.Mui-active": {
    color: "#884DFF", // pink color for active state
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

function CompanyTable() {
  const CRMBaseURL = AuthService();
  const navigate = useNavigate();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const [openCompanyForm, setOpenCompanyForm] = useState(false);
  const [companyDataList, setCompanyDataList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const [searchByName, setSearchByName] = useState([]); // Keep as array
  const [searchByDomain, setSearchByDomain] = useState([]);
  const [searchByIndustry, setSearchByIndustry] = useState([]);
  const [searchByLocation, setSearchByLocation] = useState([]);
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

  console.log("companyDataList", companyDataList);

  const fetchCompanyData = async () => {
    setLoading(true);

    const ID = storedUserData && `${storedUserData.id}`;
    const values = {
      id: parseInt(ID),
      team: storedUserData && `${storedUserData.team}`,
      role: storedUserData && `${storedUserData.userRole}`,
    };
    try {
      const companyData = await CRMBaseURL.post("getcompanytabledata", values);
      setCompanyDataList(companyData.data?.data);
    } catch (err) {
      console.log("Error occurred", err);
    }
    setLoading(false);
  };

  const exportToExcel = (filteredData) => {
    // Convert the filtered data into a worksheet
    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    // Create a new workbook and add the worksheet to it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FilteredData");

    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, "company_data.xlsx");
  };

  const getCompanyDetails = async (id) => {
    navigate("/dashboard/company_details", { state: { ID: id } });
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

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

  const filters = companyDataList.filter((row) => {
    return (
      (searchByName.length === 0 ||
        searchByName.some((name) =>
          row.companyName.toLowerCase().includes(name.toLowerCase())
        )) &&
      (searchByDomain.length === 0 ||
        searchByDomain.some((domain) =>
          row.domainName.toLowerCase().includes(domain.toLowerCase())
        )) &&
      (searchByIndustry.length === 0 ||
        searchByIndustry.some((industry) =>
          row.industry.toLowerCase().includes(industry.toLowerCase())
        )) &&
      (searchByLocation.length === 0 ||
        searchByLocation.some((location) =>
          row.city.toLowerCase().includes(location.toLowerCase())
        )) &&
      (searchByOwner.length === 0 ||
        searchByOwner.some((owner) =>
          row.createdBy.toLowerCase().includes(owner.toLowerCase())
        ))
    );
  });

  const filteredData =
    companyDataList &&
    companyDataList.filter(
      (company) =>
        company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.companyOwner
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        company.mobile.toString().includes(searchQuery) ||
        company.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const sortedData =
    filters &&
    filters.sort((a, b) => {
      if (orderBy === "companyName") {
        return (
          (a.companyName < b.companyName ? -1 : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "companyOwner") {
        return (
          (a.companyOwner < b.companyOwner ? -1 : 1) *
          (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "industry") {
        return (a.industry < b.industry ? -1 : 1) * (order === "asc" ? 1 : -1);
      } else if (orderBy === "createdBy") {
        return (
          (a.createdBy < b.createdBy ? -1 : 1) * (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "createdAt") {
        return (
          (new Date(a.createdAt) < new Date(b.createdAt) ? -1 : 1) *
          (order === "asc" ? 1 : -1)
        );
      } else if (orderBy === "mobile") {
        return (a.mobile < b.mobile ? -1 : 1) * (order === "asc" ? 1 : -1);
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
            // padding: "15px",
            // float: "right",
            // position: "relative",
            // marginTop: "-70px",
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
              setOpenCompanyForm(true);
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

        <Box display="flex" justifyContent="space-between" mb={2}></Box>

        <TableContainer>
          <Table sx={{ minWidth: 500 }} aria-label="customized table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <StyledTableCell>#</StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "companyName"}
                    direction={orderBy === "companyName" ? order : "asc"}
                    onClick={() => handleRequestSort("companyName")}
                  >
                    Company Name
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "companyOwner"}
                    direction={orderBy === "companyOwner" ? order : "asc"}
                    onClick={() => handleRequestSort("companyOwner")}
                  >
                    Company Domain
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "mobile"}
                    direction={orderBy === "mobile" ? order : "asc"}
                    onClick={() => handleRequestSort("mobile")}
                  >
                    City
                  </StyledTableSortLabel>
                </StyledTableCell>
                {/* <StyledTableCell>City</StyledTableCell> */}
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "industry"}
                    direction={orderBy === "industry" ? order : "asc"}
                    onClick={() => handleRequestSort("industry")}
                  >
                    Industry Type
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "createdBy"}
                    direction={orderBy === "createdBy" ? order : "asc"}
                    onClick={() => handleRequestSort("createdBy")}
                  >
                    Sales Owner
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
                    placeholder="Filter by company name"
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
                    placeholder="Filter by domain"
                    value={searchByDomain}
                    onChange={(e) => {
                      setSearchByDomain(e.target.value.split(","));
                      setPage(0);
                    }}
                    variant="standard"
                    fullWidth
                  />
                </TableCell>

                <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                  <TextField
                    placeholder="Filter by city"
                    value={searchByLocation}
                    onChange={(e) => {
                      setSearchByLocation(e.target.value.split(","));
                      setPage(0);
                    }}
                    variant="standard"
                    fullWidth
                  />
                </TableCell>

                <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                  <TextField
                    placeholder="Filter by Industry"
                    value={searchByIndustry}
                    onChange={(e) => {
                      setSearchByIndustry(e.target.value.split(","));
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
              </TableRow>
            </TableHead>
            <TableBody>
              {filters && filters.length > 0 ? (
                (rowsPerPage > 0
                  ? filters.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filters
                ).map((data, index) => {
                  const reverseSerialNumber =
                    filters.length - (page * rowsPerPage + index);

                  return (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor:
                          data.isNotificationRead === 0 ? "#f0f8ff" : "white",
                        fontWeight:
                          data.isNotificationRead === 0 ? "bold" : "normal",
                        "&:hover": {
                          backgroundColor: "#ffffff1a",
                        },
                      }}
                    >
                      <StyledTableCell
                        
                      >
                        <Typography
                          sx={{
                            fontSize: 12,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <NearMeIcon
                          sx={{
                            color:
                              data.companyLevel === "Gold"
                                ? "#FFD700"
                                : data.companyLevel === "Silver"
                                ? "#C0C0C0"
                                : data.companyLevel === "Bronze"
                                ? "#CD7F32"
                                : "#ccc",
                          }}
                          />
                          {reverseSerialNumber}
                        </Typography>
                      </StyledTableCell>

                      <StyledTableCell
                        sx={{
                          alignItems: "center",
                          color: "#3aa2ef",
                          cursor: "pointer",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                        onClick={() => getCompanyDetails(data.id)}
                      >
                        <Box display="flex" alignItems="center">
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              marginRight: 1,
                              bgcolor: stringToColor(data.companyName),
                            }}
                          >
                            <span style={{ fontSize: "12px" }}>
                              {data.companyName.charAt(0)}{" "}
                            </span>
                          </Avatar>
                          {data.companyName?.length > 20
                            ? `${data.companyName.substring(0, 20)}...`
                            : data.companyName}
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell>{data.domainName}</StyledTableCell>
                      <StyledTableCell>{data.city}</StyledTableCell>
                      <StyledTableCell>{data.industry}</StyledTableCell>
                      <StyledTableCell>
                        {data.createdBy.split(" ", [1])}
                      </StyledTableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <img
                        src={userNotFound}
                        alt="No data found"
                        style={{ width: "150px", height: "150px" }}
                      />
                    </Box>
                    <Typography variant="h6" color="textSecondary">
                      No Data Found
                    </Typography>
                  </TableCell>
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
        {openCompanyForm && (
          <CompanyForm
            openCompanyForm={openCompanyForm}
            setOpenCompanyForm={setOpenCompanyForm}
            fetchCompanyData={fetchCompanyData}
            companyDataList={companyDataList}
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

export default CompanyTable;
