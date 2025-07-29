import React,{useState} from 'react'

const KYCUploadSeller = () => {


      const [kycData, setKycData] = useState({
        aadhar: null,
        pan: null,
        license: null,
      });
    
      const [previewUrls, setPreviewUrls] = useState({
        aadhar: null,
        pan: null,
        license: null,
      });
    
      const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
          const url = URL.createObjectURL(file);
          setKycData((prev) => ({ ...prev, [type]: file }));
          setPreviewUrls((prev) => ({ ...prev, [type]: url }));
        }
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = {
          id: Date.now(),
          aadhar: previewUrls.aadhar,
          pan: previewUrls.pan,
          license: previewUrls.license,
        };
    
        const existing = JSON.parse(localStorage.getItem('kycBuyers')) || [];
        localStorage.setItem('kycBuyers', JSON.stringify([...existing, formData]));
    
        alert('KYC documents uploaded successfully!');
        setKycData({ aadhar: null, pan: null, license: null });
        setPreviewUrls({ aadhar: null, pan: null, license: null });
      };



  return (
    <>

     <div className="kyc-upload-container">
      <h2>Buyer KYC Upload</h2>
      <form onSubmit={handleSubmit} className="kyc-form">
        <div className="kyc-section">
          <label>Aadhar Card</label>
          <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'aadhar')} />
          {previewUrls.aadhar && (
            <div className="preview-box">
              {previewUrls.aadhar.endsWith('.pdf') ? (
                <embed src={previewUrls.aadhar} width="100%" height="200px" />
              ) : (
                <img src={previewUrls.aadhar} alt="Aadhar Preview" />
              )}
            </div>
          )}
        </div>

        <div className="kyc-section">
          <label>PAN Card</label>
          <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'pan')} />
          {previewUrls.pan && (
            <div className="preview-box">
              {previewUrls.pan.endsWith('.pdf') ? (
                <embed src={previewUrls.pan} width="100%" height="200px" />
              ) : (
                <img src={previewUrls.pan} alt="PAN Preview" />
              )}
            </div>
          )}
        </div>

        <div className="kyc-section">
          <label>Driving License</label>
          <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'license')} />
          {previewUrls.license && (
            <div className="preview-box">
              {previewUrls.license.endsWith('.pdf') ? (
                <embed src={previewUrls.license} width="100%" height="200px" />
              ) : (
                <img src={previewUrls.license} alt="License Preview" />
              )}
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn">Upload KYC</button>
      </form>
    </div>
      
    </>
  )
}

export default KYCUploadSeller
