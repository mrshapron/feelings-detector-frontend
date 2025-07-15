
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/providers/ThemeProvider';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState('english');
  const [apiKey, setApiKey] = useState('');
  const [userName, setUserName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');

  const handleSaveProfile = () => {
    toast.success('Profile settings saved');
  };

  const handleSavePreferences = () => {
    toast.success('Preferences saved');
  };

  const handleSaveAPI = () => {
    toast.success('API settings saved');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4 max-w-4xl animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="api">API & Integration</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)} 
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value="********" className="mt-1" disabled />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    To change your password, please use the "Reset Password" feature.
                  </p>
                </div>
                
                <Button onClick={handleSaveProfile} className="mt-4">
                  Save Profile
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Theme</h3>
                  <RadioGroup value={theme} onValueChange={setTheme} className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light">Light</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark">Dark</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system">System</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Language</h3>
                  <RadioGroup value={language} onValueChange={setLanguage} className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="english" id="english" />
                      <Label htmlFor="english">English</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="spanish" id="spanish" />
                      <Label htmlFor="spanish">Spanish</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="french" id="french" />
                      <Label htmlFor="french">French</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="notifications" 
                        checked={notificationsEnabled}
                        onCheckedChange={(checked) => {
                          if (typeof checked === 'boolean') setNotificationsEnabled(checked);
                        }}
                      />
                      <Label htmlFor="notifications">Enable notifications</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="email-notifications" 
                        checked={emailNotifications}
                        onCheckedChange={(checked) => {
                          if (typeof checked === 'boolean') setEmailNotifications(checked);
                        }}
                      />
                      <Label htmlFor="email-notifications">Receive email notifications</Label>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleSavePreferences}>
                  Save Preferences
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <Input 
                    id="api-key" 
                    value={apiKey} 
                    onChange={(e) => setApiKey(e.target.value)} 
                    placeholder="Enter your API key" 
                    className="mt-1 font-mono"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    This key is used to connect EmotionAI to external services.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Connected Services</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <span>Service 1</span>
                      </div>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <span>Service 2</span>
                      </div>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleSaveAPI} className="mt-4">
                  Save API Settings
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
