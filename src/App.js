import React, { useState, useRef } from 'react';

const App = () => {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [customImage, setCustomImage] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMemes, setGeneratedMemes] = useState([]);
  const canvasRef = useRef(null);

  // Italian Brainrot meme templates
  const memeTemplates = [
  { id: 1, name: "Giga Chad", url: "https://i.imgflip.com/4acd7j.png" },
  { id: 2, name: "Spider-Man Pointing", url: "https://i.imgflip.com/1b42wl.jpg" },
  { id: 3, name: "Surprised Pikachu", url: "https://i.imgflip.com/2kbn1e.jpg" },
  { id: 4, name: "Drake Hotline Bling", url: "https://i.imgflip.com/30b1gx.jpg" },
  { id: 5, name: "Woman Yelling at Cat", url: "https://i.imgflip.com/345v97.jpg" },
  { id: 6, name: "Distracted Boyfriend", url: "https://i.imgflip.com/1ur9b0.jpg" },
  { id: 7, name: "Change My Mind", url: "https://i.imgflip.com/24y43o.jpg" },
  { id: 8, name: "Two Buttons", url: "https://i.imgflip.com/1g8my4.jpg" },
  { id: 9, name: "Left Exit 12 Off Ramp", url: "https://i.imgflip.com/22bdq6.jpg" },
  { id: 10, name: "UNO Draw 25", url: "https://i.imgflip.com/3lmzyx.jpg" },
  { id: 11, name: "Is This a Pigeon?", url: "https://i.imgflip.com/1o00in.jpg" },
  { id: 12, name: "Mocking Spongebob", url: "https://i.imgflip.com/1otk96.jpg" },
  { id: 13, name: "Expanding Brain", url: "https://i.imgflip.com/1jwhww.jpg" },
  { id: 14, name: "Gru's Plan", url: "https://i.imgflip.com/26am.jpg" },
  { id: 15, name: "Boardroom Meeting Suggestion", url: "https://i.imgflip.com/m78d.jpg" },
  { id: 16, name: "Roll Safe Think About It", url: "https://i.imgflip.com/1h7in3.jpg" },
  { id: 17, name: "Batman Slapping Robin", url: "https://i.imgflip.com/9ehk.jpg" },
  { id: 18, name: "Buff Doge vs Cheems", url: "https://i.imgflip.com/43a45p.png" },
  { id: 19, name: "Epic Handshake", url: "https://i.imgflip.com/28j0te.jpg" },
  { id: 20, name: "Bernie I Am Once Again", url: "https://i.imgflip.com/3oevdk.jpg" },
  { id: 21, name: "Sad Pablo Escobar", url: "https://i.imgflip.com/1c1uej.jpg" },
  { id: 22, name: "Confused Math Lady", url: "https://i.imgflip.com/1e7ql7.jpg" },
  { id: 23, name: "Success Kid", url: "https://i.imgflip.com/1bhk.jpg" },
  { id: 24, name: "Waiting Skeleton", url: "https://i.imgflip.com/2fm6x.jpg" },
  { id: 25, name: "Y'all Got Any More", url: "https://i.imgflip.com/3si4.jpg" },
  { id: 26, name: "Hide the Pain Harold", url: "https://i.imgflip.com/2wifvo.jpg" },
  { id: 27, name: "This Is Fine", url: "https://i.imgflip.com/wxica.jpg" },
  { id: 28, name: "Awkward Look Monkey Puppet", url: "https://i.imgflip.com/2gnnjh.jpg" },
  { id: 29, name: "You Have No Power Here", url: "https://i.imgflip.com/3vzej.jpg" },
  
];


  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
    setCustomImage('');
  };

  const handleCustomImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target.result);
        setSelectedImage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAIMeme = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter a prompt for AI meme generation!');
      return;
    }

    setIsGenerating(true);
    
    try {
      const memeIdeas = await generateMemeTextWithGemini(aiPrompt);
      setGeneratedMemes(memeIdeas);
    } catch (error) {
      console.error('Error generating AI memes:', error);
      alert('Error generating memes. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMemeTextWithGemini = async (prompt) => {
    const API_KEY = process.env.REACT_APP_GEMINI_API_KEY; // Replace with your actual API key
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=GEMINI_API_KEY".replace('GEMINI_API_KEY', API_KEY);
    const memePrompt = `
    Generate 3 creative meme ideas based on the topic: "${prompt}"
    
    For each meme, provide:
    1. Top text (usually setup/situation)
    2. Bottom text (usually punchline/reaction)
    
    Make them funny, relatable, and suitable for internet memes. Use popular meme formats and internet culture references.
    Keep each text under 50 characters for readability on images.
    
    Format your response as JSON:
    [
      {"topText": "example top text", "bottomText": "example bottom text"},
      {"topText": "example top text 2", "bottomText": "example bottom text 2"},
      {"topText": "example top text 3", "bottomText": "example bottom text 3"}
    ]
    `;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: memePrompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Parse the JSON response
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Could not parse AI response');
      }
      
      const memeTexts = JSON.parse(jsonMatch[0]);
      
      // Combine with random templates
      const memeIdeas = memeTexts.map(textData => ({
        template: memeTemplates[Math.floor(Math.random() * memeTemplates.length)],
        topText: textData.topText,
        bottomText: textData.bottomText
      }));

      return memeIdeas;
    } catch (error) {
      console.error('Gemini API Error:', error);
      // Fallback to local generation if API fails
      return generateFallbackMemes(prompt);
    }
  };

  const generateFallbackMemes = (prompt) => {
    // Simple fallback if API fails - just return empty templates
    return [
      {
        template: memeTemplates[Math.floor(Math.random() * memeTemplates.length)],
        topText: `Error generating text for: ${prompt}`,
        bottomText: `Please check your API key`
      },
      {
        template: memeTemplates[Math.floor(Math.random() * memeTemplates.length)],
        topText: `AI service unavailable`,
        bottomText: `Try again later`
      },
      {
        template: memeTemplates[Math.floor(Math.random() * memeTemplates.length)],
        topText: `Connection failed`,
        bottomText: `Check internet connection`
      }
    ];
  };



  const applyGeneratedMeme = (meme) => {
    setSelectedImage(meme.template.url);
    setTopText(meme.topText);
    setBottomText(meme.bottomText);
    setCustomImage('');
  };

  const downloadMeme = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = "anonymous";
    
    img.onerror = (err) => {
      console.error('Error loading image:', err);
      alert('Error loading image. The image might be protected or unavailable.');
    };
    
    img.onload = () => {
      try {
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.font = `${Math.max(20, img.width / 20)}px Impact, Arial Black, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        if (topText) {
          const x = canvas.width / 2;
          const y = 10;
          ctx.strokeText(topText.toUpperCase(), x, y);
          ctx.fillText(topText.toUpperCase(), x, y);
        }
        
        if (bottomText) {
          const x = canvas.width / 2;
          const y = canvas.height - 60;
          ctx.textBaseline = 'bottom';
          ctx.strokeText(bottomText.toUpperCase(), x, y);
          ctx.fillText(bottomText.toUpperCase(), x, y);
        }
        
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error generating meme:', error);
        alert('Error generating meme. Please try again with a different image.');
      }
    };
    
    img.src = selectedImage || customImage;
  };

  const currentImage = customImage || selectedImage;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#1a1a2e', color: '#eee', minHeight: '100vh' }}>
      <header style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', margin: '0', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          🎭 Meme Maker & AI Generator
        </h1>
        <p style={{ fontSize: '1.2rem', margin: '0.5rem 0 0 0', opacity: '0.9' }}>
          Create hilarious memes manually or with AI assistance!
        </p>
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* AI Generator Section */}
        <div style={{ flex: '1', minWidth: '300px', background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)', borderRadius: '15px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          <h2 style={{ color: '#2d3748', marginBottom: '1.5rem', fontSize: '1.8rem', textAlign: 'center' }}>
             AI Meme Generator
          </h2>
          

          
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Enter your meme idea (e.g., 'cats vs dogs', 'monday morning', 'pizza delivery')"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            onClick={generateAIMeme}
            disabled={isGenerating}
            style={{
              width: '100%',
              padding: '12px 24px',
              backgroundColor: isGenerating ? '#ccc' : '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(66, 153, 225, 0.3)'
            }}
          >
            {isGenerating ? '🔄 Generating with AI...' : '✨ Generate AI Memes'}
          </button>

          {generatedMemes.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>Generated Ideas:</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {generatedMemes.map((meme, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      borderRadius: '8px',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                      border: '2px solid transparent'
                    }}
                    onClick={() => applyGeneratedMeme(meme)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = '#4299e1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={meme.template.url}
                        alt={meme.template.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div style={{ flex: 1, color: '#2d3748' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{meme.template.name}</div>
                        <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>
                          Top: "{meme.topText}"<br />
                          Bottom: "{meme.bottomText}"
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Manual Editor Section */}
        <div style={{ flex: '2', minWidth: '400px' }}>
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '15px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.8rem', textAlign: 'center' }}>
              ✏️ Manual Meme Editor
            </h2>
            
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Upper text (eg: Tung Tung Tung Sahur)"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
              />
              <input
                type="text"
                placeholder="Lower text (eg: chimpanzini banani)"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="file-upload"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: '#48bb78',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(72, 187, 120, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                📁 Upload Custom Image
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleCustomImageUpload}
                style={{ display: 'none' }}
              />
            </div>

            {currentImage ? (
              <div style={{ position: 'relative', textAlign: 'center', marginBottom: '1.5rem', background: 'white', borderRadius: '8px', padding: '1rem' }}>
                <img
                  src={currentImage}
                  alt="Meme"
                  style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }}
                />
                {topText && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    fontFamily: 'Impact, Arial Black, sans-serif',
                    textShadow: '2px 2px 0 black, -2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black',
                    textAlign: 'center',
                    maxWidth: '90%'
                  }}>
                    {topText.toUpperCase()}
                  </div>
                )}
                {bottomText && (
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    fontFamily: 'Impact, Arial Black, sans-serif',
                    textShadow: '2px 2px 0 black, -2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black',
                    textAlign: 'center',
                    maxWidth: '90%'
                  }}>
                    {bottomText.toUpperCase()}
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                border: '2px dashed rgba(255,255,255,0.3)'
              }}>
                <p style={{ fontSize: '18px', opacity: '0.8' }}>Select a template or upload an image to start creating!</p>
              </div>
            )}

            {currentImage && (
              <button
                onClick={downloadMeme}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  backgroundColor: '#e53e3e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(229, 62, 62, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                💾 Download Meme
              </button>
            )}
          </div>

          {/* Templates Section */}
          <div style={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', borderRadius: '15px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            <h2 style={{ color: '#2d3748', marginBottom: '1.5rem', fontSize: '1.8rem', textAlign: 'center' }}>
              🎨 Template Meme Maker
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {memeTemplates.map((template) => (
                <div
                  key={template.id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: selectedImage === template.url ? '3px solid #4299e1' : '3px solid transparent',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                  onClick={() => handleImageSelect(template.url)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <img
                    src={template.url}
                    alt={template.name}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '0.5rem'
                    }}
                  />
                  <p style={{ margin: '0', textAlign: 'center', fontWeight: 'bold', color: '#2d3748' }}>
                    {template.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default App;