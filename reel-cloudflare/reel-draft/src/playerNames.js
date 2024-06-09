import React, { useState } from 'react';

function PlayerNames({ formData, onSubmit }) {
  const [formState, setFormState] = useState({
    formData: formData,
    playerNames: Array(parseInt(formData.players)).fill('')
  });
  const [showEmptyNamePopup, setShowEmptyNamePopup] = useState(false);
  const [showDuplicateNamePopup, setShowDuplicateNamePopup] = useState(false);

  const handleNameChange = (index, value) => {
    const updatedPlayerNames = [...formState.playerNames];
    updatedPlayerNames[index] = value;
    setFormState(prevState => ({
      ...prevState,
      playerNames: updatedPlayerNames
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const hasEmptyNames = formState.playerNames.some(name => name.trim() === '');
    const hasDuplicateNames = new Set(formState.playerNames.map(name => name.trim())).size !== formState.playerNames.length;

    if (hasEmptyNames) {
      setShowEmptyNamePopup(true);
    } else if (hasDuplicateNames) {
      setShowDuplicateNamePopup(true);
    } else {
      onSubmit(formState);
    }
  };

  return (
    <div className='info-form-form'>
      <form onSubmit={handleSubmit}>
        {showEmptyNamePopup && (
          <div className="popup showEmptyNamePopup">
            <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 30" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 7C12.5523 7 13 7.44772 13 8V12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12V8C11 7.44772 11.4477 7 12 7Z" fill="white"/>
              <path d="M13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15C12.5523 15 13 15.4477 13 16Z" fill="white"/>
            </svg>
            <p className='message'>Please fill out all player names before submitting</p>
          </div>
        )}

        {showDuplicateNamePopup && (
          <div className="popup showDuplicateNamePopup">
            <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 30" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 7C12.5523 7 13 7.44772 13 8V12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12V8C11 7.44772 11.4477 7 12 7Z" fill="white"/>
              <path d="M13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15C12.5523 15 13 15.4477 13 16Z" fill="white"/>
            </svg>
            <p className='message'>Player names cannot be identical</p>
          </div>
        )}
        <p className='header'>Who is playing?</p>
        {/* <p className='descrip'>Players will be shuffled before gameplay, we promise.</p> */}
        <div className='namesContainer'>
          {formState.playerNames.map((name, index) => (
            <input
              className="name-inputs"
              key={index}
              type="text"
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              placeholder={`Player ${index + 1}`}
              maxLength={15}
            />
          ))}
        </div>
        <button className="confirm-button" type="submit">Confirm</button>
      </form>
    </div>
  );
}

export default PlayerNames;
