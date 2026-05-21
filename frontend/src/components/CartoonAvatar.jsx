import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createAvatar } from '@dicebear/core';
import { adventurer, adventurerNeutral, lorelei, notionists, micah } from '@dicebear/collection';

const CartoonAvatar = ({ name, onSave, onClose }) => {
  const [avatarSvg, setAvatarSvg] = useState('');
  const [avatarStyle, setAvatarStyle] = useState('adventurer');
  
  // Style-specific properties
  const [skinColor, setSkinColor] = useState('f2d3b6');
  const [hairColor, setHairColor] = useState('4a3123');
  const [clothingColor, setClothingColor] = useState('2ec4b6');
  const [backgroundColor, setBackgroundColor] = useState('0a192f');
  const [eyeType, setEyeType] = useState('variant01');
  const [mouthType, setMouthType] = useState('variant01');

  const avatarStyles = {
    adventurer: adventurer,
    'adventurer-neutral': adventurerNeutral,
    lorelei: lorelei,
    notionists: notionists,
    micah: micah
  };

  // Different options for each style
  const styleOptions = {
    adventurer: {
      skinColors: ['f2d3b6', 'e8b88a', 'd9a57c', 'c68642', '8d5524', '6c3b1a'],
      hairColors: ['1a1a1a', '4a3123', '5c3a21', 'c49a6c', 'b87b4a', 'ffffff'],
      clothingColors: ['2ec4b6', 'ff9f1c', 'e63946', '4fd1c5', '6c5ce7', 'fd79a8'],
    },
    'adventurer-neutral': {
      skinColors: ['f2d3b6', 'e8b88a', 'd9a57c', 'c68642', '8d5524', '6c3b1a'],
      hairColors: ['1a1a1a', '4a3123', '5c3a21', 'c49a6c', 'b87b4a', 'ffffff'],
      clothingColors: ['2ec4b6', 'ff9f1c', 'e63946', '4fd1c5', '6c5ce7', 'fd79a8'],
    },
    lorelei: {
      skinColors: ['f2d3b6', 'e8b88a', 'd9a57c', 'c68642', '8d5524', '6c3b1a'],
      hairColors: ['1a1a1a', '4a3123', '5c3a21', 'c49a6c', 'b87b4a', 'ffffff'],
      clothingColors: ['2ec4b6', 'ff9f1c', 'e63946', '4fd1c5', '6c5ce7', 'fd79a8'],
    },
    notionists: {
      skinColors: ['f2d3b6', 'e8b88a', 'd9a57c', 'c68642', '8d5524', '6c3b1a'],
      hairColors: ['1a1a1a', '4a3123', '5c3a21', 'c49a6c', 'b87b4a', 'ffffff'],
      clothingColors: ['2ec4b6', 'ff9f1c', 'e63946', '4fd1c5', '6c5ce7', 'fd79a8'],
    },
    micah: {
      skinColors: ['f2d3b6', 'e8b88a', 'd9a57c', 'c68642', '8d5524', '6c3b1a'],
      hairColors: ['1a1a1a', '4a3123', '5c3a21', 'c49a6c', 'b87b4a', 'ffffff'],
      clothingColors: ['2ec4b6', 'ff9f1c', 'e63946', '4fd1c5', '6c5ce7', 'fd79a8'],
    }
  };

  const currentOptions = styleOptions[avatarStyle];

  // Generate avatar
  const generateAvatar = () => {
    const AvatarComponent = avatarStyles[avatarStyle];
    
    try {
      let avatarConfig = {
        seed: name || 'user',
        size: 256,
        backgroundColor: [backgroundColor],
      };

      // Add style-specific properties
      if (avatarStyle === 'adventurer' || avatarStyle === 'adventurer-neutral') {
        avatarConfig = {
          ...avatarConfig,
          skinColor: [skinColor],
          hairColor: [hairColor],
          clothingColor: [clothingColor],
        };
      } else if (avatarStyle === 'lorelei') {
        avatarConfig = {
          ...avatarConfig,
          skinColor: [skinColor],
          hairColor: [hairColor],
          clothesColor: [clothingColor],
        };
      } else if (avatarStyle === 'notionists') {
        avatarConfig = {
          ...avatarConfig,
          skinColor: [skinColor],
          hairColor: [hairColor],
          facialHairColor: [clothingColor],
        };
      } else if (avatarStyle === 'micah') {
        avatarConfig = {
          ...avatarConfig,
          skinColor: [skinColor],
          hairColor: [hairColor],
          shirtColor: [clothingColor],
        };
      }

      const avatar = createAvatar(AvatarComponent, avatarConfig);
      setAvatarSvg(avatar.toString());
    } catch (error) {
      console.error('Error generating avatar:', error);
      // Fallback
      const fallbackAvatar = createAvatar(adventurer, {
        seed: name || 'user',
        size: 256,
        backgroundColor: ['0a192f'],
      });
      setAvatarSvg(fallbackAvatar.toString());
    }
  };

  useEffect(() => {
    generateAvatar();
  }, [avatarStyle, skinColor, hairColor, clothingColor, backgroundColor, name]);

  const handleSave = () => {
    onSave(avatarSvg);
    onClose();
  };

  // Styles
  const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(8px)',
    zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center'
  };

  const modalStyle = {
    background: 'linear-gradient(135deg, #112240, #0a192f)',
    borderRadius: '24px', width: '90%', maxWidth: '1000px',
    maxHeight: '85vh', overflow: 'hidden',
    border: '1px solid rgba(46,196,182,0.3)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
  };

  const headerStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 28px', borderBottom: '1px solid rgba(46,196,182,0.2)',
    background: '#112240'
  };

  const bodyStyle = {
    display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px',
    padding: '28px', maxHeight: 'calc(85vh - 80px)', overflow: 'auto'
  };

  const previewStyle = {
    background: '#0d1f2d', borderRadius: '20px', padding: '24px', textAlign: 'center'
  };

  const avatarContainerStyle = {
    width: '200px', height: '200px', margin: '0 auto 20px',
    borderRadius: '50%', overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    border: '2px solid rgba(46,196,182,0.5)'
  };

  const saveBtnStyle = {
    width: '100%', padding: '12px',
    background: 'linear-gradient(135deg, #2ec4b6, #1a8a7e)',
    border: 'none', borderRadius: '30px', color: '#0a192f',
    fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px'
  };

  const optionsStyle = {
    display: 'flex', flexDirection: 'column', gap: '20px',
    overflowY: 'auto', paddingRight: '10px'
  };

  const sectionStyle = {
    background: '#0d1f2d', borderRadius: '16px', padding: '16px'
  };

  const sectionTitleStyle = {
    color: '#2ec4b6', fontSize: '13px', fontWeight: 'bold',
    marginBottom: '12px', display: 'flex', alignItems: 'center',
    gap: '8px', textTransform: 'uppercase', letterSpacing: '1px'
  };

  const colorGridStyle = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(38px, 1fr))',
    gap: '10px'
  };

  const styleGridStyle = {
    display: 'flex', flexWrap: 'wrap', gap: '8px'
  };

  const styleBtnStyle = (isActive) => ({
    padding: '8px 14px', background: isActive ? '#2ec4b6' : '#0d1f2d',
    border: isActive ? 'none' : '1px solid rgba(46,196,182,0.3)',
    borderRadius: '20px', color: isActive ? '#0a192f' : 'white',
    cursor: 'pointer', fontSize: '12px', fontWeight: isActive ? 'bold' : 'normal'
  });

  const colorBtnStyle = (color, isActive) => ({
    width: '38px', height: '38px', borderRadius: '50%',
    backgroundColor: `#${color}`, border: isActive ? '2px solid white' : '2px solid transparent',
    cursor: 'pointer', boxShadow: isActive ? '0 0 0 2px #2ec4b6' : 'none',
    transform: isActive ? 'scale(1.05)' : 'scale(1)'
  });

  return ReactDOM.createPortal(
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3 style={{ color: 'white', margin: 0 }}>
            <i className="fas fa-user-astronaut" style={{ color: '#2ec4b6', marginRight: '10px' }}></i>
            Create Cartoon Avatar
          </h3>
          <button onClick={onClose} style={{ background: 'rgba(46,196,182,0.2)', border: 'none', color: 'white', fontSize: '20px', width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={bodyStyle}>
          {/* Preview */}
          <div style={previewStyle}>
            <div style={avatarContainerStyle}>
              {avatarSvg && <div dangerouslySetInnerHTML={{ __html: avatarSvg }} style={{ width: '100%', height: '100%' }} />}
            </div>
            <button style={saveBtnStyle} onClick={handleSave}>
              <i className="fas fa-save"></i> Save Avatar
            </button>
          </div>

          {/* Options */}
          <div style={optionsStyle}>
            {/* Avatar Style */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}><i className="fas fa-style"></i> Avatar Style</div>
              <div style={styleGridStyle}>
                {Object.keys(avatarStyles).map(style => (
                  <button key={style} style={styleBtnStyle(avatarStyle === style)} onClick={() => setAvatarStyle(style)}>
                    {style === 'adventurer-neutral' ? 'Adventurer Neutral' : style.charAt(0).toUpperCase() + style.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Color */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}><i className="fas fa-hand-peace"></i> Skin Color</div>
              <div style={colorGridStyle}>
                {currentOptions?.skinColors.map(color => (
                  <button key={color} style={colorBtnStyle(color, skinColor === color)} onClick={() => setSkinColor(color)} />
                ))}
              </div>
            </div>

            {/* Hair Color */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}><i className="fas fa-cut"></i> Hair Color</div>
              <div style={colorGridStyle}>
                {currentOptions?.hairColors.map(color => (
                  <button key={color} style={colorBtnStyle(color, hairColor === color)} onClick={() => setHairColor(color)} />
                ))}
              </div>
            </div>

            {/* Clothing/Accent Color */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}>
                <i className="fas fa-tshirt"></i> {avatarStyle === 'micah' ? 'Shirt Color' : avatarStyle === 'notionists' ? 'Accent Color' : 'Clothing Color'}
              </div>
              <div style={colorGridStyle}>
                {currentOptions?.clothingColors.map(color => (
                  <button key={color} style={colorBtnStyle(color, clothingColor === color)} onClick={() => setClothingColor(color)} />
                ))}
              </div>
            </div>

            {/* Background Color */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}><i className="fas fa-fill-drip"></i> Background Color</div>
              <div style={colorGridStyle}>
                {['0a192f', '2ec4b6', 'ff9f1c', 'e63946', '6c5ce7', '00b894'].map(color => (
                  <button key={color} style={colorBtnStyle(color, backgroundColor === color)} onClick={() => setBackgroundColor(color)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CartoonAvatar;