import React from 'react';
import './home.css';

const Home = () => {
    const handlePlayClick = () => {
    };

    return (
        <div className="home-home" >
            <div className="logline-layout">
                <div className="log-text">
                    <p className="text-home">Pick your favorite films</p>
                    <p className="while">While you still can</p>
                    <div className="site-title">
                        <p className="with">with</p>
                        <p className="the-words">The Reel Draft</p>
                    </div>
                </div>
            </div>
            <div className="container">
                <a href="dataGather" className="circle-button" onClick={handlePlayClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="138" height="138" viewBox="0 0 138 138" fill="none">
                        <circle cx="68.5714" cy="68.5714" r="63.5714" />
                    </svg>
                
                    <div className="triangle">
                        <svg xmlns="http://www.w3.org/2000/svg" width="67" height="79" viewBox="0 0 67 79" fill="none">
                            <path d="M58.25 41.6651L62 39.5L58.25 37.3349L6.5 7.45706L2.75 5.29199L2.75 9.62212L2.75 69.3779L2.75 73.708L6.5 71.5429L58.25 41.6651Z" fill="white" />
                        </svg>
                    </div>
                </a>
            </div>
        </div>
    );
};

export default Home;