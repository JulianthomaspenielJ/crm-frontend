import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Button,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import userNotFound from "../Image/useeNotfound.webp";
import AuthService from "../services/AuthService";
import ContactForm from "./PartnerForm";
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

const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  "&:hover": {
    color: "#e02b6a",
  },
  "&.Mui-active": {
    color: "#e02b6a",
  },
}));

const PartnerList = () => {
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
    partner: "",
    authCode: "",
    areaCovered: "",
    createdBy: "",
    createdAt: "",
  });

  const handleFilterChange = (field) => (event) => {
    setFilters({ ...filters, [field]: event.target.value });
    setPage(0)
  };

  const filteredDatas = contactDataList.filter((item) => {
    return (
      (!filters.partner ||
        item.partner.toLowerCase().includes(filters.partner.toLowerCase())) &&
      (!filters.authCode ||
        item.authCode.toLowerCase().includes(filters.authCode.toLowerCase())) &&
      (!filters.areaCovered ||
        item.areaCovered
          .toLowerCase()
          .includes(filters.areaCovered.toLowerCase())) &&
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
  // Fetch contact data from API
  const fetchContactData = async () => {
    setLoading(true);
    try {
      const contactData = await CRMBaseURL.get("getpartner");
      setContactDataList(contactData.data?.partners || []);
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
  const handleSearchQueryChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  // Handle sort request
  const handleRequestSort = useCallback(
    (property) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    },
    [order, orderBy]
  );

  // Handle page change
  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Filter and sort data
  const filteredData = useMemo(
    () =>
      contactDataList.filter((contact) => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
          contact.partner.toLowerCase().includes(lowerCaseQuery) ||
          contact.authCode.toLowerCase().includes(lowerCaseQuery) ||
          contact.areaCovered.toString().includes(searchQuery)
        );
      }),
    [contactDataList, searchQuery]
  );

  const sortedData = useMemo(
    () =>
      filteredDatas?.sort((a, b) => {
        const orderMultiplier = order === "asc" ? 1 : -1;
        if (orderBy === "partner")
          return (a.partner < b.partner ? -1 : 1) * orderMultiplier;
        if (orderBy === "authCode")
          return (a.authCode < b.authCode ? -1 : 1) * orderMultiplier;
        if (orderBy === "areaCovered")
          return (a.areaCovered < b.areaCovered ? -1 : 1) * orderMultiplier;
        if (orderBy === "createdBy")
          return (a.createdBy < b.createdBy ? -1 : 1) * orderMultiplier;
        if (orderBy === "createdAt")
          return (
            (new Date(a.createdAt) < new Date(b.createdAt) ? -1 : 1) *
            orderMultiplier
          );
        return 0;
      }),
    [filteredData, order, orderBy]
  );

  // Function to handle partner name click
  const handlePartnerClick = async (partner) => {
    const id = partner.id;
    navigate("/dashboard/partner_details", { state: { ID: id } });
  };
  if (!loading) {
    return (
      <>
        {/* <Box display="flex" justifyContent="space-between" mb={2}>
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
      </Box> */}
        <Box
          sx={{
            display: "flex",
            color: "#000",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h4 style={{ marginRight: "50%", color: "#000" }}>
            Partners ({contactDataList.length})
          </h4>
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
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <StyledTableCell>#</StyledTableCell>
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
                    active={orderBy === "authCode"}
                    direction={orderBy === "authCode" ? order : "asc"}
                    onClick={() => handleRequestSort("authCode")}
                  >
                    Auth Code
                  </StyledTableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTableSortLabel
                    active={orderBy === "areaCovered"}
                    direction={orderBy === "areaCovered" ? order : "asc"}
                    onClick={() => handleRequestSort("areaCovered")}
                  >
                    Area Covered
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
              <TableRow sx={{ backgroundColor: "#fff" }}>
                <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                  <FilterAltIcon
                    style={{ color: "#0767e6", marginLeft: "-4px" }}
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                  <TextField
                    variant="standard"
                    placeholder="Search"
                    value={filters.partner}
                    onChange={handleFilterChange("partner")}
                    fullWidth
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                  <TextField
                    variant="standard"
                    placeholder="Search"
                    value={filters.authCode}
                    onChange={handleFilterChange("authCode")}
                    fullWidth
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                  <TextField
                    variant="standard"
                    placeholder="Search"
                    value={filters.areaCovered}
                    onChange={handleFilterChange("areaCovered")}
                    fullWidth
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #f0f0f0" }}>
                  <TextField
                    variant="standard"
                    placeholder="Search"
                    value={filters.createdBy}
                    onChange={handleFilterChange("createdBy")}
                    fullWidth
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #f0f0f0" }}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredDatas.length > 0 ? (
                filteredDatas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((data, i) => {
                    const reverseIndex =
                      filteredDatas.length - (page * rowsPerPage + i); // Calculate reverse S.No
                    return (
                      <TableRow key={data.id}>
                        <StyledTableCell>{reverseIndex}</StyledTableCell>{" "}
                        {/* Use reverse index */}
                        <StyledTableCell
                          sx={{
                            color: "#3aa2ef",
                            cursor: "pointer",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                          onClick={() => handlePartnerClick(data)} // Handle partner name click
                        >
                          <Box display="flex" alignItems="center">
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                marginRight: 1,
                                bgcolor: stringToColor(data.partner), // Dynamically generate color
                              }}
                            >
                              <span style={{ fontSize: "12px" }}>
                                {data.partner.charAt(0)}{" "}
                              </span>
                              {/* Initial of the company name */}
                            </Avatar>
                            {data.partner?.length > 25
                              ? `${data.partner.substring(0, 25)}...`
                              : data.partner}
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>{data.authCode}</StyledTableCell>
                        <StyledTableCell>{data.areaCovered}</StyledTableCell>
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
        {/* <PartnerDetailsDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        partnerData={selectedPartner}
        contacts={selectedPartner.contacts}
        gems={selectedPartner.gem}
      /> */}
      </>
    );
  } else {
    return <Loading />;
  }
};

export default PartnerList;
