import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    site_name: 'Hope Somalia Foundation',
    site_tagline: 'Creating Hope. Changing Lives. Building Stronger Communities.',
    contact_email: 'info@hopesomalia.org',
    contact_phone: '+252 61 500 0000',
    contact_address: 'Km4 Airport Road, Hodan District, Mogadishu, Somalia',
    stat_people_reached: '154200',
    stat_projects_completed: '84',
    stat_communities_served: '42',
    stat_children_supported: '35000',
    hero_headline: 'Creating Hope. Changing Lives. Building Stronger Communities.',
    hero_description: 'We work directly with communities to create sustainable solutions in education, healthcare, clean water, livelihoods, and rapid emergency response.',
    hero_image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1920&q=80',
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.success && res.data) {
        setSettings((prev) => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, fetchSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
