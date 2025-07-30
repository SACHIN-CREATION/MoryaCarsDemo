import React, { useState } from 'react';
import './AddCar.css';

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
    photos: [], // base64 strings
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Validation functions
  const validateForm = () => {
    const newErrors = {};

    // Brand validation
    if (!formData.Brand.trim()) {
      newErrors.Brand = 'Brand is required';
    } else if (formData.Brand.trim().length < 2) {
      newErrors.Brand = 'Brand must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.Brand.trim())) {
      newErrors.Brand = 'Brand should only contain letters and spaces';
    }

    // Model validation
    if (!formData.Model.trim()) {
      newErrors.Model = 'Model is required';
    } else if (formData.Model.trim().length < 1) {
      newErrors.Model = 'Model must be at least 1 character';
    } else if (formData.Model.trim().length > 50) {
      newErrors.Model = 'Model must be less than 50 characters';
    }

    // Chassis Number validation
    if (!formData.chassisNumber.trim()) {
      newErrors.chassisNumber = 'Chassis number is required';
    } else if (formData.chassisNumber.trim().length < 10) {
      newErrors.chassisNumber = 'Chassis number must be at least 10 characters';
    } else if (formData.chassisNumber.trim().length > 25) {
      newErrors.chassisNumber = 'Chassis number must be less than 25 characters';
    } else if (!/^[A-Z0-9]+$/.test(formData.chassisNumber.trim().replace(/\s/g, ''))) {
      newErrors.chassisNumber = 'Chassis number should only contain uppercase letters and numbers';
    }

    // Engine Number validation
    if (!formData.engineNumber.trim()) {
      newErrors.engineNumber = 'Engine number is required';
    } else if (formData.engineNumber.trim().length < 5) {
      newErrors.engineNumber = 'Engine number must be at least 5 characters';
    } else if (formData.engineNumber.trim().length > 20) {
      newErrors.engineNumber = 'Engine number must be less than 20 characters';
    } else if (!/^[A-Z0-9]+$/.test(formData.engineNumber.trim().replace(/\s/g, ''))) {
      newErrors.engineNumber = 'Engine number should only contain uppercase letters and numbers';
    }

    // Color validation
    if (!formData.color.trim()) {
      newErrors.color = 'Color is required';
    } else if (formData.color.trim().length < 2) {
      newErrors.color = 'Color must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.color.trim())) {
      newErrors.color = 'Color should only contain letters and spaces';
    }

    // Price validation
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Price must be a valid positive number';
      } else if (price < 10000) {
        newErrors.price = 'Price should be at least ₹10,000';
      } else if (price > 10000000) {
        newErrors.price = 'Price should be less than ₹1,00,00,000';
      }
    }

    // KM Driven validation
    if (!formData.KMDriven) {
      newErrors.KMDriven = 'KM Driven is required';
    } else {
      const km = parseFloat(formData.KMDriven);
      if (isNaN(km) || km < 0) {
        newErrors.KMDriven = 'KM Driven must be a valid non-negative number';
      } else if (km > 1000000) {
        newErrors.KMDriven = 'KM Driven seems too high (max 10,00,000)';
      }
    }

    if (!formData.showroomEntryDate) {
      newErrors.showroomEntryDate = "Show Room Entry Date is Required";
    }

    // Dropdown validations
    if (!formData.transmission) {
      newErrors.transmission = 'Transmission type is required';
    }

    if (!formData.FuelType) {
      newErrors.FuelType = 'Fuel type is required';
    }

    if (!formData.insurance) {
      newErrors.insurance = 'Insurance status is required';
    }

    // Photos validation
    if (formData.photos.length === 0) {
      newErrors.photos = 'At least one car photo is required';
    } else if (formData.photos.length > 10) {
      newErrors.photos = 'Maximum 10 photos allowed';
    }

    return newErrors;
  };

  // Check for duplicate chassis/engine numbers
  const checkDuplicates = () => {
    const existingCars = JSON.parse(localStorage.getItem('cars')) || [];
    const duplicateErrors = {};

    // Check chassis number
    if (existingCars.some(car => car.chassisNumber.toLowerCase() === formData.chassisNumber.toLowerCase())) {
      duplicateErrors.chassisNumber = 'A car with this chassis number already exists';
    }

    // Check engine number
    if (existingCars.some(car => car.engineNumber.toLowerCase() === formData.engineNumber.toLowerCase())) {
      duplicateErrors.engineNumber = 'A car with this engine number already exists';
    }

    return duplicateErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Format specific fields
    let formattedValue = value;
    
    if (name === 'chassisNumber' || name === 'engineNumber') {
      formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    } else if (name === 'Brand' || name === 'color') {
      formattedValue = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (name === 'price' || name === 'KMDriven') {
      formattedValue = value.replace(/[^0-9.]/g, '');
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Individual photo upload handler
  const handleSinglePhotoAdd = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Clear previous photo errors
    if (errors.photos) {
      setErrors(prev => ({ ...prev, photos: '' }));
    }

    // Check if already have 10 photos
    if (formData.photos.length >= 10) {
      setErrors(prev => ({ ...prev, photos: "Maximum 10 photos allowed" }));
      e.target.value = "";
      return;
    }

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, photos: "Only JPEG, PNG, and WebP images are allowed" }));
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, photos: "Each image must be less than 5MB" }));
      e.target.value = "";
      return;
    }

    try {
      setUploadingPhoto(true);
      const base64File = await fileToBase64(file);
      setFormData((prev) => ({ 
        ...prev, 
        photos: [...prev.photos, base64File] 
      }));
      // Clear the file input
      e.target.value = "";
    } catch (error) {
      setErrors(prev => ({ ...prev, photos: "Error reading file. Please try again." }));
      console.error(error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Remove specific photo
  const removePhoto = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove)
    }));
    
    // Clear photo error if exists
    if (errors.photos) {
      setErrors(prev => ({ ...prev, photos: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    const formErrors = validateForm();
    const duplicateErrors = checkDuplicates();
    const allErrors = { ...formErrors, ...duplicateErrors };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setIsLoading(false);
      
      // Scroll to first error
      const firstErrorField = Object.keys(allErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`) || 
                          document.querySelector(`#${firstErrorField}`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      return;
    }

    try {
      // Retrieve existing cars or empty array
      const existingCars = JSON.parse(localStorage.getItem('cars')) || [];

      // Prepare new car data
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
      };

      // Save to localStorage
      localStorage.setItem('cars', JSON.stringify([...existingCars, newCar]));

      alert('Car added successfully!');

      // Reset form and clear file input
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
      // Reset all file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => input.value = '');
    } catch (error) {
      alert('Error saving car data. Please try again.');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderError = (fieldName) => {
    return errors[fieldName] ? (
      <span className="error-message">{errors[fieldName]}</span>
    ) : null;
  };

  return (
    <div className="add-car-container">
      <h2>Add New Car</h2>
      <form className="add-car-form" onSubmit={handleSubmit}>
        {[
          { label: 'Brand', name: 'Brand', placeholder: 'e.g., Maruti, Honda, Toyota' },
          { label: 'Model', name: 'Model', placeholder: 'e.g., Swift, City, Innova' },
          { label: 'Chassis Number', name: 'chassisNumber', placeholder: 'e.g., MABKS46FXGK012345' },
          { label: 'Engine Number', name: 'engineNumber', placeholder: 'e.g., K15B1234567' },
          { label: 'colour', name: 'color', placeholder: 'e.g., Red, Blue, White' },
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
              min={type === 'number' ? '0' : undefined}
              max={type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
            />
            {renderError(name)}
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="transmission">
            Transmission <span className="required">*</span>
          </label>
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
          <label htmlFor="FuelType">
            Fuel Type <span className="required">*</span>
          </label>
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
          <label htmlFor="insurance">
            Insurance Status <span className="required">*</span>
          </label>
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
          <label htmlFor="KMDriven">
            KM Driven <span className="required">*</span>
          </label>
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

        {/* Photo Upload Section */}
        <div className="form-group">
          <label>
            Upload Car Photos <span className="required">*</span>
            <small>(Max 10 images, each under 5MB)</small>
          </label>
          
          {/* Add Photo Button */}
          {formData.photos.length < 10 && (
            <div className="photo-upload-section">
              <input
                id="photoInput"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleSinglePhotoAdd}
                className={errors.photos ? 'error' : ''}
                style={{ display: 'none' }}
              />
              <label 
                htmlFor="photoInput" 
                className={`photo-upload-btn ${uploadingPhoto ? 'uploading' : ''}`}
              >
                {uploadingPhoto ? 'Uploading...' : '+ Add Photo'}
              </label>
            </div>
          )}

          {/* Photo Count */}
          <div className="photo-count-info">
            {formData.photos.length}/10 photos added
            {formData.photos.length >= 10 && (
              <span className="max-reached"> (Maximum reached)</span>
            )}
          </div>

          {/* Photo Preview Grid */}
          {formData.photos.length > 0 && (
            <div className="photo-preview-grid">
              {formData.photos.map((photo, index) => (
                <div key={index} className="photo-preview-item">
                  <img 
                    src={photo} 
                    alt={`Car photo ${index + 1}`}
                    className="photo-thumbnail"
                  />
                  <button
                    type="button"
                    className="remove-photo-btn"
                    onClick={() => removePhoto(index)}
                    title="Remove this photo"
                  >
                    ×
                  </button>
                  <span className="photo-number">{index + 1}</span>
                </div>
              ))}
            </div>
          )}

          {renderError('photos')}
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isLoading || uploadingPhoto}
        >
          {isLoading ? 'Adding Car...' : 'Add Car'}
        </button>
      </form>

      {/* <style jsx>
        {`
        .required {
          color: #dc3545;
          font-weight: bold;
        }
        
        .error-message {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          display: block;
        }
        
        .error {
          border-color: #dc3545 !important;
          background-color: #fff5f5;
        }
        
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        small {
          color: #6c757d;
          font-size: 0.8rem;
        }

        .photo-upload-section {
          margin: 10px 0;
        }

        .photo-upload-btn {
          display: inline-block;
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s ease;
        }

        .photo-upload-btn:hover {
          background: #0056b3;
        }

        .photo-upload-btn.uploading {
          background: #6c757d;
          cursor: not-allowed;
        }

        .photo-count-info {
          margin: 10px 0;
          font-size: 14px;
          color: #666;
        }

        .max-reached {
          color: #dc3545;
          font-weight: bold;
        }

        .photo-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 10px;
          margin-top: 15px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background: #f9f9f9;
        }

        .photo-preview-item {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .photo-thumbnail {
          width: 100%;
          height: 100px;
          object-fit: cover;
          display: block;
        }

        .remove-photo-btn {
          position: absolute;
          top: 5px;
          right: 5px;
          background: rgba(220, 53, 69, 0.8);
          color: white;
          border: none;
          border-radius: 50%;
          width: 25px;
          height: 25px;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .remove-photo-btn:hover {
          background: rgba(220, 53, 69, 1);
        }

        .photo-number {
          position: absolute;
          bottom: 5px;
          left: 5px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 3px;
        }

        @media (max-width: 768px) {
          .photo-preview-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 8px;
          }

          .photo-thumbnail {
            height: 80px;
          }

          .remove-photo-btn {
            width: 22px;
            height: 22px;
            font-size: 14px;
          }
        }
      `}</style> */}
    </div>
  );
};

export default AddCar;
