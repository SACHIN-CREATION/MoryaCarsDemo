
import React, { useState } from 'react';
import './AddCar.css';



const allDocuments = [
  { key: 'aadhar', label: 'Aadhaar Card' },
  { key: 'pan', label: 'PAN Card' },
  { key: 'drivingLicense', label: 'Driving License' },
  { key: 'passportPhoto', label: 'Passport Size Photo' },
  { key: 'addressProof', label: 'Address Proof' },
  { key: 'bankProof', label: 'Bank Proof' },
  { key: 'incomeProof', label: 'Income Proof' },
  { key: 'propertyDocument', label: 'Property Document' },
];

const MAX_FILE_SIZE_MB = 5;
const MAX_PHOTOS = 10;

const AddCar = () => {
  const [formData, setFormData] = useState({
    Brand: '',
    Model: '',
    FuelType: '',
    KMDriven: '',
    chassisNumber: '',
    engineNumber: '',
    transmission: '',
    color: '',
    insurance: '',
    price: '',
    showroomEntryDate: '',
    photos: [],
  });

  const [errors, setErrors] = useState({});
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [documents, setDocuments] = useState({});
  const [previewUrls, setPreviewUrls] = useState({});
  const [notApplicable, setNotApplicable] = useState({});
  const [docErrors, setDocErrors] = useState({});

  // Handle input changes with validation patterns
  const handleChange = (e) => {
    let { name, value } = e.target;

    // Uppercase alphanumeric for chassisNumber & engineNumber
    if (name === 'chassisNumber' || name === 'engineNumber') {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    } else if (name === 'Brand' || name === 'color') {
      value = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (name === 'price' || name === 'KMDriven') {
      value = value.replace(/[^0-9.]/g, '');
    }
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear errors as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Convert file to base64 string
  const fileToBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = err => reject(err);
    });

  // Handle adding a single photo with validations & max count
  const handleSinglePhotoAdd = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (formData.photos.length >= MAX_PHOTOS) {
      setErrors(prev => ({ ...prev, photos: `Maximum ${MAX_PHOTOS} photos allowed` }));
      alert(`Maximum ${MAX_PHOTOS} photos allowed`);
      return;
    }
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (!validTypes.includes(file.type) || file.size > maxSize) {
      setErrors(prev => ({ ...prev, photos: `Only JPEG, PNG, WebP under ${MAX_FILE_SIZE_MB}MB allowed` }));
      alert(`Only JPEG, PNG, or WebP images under ${MAX_FILE_SIZE_MB}MB allowed`);
      return;
    }

    try {
      setUploadingPhoto(true);
      const base64File = await fileToBase64(file);

      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, base64File],
      }));

      // Clear any previous photo errors
      if (errors.photos) setErrors(prev => ({ ...prev, photos: '' }));
    } catch {
      setErrors(prev => ({ ...prev, photos: "Error reading file" }));
      alert("Error reading the selected photo");
    } finally {
      setUploadingPhoto(false);
    }

    // Reset file input so same file can be selected again if needed
    e.target.value = '';
  };

  // Remove photo by index
  const removePhoto = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, idx) => idx !== indexToRemove),
    }));
    if (errors.photos) setErrors(prev => ({ ...prev, photos: '' }));
  };

  // Handle document file changes with validations
  const handleFileChange = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    setDocErrors(prev => ({ ...prev, [key]: null }));

    const validTypes = ["image/jpeg", "image/png", "application/pdf", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setDocErrors(prev => ({ ...prev, [key]: "Invalid file type." }));
      alert(`${allDocuments.find(d => d.key === key).label}: Invalid file type.`);
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setDocErrors(prev => ({ ...prev, [key]: `File size must be under ${MAX_FILE_SIZE_MB}MB.` }));
      alert(`${allDocuments.find(d => d.key === key).label}: File size must be under ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      setDocuments(prev => ({
        ...prev,
        [key]: { url: base64, name: file.name, type: file.type }
      }));
      setPreviewUrls(prev => ({
        ...prev,
        [key]: URL.createObjectURL(file)
      }));
      setNotApplicable(prev => ({ ...prev, [key]: false }));
      setDocErrors(prev => ({ ...prev, [key]: null }));
    } catch {
      setDocErrors(prev => ({ ...prev, [key]: "Failed to read file." }));
      alert(`${allDocuments.find(d => d.key === key).label}: Failed to read file.`);
    }
  };

  // Remove document file
  const handleRemoveFile = (key) => {
    setDocuments(prev => ({ ...prev, [key]: null }));
    setPreviewUrls(prev => ({ ...prev, [key]: null }));
    setDocErrors(prev => ({ ...prev, [key]: null }));
  };

  // Toggle Not Applicable document checkbox
  const handleNotApplicableChange = (key) => {
    setNotApplicable(prev => {
      const newVal = !prev[key];
      if (newVal) {
        setDocuments(doc => ({ ...doc, [key]: null }));
        setPreviewUrls(previews => ({ ...previews, [key]: null }));
        setDocErrors(err => ({ ...err, [key]: null }));
      }
      return { ...prev, [key]: newVal };
    });
  };

  // Validate car form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.Brand.trim()) newErrors.Brand = 'Brand is required';
    if (!formData.Model.trim()) newErrors.Model = 'Model is required';
    if (!formData.chassisNumber.trim()) newErrors.chassisNumber = 'Chassis number is required';
    if (!formData.engineNumber.trim()) newErrors.engineNumber = 'Engine number is required';
    if (!formData.color.trim()) newErrors.color = 'Color is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.KMDriven) newErrors.KMDriven = 'KM Driven is required';
    if (!formData.showroomEntryDate) newErrors.showroomEntryDate = "Showroom Entry Date is Required";
    if (!formData.transmission) newErrors.transmission = 'Transmission type is required';
    if (!formData.FuelType) newErrors.FuelType = 'Fuel type is required';
    if (!formData.insurance) newErrors.insurance = 'Insurance status is required';
    if (formData.photos.length === 0) newErrors.photos = 'At least one car photo is required';
    if (formData.photos.length > MAX_PHOTOS) newErrors.photos = `Maximum ${MAX_PHOTOS} photos allowed`;
    return newErrors;
  };

  // Validate documents section
  const validateDocuments = () => {
    let valid = true;
    const newErr = {};
    allDocuments.forEach(({ key, label }) => {
      if (!notApplicable[key] && !documents[key]) {
        valid = false;
        newErr[key] = `${label} is required or mark as Not Applicable.`;
      }
    });
    setDocErrors(newErr);
    return valid;
  };

  // On form submit
  const handleSubmit = (e) => {

    e.preventDefault();

    const carErrors = validateForm();
    setErrors(carErrors);
    if (Object.keys(carErrors).length > 0) {
      alert('Please fill all required car fields correctly.');
      return;
    }

    if (!validateDocuments()) {
      alert('Please upload all required documents or mark as Not Applicable before submitting.');
      return;
    }

    const existingCars = JSON.parse(localStorage.getItem('cars')) || [];

    const newCar = {
      ...formData,
      id: Date.now(),
      photos: formData.photos,
      price: parseFloat(formData.price),
      KMDriven: parseFloat(formData.KMDriven),
      Brand: formData.Brand.trim(),
      Model: formData.Model.trim(),
      color: formData.color.trim(),
      chassisNumber: formData.chassisNumber.trim(),
      engineNumber: formData.engineNumber.trim(),
      dateAdded: new Date().toISOString(),
      documents: documents,
    };

    localStorage.setItem('cars', JSON.stringify([...existingCars, newCar]));
    alert('Car added successfully!');

    // Reset all states
    setFormData({
      Brand: '',
      Model: '',
      FuelType: '',
      KMDriven: '',
      chassisNumber: '',
      engineNumber: '',
      transmission: '',
      color: '',
      insurance: '',
      price: '',
      showroomEntryDate: '',
      photos: [],
    });
    setErrors({});
    setDocuments({});
    setPreviewUrls({});
    setNotApplicable({});
    setDocErrors({});
  };

  const renderError = (fieldName) => errors[fieldName] ? (
    <span className="error-message">{errors[fieldName]}</span>
  ) : null;

  return (
    <div className="add-car-container">
      <h2>Add New Car</h2>

      <form className="add-car-form" onSubmit={handleSubmit} noValidate autoComplete="off">
        {/* Car info fields */}
        {[
          { label: 'Brand', name: 'Brand', placeholder: 'e.g., Maruti, Honda, Toyota' },
          { label: 'Model', name: 'Model', placeholder: 'e.g., Swift, City, Innova' },
          { label: 'Chassis Number', name: 'chassisNumber', placeholder: 'e.g., MABKS46FXGK012345' },
          { label: 'Engine Number', name: 'engineNumber', placeholder: 'e.g., K15B1234567' },
          { label: 'Color', name: 'color', placeholder: 'e.g., Red, Blue, White' },
          { label: 'Price (₹)', name: 'price', type: 'number', placeholder: 'e.g., 500000' },
          { label: 'Showroom Entry Date', name: 'showroomEntryDate', type: 'date' },
        ].map(({ label, name, type = 'text', placeholder }) => (
          <div className="form-group" key={name}>
            <label htmlFor={name}>
              {label} <span className="required">*</span>
            </label>
            <input
              id={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              className={errors[name] ? 'error' : ''}
            />
            {renderError(name)}
          </div>
        ))}

        {/* Dropdowns */}
        <div className="form-group">
          <label htmlFor="transmission">Transmission <span className="required">*</span></label>
          <select
            name="transmission"
            id="transmission"
            value={formData.transmission}
            onChange={handleChange}
            className={errors.transmission ? 'error' : ''}
          >
            <option value="">-- Select Transmission --</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
          {renderError('transmission')}
        </div>

        <div className="form-group">
          <label htmlFor="FuelType">Fuel Type <span className="required">*</span></label>
          <select
            name="FuelType"
            id="FuelType"
            value={formData.FuelType}
            onChange={handleChange}
            className={errors.FuelType ? 'error' : ''}
          >
            <option value="">-- Select Fuel Type --</option>
            <option value="CNG">CNG</option>
            <option value="Petrol">Petrol</option>
            <option value="Both">Both (CNG + Petrol)</option>
          </select>
          {renderError('FuelType')}
        </div>

        <div className="form-group">
          <label htmlFor="insurance">Insurance Status <span className="required">*</span></label>
          <select
            name="insurance"
            id="insurance"
            value={formData.insurance}
            onChange={handleChange}
            className={errors.insurance ? 'error' : ''}
          >
            <option value="">-- Select Insurance Status --</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Not Available">Not Available</option>
          </select>
          {renderError('insurance')}
        </div>

        <div className="form-group">
          <label htmlFor="KMDriven">KM Driven <span className="required">*</span></label>
          <input
            type="number"
            id="KMDriven"
            name="KMDriven"
            placeholder="e.g., 25000"
            value={formData.KMDriven}
            onChange={handleChange}
            min="0"
            max="1000000"
            className={errors.KMDriven ? 'error' : ''}
          />
          {renderError('KMDriven')}
        </div>

        {/* Photo Upload */}
        <div className="form-group">
          <label>
            Upload Car Photos <span className="required">*</span>
            <small style={{ display: 'block' }}>(Max {MAX_PHOTOS} images, under {MAX_FILE_SIZE_MB}MB each)</small>
          </label>

          {/* Hidden file input */}
          {formData.photos.length < MAX_PHOTOS && (
            <>
              <input
                id="photoInput"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleSinglePhotoAdd}
                className={errors.photos ? 'error' : ''}
                style={{ display: 'none' }}
                multiple={false} // Single photo add each time
              />
              <label
                htmlFor="photoInput"
                className={`photo-upload-btn ${uploadingPhoto ? 'uploading' : ''}`}
                style={{ cursor: uploadingPhoto ? 'default' : 'pointer' }}
              >
                {uploadingPhoto ? 'Uploading...' : '+ Choose Photos'}
              </label>
            </>
          )}
          <div className="photo-count" style={{ marginTop: 5 }}>
            {formData.photos.length}/{MAX_PHOTOS} photos&nbsp;
            {formData.photos.length >= MAX_PHOTOS && <span className="max-reached">(Max reached)</span>}
          </div>
          {formData.photos.length > 0 && (
            <div className="photo-preview-grid" style={{ marginTop: 10 }}>
              {formData.photos.map((photo, index) => (
                <div key={index} className="photo-preview-item" style={{ position: 'relative', display: 'inline-block', margin: 8 }}>
                  <img src={photo} alt={`Car ${index + 1}`} className="photo-thumbnail" style={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                  <button
                    type="button"
                    className="remove-photo-btn"
                    onClick={() => removePhoto(index)}
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: 22,
                      height: 22,
                      cursor: 'pointer',
                    }}
                    aria-label={`Remove photo ${index + 1}`}
                  >
                    ×
                  </button>
                  <span className="photo-number" style={{
                    position: 'absolute',
                    bottom: 4,
                    left: 4,
                    color: 'white',
                    backgroundColor: '#000000b3',
                    padding: '0 6px',
                    borderRadius: 4,
                    fontSize: 12,
                  }}>{index + 1}</span>
                </div>
              ))}
            </div>
          )}
          {renderError('photos')}
        </div>

        {/* Documents Section */}
        <div className="kyc-documents-section" style={{ marginTop: 40 }}>
          <h3>Upload Car KYC / Documents</h3>
          <div className="row">
            {allDocuments.map(({ key, label }) => (
              <div className="col-md-6 mb-4" key={key} style={{ marginBottom: '1.5rem' }}>
                <label htmlFor={`file-${key}`} className="fw-semibold" style={{ color: "#826900" }}>
                  {label} <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  id={`file-${key}`}
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={e => handleFileChange(e, key)}
                  aria-describedby={`error-${key}`}
                  disabled={!!notApplicable[key]}
                  required={!notApplicable[key]}
                  className="form-control mt-1"
                />

                <div className="form-check mt-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`na-${key}`}
                    checked={!!notApplicable[key]}
                    onChange={() => handleNotApplicableChange(key)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`na-${key}`}
                    style={{ fontSize: ".96rem", color: "#7f7016" }}
                  >
                    Mark as Not Applicable / Optional
                  </label>
                </div>
                {docErrors[key] && (
                  <div className="text-danger fw-semibold mb-1" id={`error-${key}`} role="alert">
                    {docErrors[key]}
                  </div>
                )}
                {documents[key] && (
                  <div
                    style={{
                      background: "#fffdfa",
                      marginTop: 8,
                      borderRadius: 10,
                      boxShadow: "0 2px 10px #d4af3730",
                      border: "1px solid #edd97e60",
                      position: "relative",
                      padding: 8
                    }}
                  >
                    {documents[key].type?.includes("pdf") ? (
                      <embed
                        src={previewUrls[key] || documents[key].url}
                        type="application/pdf"
                        style={{ width: "100%", height: "160px", borderRadius: 9, background: "#fff" }}
                      />
                    ) : (
                      <img
                        src={previewUrls[key] || documents[key].url}
                        alt={`${label} Preview`}
                        style={{ width: "100%", maxHeight: 160, borderRadius: 9, objectFit: "contain", background: "#fff" }}
                      />
                    )}
                    <button
                      type="button"
                      className="btn btn-sm btn-danger position-absolute"
                      style={{ right: 12, bottom: 12, zIndex: 10 }}
                      onClick={() => handleRemoveFile(key)}
                      aria-label={`Remove ${label}`}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-btn"
          disabled={uploadingPhoto}
          style={{ marginTop: 20 }}
        >
          Add Car
        </button>
      </form>
    </div>
  );
};

export default AddCar;

