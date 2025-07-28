import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, List, ListItem, ListItemText, Grid, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AuthService from '../services/AuthService';

function PricingScreen() {
  const [components, setComponents] = useState([]);
  const [options, setOptions] = useState({
    processor: [],
    motherboard: [],
    ram: [],
    storage: [],
    smps: [],
    monitor: [],
    keyboardMouse: [],
    os: [],
    chassis: [],
    lan: [],
    wifi: [],
    dvdDriver: [],
    graphics: [],
    cooler: []
  });
  const [openDialog, setOpenDialog] = useState(null);
  const [selections, setSelections] = useState({
    processor: '',
    motherboard: '',
    ram: '',
    storage: '',
    smps: '',
    monitor: '',
    keyboardMouse: '',
    os: '',
    chassis: '',
    lan: '',
    wifi: '',
    dvdDriver: '',
    graphics: '',
    cooler: ''
  });
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [currentField, setCurrentField] = useState('');
  const [prices, setPrices] = useState({
    processor: 0,
    motherboard: 0,
    ram: 0,
    storage: 0,
    smps: 0,
    monitor: 0,
    keyboardMouse: 0,
    os: 0,
    chassis: 0,
    lan: 0,
    wifi: 0,
    dvdDriver: 0,
    graphics: 0,
    cooler: 0
  });
  const [descriptions, setDescriptions] = useState({
    processor: '',
    motherboard: '',
    ram: '',
    storage: '',
    smps: '',
    monitor: '',
    keyboardMouse: '',
    os: '',
    chassis: '',
    lan: '',
    wifi: '',
    dvdDriver: '',
    graphics: '',
    cooler: ''
  });
  const [quantities, setQuantities] = useState({
    processor: 1,
    motherboard: 1,
    ram: 1,
    storage: 1,
    smps: 1,
    monitor: 1,
    keyboardMouse: 1,
    os: 1,
    chassis: 1,
    lan: 1,
    wifi: 1,
    dvdDriver: 1,
    graphics: 1,
    cooler: 1
  });

  const CRMBaseURL = AuthService();

  const fetchComponents = async () => {
    try {
      const response = await CRMBaseURL.get("getcomponentlist");
      const userData = response.data.components;
      setComponents(userData);

      const initialOptions = {
        processor: userData.filter(component => component.componentName === "Processor").map(component => component.description),
        motherboard: userData.filter(component => component.componentName === "MotherBoard").map(component => component.description),
        ram: userData.filter(component => component.componentName === "RAM").map(component => component.description),
        storage: userData.filter(component => component.componentName === "Storage").map(component => component.description),
        smps: userData.filter(component => component.componentName === "SMPS").map(component => component.description),
        monitor: userData.filter(component => component.componentName === "Monitor").map(component => component.description),
        keyboardMouse: userData.filter(component => component.componentName === "KeyboardMouse").map(component => component.description),
        os: userData.filter(component => component.componentName === "OS").map(component => component.description),
        chassis: userData.filter(component => component.componentName === "Chassis").map(component => component.description),
        lan: userData.filter(component => component.componentName === "LAN").map(component => component.description),
        wifi: userData.filter(component => component.componentName === "WiFi").map(component => component.description),
        dvdDriver: userData.filter(component => component.componentName === "DVD Driver").map(component => component.description),
        graphics: userData.filter(component => component.componentName === "Graphics").map(component => component.description),
        cooler: userData.filter(component => component.componentName === "Cooler").map(component => component.description),
      };
      setOptions(initialOptions);
    } catch (err) { 
      console.error("Error occurred", err);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  const handleOpenDialog = (field) => {
    setCurrentField(field);
    setOpenDialog(field);
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
    setSelectedVariants([]); 
  };

  const handleSelect = async (field, value) => {
   
  
    const selectedComponent = components.find(
      component => component.componentName.toLowerCase().replace(/\s+/g, '') === field.toLowerCase().replace(/\s+/g, '') && component.description === value
    );
  
    if (selectedComponent) {
      const { id } = selectedComponent;
      
      setSelectedComponentId(id);
  
      try {
        const response = await CRMBaseURL.post("pricing", { id });
        
        setSelectedVariants(response.data.component || []);
  
        if (response.data.component && response.data.component.length > 0) {
          setCurrentField(field);
          setOpenDialog('variants');
        } else {
          setSelections({ ...selections, [field]: value });
          setDescriptions({ ...descriptions, [field]: selectedComponent.description });
          setPrices({ ...prices, [field]: selectedComponent.price });
          handleCloseDialog();
        }
      } catch (err) {
        console.error("Error occurred", err);
      }
    }
  };

  const handleVariantSelect = (variant) => {
    const variantDetails = selectedVariants.find(v => v.variantName === variant);
    setSelections({ ...selections, [currentField]: variant });
    setDescriptions({ ...descriptions, [currentField]: variantDetails.variantDescription });
    setPrices({ ...prices, [currentField]: variantDetails.variantPrice });
    handleCloseDialog();
  };

  const handleQuantityChange = (field, increment) => {
    const newQuantity = quantities[field] + increment;
    if (newQuantity >= 1) {
      setQuantities({ ...quantities, [field]: newQuantity });
      setPrices({ ...prices, [field]: (prices[field] / quantities[field]) * newQuantity });
    }
  };

  const handleQuantityInputChange = (field, event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      setQuantities({ ...quantities, [field]: newQuantity });
      setPrices({ ...prices, [field]: (prices[field] / quantities[field]) * newQuantity });
    }
  };

  const renderOptions = (field) => {
    const fieldOptions = options[field] || [];

    if (fieldOptions.length === 0) {
      return <ListItem><ListItemText primary="No data available" /></ListItem>;
    }

    return fieldOptions.map((option) => (
      <ListItem button key={option} onClick={() => handleSelect(field, option)}>
        <ListItemText primary={option} />
      </ListItem>
    ));
  };

  const renderVariantOptions = () => {
    if (selectedVariants.length === 0) {
      return <ListItem><ListItemText primary="No variants available" /></ListItem>;
    }

    return selectedVariants.map((variant, index) => (
      <ListItem button key={index} onClick={() => handleVariantSelect(variant.variantName)}>
        <ListItemText primary={variant.variantName} />
      </ListItem>
    ));
  };

  const renderFields = (field) => (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={3}>
        <TextField
          label={field.charAt(0).toUpperCase() + field.slice(1)}
          value={selections[field]}
          onClick={() => handleOpenDialog(field)}
          fullWidth
          margin="normal"
          readOnly
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          label="Description"
          value={descriptions[field]}
          fullWidth
          margin="normal"
          readOnly
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          label="Price"
          value={prices[field]}
          fullWidth
          margin="normal"
          readOnly
        />
      </Grid>
      <Grid item xs={0}>
        <IconButton onClick={() => handleQuantityChange(field, 1)}>
          <AddIcon />
        </IconButton>
      </Grid>
      <Grid item xs={1}>
        <TextField
          label="Quantity"
          value={quantities[field]}
          onChange={(e) => handleQuantityInputChange(field, e)}
          fullWidth
          margin="normal"
        />
      </Grid>
      <Grid item xs={0}>
        <IconButton onClick={() => handleQuantityChange(field, -1)}>
          <RemoveIcon />
        </IconButton>
      </Grid>
    </Grid>
  );

  const [additionalFields, setAdditionalFields] = useState([]);

  const handleAddField = (field) => {
    setAdditionalFields([...additionalFields, field]);
  };

  return (
    <div style={{ padding: '20px' }}>
      {renderFields('processor')}
      {renderFields('motherboard')}
      {renderFields('ram')}
      {renderFields('storage')}
      {additionalFields.filter(f => f === 'storage').map((_, idx) => (
        renderFields(`storage_${idx + 1}`)
      ))}
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => handleAddField('storage')}
        >
          Add Storage
        </Button>
      </Grid>

      {renderFields('smps')}
      {renderFields('monitor')}
      {renderFields('keyboardMouse')}
      {renderFields('os')}
      {renderFields('chassis')}

      {additionalFields.filter(f => f === 'lan').map((_, idx) => (
        renderFields(`lan_${idx + 1}`)
      ))}
      {additionalFields.filter(f => f === 'wifi').map((_, idx) => (
        renderFields(`wifi_${idx + 1}`)
      ))}
      {additionalFields.filter(f => f === 'dvdDriver').map((_, idx) => (
        renderFields(`dvdDriver_${idx + 1}`)
      ))}
      {additionalFields.filter(f => f === 'graphics').map((_, idx) => (
        renderFields(`graphics_${idx + 1}`)
      ))}
      {additionalFields.filter(f => f === 'cooler').map((_, idx) => (
        renderFields(`cooler_${idx + 1}`)
      ))}

      <Grid container spacing={2}>
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleAddField('lan')}
          >
            Add LAN
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleAddField('wifi')}
            style={{ marginLeft: '10px' }}
          >
            Add WiFi
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleAddField('dvdDriver')}
            style={{ marginLeft: '10px' }}
          >
            Add DVD Driver
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleAddField('graphics')}
            style={{ marginLeft: '10px' }}
          >
            Add Graphics
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleAddField('cooler')}
            style={{ marginLeft: '10px' }}
          >
            Add Cooler
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Warranty Info"
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Packages"
            fullWidth
            margin="normal"
          />
        </Grid>
      </Grid>

      {/* Dialog for selecting options */}
      <Dialog open={openDialog !== null && openDialog !== 'variants'} onClose={handleCloseDialog}>
        <DialogTitle>{`Select ${openDialog}`}</DialogTitle>
        <DialogContent>
          <List>{renderOptions(openDialog)}</List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for displaying variants */}
      <Dialog open={openDialog === 'variants'} onClose={handleCloseDialog}>
        <DialogTitle>{`Select Variant`}</DialogTitle>
        <DialogContent>
          <List>{renderVariantOptions()}</List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PricingScreen;
