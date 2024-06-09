import React, { useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './dataGather.css';
import PlayersData from './infoForm';
import PlayerNames from './playerNames';

// Create a context to store the form data
const FormDataContext = createContext();

function DataGather() {
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState(null);
    const [formSubmitted, setFormSubmitted] = useState(false);

    // Function to handle form submission
    const handleFormSubmit = (data) => {
        // Process form data if needed
        // Then set formData to trigger rendering of PlayerNames
        setFormData(data);
        setFormSubmitted(true);
    };
    
    // Function to handle form completion
    const handleFormCompletion = (state) => {
        setFormData(state);
        navigate('/playersInOrder', { state: { formData: state } });
        // Handle completion if needed
    };

    return (
        <FormDataContext.Provider value={formData}>
            <div className='home-root'>
                {!formSubmitted && <PlayersData onSubmit={handleFormSubmit} />}
                {formSubmitted && <PlayerNames formData={formData} onSubmit={handleFormCompletion} />}
            </div>
        </FormDataContext.Provider>
    );
}

export default DataGather;

// Custom hook to access the year from form data
export function useYear() {
    const formData = useContext(FormDataContext);
    
    // Check if formData exists and contains the year
    if (formData && formData.year) {
        return formData.year;
    } else {
        // Handle the case when formData or year is not available
        return null;
    }
}
