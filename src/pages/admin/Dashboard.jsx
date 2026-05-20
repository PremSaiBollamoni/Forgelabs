import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { FolderKanban, MessageSquare, TrendingUp, Users } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projects: 0,
    inquiries: 0,
    newInquiries: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, inquiriesRes] = await Promise.all([
          api.get('/admin/projects'),
          api.get('/admin/inquiries')
        ]);
        
        setStats({
          projects: projectsRes.data.length,
          inquiries: inquiriesRes.data.length,
          newInquiries: inquiriesRes.data.length 
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Projects', value: stats.projects, icon: <FolderKanban className="text-blue-500" /> },
    { label: 'Total Inquiries', value: stats.inquiries, icon: <MessageSquare className="text-green-500" /> },
    { label: 'New Leads', value: stats.newInquiries, icon: <TrendingUp className="text-orange-500" /> },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {statCards.map((card) => (
          <div key={card.label} className="bg-background/50 border border-line rounded-2xl p-6 shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-surface border border-line">
                   {card.icon}
                </div>
             </div>
             <p className="text-secondary font-medium">{card.label}</p>
             <h3 className="text-4xl font-display font-bold text-primary mt-1">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
         <div className="bg-background/50 border border-line rounded-2xl p-8">
            <h3 className="text-xl font-bold text-primary mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
               <button 
                onClick={() => navigate('/admin/projects/new')}
                className="px-6 py-3 bg-accent text-white rounded-xl font-bold hover:opacity-90 transition-all"
               >
                 Add New Project
               </button>
               <button 
                onClick={() => navigate('/admin/inquiries')}
                className="px-6 py-3 bg-surface border border-line text-primary rounded-xl font-bold hover:bg-background transition-all"
               >
                 View All Inquiries
               </button>
               <button 
                onClick={() => navigate('/admin/settings')}
                className="px-6 py-3 bg-surface border border-line text-primary rounded-xl font-bold hover:bg-background transition-all"
               >
                 Studio Settings
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
