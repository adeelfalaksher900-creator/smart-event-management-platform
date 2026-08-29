import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Code2, Gavel, Settings, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export function RoleSelection() {
  const navigate = useNavigate();

  const handleSelectRole = (role: string) => {
    localStorage.setItem('eventos_role', role);
    navigate('/dashboard');
  };

  const roles = [
    {
      id: 'participant',
      title: 'Participant',
      description: 'Join teams, submit projects, and compete in the hackathon.',
      icon: <Code2 className="w-8 h-8 text-primary" />,
      color: 'border-primary/50 bg-primary/5'
    },
    {
      id: 'judge',
      title: 'Judge',
      description: 'Review submissions, score teams, and provide feedback.',
      icon: <Gavel className="w-8 h-8 text-secondary" />,
      color: 'border-secondary/50 bg-secondary/5'
    },
    {
      id: 'organizer',
      title: 'Organizer',
      description: 'Manage events, announcements, and oversee the platform.',
      icon: <Settings className="w-8 h-8 text-tertiary" />,
      color: 'border-tertiary/50 bg-tertiary/5'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-primary mb-6">
              <span className="text-3xl font-bold font-display tracking-tighter">E</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline mb-4">
              Choose your role
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl mx-auto font-body">
              How will you participate in Prompt Wars 2026? Select your persona to enter the workspace.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, idx) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card 
                className={`h-full cursor-pointer hover:scale-[1.02] transition-transform ${role.color} hover:border-opacity-100 hover:shadow-lg hover:shadow-primary/5`}
                onClick={() => handleSelectRole(role.id)}
              >
                <CardContent className="p-8 flex flex-col h-full items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-6">
                    {role.icon}
                  </div>
                  <h3 className="text-xl font-bold font-headline mb-3">{role.title}</h3>
                  <p className="text-sm text-on-surface-variant flex-1 mb-6">
                    {role.description}
                  </p>
                  
                  <div className="w-full mt-auto flex items-center justify-center text-sm font-semibold text-primary group">
                    Select Role 
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
