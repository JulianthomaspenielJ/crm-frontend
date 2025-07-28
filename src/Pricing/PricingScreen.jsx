import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, List, ListItem, ListItemText, Grid, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
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
    chassis: ''
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
    chassis: 0
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
    chassis: ''
  });
  const [idvalue, setIdvalue] = useState({
    processor: '',
    motherboard: '',
    ram: '',
    storage: '',
    smps: '',
    monitor: '',
    keyboardMouse: '',
    os: '',
    chassis: '',
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
  

   
  
    const baseField = field.split('_')[0];
   
  
    const selectedComponent = components.find(
      component => component.componentName.toLowerCase().replace(/\s+/g, '') === baseField.toLowerCase().replace(/\s+/g, '') && component.description === value
    );


   

  
    if (selectedComponent) {
      const { id, price, description } = selectedComponent;
  
      setSelectedComponentId(id);
  
      try {
        const response = await CRMBaseURL.post("pricing", { id });
        setSelectedVariants(response.data.component || []);
  
        if (response.data.component && response.data.component.length > 0) {
          setCurrentField(field);
          setOpenDialog('variants');
        } else {
          setSelections({ ...selections, [field]: value });
          setDescriptions({ ...descriptions, [field]: description });
          setIdvalue({ ...idvalue, [field]: id });
          setPrices({ ...prices, [field]: price });
  
          if (field.startsWith('storage')) {
            const newField = `${field}_${additionalFields.filter(f => f === field).length + 1}`;
            setQuantities({ ...quantities, [newField]: 1 });
            setPrices({ ...prices, [newField]: price });
            setAdditionalFields([...additionalFields, newField]);
          }
  
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
    setIdvalue({...idvalue, [currentField] : variantDetails.id})

    const newField = `${currentField}_${additionalFields.filter(f => f === currentField).length + 1}`;
    setPrices({ ...prices, [currentField]: variantDetails.variantPrice, [newField]: variantDetails.variantPrice });
    setQuantities({ ...quantities, [newField]: 1 });

    handleCloseDialog();
  };

  const handleQuantityChange = (field, increment) => {
    const newQuantity = quantities[field] + increment;
    if (newQuantity >= 1) {
      const newPrice = (prices[field] / quantities[field]) * newQuantity; // Calculate the new price
      setQuantities({ ...quantities, [field]: newQuantity });
      setPrices({ ...prices, [field]: newPrice });
    }
  };
  const handleQuantityInputChange = (field, event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      const newPrice = (prices[field] / quantities[field]) * newQuantity; // Calculate the new price
      setQuantities({ ...quantities, [field]: newQuantity });
      setPrices({ ...prices, [field]: newPrice });
    }
  };

  const renderOptions = (field) => {
    if (!field) {
      return <ListItem key="no-data"><ListItemText primary="No data available" /></ListItem>;
    }

    const baseField = field.split('_')[0]; 
    const fieldOptions = options[baseField] || [];

    if (fieldOptions.length === 0) {
      return <ListItem key="no-options"><ListItemText primary="No options available" /></ListItem>;
    }

    return fieldOptions.map((option, index) => (
      <ListItem button key={`${field}_${index}`} onClick={() => handleSelect(field, option)}>
        <ListItemText primary={option} />
      </ListItem>
    ));
  };

  const renderVariantOptions = () => {
    if (selectedVariants.length === 0) {
      return <ListItem key="no-variants"><ListItemText primary="No variants available" /></ListItem>;
    }

    return selectedVariants.map((variant, index) => (
      <ListItem button key={`variant_${index}`} onClick={() => handleVariantSelect(variant.variantName)}>
        <ListItemText primary={variant.variantName} />
      </ListItem>
    ));
  };

  const renderFields = (field, isRemovable = false) => (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={2}>
        <TextField
          label={field.charAt(0).toUpperCase() + field.slice(1)}
          value={selections[field] || ''}
          onClick={() => handleOpenDialog(field)}
          fullWidth
          margin="normal"
          readOnly
        />
      </Grid>
      <Grid item xs={1}>
        <TextField
        style={{display:'none'}}
          label="id"
          value={idvalue[field] || ''}
          margin="normal"
          readOnly
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          label="Description"
          value={descriptions[field] || ''}
          fullWidth
          margin="normal"
          readOnly
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          label="Price"
          value={prices[field] !== undefined ? prices[field].toFixed(2) : ''}
          fullWidth
          margin="normal"
          readOnly
        />
      </Grid>
      <Grid item xs={1}>
        <IconButton onClick={() => handleQuantityChange(field, 1)}>
          <AddIcon />
        </IconButton>
      </Grid>
      <Grid item xs={1}>
        <TextField
          label="Quantity"
          value={quantities[field] || 1}
          onChange={(e) => handleQuantityInputChange(field, e)}
          fullWidth
          margin="normal"
        />
      </Grid>
      <Grid item xs={1}>
        <IconButton onClick={() => handleQuantityChange(field, -1)}>
          <RemoveIcon />
        </IconButton>
      </Grid>
      {isRemovable && (
        <Grid item xs={1}>
          <IconButton onClick={() => handleRemoveField(field)}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );

  const [additionalFields, setAdditionalFields] = useState([]);

  const handleAddField = (field) => {
    const newField = `${field}_${additionalFields.filter(f => f.startsWith(field)).length + 1}`;
    setAdditionalFields([...additionalFields, newField]);
    setQuantities({ ...quantities, [newField]: 1 }); 
    setPrices({ ...prices, [newField]: 0 });
  };
  
  const handleRemoveField = (field) => {
    const updatedAdditionalFields = additionalFields.filter(f => f !== field);
  
    const updatedQuantities = { ...quantities };
    const updatedPrices = { ...prices };
    const updatedSelections = { ...selections };
    const updatedDescriptions = { ...descriptions };
    const updatedIdValue = { ...idvalue };
  
    delete updatedQuantities[field];
    delete updatedPrices[field];
    delete updatedSelections[field];
    delete updatedDescriptions[field];
    delete updatedIdValue[field];
  
    setAdditionalFields(updatedAdditionalFields);
    setQuantities(updatedQuantities);
    setPrices(updatedPrices);
    setSelections(updatedSelections);
    setDescriptions(updatedDescriptions);
    setIdvalue(updatedIdValue);
  };

  const handleSubmit = async() => {
    const selectedIdsAndQuantities = {};
  
    Object.keys(idvalue).forEach((key) => {
      if (idvalue[key]) {
        const baseField = key.split('_')[0];
        const formattedField = baseField.charAt(0).toLowerCase() + baseField.slice(1) + 'Id';
  
        if (!selectedIdsAndQuantities[formattedField]) {
          selectedIdsAndQuantities[formattedField] = [];
        }
  
        selectedIdsAndQuantities[formattedField].push({
          id: idvalue[key],
          quantity: quantities[key]
        });
      }
    });
  
    const warrantyInfo = document.getElementById('warranty-info').value;
    const packages = document.getElementById('packages').value;
    const logistics = document.getElementById('logistics').value;
  
    const dataToSubmit = {
      ...selectedIdsAndQuantities,
      warrantyInfo: warrantyInfo,
      packages: packages,
      logistics: logistics
    };

    const response = await CRMBaseURL.post('products' , dataToSubmit)
    
  };
   
  return (
    <div style={{ padding: '20px' }}>
      {renderFields('processor')}
      {renderFields('motherboard')}
      {renderFields('ram')}
      {renderFields('storage')}
      {additionalFields.filter(f => f.startsWith('storage')).map((field) => renderFields(field, true))}

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

      {additionalFields.filter(f => f.startsWith('lan')).map((field) => renderFields(field, true))}
      {additionalFields.filter(f => f.startsWith('wifi')).map((field) => renderFields(field, true))}
      {additionalFields.filter(f => f.startsWith('dvdDriver')).map((field) => renderFields(field, true))}
      {additionalFields.filter(f => f.startsWith('graphics')).map((field) => renderFields(field, true))}
      {additionalFields.filter(f => f.startsWith('cooler')).map((field) => renderFields(field, true))}

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
        <Grid item xs={3}>
          <TextField
            id='warranty-info'
            label="Warranty Info"
            fullWidth
            value={5}
            readOnly
            margin="normal"
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
          id='packages'
            label="Packages"
            margin="normal"
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='logistics'
            label="Logistics"
            margin="normal"
          />
        </Grid>
      </Grid> <br/>

      <Grid item xs={3} style={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
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