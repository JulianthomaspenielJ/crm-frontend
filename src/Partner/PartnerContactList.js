import React, { useEffect, useState, useMemo } from "react";
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
  Button,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import userNotFound from "../Image/useeNotfound.webp";
import SearchIcon from "@mui/icons-material/Search";
import AuthService from "../services/AuthService";
import ContactForm from "./PartnerContactForm";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    border: "1px solid #fff",
    fontSize: 14,
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

const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  "&:hover": {
    color: "#e02b6a",
  },
  "&.Mui-active": {
    color: "#e02b6a",
  },
}));

function PartnerContactList() {
  const CRMBaseURL = AuthService();
  const navigate = useNavigate();

  // State for managing contact data and form
  const [contactDataList, setContactDataList] = useState([]);
  const [openContactsForm, setOpenContactsForm] = useState(false);

  // State for search, sort, and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    partnerContactName: "",
    partnerName: "",
    email: "",
    mobile: "",
    createdBy: "",
    createdAt: "",
  });

  const handleFilterChange = (field) => (event) => {
    setFilters({ ...filters, [field]: event.target.value });
    setPage(0)
  };

  // Fetch contact data from API
  const fetchContactData = async () => {
    setLoading(true);
    try {
      const contactData = await CRMBaseURL.get("getcontactpersonlist");
      setContactDataList(contactData.data.contacts || []);
    } catch (err) {
      console.error("Error occurred", err);
    }
    setLoading(false);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchContactData();
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

  const filteredDatas = contactDataList.filter((item) => {
    return (
      (!filters?.partnerContactName ||
        item?.contactPersonName
          .toLowerCase()
          .includes(filters?.partnerContactName.toLowerCase())) &&
      (!filters.partnerName ||
        item.partnerName
          .toLowerCase()
          .includes(filters.partnerName.toLowerCase())) &&
      (!filters.email ||
        item.email.toLowerCase().includes(filters.email.toLowerCase())) &&
      (!filters.mobile ||
        item.mobile.toLowerCase().includes(filters.mobile.toLowerCase())) &&
      (!filters.createdBy ||
        item.createdBy
          .toLowerCase()
          .includes(filters.createdBy.toLowerCase())) &&
      (!filters.createdAt ||
        new Date(item.createdAt)
          .toLocaleDateString("en-GB")
          .includes(filters.createdAt))
    );
  });

  // Filter and sort data
  const filteredData = useMemo(
    () =>
      contactDataList.filter((contact) => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
          contact.contactPersonName.toLowerCase().includes(lowerCaseQuery) ||
          contact.email.toLowerCase().includes(lowerCaseQuery) ||
          contact.createdBy.toLowerCase().includes(lowerCaseQuery)
        );
      }),
    [contactDataList, searchQuery]
  );

  const sortedData = useMemo(
    () =>
      filteredDatas?.sort((a, b) => {
        const orderMultiplier = order === "asc" ? 1 : -1;
        const compare = (aVal, bVal) =>
          aVal < bVal ? -1 : aVal > bVal ? 1 : 0;

        switch (orderBy) {
          case "name":
            return (
              compare(a.contactPersonName, b.contactPersonName) *
              orderMultiplier
            );
          case "partner":
            return compare(a.partnerName, b.partnerName) * orderMultiplier;
          case "email":
            return compare(a.email, b.email) * orderMultiplier;
          case "mobile":
            return compare(a.mobile, b.mobile) * orderMultiplier;
          case "createdBy":
            return compare(a.createdBy, b.createdBy) * orderMultiplier;
          case "createdAt":
            return (
              compare(new Date(a.createdAt), new Date(b.createdAt)) *
              orderMultiplier
            );
          default:
            return 0;
        }
      }),
    [filteredData, order, orderBy]
  );

  if (!loading) {
    return (
      <>
        <Box display="flex" justifyContent="space-between">
          <TextField
            sx={{
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
        </Box>
        <Box
          sx={{
            display: "flex",
            color: "#000",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3 style={{ marginRight: "50%", color: "#000" }}>
            Contacts ({contactDataList && contactDataList.length})
          </h3>
          <div
          // className="icon_container"
          >
            <Button
              startIcon={<AddIcon />}
              // className="icon_container"
              onClick={() => setOpenContactsForm(true)}
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
          </div>
        </Box>
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
                    active={orderBy === "partner"}
                    direction={orderBy === "partner" ? order : "asc"}
                    onClick={() => handleRequestSort("partner")}
                  >
                    Partner Name
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "email"}
                    direction={orderBy === "email" ? order : "asc"}
                    onClick={() => handleRequestSort("email")}
                  >
                    Email
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "mobile"}
                    direction={orderBy === "mobile" ? order : "asc"}
                    onClick={() => handleRequestSort("mobile")}
                  >
                    Mobile
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "createdBy"}
                    direction={orderBy === "createdBy" ? order : "asc"}
                    onClick={() => handleRequestSort("createdBy")}
                  >
                    Created By
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
            </TableHead>

            <TableBody>
              <TableRow>
                <StyledTableCell>
                  <FilterAltIcon
                    style={{ color: "#0767e6", marginLeft: "-4px" }}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <TextField
                    variant="standard"
                    placeholder="Search"
                    value={filters.partnerContactName}
                    onChange={handleFilterChange("partnerContactName")}
                    fullWidth
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <TextField
                    variant="standard"
                    placeholder="Search"
                    value={filters.partnerName}
                    onChange={handleFilterChange("partnerName")}
                    fullWidth
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <TextField
                    variant="standard"
                    placeholder="Search"
                    value={filters.email}
                    onChange={handleFilterChange("email")}
                    fullWidth
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <TextField
                    variant="standard"
                    placeholder="Search"
                    value={filters.mobile}
                    onChange={handleFilterChange("mobile")}
                    fullWidth
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <TextField
                    variant="standard"
                    placeholder="Search"
                    value={filters.createdBy}
                    onChange={handleFilterChange("createdBy")}
                    fullWidth
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <TextField
                    variant="standard"
                    placeholder="Search"
                    value={filters.createdAt}
                    onChange={handleFilterChange("createdAt")}
                    fullWidth
                  />
                </StyledTableCell>
              </TableRow>
              {filteredDatas?.length > 0 ? (
                filteredDatas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((data, i) => (
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
                      >
                        <Box display="flex" alignItems="center">
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              marginRight: 1,
                              bgcolor: stringToColor(data.contactPersonName), // Dynamically generate color
                            }}
                          >
                            <span style={{ fontSize: "12px" }}>
                              {data.contactPersonName.charAt(0)}{" "}
                            </span>
                            {/* Initial of the company name */}
                          </Avatar>
                          {data.contactPersonName?.length > 25
                            ? `${data.contactPersonName.substring(0, 25)}...`
                            : data.contactPersonName}
                        </Box>
                        {/* {data.contactPersonName} */}
                      </StyledTableCell>
                      <StyledTableCell>{data.partnerName}</StyledTableCell>
                      <StyledTableCell>{data.email}</StyledTableCell>
                      <StyledTableCell>{data.mobile}</StyledTableCell>
                      <StyledTableCell>{data.createdBy}</StyledTableCell>
                      <StyledTableCell>
                        {new Date(data.createdAt).toLocaleDateString("en-GB")}
                      </StyledTableCell>
                    </TableRow>
                  ))
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
      </>
    );
  } else {
    return <Loading />;
  }
}

export default PartnerContactList;
