// import React, { useState, useEffect, useRef } from 'react';
import React from 'react';

import ReactPlayer from 'react-player'
import Vid from "./HOW TO PLAY.mp4";
import './video.css';

const VideoPlayer = () => {
  
    return (
      <div>
            <div className="vid-here">
            <ReactPlayer
              url={Vid}
              playing={true}
              controls={true}
              loop={true}
              playsinline={true}
              preload="metadata" 
              poster="path/to/poster.jpg" 
            />
          </div>
      </div>
    );
  };
  
  export default VideoPlayer;
