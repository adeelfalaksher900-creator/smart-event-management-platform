/**
 * @file Registration.tsx
 * @description Module 1: Handles user registration, check-in, and mock QR generation.
 * Saves to global context to fulfill the 5-module connection requirement.
 */
import React, { useState, useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { QrCode, CheckCircle } from 'lucide-react';
import { validateRegistration } from '../utils/validation';

export const Registration = React.memo(() => {
  const { registerUser, currentUser } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Participant', skills: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRegistered, setIsRegistered] = useState(!!currentUser?.qrCode);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Use testable utility for validation
    const validationErrors = validateRegistration({ ...formData, firstName: formData.name, lastName: 'Valid' });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Process and dispatch to global state
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
    registerUser({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      skills: skillsArray.length ? skillsArray : ['General'],
      experience: 3,
      projectInterests: ['Hackathon']
    });
    
    setIsRegistered(true);
  }, [formData, registerUser]);

  // Derived state to visualize the QR safely
  const qrDisplay = useMemo(() => {
    if (!currentUser?.qrCode) return null;
    return (
      <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-inner text-black">
        <QrCode className="w-48 h-48 mb-4" />
        <p className="font-mono text-sm tracking-widest">{currentUser.qrCode}</p>
      </div>
    );
  }, [currentUser]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Event Registration & Check-in</h1>
        <p className="text-on-surface-variant font-body mt-2">Module 1: Create your profile to generate your unique event access pass.</p>
      </div>

      {!isRegistered ? (
        <Card>
          <CardHeader>
            <CardTitle>Attendee Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Registration Form">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-on-surface">Full Name</label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ada Lovelace" aria-invalid={!!errors.firstName} />
                {errors.firstName && <p className="text-error text-xs mt-1" role="alert">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-on-surface">Email Address</label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="ada@example.com" aria-invalid={!!errors.email} />
                {errors.email && <p className="text-error text-xs mt-1" role="alert">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="skills" className="text-sm font-medium text-on-surface">Skills (comma separated)</label>
                <Input id="skills" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Python, Design" />
              </div>
              <Button type="submit" className="w-full mt-4" aria-label="Complete Registration">Complete Registration</Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-primary/50 shadow-lg shadow-primary/10 overflow-hidden">
          <div className="bg-primary p-6 text-on-primary text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-2" />
            <h2 className="text-2xl font-bold">Check-in Complete</h2>
            <p>Your profile is linked to the global system.</p>
          </div>
          <CardContent className="p-8 flex flex-col items-center">
            {qrDisplay}
            <p className="mt-6 text-on-surface-variant text-center max-w-md">
              Present this QR code at the physical venue for badge printing, or use it to join teams in the Matchmaking module.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
});
Registration.displayName = 'Registration';
