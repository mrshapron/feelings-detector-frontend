
import React from 'react';
import Navbar from '@/components/Navbar';
import TranscriptionCard from '@/components/TranscriptionCard';
import EmotionChart from '@/components/EmotionChart';

const Dashboard = () => {
  // Sample data for the transcription
  const transcriptionData = [
    { speaker: 'Speaker 1', text: 'Hello, could you tell me about the project status?' },
    { speaker: 'Speaker 2', text: 'Yes, we have completed the initial phase and are moving to the next stage.' },
    { speaker: 'Speaker 1', text: "That's great to hear, keep up the good work!" },
  ];

  // Sample data for the emotion chart - using end_time to match EmotionChartPoint interface
  const emotionData = [
    { end_time: 0, confidence: 30 },
    { end_time: 5, confidence: 40 },
    { end_time: 10, confidence: 35 },
    { end_time: 15, confidence: 50 },
    { end_time: 20, confidence: 45 },
    { end_time: 25, confidence: 60 },
    { end_time: 30, confidence: 75 },
  ];

  console.log('📊 Dashboard emotion data:', emotionData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col page-transition">
      <Navbar />
      
      <div className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 animate-fade-in">Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[500px]">
            <TranscriptionCard 
              messages={transcriptionData} 
              title="Live Transcription" 
            />
          </div>
          
          <div className="space-y-8">
            <EmotionChart 
              data={emotionData} 
              title="Emotional Trends Over Time" 
              height={225}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-lg p-6 card-hover animate-fade-in">
                <h3 className="text-lg font-medium mb-4">Sentiment Analysis</h3>
                <div className="flex items-center justify-between">
                  <span>Positive</span>
                  <span className="font-medium">68%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2 mb-3">
                  <div className="bg-black h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Neutral</span>
                  <span className="font-medium">24%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2 mb-3">
                  <div className="bg-black h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Negative</span>
                  <span className="font-medium">8%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                  <div className="bg-black h-2 rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>
              
              <div className="glass-card rounded-lg p-6 card-hover animate-fade-in">
                <h3 className="text-lg font-medium mb-4">Key Emotions</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-black h-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="ml-3 font-medium min-w-[60px] text-right">Confidence</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-black h-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="ml-3 font-medium min-w-[60px] text-right">Interest</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-black h-full" style={{ width: '45%' }}></div>
                    </div>
                    <span className="ml-3 font-medium min-w-[60px] text-right">Concern</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-black h-full" style={{ width: '30%' }}></div>
                    </div>
                    <span className="ml-3 font-medium min-w-[60px] text-right">Confusion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
