import React, { useState } from 'react';

function PlayersData({ onSubmit }) {
    const [formData, setFormData] = useState({ 
        year: '', 
        players: '' 
    });
    const [showPopup, setShowPopup] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (formData.year && formData.players) {
            onSubmit(formData); // Pass form data to parent component
        } else {
            setShowPopup(true); // Show the popup if any input is empty
        }
    };

    const handleInputClick = (event) => {
        event.preventDefault(); // Prevent the default action when clicking into the input
    };

    return (
        <div className='info-form-form'>
            <form onSubmit={handleSubmit}>
                {/* Popup for generic message */}
                {showPopup && (
                <div className="popup showPopup">
                    <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 30" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d= "M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 7C12.5523 7 13 7.44772 13 8V12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12V8C11 7.44772 11.4477 7 12 7Z" fill="white"/>
                        <path d="M13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15C12.5523 15 13 15.4477 13 16Z" fill="white"/>
                    </svg>
                    <p className='message'>Please choose a year and number of players</p>
                </div>
                )}
                <p className='header'>Pick a Year to Draft</p>
                <p className='descrip'>1970-2023</p>
                <input 
                    name="year"
                    type="number" 
                    min="1970" 
                    max="2023"
                    value={formData.year} 
                    onChange={handleChange}
                    onClick={handleInputClick} // Add onClick event handler
                    className="input"         
                />
                <p className='header'>How many players?</p>
                <p className='descrip'>2-10</p>
                <input 
                    type="number" 
                    name="players"
                    min="2" 
                    max="10"
                    value={formData.players} 
                    onChange={handleChange}
                    className="input" 
                />
                <button className="confirm-button info-form-confirm" type="submit">
                    Confirm
                </button>
            </form>
        </div>
    );
}

export default PlayersData;
