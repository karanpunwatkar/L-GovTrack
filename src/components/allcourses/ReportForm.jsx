// import React from "react"
// import "./courses.css"
// import { coursesCard } from "../../dummydata"

// const CoursesCard = () => {
//   return (
//     <>
//       {/* <section className='coursesCard'>
//         <div className='container grid2'>
//           {coursesCard.map((val) => (
//             <div className='items'>
//               <div className='content flex'>
//                 <div className='left'>
//                   <div className='img'>
//                     <img src={val.cover} alt='' />
//                   </div>
//                 </div>
//                 <div className='text'>
//                   <h1>{val.coursesName}</h1>
//                   <div className='rate'>
//                     <i className='fa fa-star'></i>
//                     <i className='fa fa-star'></i>
//                     <i className='fa fa-star'></i>
//                     <i className='fa fa-star'></i>
//                     <i className='fa fa-star'></i>
//                     <label htmlFor=''>(5.0)</label>
//                   </div>
//                   <div className='details'>
//                     {val.courTeacher.map((details) => (
//                       <>
//                         <div className='box'>
//                           <div className='dimg'>
//                             <img src={details.dcover} alt='' />
//                           </div>
//                           <div className='para'>
//                             <h4>{details.name}</h4>
//                           </div>
//                         </div>
//                         <span>{details.totalTime}</span>
//                       </>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <div className='price'>
//                 <h3>
//                   {val.priceAll} / {val.pricePer}
//                 </h3>
//               </div>
//               <button className='outline-btn'>ENROLL NOW !</button>
//             </div>
//           ))}
//         </div>
//       </section> */}



//     </>
//   )
// }

// export default CoursesCard


import React, { useState, useEffect } from 'react';
import './ReportForm.css';

const ReportForm = () => {
    const [formData, setFormData] = useState({
        location: '',
        description: '',
    });
    const [userLocation, setUserLocation] = useState({
        latitude: null,
        longitude: null,
        area: '',
        city: '',
        country: '',
    });
    const [photos, setPhotos] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileUpload = (e) => {
        const files = e.target.files;
        setPhotos(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Create a FormData object to send the data including files
        const formDataToSend = new FormData();
        formDataToSend.append('location', formData.location);
        formDataToSend.append('description', formData.description);
        for (let i = 0; i < photos.length; i++) {
            formDataToSend.append('photos', photos[i]);
        }

        try {
            const response = await fetch('http://localhost:5000/reportRoutes', {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                console.log('Report submitted successfully');
                alert('Report submitted successfully');
            } else {
                console.log(response.status);
                console.error('Failed to submit report');
            }
        } catch (error) {
            console.error('Error submitting report:', error);
        }
    };

        useEffect(() => {
        // Use the Geolocation API to get the user's current location
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const newUserLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };

                    // Check if the user's location has changed before updating the state
                    if (
                        newUserLocation.latitude !== userLocation.latitude ||
                        newUserLocation.longitude !== userLocation.longitude
                    ) {
                        setUserLocation(newUserLocation);

                        // Fetch location information using TomTom Geocoding API
                        const apiKey = 'n0RMtA9kB6L2DvLhegfjM5CPmUbquAjK'; // Replace with your TomTom API key
                        const apiUrl = `https://api.tomtom.com/search/2/reverseGeocode/${newUserLocation.latitude},${newUserLocation.longitude}.json?key=${apiKey}`;

                        try {
                            const response = await fetch(apiUrl);
                            const data = await response.json();

                            if (data.addresses && data.addresses.length > 0) {
                                setUserLocation({
                                    ...newUserLocation,
                                    area: data.addresses[0].address.freeformAddress,
                                    city: data.addresses[0].address.localName,
                                    country: data.addresses[0].address.countryCode,
                                });
                            }
                        } catch (error) {
                            console.error('Error fetching location:', error);
                        }
                    }
                },
                (error) => {
                    console.error('Error getting user location:', error.message);
                }
            );
        } else {
            console.error('Geolocation not supported');
        }
    }, [userLocation]);

    return (
        <div className="report-form">
            <h2>Report Illegal Garbage Dumping Site</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        name="location"
                        id="location"
                        value = {userLocation.area} 
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="photos">Upload Photos</label>
                    <div className="file-input-container">
                        <label className="file-input-label" htmlFor="photos">
                            Choose File
                        </label>
                        <span className="file-input-name">
                            {photos.length > 0 ? `${photos.length} file(s) selected` : 'No files selected'}
                        </span>
                        <input
                            type="file"
                            name="photos"
                            id="photos"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                        />
                    </div>
                </div>
                <button type="submit">Submit</button>
            </form>
            {userLocation.latitude !== null && userLocation.longitude !== null && (
                <div className="user-location">
                    <h3>Your Current Location</h3>
                    <p>Latitude: {userLocation.latitude}</p>
                    <p>Longitude: {userLocation.longitude}</p>
                    <p>Area: {userLocation.area}</p>
                    <p>City: {userLocation.city}</p>
                    <p>Country: {userLocation.country}</p>
                </div>
            )}
        </div>
    );
};

export default ReportForm;

